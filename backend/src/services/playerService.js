import Event from "../models/evenetModel.js";
import Player from "../models/playerModel.js";
import Category from "../models/categoryModels.js";
import { fieldValidation } from "../utils/validation.js";
import { Op } from "sequelize";
import sendEmail from "./emailService.js";
import { sendVerificationEmail } from "./verificationEmailService.js";



export const registerPlayerServices = async (fullName, address, dateOfBirth, gender, email, contactNumber, TshirtSize, bloodGroup, emergencyContact, paymentVoucher, authenticateDocument, eventId, categoryId) => {
    try {
        if (!fieldValidation(fullName, address, dateOfBirth, gender, email, contactNumber, TshirtSize, bloodGroup, emergencyContact, paymentVoucher, authenticateDocument,eventId)) {
            throw new Error("Please enter all fields");
        }
        const eventExist = await Event.findByPk(eventId);
        if(!eventExist){
            throw new Error("Event does not exist");
        }

        // if categoryId provided, ensure it exists and belongs to the event (best-effort)
        if (categoryId) {
            const cat = await Category.findByPk(categoryId);
            if (!cat) {
                throw new Error("Category does not exist");
            }
        }

        const newPlayer = await Player.create({ fullName, address, dateOfBirth, gender, email, contactNumber, TshirtSize, bloodGroup, emergencyContact, paymentVoucher, authenticateDocument, eventId, categoryId });
         const formData = {
      "Full Name": fullName,
      Address: address,
      "Date of Birth": dateOfBirth,
      Gender: gender,
      Email: email,
      "Contact Number": contactNumber,
      "T-Shirt Size": TshirtSize,
      "Blood Group": bloodGroup,
      "Emergency Contact": emergencyContact,
      "Event": eventExist.title,
      "Category": categoryId ? (await Category.findByPk(categoryId))?.title : "N/A",
    };
        if (!newPlayer) {
            // console.log("Cannot create user:")
            throw new Error("Cannot create user. Please try again");
        }
    //      await sendEmail({
    //   to: email,
    //   subject: "Player Registration Successful!",
    //   formData,
    // });
        return newPlayer;
    }
    catch (err) {
        
        throw new Error(err.message || "Something went wrong");

    }






}


export const getAllRegisteredPlayersService = async ({ page = 1, limit = 10, search = null, eventId = null, categoryId = null, status = null, bibNumber = null }) => {
    try {
        const offset = (page - 1) * limit;

        const where = {};
        if (search) {
            where[Op.or] = [
                { fullName: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ];
        }
        if (eventId) where.eventId = eventId;
        if (categoryId) where.categoryId = categoryId;
        if (status) where.verificationStatus = status;
        if (bibNumber) where.bibNumber = Number(bibNumber);

        const totalPlayers = await Player.count({ where });

        const players = await Player.findAll({
            where,
            include: [
                { model: Event, attributes: ["id", "title"] },
                { model: Category, attributes: ["id", "title"] }
            ],
            limit: Number(limit),
            offset: Number(offset),
            order: [["bibNumber", "ASC"], ["createdAt", "DESC"]]
        });

        // Totals
        const overallTotal = await Player.count();
        const eventTotal = eventId ? await Player.count({ where: { eventId } }) : null;
        const categoryTotal = categoryId ? await Player.count({ where: { categoryId } }) : null;

        return { players, totalPlayers, totals: { overall: overallTotal, event: eventTotal, category: categoryTotal } };
    }
    catch (err) {
        throw new Error(err.message || "Something went wrong");
    }
}


export const getPlayerDetailService = async (playerId) => {
    try {
        if (!playerId) throw new Error("playerId is required");

        const player = await Player.findByPk(playerId, {
            include: [
                { model: Event, attributes: ["id", "title", "startDate", "isPublish"] },
                { model: Category, attributes: ["id", "title", "bibStart", "bibEnd"] }
            ]
        });

        if (!player) throw new Error("Player not found");

        return player;
    }
    catch (err) {
        throw new Error(err.message || "Something went wrong");
    }
}


// Verify player and auto-generate BIB number
export const verifyPlayerService = async (playerId, status = "verified") => {
    try {
        if (!playerId) throw new Error("playerId is required");

        const player = await Player.findByPk(playerId, {
            include: [
                { model: Event, attributes: ["id", "title", "startDate"] },
                { model: Category, attributes: ["id", "title", "bibStart", "bibEnd"] }
            ]
        });

        if (!player) throw new Error("Player not found");

        // If already verified, don't re-verify
        if (player.verificationStatus === "verified" && status === "verified") {
            throw new Error("Player is already verified");
        }

        let bibNumber = null;

        // Generate BIB only when verifying (not rejecting)
        if (status === "verified" && player.categoryId) {
            const category = player.Category;
            
            if (category && category.bibStart !== null && category.bibEnd !== null) {
                // Find the highest BIB number already assigned in this category
                const maxBibPlayer = await Player.findOne({
                    where: {
                        categoryId: player.categoryId,
                        bibNumber: {
                            [Op.not]: null,
                            [Op.between]: [category.bibStart, category.bibEnd]
                        }
                    },
                    order: [["bibNumber", "DESC"]]
                });

                if (maxBibPlayer && maxBibPlayer.bibNumber) {
                    bibNumber = maxBibPlayer.bibNumber + 1;
                } else {
                    bibNumber = category.bibStart;
                }

                // Check if BIB is within range
                if (bibNumber > category.bibEnd) {
                    throw new Error(`BIB range exhausted for category ${category.title}. Max: ${category.bibEnd}`);
                }
            }
        }

        // Update player
        player.verificationStatus = status;
        if (status === "verified") {
            player.bibNumber = bibNumber;
            player.verifiedAt = new Date();
        }
        await player.save();

        // Reload with associations
        await player.reload({
            include: [
                { model: Event, attributes: ["id", "title", "startDate"] },
                { model: Category, attributes: ["id", "title"] }
            ]
        });

        // Send verification email with BIB number
        if (status === "verified" && player.email) {
            try {
                await sendVerificationEmail({
                    to: player.email,
                    playerName: player.fullName,
                    bibNumber: player.bibNumber,
                    eventTitle: player.Event?.title || "Event",
                    categoryTitle: player.Category?.title || "Category",
                    eventDate: player.Event?.startDate || null,
                });
            } catch (emailErr) {
                console.error("Failed to send verification email:", emailErr.message);
                // Don't throw - verification still succeeded
            }
        }

        return player;
    }
    catch (err) {
        throw new Error(err.message || "Something went wrong");
    }
}


// Update player verification status (reject)
export const rejectPlayerService = async (playerId, reason = "") => {
    try {
        if (!playerId) throw new Error("playerId is required");

        const player = await Player.findByPk(playerId);
        if (!player) throw new Error("Player not found");
       

        player.verificationStatus = "rejected";
        player.bibNumber = null;
        player.verifiedAt = null;
        player.rejectionReason = reason;
        console.log("this is player",player)
           await sendEmail({
            to: player.email,
            subject: "Player Registration Rejected",
            body: `Dear ${player.fullName},\n\nWe regret to inform you that your registration has been rejected.\nReason: ${reason}\n\nRegards,\nEvent Team`
        });
      
        await player.save();

        return player;
    }
    catch (err) {
        throw new Error(err.message || "Something went wrong");
    }
}
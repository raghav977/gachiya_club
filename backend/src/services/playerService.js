import Event from "../models/evenetModel.js";
import Player from "../models/playerModel.js";
import Category from "../models/categoryModels.js";
import { fieldValidation } from "../utils/validation.js";
import { Op } from "sequelize";



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

        if (!newPlayer) {
            // console.log("Cannot create user:")
            throw new Error("Cannot create user. Please try again");
        }
        return newPlayer;
    }
    catch (err) {
        
        throw new Error(err.message || "Something went wrong");

    }






}


export const getAllRegisteredPlayersService = async ({ page = 1, limit = 10, search = null, eventId = null, categoryId = null }) => {
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

        const totalPlayers = await Player.count({ where });

        const players = await Player.findAll({
            where,
            include: [
                { model: Event, attributes: ["id", "title"] },
                { model: Category, attributes: ["id", "title"] }
            ],
            limit: Number(limit),
            offset: Number(offset),
            order: [["createdAt", "DESC"]]
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
                { model: Category, attributes: ["id", "title"] }
            ]
        });

        if (!player) throw new Error("Player not found");

        return player;
    }
    catch (err) {
        throw new Error(err.message || "Something went wrong");
    }
}
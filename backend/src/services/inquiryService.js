import Inquiry from "../models/messageModel.js";
import { Op } from "sequelize";


// Create a new inquiry (public - from contact form)
export const createInquiryService = async (name, email, message) => {
    try {
        const inquiry = await Inquiry.create({
            name,
            email,
            message,
            status: 'pending'
        });
        return inquiry;
    } catch (err) {
        console.log(err);
        throw new Error("Failed to create inquiry");
    }
};


export const getAllInquiriesService = async(page, limit, status, search)=>{
    try{
        const offset = (page - 1) * limit;

        const {count, rows} = await Inquiry.findAndCountAll({
            limit,
            offset,
            attributes: ['id', 'name', 'email', 'status', 'createdAt', 'updatedAt'],
            order: [['createdAt', 'DESC']],
            where: {
                ...(status ? { status } : {}),
                ...(search ? {
                    [Op.or]: [
                        { email: { [Op.like]: `%${search}%` } },
                    ],
                } : {}),
            },
        });

        return {
            totalInquiries: count,
            inquiries: rows
        };



    }
    catch(err){
        console.log(err);
        throw new Error("Something went wrong");
    }
}

export const getInqueryDetailByIdService =async(id)=>{
    try{
        const inquiry = await Inquiry.findByPk(id);
        if(!inquiry){
            throw new Error("Inquiry not found");
        }
        return inquiry;

    }
    catch(err){
        console.log(err);
        throw new Error("Something went wrong");
    }
}

export const updateInquiryStatusService = async(id,status)=>{
    try{
        const inquiry = await Inquiry.findByPk(id);
        if(!inquiry){
            throw new Error("Inquiry not found");
        }
        inquiry.status = status;
        await inquiry.save();
        return inquiry;

    }
    catch(err){
        console.log(err);
        throw new Error("Something went wrong");
    }
}

// export const deleteInquiryService = async(id)=>{
//     try{
//         const inquiry = await Inquiry.findByPk(id);
//         if(!inquiry){
//             throw new Error("Inquiry not found");
//         }
//         await inquiry.destroy();
//         return true;

//     }
//     catch(err){
//         console.log(err);
//         throw new Error("Something went wrong");
//     }
// }
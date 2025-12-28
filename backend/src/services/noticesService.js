import { Op, Sequelize } from "sequelize"
import Notices from "../models/NoticesModel.js"

export const createNoticeService = async(title, description, isActive, url = null) => {
    try {
        const notice = await Notices.create({
            title,
            description,
            isActive,
            url
        });
        return notice;
    }
    catch(err) {
        console.error(err);
        throw new Error("Something went wrong");
    }
}


export const updateNotices = async(id, title, description, isActive, url = undefined) => {
    try {
        console.log(`the id `,id)
        console.log(`the title`,title,description,isActive)
        
        const isNotificationExist = await Notices.findByPk(id);
        if(!isNotificationExist){
            throw new Error("Notification doesn't exist");
        }
        
        // Build update object, only include url if a new file was uploaded
        const updateData = {
            title,
            description,
            isActive
        };
        
        // Only update url if a new file was provided
        if (url !== undefined) {
            updateData.url = url;
        }
        
        const notice = await Notices.update(updateData, {
            where: {
                id
            }
        });
        return notice;
    }
    catch(err) {
        console.log(err);
        throw new Error("Something went wrong");
    }
}

export const getAllNoticesForUser = async(search = "", limit = 10, page = 1) => {
    try {
        // Ensure limit and page are integers
        const limitInt = parseInt(limit, 10) || 10;
        const pageInt = parseInt(page, 10) || 1;
        const offset = (pageInt - 1) * limitInt;

        console.log(limitInt)
        console.log(pageInt)
        console.log(search)
        
        const notices = await Notices.findAll({
            limit: limitInt,
            offset: offset,
            attributes: ['id', 'title', 'description', 'url', 'createdAt'],
            where: {
                isActive: true,
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            order: [['createdAt', 'DESC']]
        });
        
        const totalNotices = await Notices.count({
            where: {
                isActive: true,
                title: {
                    [Op.like]: `%${search}%`
                }
            }
        });
        
        return { notices, totalNotices };
    }
    catch(err) {
        console.log("error", err);
        throw new Error("Something went wrong");
    }
}

export const getNoticesDetailForUser = async(id)=>{
    try{    
        const notice = await Notices.findOne({
            where:{
                id:id,
                isActive:true
            }
        })
      if(!notice){
            throw new Error("Notification doesn't exist");
        }
        return notice;
    }
    catch(err){
        console.log(err);
        throw new Error("something went wrong");

    }
}


export const getNotificationForAdmin = async(search = "", limit = 10, page = 1) => {
    try {
        // Ensure limit and page are integers
        const limitInt = parseInt(limit, 10) || 10;
        const pageInt = parseInt(page, 10) || 1;
        const offset = (pageInt - 1) * limitInt;
        
        const notices = await Notices.findAll({
            limit: limitInt,
            offset: offset,
            attributes: ['id', 'title', 'description', 'url', 'isActive', 'createdAt'],
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            order: [['createdAt', 'DESC']]
        });
        
        const totalNotices = await Notices.count({
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }
            }
        });
        
        return { notices, totalNotices };
    }
    catch(err) {
        console.log(err);
        throw new Error("something went wrong");
    }
}


export const getNotificationDetailForAdmin = async(id)=>{
    try{
        const notice = await Notices.findOne({
            where:{
                id:id
            }
        })
        if(!notice){
            throw new Error("Notification doesn't exist");
        }
        return notice;
    }
    catch(err){
        console.log(err);
        throw new Error("something went wrong");

    }
}
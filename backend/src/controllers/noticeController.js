import { createNoticeService, getAllNoticesForUser, getNoticesDetailForUser, updateNotices, getNotificationForAdmin, getNotificationDetailForAdmin } from "../services/noticesService.js";
import { fieldValidation } from "../utils/validation.js";
import { getRelativeImagePath } from "../middleware/multerConfig.js";

export const createNotice = async(req,res)=>{
    try{
        const {title, description, is_active} = req.body;
        
        if(!fieldValidation(title, description)){
            return res.status(400).json({
                message:"Please enter title and description"
            })
        }
        
        // Handle optional file upload - convert to relative path for database storage
        const url = getRelativeImagePath(req.file?.path) || "";
        
        const newNotice = await createNoticeService(title, description, is_active || true, url);
        return res.status(200).json({
            message:"Notice created successfully",
            data:newNotice
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }

}

export const updateNotice = async(req,res)=>{
    try{
        const {id} = req.params;
        console.log("tis is req.bdy",req.body)
        const {title, description, is_active} = req.body;
        
        // Handle optional file upload - convert to relative path for database storage
        const url = req.file ? getRelativeImagePath(req.file.path) : undefined;

        const updatedNotice = await updateNotices(id, title, description, is_active, url);
        return res.status(200).json({
            message:"Notice updated successfully",
            data:updatedNotice
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

export const getAllNoticesUser = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const {notices, totalNotices} = await getAllNoticesForUser(search, limit, page);

        return res.status(200).json({
            message:"Notices fetched successfully",
            page,
            limit,
            total:notices.length,
            totalNotices,
            data:notices
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

export const getNoticeDetailUSER = async(req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                message:"Notice id required"
            });
        }

        const notice = await getNoticesDetailForUser(Number(id));

        return res.status(200).json({
            message:"Notice fetched successfully",
            data:notice
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}


export const getNoticeDetailAdmin = async(req,res)=>{
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({
                message:"Notice id required"
            });
        }

        const notice = await getNoticesDetailForUser(Number(id));

        return res.status(200).json({
            message:"Notice fetched successfully",
            data:notice
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}

export const getAllNoticesAdmin = async(req,res)=>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || "";

        const {notices, totalNotices} = await getNotificationForAdmin(search, limit, page);

        return res.status(200).json({
            message:"Notices fetched successfully",
            page,
            limit,
            total:notices.length,
            totalNotices,
            data:notices
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Something went wrong"
        });
    }
}
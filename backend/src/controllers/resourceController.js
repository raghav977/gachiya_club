import { createResource, getAllResourcesForAdmin, getAllResourcesForUser, updateResource } from "../services/resourcesService.js";
import { getRelativeImagePath } from "../middleware/multerConfig.js";



export const createResourceAdmin = async(req,res)=>{
    try{
        const {name} = req.body;
        // Convert absolute path to relative path for database storage
        const url = getRelativeImagePath(req.file?.path);

        if(!name || !url){
            return res.status(400).json({
                message:"Name and URL are required"
            });
        }

        const newResource = await createResource(name,url);
        
        return res.status(201).json({
            message:"Resource created successfully",
            data:newResource
        });

    }
    catch(err){
        console.error("Error creating resource:", err.message);
        return res.status(500).json({
            message:"Internal Server Error"
        });

    }
}

export const getAllResourcesAdmin = async(req,res)=>{
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    try{
        const { resources, totalResources } = await getAllResourcesForAdmin(search, limit, page);
        return res.status(200).json({
            message:"Resources fetched successfully",
            page,
            limit,
            totalResources,
            data:resources
        });

    }
    catch(err){
        console.error("Error fetching resources:", err.message);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}


export const getAllResourcesUser = async(req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    try{
        const { resources, totalResources } = await getAllResourcesForUser(search, limit, page);
        return res.status(200).json({
            message:"Resources fetched successfully",
            page,
            limit,
            totalResources,
            data:resources
        });

    }
    catch(err){
        console.error("Error fetching resources:", err.message);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}




export const updateResourceAdmin = async(req,res)=>{
    try{
        const {id} = req.params;
        const {name,isActive} = req.body;
        // Convert absolute path to relative path for database storage
        const url = getRelativeImagePath(req.file?.path);

        if(!id){
            return res.status(400).json({
                message:"Resource id required"
            });
        }

        const updatedResource = await updateResource(Number(id),name,url,isActive);

        return res.status(200).json({
            message:"Resource updated successfully",
            data:updatedResource
        });

    }
    catch(err){
        console.error("Error updating resource:", err.message);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}


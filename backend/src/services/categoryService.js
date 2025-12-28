import Category from "../models/categoryModels.js";
import { fieldValidation } from "../utils/validation.js";



export const createCategoryService = async (eventId, title, bibStart = null, bibEnd = null) => {
    // console.log("Creating category with:", { eventId, title });
    try {
        if (!fieldValidation(eventId, title)) {
            throw new Error("please input all fields");
        }

        const newCategory = await Category.create({
            eventId,
            title,
            bibStart: bibStart ? Number(bibStart) : null,
            bibEnd: bibEnd ? Number(bibEnd) : null,
        });

        return newCategory;


    }
    catch(err){
        // console.log("Create category err:". err.message)
        throw err;
    }

};


export const updateCategoryServices = async (id, title, isActive, bibStart, bibEnd) => {
    try {
        console.log("Updating category with:", { id, title, isActive, bibStart, bibEnd });
       
        const category = await Category.findByPk(id);

        if (!category) {
            throw new Error("Category not found");
        }

        // Build update payload - only include fields that are provided
        const updatePayload = {};
        if (title !== undefined) updatePayload.title = title;
        if (isActive !== undefined) updatePayload.isActive = isActive;
        if (bibStart !== undefined) updatePayload.bibStart = bibStart ? Number(bibStart) : null;
        if (bibEnd !== undefined) updatePayload.bibEnd = bibEnd ? Number(bibEnd) : null;

        await Category.update(updatePayload, {
            where: { id }
        });

        // Fetch and return updated category
        const updatedCategory = await Category.findByPk(id);
        return updatedCategory;

    }
    catch (err) {
        console.log("Something went wrong:", err.message);
        throw new Error(err.message);
    }
}


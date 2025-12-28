import { createCategoryService, updateCategoryServices } from "../services/categoryService.js";

export const createCategory = async (req, res) => {
    // console.log("This is request body:", req.body);
    try {
        const { EventId, title, bibStart, bibEnd } = req.body;

        const result = await createCategoryService(EventId, title, bibStart, bibEnd);
        if (!result) {
            throw err("Cannot create new category");
        }

        return res.status(200).json({ message: "Category created sucessfully", data: result });
    }
    catch (err) {
        // console.log(err.message);
        return res.status(500).json({ message: err.message || "Failed to create category" });
    }

}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, isActive, bibStart, bibEnd } = req.body;

        const result = await updateCategoryServices(id, title, isActive, bibStart, bibEnd);

        if (!result) {
            throw new Error("Cannot update category");
        }

        return res.status(200).json({message: "Category updated sucessfully", data: result})


    }
    catch(err){
        console.log("Update category error:", err.message);
        return res.status(500).json({ message: err.message || "Failed to update category" });
    }
   
}


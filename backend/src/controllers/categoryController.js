import { createCategoryService, updateCategoryServices } from "../services/categoryService.js";

export const createCategory = async (req, res) => {
    // console.log("This is request body:", req.body);
    try {
        const {EventId, title } = req.body;

        const result = await createCategoryService(EventId, title);
        if (!result) {
            throw err("Cannot create new category");
        }

        return res.status(200).json({ message: "Category created sucessfully", data: result });
    }
    catch (err) {
        // console.log(err.message);
    }

}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        const result = updateCategoryServices(id, title);

        if (!result) {
            throw new Error("Cannot update category");
        }

        return res.status(200).json({message: "Category updated sucessfully", data:result})


    }
    catch(err){
        // console.log(err.message);
    }
   
}


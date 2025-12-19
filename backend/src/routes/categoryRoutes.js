import express from "express";

import { createCategory, updateCategory, } from "../controllers/categoryController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";


const router = express.Router();
router.post("/register", adminMiddleware,createCategory);
router.patch("/update/:id",adminMiddleware, updateCategory);


export default router;
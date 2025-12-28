

import express from "express";
import { createInquiry, getAllInquiries, getInquiryDetailById, updateInquiryStatus } from "../controllers/inquiryController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
const router = express.Router();

// Public route - contact form submission
router.post("/", createInquiry);

// Admin routes
router.get("/", adminMiddleware, getAllInquiries);
router.get("/:id", adminMiddleware, getInquiryDetailById);
router.put("/:id/status", adminMiddleware, updateInquiryStatus);

export default router;

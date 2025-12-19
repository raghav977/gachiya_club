import express from "express";
import { createEvent, updateEvent, getAllEvent, viewEvent, viewAdminEvent } from "../controllers/eventController.js";
import upload from "../middleware/multerConfig.js";
import { adminLevelViewEventService } from "../services/eventService.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register",adminMiddleware, upload.single("image"), createEvent);
router.patch("/update/:id", adminMiddleware, upload.single("image"), updateEvent);
router.get("/getAll", getAllEvent);
router.get("/view/:id", viewEvent
);
router.get("/admin/view/:id",adminMiddleware, viewAdminEvent)

export default router;
import express from "express";
import { registerPlayer, getAllRegisteredPlayers, getPlayerDetail, verifyPlayer, rejectPlayer } from "../controllers/playerController.js";
import upload from "../middleware/multerConfig.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/register",   upload.fields([
    { name: 'authenticateDocument', maxCount: 2 },
    { name: 'paymentVoucher', maxCount: 2 }
  ]), registerPlayer);

// fetch paginated/filtered players
router.get("/getall",adminMiddleware, getAllRegisteredPlayers);

// fetch single player detail
router.get("/:id",adminMiddleware, getPlayerDetail);

// Verify player and assign BIB number
router.patch("/:id/verify", adminMiddleware, verifyPlayer);

// Reject player registration
router.patch("/:id/reject", adminMiddleware, rejectPlayer);


export default router;
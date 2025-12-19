import express from "express";
import { registerPlayer, getAllRegisteredPlayers, getPlayerDetail } from "../controllers/playerController.js";
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


export default router;
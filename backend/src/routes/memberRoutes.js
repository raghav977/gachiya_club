import express from "express";
import {
  createMember,
  getAllMembers,
  getPublicMembers,
  getMemberById,
  updateMember,
  deleteMember,
  toggleMemberStatus,
  getMemberCounts,
  reorderMembers,
} from "../controllers/memberController.js";
import upload  from "../middleware/multerConfig.js";
import verifyToken  from "../middleware/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/public", getPublicMembers);
router.get("/counts", getMemberCounts);

// Admin routes (protected)
// Note: /reorder must come before /:id to avoid route conflicts
router.patch("/reorder", verifyToken, reorderMembers);
router.get("/", verifyToken, getAllMembers);
router.get("/:id", verifyToken, getMemberById);
router.post("/", verifyToken, upload.single("image"), createMember);
router.put("/:id", verifyToken, upload.single("image"), updateMember);
router.delete("/:id", verifyToken, deleteMember);
router.patch("/:id/toggle-status", verifyToken, toggleMemberStatus);

export default router;

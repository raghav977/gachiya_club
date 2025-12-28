import express from "express";
import {
  createGallery,
  getGalleryAdmin,
  getGalleryPublic,
  getFeatured,
  updateGallery,
  toggleFeaturedStatus,
  updateOrder,
  deleteGallery,
} from "../controllers/galleryController.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/multerConfig.js";

const router = express.Router();

// Public routes
router.get("/all", getGalleryPublic);
router.get("/featured", getFeatured);

// Admin routes
router.get("/admin/all", adminMiddleware, getGalleryAdmin);
router.post("/admin/create", upload.single("image"), adminMiddleware, createGallery);
router.patch("/admin/update/:id", upload.single("image"), adminMiddleware, updateGallery);
router.patch("/admin/toggle-featured/:id", adminMiddleware, toggleFeaturedStatus);
router.patch("/admin/update-order", adminMiddleware, updateOrder);
router.delete("/admin/delete/:id", adminMiddleware, deleteGallery);

export default router;

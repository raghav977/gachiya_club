import {
  createGalleryImage,
  getAllGalleryAdmin,
  getAllGalleryPublic,
  getFeaturedGallery,
  updateGalleryImage,
  toggleFeatured,
  updateFeaturedOrder,
  deleteGalleryImage,
} from "../services/galleryService.js";
import { getRelativeImagePath } from "../middleware/multerConfig.js";

// Admin: Create gallery image
export const createGallery = async (req, res) => {
  try {
    const { title } = req.body;
    // Convert absolute path to relative path for database storage
    const url = getRelativeImagePath(req.file?.path);

    if (!url) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const image = await createGalleryImage(title || "", url);
    return res.status(201).json({
      message: "Gallery image uploaded successfully",
      data: image,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin: Get all gallery images
export const getGalleryAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const { images, total } = await getAllGalleryAdmin(search, limit, page);
    return res.status(200).json({
      message: "Gallery images fetched successfully",
      page,
      limit,
      total,
      data: images,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Public: Get all active gallery images
export const getGalleryPublic = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const { images, total } = await getAllGalleryPublic(limit, page);
    return res.status(200).json({
      message: "Gallery images fetched successfully",
      page,
      limit,
      total,
      data: images,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Public: Get featured images for home page
export const getFeatured = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const images = await getFeaturedGallery(limit);
    return res.status(200).json({
      message: "Featured images fetched successfully",
      data: images,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin: Update gallery image
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, isActive } = req.body;
    // Convert absolute path to relative path for database storage
    const url = getRelativeImagePath(req.file?.path);

    const image = await updateGalleryImage(id, title, url, isActive);
    return res.status(200).json({
      message: "Gallery image updated successfully",
      data: image,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin: Toggle featured status
export const toggleFeaturedStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isFeatured } = req.body;

    if (typeof isFeatured !== "boolean") {
      return res.status(400).json({ message: "isFeatured must be a boolean" });
    }

    const image = await toggleFeatured(id, isFeatured);
    return res.status(200).json({
      message: `Image ${isFeatured ? "added to" : "removed from"} home page`,
      data: image,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin: Update featured order
export const updateOrder = async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: "orderedIds must be an array" });
    }

    await updateFeaturedOrder(orderedIds);
    return res.status(200).json({
      message: "Featured order updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Admin: Delete gallery image
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteGalleryImage(id);
    return res.status(200).json({
      message: "Gallery image deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

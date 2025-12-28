import { Op } from "sequelize";
import Gallery from "../models/GalleryModel.js";

// Create a new gallery image
export const createGalleryImage = async (title, url) => {
  try {
    const image = await Gallery.create({ title, url });
    return image;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to create gallery image");
  }
};

// Get all gallery images for admin (with pagination)
export const getAllGalleryAdmin = async (search = "", limit = 10, page = 1) => {
  try {
    const limitInt = parseInt(limit, 10) || 10;
    const pageInt = parseInt(page, 10) || 1;
    const offset = (pageInt - 1) * limitInt;

    const images = await Gallery.findAll({
      limit: limitInt,
      offset: offset,
      where: {
        ...(search && {
          title: { [Op.like]: `%${search}%` }
        })
      },
      order: [["createdAt", "DESC"]],
    });

    const total = await Gallery.count({
      where: {
        ...(search && {
          title: { [Op.like]: `%${search}%` }
        })
      }
    });

    return { images, total };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch gallery images");
  }
};

// Get all active gallery images for public
export const getAllGalleryPublic = async (limit = 20, page = 1) => {
  try {
    const limitInt = parseInt(limit, 10) || 20;
    const pageInt = parseInt(page, 10) || 1;
    const offset = (pageInt - 1) * limitInt;

    const images = await Gallery.findAll({
      limit: limitInt,
      offset: offset,
      where: { isActive: true },
      order: [["createdAt", "DESC"]],
    });

    const total = await Gallery.count({ where: { isActive: true } });

    return { images, total };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch gallery images");
  }
};

// Get featured images for home page (limited to 6, ordered)
export const getFeaturedGallery = async (limit = 6) => {
  try {
    const limitInt = parseInt(limit, 10) || 6;

    const images = await Gallery.findAll({
      limit: limitInt,
      where: { isFeatured: true, isActive: true },
      order: [["order", "ASC"], ["createdAt", "DESC"]],
    });

    return images;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to fetch featured images");
  }
};

// Update gallery image
export const updateGalleryImage = async (id, title, url, isActive) => {
  try {
    const image = await Gallery.findByPk(id);
    if (!image) throw new Error("Gallery image not found");

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (url !== undefined) updateData.url = url;
    if (isActive !== undefined) updateData.isActive = isActive;

    await Gallery.update(updateData, { where: { id } });
    return await Gallery.findByPk(id);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update gallery image");
  }
};

// Toggle featured status
export const toggleFeatured = async (id, isFeatured) => {
  try {
    const image = await Gallery.findByPk(id);
    if (!image) throw new Error("Gallery image not found");

    await Gallery.update({ isFeatured }, { where: { id } });
    return await Gallery.findByPk(id);
  } catch (err) {
    console.error(err);
    throw new Error("Failed to toggle featured status");
  }
};

// Update order of featured images
export const updateFeaturedOrder = async (orderedIds) => {
  try {
    // orderedIds is an array of image IDs in the desired order
    for (let i = 0; i < orderedIds.length; i++) {
      await Gallery.update({ order: i }, { where: { id: orderedIds[i] } });
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to update featured order");
  }
};

// Delete gallery image
export const deleteGalleryImage = async (id) => {
  try {
    const image = await Gallery.findByPk(id);
    if (!image) throw new Error("Gallery image not found");

    await Gallery.destroy({ where: { id } });
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to delete gallery image");
  }
};


import { Op } from "sequelize";
import Resources from "../models/ResourcesModel.js";

export const createResource = async (name, url) => {
  try {
    return await Resources.create({ name, url });
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};

export const updateResource = async (id, name, url, isActive) => {
  try {
    const resource = await Resources.findByPk(id);
    if (!resource) throw new Error("Resource doesn't exist");

    // Build update object - only include url if a new file was uploaded
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (url !== undefined && url !== null) updateData.url = url;
    if (isActive !== undefined) updateData.isActive = isActive;

    await resource.update(updateData);
    return resource;
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};

export const getAllResourcesForUser = async (search = "", limit = 10, page = 1) => {
  try {
    // Ensure limit and page are integers
    const limitInt = parseInt(limit, 10) || 10;
    const pageInt = parseInt(page, 10) || 1;
    const offset = (pageInt - 1) * limitInt;

    const resources = await Resources.findAll({
      limit: limitInt,
      offset: offset,
      attributes: ["id", "name", "url","createdAt"],
      where: {
        isActive: true,
        ...(search && {
          name: { [Op.like]: `%${search}%` }
        })
      },
      order: [["id", "DESC"]]
    });
    
    const totalResources = await Resources.count({
      where: {
        isActive: true,
        ...(search && {
          name: { [Op.like]: `%${search}%` }
        })
      }
    });
    
    return { resources, totalResources };
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};

export const getAllResourcesForAdmin = async (search = "", limit = 10, page = 1) => {
  try {
    // Ensure limit and page are integers
    const limitInt = parseInt(limit, 10) || 10;
    const pageInt = parseInt(page, 10) || 1;
    const offset = (pageInt - 1) * limitInt;

    const resources = await Resources.findAll({
      limit: limitInt,
      offset: offset,
      attributes: ["id", "name", "url", "isActive","createdAt"],
      where: {
        ...(search && {
          name: { [Op.like]: `%${search}%` }
        })
      },
      order: [["id", "DESC"]]
    });
    
    const totalResources = await Resources.count({
      where: {
        ...(search && {
          name: { [Op.like]: `%${search}%` }
        })
      }
    });
    
    return { resources, totalResources };
  } catch (err) {
    console.error(err);
    throw new Error("Something went wrong");
  }
};

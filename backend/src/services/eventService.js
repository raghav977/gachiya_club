import { fieldValidation } from "../utils/validation.js"
import Event from "../models/evenetModel.js";
import Category from "../models/categoryModels.js";
import { Op } from "sequelize";

export const regisetEvent = async (title, description, startDate, isPublish, note, imageURl) => {
    if (!fieldValidation(title, description, startDate)) {
        throw new error("Please input all fields")

    }

    const newEvent = await Event.create({

        title,
        description,
        startDate,
        isPublish,
        note,
        imageURl
    });

    return newEvent;
}

export const updateEventService = async (id, title, description, note, ispublish, isActive, imageURl) => {
    try {
        const event = await Event.findByPk(id);
        if (!event) {
            throw new Error("No event found");
        }

    const updatePayload = {
      title,
      description,
      note,
      isPublish:  ispublish,
      isActive
    };

    // if a new image was uploaded, update imageURl too
    if (imageURl) updatePayload.imageURl = imageURl;

    await Event.update(
      updatePayload,
      { where: { id } }
    );


        return event;

    }
    catch (err) {
        // console.log("Update event error:", err.message);
        throw err;
    }

}

// getAll events service
export const getAllEventService = async (search = "", limit = 10, offset = 0) => {
    try {
        const events = await Event.findAll({
          attributes: ['id', 'title', 'imageURl', 'startDate','isPublish','isActive'],
            where: {
              isActive: true,
                title: {
                    [Op.like]: `%${search}%` 
                }
            },
            limit,
            offset,
            order: [["createdAt", "DESC"]]
        });
        // console.log("Events fetched:", events);

        const totalEvents = await Event.count({
            where: {
              isActive: true,
                title: {
                    [Op.like]: `%${search}%`
                }
            }
        });

        return { events, totalEvents };
    } catch (err) {
        console.error("Error in getAllEventService:", err.message);
        throw err;
    }
};


export const viewEventService = async (id) => {
  try {
    if (!id) throw new Error("Event ID is required");

    const eventDetails = await Event.findOne({
      where: {
        id,
        isActive: true
      },
      include: [
        {
          model: Category,
          attributes: ["id", "title", "isActive","bibStart","bibEnd"],
          where: { isActive: true },
          required: false 
        }
      ]
    });

    if (!eventDetails) {
      throw new Error("Event not found");
    }

    return eventDetails;
  } catch (err) {
    console.error("Error from viewEvent service:", err.message);
    throw err;
  }
};



export const adminLevelViewEventService = async (id) => {
  try {
    if (!id) {
      throw new Error("Event ID is required");
    }

    const eventDetails = await Event.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ["id", "title", "isActive"],
        }
      ]

    });

    if (!eventDetails) {
      throw new Error("Event not found");
    }

    return eventDetails;

  } catch (err) {
    console.error("Error from adminLevelViewEvent service:", err.message);
    throw err;
  }
};
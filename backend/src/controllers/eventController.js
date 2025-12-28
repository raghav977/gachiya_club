import { regisetEvent, updateEventService, getAllEventService, viewEventService, adminLevelViewEventService  } from "../services/eventService.js";
import { getRelativeImagePath } from "../middleware/multerConfig.js";


import path from "path";

export const createEvent = async (req, res) => {
    // console.log(req.file);
  // Convert absolute path to relative path for database storage
  const imageUrl = getRelativeImagePath(req.file?.path);
    const { title, description, startDate, isPublish, note } = req.body;
    
    try {

    const result = await regisetEvent( title, description, startDate, isPublish, note, imageUrl);
        // console.log(result);
         
    return res.status(200).json({message: "Successfully created new event", data: result});

    }
    catch (err) {
        console.log("Somthing went wrong", err.message);
        return res.status(500).json({ message: err.message });
    }

}

export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, note, isPublish, isActive } = req.body;
    // Convert absolute path to relative path for database storage
    const imageUrl = getRelativeImagePath(req.file?.path);

    if (!id) {
      return res.status(400).json({
        message: "Event id is required"
      });
    }

    const updatedEvent = await updateEventService(
      id,
      title,
      description,
      note,
      isPublish,
      isActive,
      imageUrl
    );

    return res.status(200).json({
      message: "Event updated successfully",
      data: updatedEvent
    });

  } catch (err) {
    console.error("Update Event Controller Error:", err.message);

    return res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
};

export const getAllEvent = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";

  const { events, totalEvents } = await getAllEventService( search, limit, offset);

    if (events.length === 0) {
      return res.status(404).json({
        message: "No events found"
      });
    }

  const data = events.map(event => {
    const e = event.toJSON ? event.toJSON() : event;
    const imgPath = e.imageURl || e.imageUrl || e.imageURL;
    const imageURL = imgPath ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(imgPath)}` : null;
    return {
      id: e.id,
      title: e.title,
      imageURL,
      startDate: e.startDate,
      isPublish: e.isPublish,
    };
  });

  return res.status(200).json({
    message: "Events fetched successfully",
    page,
    limit,
    totalEvents,
    data
  });

  } catch (err) {
    console.error("Get All Events Error:", err.message);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
};


//view event controller
export const viewEvent = async (req, res) => {
  try {
    const { id } = req.params;
  
    const event = await viewEventService(id);

    const e = event.toJSON ? event.toJSON() : event;
    const imgPath = e.imageURl || e.imageUrl || e.imageURL;
    const imageURL = imgPath ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(imgPath)}` : null;
    e.imageURL = imageURL;

    return res.status(200).json({
      message: "Event fetched successfully",
      data: e
    });

  } catch (err) {
    console.error("Get Event Error:", err.message);
    return res.status(404).json({ message: err.message });
  }
};

export const viewAdminEvent = async (req, res) => {
  try {
    const { id } = req.params;
  
    const event = await adminLevelViewEventService(id);

    const e = event.toJSON ? event.toJSON() : event;
    const imgPath = e.imageURl || e.imageUrl || e.imageURL;
    const imageURL = imgPath ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(imgPath)}` : null;
    e.imageURL = imageURL;

    return res.status(200).json({
      message: "Event fetched successfully",
      data: e
    });

  } catch (err) {
    console.error("Get Event Error:", err.message);
    return res.status(404).json({ message: err.message });
  }
};

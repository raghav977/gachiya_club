import { regisetEvent, updateEventService, getAllEventService, viewEventService, adminLevelViewEventService  } from "../services/eventService.js";
import path from "path";




export const createEvent = async (req, res) => {
    // console.log(req.file);
  // multer provides a filesystem path in req.file.path; convert to a public URL path
  const imageURl = req.file?.path;
  const imagePublicUrl = imageURl ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(imageURl)}` : null;
    const { title, description, startDate, isPublish, note } = req.body;
    
    try {

    const result = await regisetEvent( title, description, startDate, isPublish, note, imageURl);
        // console.log(result);
         
    // return created event and a public image URL for frontend
    const returned = result.toJSON ? result.toJSON() : result;
    returned.imageURL = imagePublicUrl;
    return res.status(200).json({message: "Successfully created new event", data: returned});

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
    // accept optional uploaded image (multer sets req.file)
  const imageURl = req.file?.path;
  const imagePublicUrl = imageURl ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(imageURl)}` : null;

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
      imageURl
    );

    const returned = updatedEvent.toJSON ? updatedEvent.toJSON() : updatedEvent;
    // if a new image was uploaded, include public image url
    if (imagePublicUrl) returned.imageURL = imagePublicUrl;

    return res.status(200).json({
      message: "Event updated successfully",
      data: returned
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

  // convert stored filesystem paths into public URLs
  const data = events.map(event => {
    const e = event.toJSON ? event.toJSON() : event;
    const imgPath = e.imageURl || e.imageUrl || e.imageURL;
    const imageURL = imgPath ? `${req.protocol}://${req.get('host')}/uploads/${path.basename(imgPath)}` : null;
    return {
      id: e.id,
      title: e.title,
      imageURL,
      startDate: e.startDate
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

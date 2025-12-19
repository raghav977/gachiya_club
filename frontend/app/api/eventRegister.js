import { apiFetch, apiGet, apiPatch, apiPostForm } from "./interceptor";
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export const eventRegister = async (eventData) => {
  const formData = new FormData();
  for (const key in eventData) formData.append(key, eventData[key]);

  try {
    return await apiPostForm(`/api/event/register`, formData);
  } catch (error) {
    console.error("Error registering event:", error);
    throw error;
  }
}

export const getAllEvents = async ({ page = 1, limit = 10, search = "" } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    const url = `${BACKEND_URL}/api/event/getall?${params.toString()}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("Fetched events data:", data);
    // backend already returns 404 when no events — normalize to empty list
    if (!data) return { message: "No events found", page, limit, totalEvents: 0, data: [] };
    return data;
  } catch (err) {
    console.error('Error fetching events:', err);
    throw err;
  }
}

export const updateEvent = async (id, eventData) => {
  console.log("updating event id:", id, "with data:", eventData);
  try {
    // if caller passed a FormData (contains an image), send as multipart PATCH
    if (typeof FormData !== 'undefined' && eventData instanceof FormData) {
      return await apiFetch(`/api/event/update/${id}`, { method: 'PATCH', body: eventData });
    }

    // if eventData contains an image file, build FormData
    if (eventData && eventData.imageFile) {
      const fd = new FormData();
      for (const key in eventData) {
        if (eventData.hasOwnProperty(key) && key !== 'imageFile') {
          fd.append(key, eventData[key]);
        }
      }
      fd.append('image', eventData.imageFile);
      return await apiFetch(`/api/event/update/${id}`, { method: 'PATCH', body: fd });
    }

    // otherwise send JSON
    return await apiPatch(`/api/event/update/${id}`, eventData);
  } catch (err) {
    console.error('Error updating event:', err);
    throw err;
  }
}

export const getEventDetail = async (id) => {
  try {
    return await apiGet(`/api/event/view/${id}`);
  } catch (err) {
    console.error('Error fetching event detail:', err);
    throw err;
  }
}

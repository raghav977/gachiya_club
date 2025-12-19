import { apiGet } from "./interceptor";

export const getAllPlayers = async ({ page = 1, limit = 10, search = "", eventId = null, categoryId = null } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (limit) params.append("limit", limit);
    if (page) params.append("page", page);
    if (eventId) params.append("eventId", eventId);
    if (categoryId) params.append("categoryId", categoryId);

    const url = `/api/player/getall?${params.toString()}`;
    return await apiGet(url);
  } catch (err) {
    console.error("Error in getAllPlayers:", err);
    throw err;
  }
};

export const getPlayerDetail = async (id) => {
  try {
    return await apiGet(`/api/player/${id}`);
  } catch (err) {
    console.error("Error in getPlayerDetail:", err);
    throw err;
  }
};

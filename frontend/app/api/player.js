import { apiGet, apiPatch } from "./interceptor";

export const getAllPlayers = async ({ page = 1, limit = 10, search = "", eventId = null, categoryId = null, status = null, bibNumber = null } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (limit) params.append("limit", limit);
    if (page) params.append("page", page);
    if (eventId) params.append("eventId", eventId);
    if (categoryId) params.append("categoryId", categoryId);
    if (status) params.append("status", status);
    if (bibNumber) params.append("bibNumber", bibNumber);

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

// Verify player and assign BIB number
export const verifyPlayer = async (id) => {
  try {
    return await apiPatch(`/api/player/${id}/verify`);
  } catch (err) {
    console.error("Error in verifyPlayer:", err);
    throw err;
  }
};

// Reject player registration
export const rejectPlayer = async (id, reason = "") => {
  try {
    return await apiPatch(`/api/player/${id}/reject`, { reason });
  } catch (err) {
    console.error("Error in rejectPlayer:", err);
    throw err;
  }
};

import { apiPost, apiPatch } from "./interceptor";

export const categoryRegister = async (title, EventId, bibStart = null, bibEnd = null) => {
    try {
        return await apiPost(`/api/category/register`, { title, EventId, bibStart, bibEnd });
    } catch (err) {
        console.error("Error registering category:", err);
        throw err;
    }
};

export const updateCategory = async (id, { title, isActive, bibStart, bibEnd }) => {
    try {
        return await apiPatch(`/api/category/update/${id}`, { title, isActive, bibStart, bibEnd });
    } catch (err) {
        console.error("Error updating category:", err);
        throw err;
    }
};
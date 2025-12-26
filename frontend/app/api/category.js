import { apiPost, apiPatch } from "./interceptor";

export const categoryRegister = async (title, EventId) => {
    try {
        return await apiPost(`/api/category/register`, { title, EventId });
    } catch (err) {
        console.error("Error registering category:", err);
        throw err;
    }
};

export const updateCategory = async (id, title, isActive) => {
    try {
        return await apiPatch(`/api/category/update/${id}`, { title, isActive });
    } catch (err) {
        console.error("Error updating category:", err);
        throw err;
    }
};
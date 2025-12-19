import { apiPost } from "./interceptor";

export const categoryRegister = async (title, EventId) => {
    try {
        return await apiPost(`/api/category/register`, { title, EventId });
    } catch (err) {
        console.error("Error registering category:", err);
        throw err;
    }
};
import { apiGet, apiPostForm } from "./interceptor";

// User endpoints
export const getAllResources = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    return await apiGet(`/api/resource/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  } catch (err) {
    console.error("Error fetching resources:", err);
    throw err;
  }
};

// Admin endpoints
export const getAllResourcesAdmin = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    return await apiGet(`/api/resource/admin/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  } catch (err) {
    console.error("Error fetching admin resources:", err);
    throw err;
  }
};

export const createResource = async (formData) => {
  try {
    return await apiPostForm(`/api/resource/admin/create`, formData);
  } catch (err) {
    console.error("Error creating resource:", err);
    throw err;
  }
};

export const updateResource = async (id, formData) => {
  try {
    // For PATCH with FormData, we need to use fetch directly
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    
    const resp = await fetch(`${BASE_URL}/api/resource/admin/update/${id}`, {
      method: "PATCH",
      headers,
      body: formData,
    });
    
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Failed to update resource");
    }
    
    return await resp.json();
  } catch (err) {
    console.error("Error updating resource:", err);
    throw err;
  }
};

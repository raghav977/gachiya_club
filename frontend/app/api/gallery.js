import { apiGet, apiPostForm } from "./interceptor";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// Public endpoints
export const getAllGallery = async ({ page = 1, limit = 20 }) => {
  try {
    return await apiGet(`/api/gallery/all?page=${page}&limit=${limit}`);
  } catch (err) {
    console.error("Error fetching gallery:", err);
    throw err;
  }
};

export const getFeaturedGallery = async (limit = 6) => {
  try {
    return await apiGet(`/api/gallery/featured?limit=${limit}`);
  } catch (err) {
    console.error("Error fetching featured gallery:", err);
    throw err;
  }
};

// Admin endpoints
export const getAllGalleryAdmin = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    return await apiGet(`/api/gallery/admin/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  } catch (err) {
    console.error("Error fetching admin gallery:", err);
    throw err;
  }
};

export const createGalleryImage = async (formData) => {
  try {
    return await apiPostForm(`/api/gallery/admin/create`, formData);
  } catch (err) {
    console.error("Error creating gallery image:", err);
    throw err;
  }
};

export const updateGalleryImage = async (id, formData) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(`${BASE_URL}/api/gallery/admin/update/${id}`, {
      method: "PATCH",
      headers,
      body: formData,
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Failed to update gallery image");
    }
    return await resp.json();
  } catch (err) {
    console.error("Error updating gallery image:", err);
    throw err;
  }
};

export const toggleFeatured = async (id, isFeatured) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(`${BASE_URL}/api/gallery/admin/toggle-featured/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ isFeatured }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Failed to toggle featured");
    }
    return await resp.json();
  } catch (err) {
    console.error("Error toggling featured:", err);
    throw err;
  }
};

export const updateFeaturedOrder = async (orderedIds) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(`${BASE_URL}/api/gallery/admin/update-order`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ orderedIds }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Failed to update order");
    }
    return await resp.json();
  } catch (err) {
    console.error("Error updating order:", err);
    throw err;
  }
};

export const deleteGalleryImage = async (id) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const resp = await fetch(`${BASE_URL}/api/gallery/admin/delete/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Failed to delete gallery image");
    }
    return await resp.json();
  } catch (err) {
    console.error("Error deleting gallery image:", err);
    throw err;
  }
};

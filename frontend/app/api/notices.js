import { apiGet, apiPost, apiPatch, apiPostForm } from "./interceptor";

// User endpoints
export const getAllNotices = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    return await apiGet(`/api/notice/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  } catch (err) {
    console.error("Error fetching notices:", err);
    throw err;
  }
};

export const getNoticeDetail = async (id) => {
  try {
    return await apiGet(`/api/notice/${id}`);
  } catch (err) {
    console.error("Error fetching notice detail:", err);
    throw err;
  }
};

// Admin endpoints
export const getAllNoticesAdmin = async ({ page = 1, limit = 10, search = "" }) => {
  try {
    return await apiGet(`/api/notice/admin/all?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);
  } catch (err) {
    console.error("Error fetching admin notices:", err);
    throw err;
  }
};

export const createNotice = async (formData) => {
  try {
    return await apiPostForm(`/api/notice/create`, formData);
  } catch (err) {
    console.error("Error creating notice:", err);
    throw err;
  }
};

export const updateNotice = async (id, formData) => {
  try {
    // For PATCH with FormData, we need to use fetch directly
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    
    const resp = await fetch(`${BASE_URL}/api/notice/update/${id}`, {
      method: "PATCH",
      headers,
      body: formData,
    });
    
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(text || "Failed to update notice");
    }
    
    return await resp.json();
  } catch (err) {
    console.error("Error updating notice:", err);
    throw err;
  }
};

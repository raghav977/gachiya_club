import { apiGet, apiPostForm, apiPatch, apiDelete } from "./interceptor";

// Public - Get active members
export const getPublicMembers = async ({ page = 1, limit = 20, memberType = "", search = "" }) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (memberType) params.append("memberType", memberType);
  if (search) params.append("search", search);
  
  return apiGet(`/api/member/public?${params.toString()}`);
};

// Public - Get member counts by type
export const getMemberCounts = async () => {
  return apiGet("/api/member/counts");
};

// Admin - Get all members with filters
export const getAllMembersAdmin = async ({ page = 1, limit = 10, search = "", memberType = "", isActive = "" }) => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (search) params.append("search", search);
  if (memberType) params.append("memberType", memberType);
  if (isActive !== "") params.append("isActive", isActive);
  
  return apiGet(`/api/member?${params.toString()}`);
};

// Admin - Get single member
export const getMemberById = async (id) => {
  return apiGet(`/api/member/${id}`);
};

// Admin - Create member (FormData for file upload)
export const createMember = async (formData) => {
  return apiPostForm("/api/member", formData);
};

// Admin - Update member (FormData for file upload)
export const updateMember = async (id, formData) => {
  // Use apiFetch directly for PUT with FormData
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/${id}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || "Failed to update member");
  }
  return resp.json();
};


export const deleteMember = async (id) => {
  return apiDelete(`/api/member/${id}`);
};


export const toggleMemberStatus = async (id) => {
  return apiPatch(`/api/member/${id}/toggle-status`);
};

// Admin - Reorder members (update displayOrder for drag & drop)
export const reorderMembers = async (orders) => {
  // orders = [{ id: 1, displayOrder: 0 }, { id: 2, displayOrder: 1 }, ...]
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/reorder`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ orders }),
  });
  
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(text || "Failed to reorder members");
  }
  return resp.json();
};

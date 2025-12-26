import {apiGet, apiPost, apiPut} from "./interceptor";

// Submit inquiry (public - from contact form)
export const submitInquiry = async ({ name, email, message }) => {
  const response = await apiPost(`/api/inquiry`, { name, email, message });
  return response;
};

// Get all inquiries with pagination, status filter, and search
export const getAllInquiries = async ({ page = 1, limit = 10, status = '', search = '' }) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const response = await apiGet(`/api/inquiry?${params.toString()}`);
  console.log("Response:", response);
  return response; // apiGet already returns parsed JSON, no need for .data
};

// Get inquiry detail by ID
export const getInquiryDetail = async (id) => {
  const response = await apiGet(`/api/inquiry/${id}`);
  return response; // apiGet already returns parsed JSON
};

// Update inquiry status
export const updateInquiryStatus = async (id, status) => {
  const response = await apiPut(`/api/inquiry/${id}/status`, { status });
  return response; // apiPut already returns parsed JSON
};

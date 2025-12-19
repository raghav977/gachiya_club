import { apiPost, apiFetch, apiGet } from './interceptor';

export const adminLogin = async (email, password) => {
  try {
    return await apiPost('/api/admin/login', { email, password });
  } catch (err) {
    console.error('adminLogin error:', err);
    throw err;
  }
};

export const verifyAdmin = async (token) => {
  try {
    // verify endpoint expects Authorization header; apiFetch will attach token if present in localStorage
    if (token && typeof window !== 'undefined') localStorage.setItem('admin_token', token);
    return await apiGet('/api/admin/verify');
  } catch (err) {
    console.error('verifyAdmin error:', err);
    throw err;
  }
};

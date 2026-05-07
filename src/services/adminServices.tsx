import { BASE_URL } from '../utils/urls';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const fetchAdminUsers = async (filters: { role?: string; status?: string } = {}) => {
  const queryParams = new URLSearchParams();
  if (filters.role && filters.role !== 'all') queryParams.append('role', filters.role);
  if (filters.status && filters.status !== 'all') queryParams.append('status', filters.status);

  const adminUsersUrl = `${BASE_URL}/api/admin/users?${queryParams.toString()}`;

  const response = await fetch(adminUsersUrl, {
    headers: getHeaders(),
  });
  return response;
};

export const updateUserStatus = async (userId: number, status: 'approved' | 'rejected' | 'pending') => {
  const response = await fetch(`${BASE_URL}/api/admin/users/${userId}/status`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return response;
};

export const fetchAnalytics = async () => {
  const response = await fetch(`${BASE_URL}/api/admin/analytics`, {
    headers: getHeaders(),
  });
  return response;
};

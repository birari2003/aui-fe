import { API_ENDPOINTS } from '../utils/urls';

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

  const adminUsersUrl = `${API_ENDPOINTS.ADMIN_EXTRA.USERS}?${queryParams.toString()}`;

  const response = await fetch(adminUsersUrl, {
    headers: getHeaders(),
  });
  return response;
};

export const updateUserStatus = async (userId: number, status: 'approved' | 'rejected' | 'pending') => {
  const response = await fetch(API_ENDPOINTS.ADMIN_EXTRA.USER_STATUS(userId), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return response;
};

export const fetchAnalytics = async () => {
  const response = await fetch(API_ENDPOINTS.ADMIN_EXTRA.ANALYTICS, {
    headers: getHeaders(),
  });
  return response;
};

export const fetchEmailAccounts = async () => {
  const response = await fetch(API_ENDPOINTS.ADMIN_EXTRA.EMAIL_ACCOUNTS, {
    headers: getHeaders(),
  });
  return response;
};

export const sendBulkEmail = async (emails: string[], subject: string, body: string, fromEmail?: string) => {
  const response = await fetch(API_ENDPOINTS.ADMIN_EXTRA.SEND_BULK_EMAIL, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ emails, subject, body, fromEmail }),
  });
  return response;
};

import { API_ENDPOINTS } from '../utils/urls';

export const fetchPlatformStats = async () => {
  const publicStatsRes = await fetch(API_ENDPOINTS.PLATFORM.STATS);
  if (publicStatsRes.ok) return publicStatsRes;

  const token = localStorage.getItem('token');
  if (!token) return publicStatsRes;

  return fetch(API_ENDPOINTS.ADMIN_EXTRA.ANALYTICS, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
};

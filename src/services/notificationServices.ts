import { API_ENDPOINTS } from '../utils/urls';

export const getMyNotifications = async (token: string) => {
  return fetch(API_ENDPOINTS.PROFESSIONAL.NOTIFICATIONS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const markAsRead = async (token: string, id: number) => {
  return fetch(API_ENDPOINTS.PROFESSIONAL.MARK_READ(id), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

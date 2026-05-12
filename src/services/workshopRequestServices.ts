import { API_ENDPOINTS } from '../utils/urls';

const API_URL = API_ENDPOINTS.WORKSHOP_REQUESTS.BASE;

export const createWorkshopRequest = async (data: any) => {
  return fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
};

export const getMyWorkshopRequests = async () => {
  return fetch(API_ENDPOINTS.WORKSHOP_REQUESTS.MY_REQUESTS, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const getAllWorkshopRequests = async () => {
  return fetch(API_ENDPOINTS.WORKSHOP_REQUESTS.ALL, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const updateWorkshopRequestStatus = async (id: number, status: string) => {
  return fetch(API_ENDPOINTS.WORKSHOP_REQUESTS.STATUS(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ status }),
  });
};

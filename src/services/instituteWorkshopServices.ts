import { API_ENDPOINTS } from '../utils/urls';

const API_URL = API_ENDPOINTS.INSTITUTE.WORKSHOPS;

export const fetchAllWorkshops = async () => {
  return fetch(`${API_URL}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const createInstituteWorkshop = async (data: any) => {
  return fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
};

export const updateInstituteWorkshop = async (id: number, data: any) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
};

export const deleteInstituteWorkshop = async (id: number) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

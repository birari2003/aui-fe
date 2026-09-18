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
  const body = toFormData(data);
  return fetch(`${API_URL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body,
  });
};

export const updateInstituteWorkshop = async (id: number, data: any) => {
  const body = toFormData(data);
  return fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body,
  });
};

const toFormData = (data: any) => {
  const form = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (key === 'mediaFile' && value instanceof File) form.append('media', value);
    else if (Array.isArray(value)) form.append(key, JSON.stringify(value));
    else if (key !== 'mediaFile') form.append(key, String(value));
  });
  return form;
};

export const deleteInstituteWorkshop = async (id: number) => {
  return fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

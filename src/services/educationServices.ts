import { API_ENDPOINTS } from '../utils/urls';

export const fetchEducations = async (status?: number) => {
  const url = status !== undefined ? `${API_ENDPOINTS.EDUCATIONS.BASE}?status=${status}` : API_ENDPOINTS.EDUCATIONS.BASE;
  const response = await fetch(url);
  return response;
};

export const createEducation = async (data: any, token: string) => {
  const response = await fetch(API_ENDPOINTS.EDUCATIONS.BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const updateEducation = async (id: number, data: any, token: string) => {
  const response = await fetch(API_ENDPOINTS.EDUCATIONS.GET_BY_ID(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteEducation = async (id: number, token: string) => {
  const response = await fetch(API_ENDPOINTS.EDUCATIONS.GET_BY_ID(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

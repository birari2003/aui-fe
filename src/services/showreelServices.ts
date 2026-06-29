import { API_ENDPOINTS } from '../utils/urls';

export const fetchShowreels = async () => {
  const response = await fetch(`${API_ENDPOINTS.SHOWREELS.BASE}`);
  return response;
};

export const createShowreel = async (token: string, formData: FormData) => {
  const response = await fetch(`${API_ENDPOINTS.SHOWREELS.BASE}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Note: Do NOT set Content-Type header when using FormData; the browser will automatically set it with boundary
    },
    body: formData
  });
  return response;
};

export const deleteShowreel = async (token: string, id: number) => {
  const response = await fetch(`${API_ENDPOINTS.SHOWREELS.DELETE(id)}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response;
};

export const updateShowreel = async (token: string, id: number, formData: FormData) => {
  const response = await fetch(`${API_ENDPOINTS.SHOWREELS.DELETE(id)}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  return response;
};

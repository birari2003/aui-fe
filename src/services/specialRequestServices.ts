import { API_ENDPOINTS } from '../utils/urls';

export const createProfessionalSpecialRequest = async (token: string, data: {
  professionalName: string;
  professionalPublicUrl?: string;
  institutePublicUrl: string;
  mentorshipTime?: string;
  message: string;
}) => {
  const response = await fetch(`${API_ENDPOINTS.SPECIAL_REQUESTS.BASE}/professional`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const createInstituteSpecialRequest = async (token: string, data: {
  professionalName: string;
  professionalPublicUrl?: string;
  mentorshipTime?: string;
  message: string;
}) => {
  const response = await fetch(`${API_ENDPOINTS.SPECIAL_REQUESTS.BASE}/institute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const getAllSpecialRequests = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.SPECIAL_REQUESTS.GET_ALL, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const getMySpecialRequests = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.SPECIAL_REQUESTS.GET_MY, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const shareProfessionalToInstitute = async (token: string, data: {
  professionalId: number;
  instituteId: number;
  message?: string;
}) => {
  const response = await fetch(`${API_ENDPOINTS.SPECIAL_REQUESTS.BASE}/share`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const updateSpecialRequestStatus = async (token: string, id: number, data: {
  status: 'pending' | 'contacted' | 'closed' | 'rejected';
  responseMessage?: string;
}) => {
  const response = await fetch(API_ENDPOINTS.SPECIAL_REQUESTS.UPDATE_STATUS(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

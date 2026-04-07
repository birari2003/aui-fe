import { API_ENDPOINTS } from '../utils/urls';

export const getMyProfile = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.PROFESSIONAL.GET_PROFILE, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const upsertProfile = async (token: string, data: any) => {
  const response = await fetch(API_ENDPOINTS.PROFESSIONAL.UPDATE_PROFILE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const getPublicProfile = async (talentCode: string) => {
  const response = await fetch(API_ENDPOINTS.PROFESSIONAL.PUBLIC_PROFILE(talentCode));
  return response;
};

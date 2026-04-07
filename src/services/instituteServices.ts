import { API_ENDPOINTS } from '../utils/urls';

export const getMyInstituteProfile = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.INSTITUTE.GET_PROFILE, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const updateInstituteProfile = async (token: string, data: any) => {
  const response = await fetch(API_ENDPOINTS.INSTITUTE.UPDATE_PROFILE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const getPublicInstituteProfile = async (talentCode: string) => {
  const response = await fetch(API_ENDPOINTS.INSTITUTE.PUBLIC_PROFILE(talentCode));
  return response;
};

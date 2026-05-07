import { BASE_URL } from '../utils/urls';

const API_URL = `${BASE_URL}/api`;

export const getPublicProfileByCode = async (talentCode: string) => {
  return fetch(`${API_URL}/public-profile/code/${talentCode}`);
};

export const getMyPublicProfile = async (token: string) => {
  return fetch(`${API_URL}/public-profile/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const upsertPublicProfile = async (token: string, formData: FormData) => {
  return fetch(`${API_URL}/public-profile/upsert`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Do NOT set Content-Type, browser will set it with boundary for FormData
    },
    body: formData,
  });
};

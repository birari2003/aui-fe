import { BASE_URL } from "../utils/urls";

const API_URL = `${BASE_URL}/api/institute-public-profile`;

export const getMyInstitutePublicProfile = async (token: string) => {
  return fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const upsertInstitutePublicProfile = async (token: string, formData: FormData) => {
  return fetch(`${API_URL}/upsert`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
};

export const getInstitutePublicProfileByCode = async (talentCode: string) => {
  return fetch(`${API_URL}/talent/${talentCode}`);
};

export const getAllInstituteProfiles = async () => {
  return fetch(`${API_URL}/list`);
};

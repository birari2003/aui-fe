const API_URL = 'http://localhost:5000/api/studio-public-profile';

export const getMyStudioPublicProfile = async (token: string) => {
  return fetch(`${API_URL}/me`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const upsertStudioPublicProfile = async (token: string, formData: FormData) => {
  return fetch(`${API_URL}/upsert`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
};

export const getStudioPublicProfileByCode = async (talentCode: string) => {
  return fetch(`${API_URL}/talent/${talentCode}`);
};

export const getAllStudioProfiles = async () => {
  return fetch(`${API_URL}/list`);
};

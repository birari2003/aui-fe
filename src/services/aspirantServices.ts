import { API_ENDPOINTS } from '../utils/urls';

export const fetchAspirantProfile = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.ASPIRANTS.GET_PROFILE, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const updateAspirantProfile = async (data: any, token: string) => {
  const response = await fetch(API_ENDPOINTS.ASPIRANTS.UPDATE_PROFILE, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const fetchAllAspirants = async () => {
  const response = await fetch(API_ENDPOINTS.ASPIRANTS.BASE);
  return response;
};

export const updateAspirantAdmin = async (id: number, data: any, token: string) => {
  const response = await fetch(API_ENDPOINTS.ASPIRANTS.UPDATE(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const deleteAspirantAdmin = async (id: number, token: string) => {
  const response = await fetch(API_ENDPOINTS.ASPIRANTS.DELETE(id), {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const fetchCollegesFromApi = async (country: string = 'India', query?: string) => {
  try {
    let url = `http://universities.hipolabs.com/search?country=${encodeURIComponent(country)}`;
    if (query && query.trim().length > 0) {
      url += `&name=${encodeURIComponent(query.trim())}`;
    }
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  } catch (err) {
    console.error('Failed to fetch colleges from Hipolabs API:', err);
    return [];
  }
};

export const shareAspirantsWithInstitutes = async (token: string, instituteIds: number[]) => {
  const response = await fetch(API_ENDPOINTS.ASPIRANTS.SHARE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ instituteIds }),
  });
  return response;
};

export const fetchAspirantShares = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.ASPIRANTS.GET_SHARES, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const fetchSharedAspirantsForInstitute = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.ASPIRANTS.GET_SHARED_FOR_INSTITUTE, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};


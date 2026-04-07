import { API_ENDPOINTS } from '../utils/urls';

export const searchProfessionals = async (token: string, query: any = {}) => {
  const queryString = new URLSearchParams(query).toString();
  const url = `${API_ENDPOINTS.SEARCH.PROFESSIONALS}${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const searchInstitutes = async (token: string, query: any = {}) => {
  const queryString = new URLSearchParams(query).toString();
  const url = `${API_ENDPOINTS.SEARCH.INSTITUTES}${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

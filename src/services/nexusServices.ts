import { API_ENDPOINTS } from '../utils/urls';

export const fetchNexusOpportunities = async () => {
  const response = await fetch(`${API_ENDPOINTS.NEXUS.BASE}`);
  return response;
};

export const createNexusOpportunity = async (token: string, data: any) => {
  const response = await fetch(`${API_ENDPOINTS.NEXUS.BASE}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response;
};

export const updateNexusOpportunity = async (token: string, id: number, data: any) => {
  const response = await fetch(`${API_ENDPOINTS.NEXUS.BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response;
};

export const deleteNexusOpportunity = async (token: string, id: number) => {
  const response = await fetch(`${API_ENDPOINTS.NEXUS.BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response;
};

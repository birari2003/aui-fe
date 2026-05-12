const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createWorkshopRequest = async (data: any) => {
  return fetch(`${API_URL}/workshop-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
};

export const getMyWorkshopRequests = async () => {
  return fetch(`${API_URL}/workshop-requests/my-requests`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const getAllWorkshopRequests = async () => {
  return fetch(`${API_URL}/workshop-requests/all`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const updateWorkshopRequestStatus = async (id: number, status: string) => {
  return fetch(`${API_URL}/workshop-requests/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ status }),
  });
};

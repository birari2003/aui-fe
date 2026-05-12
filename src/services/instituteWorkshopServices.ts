const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchAllWorkshops = async () => {
  return fetch(`${API_URL}/institute-workshops`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export const createInstituteWorkshop = async (data: any) => {
  return fetch(`${API_URL}/institute-workshops`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
};

export const updateInstituteWorkshop = async (id: number, data: any) => {
  return fetch(`${API_URL}/institute-workshops/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  });
};

export const deleteInstituteWorkshop = async (id: number) => {
  return fetch(`${API_URL}/institute-workshops/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

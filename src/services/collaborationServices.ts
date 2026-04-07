import { API_ENDPOINTS } from '../utils/urls';

export const sendCollaborationRequest = async (token: string, data: {
  receiverId: number;
  receiverRole: 'professional' | 'institute';
  message: string;
  proposedDate?: string;
  publicUrl?: string;
}) => {
  const response = await fetch(API_ENDPOINTS.COLLABORATION.SEND_REQUEST, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const getMyCollaborationRequests = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.COLLABORATION.GET_MY_REQUESTS, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const respondToCollaborationRequest = async (token: string, id: number, data: {
  status: 'accepted' | 'rejected' | 'cancelled';
  responseMessage?: string;
}) => {
  const response = await fetch(API_ENDPOINTS.COLLABORATION.RESPOND(id), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return response;
};

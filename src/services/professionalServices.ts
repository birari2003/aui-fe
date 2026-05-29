import { API_ENDPOINTS } from '../utils/urls';

export const getMyProfile = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.PROFESSIONAL.GET_PROFILE, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const upsertProfile = async (token: string, data: any) => {
  const response = await fetch(API_ENDPOINTS.PROFESSIONAL.UPDATE_PROFILE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const getPublicProfile = async (talentCode: string) => {
  const response = await fetch(API_ENDPOINTS.PROFESSIONAL.PUBLIC_PROFILE(talentCode));
  return response;
};

export const getStudioRequests = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.PROFESSIONAL.STUDIO_REQUESTS, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const respondToStudioRequest = async (token: string, requestId: number, data: any) => {
  const response = await fetch(API_ENDPOINTS.PROFESSIONAL.RESPOND_STUDIO_REQUEST(requestId), {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const getStudioJobPostings = async (token: string) => {
  return fetch(API_ENDPOINTS.PROFESSIONAL.STUDIO_JOB_POSTINGS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const applyForJob = async (token: string, data: { jobPostingId?: number; studioRequestId?: number; verifiedResponse?: any }) => {
  return fetch(API_ENDPOINTS.PROFESSIONAL.APPLICATIONS, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const getMyApplications = async (token: string) => {
  return fetch(API_ENDPOINTS.PROFESSIONAL.APPLICATIONS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const respondToAgreement = async (token: string, applicationId: number, decision: 'accepted' | 'rejected') => {
  return fetch(API_ENDPOINTS.PROFESSIONAL.RESPOND_AGREEMENT(applicationId), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ decision }),
  });
};

export const getNotifications = async (token: string) => {
  return fetch(API_ENDPOINTS.PROFESSIONAL.NOTIFICATIONS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const markNotificationAsRead = async (token: string, id: number) => {
  return fetch(API_ENDPOINTS.PROFESSIONAL.MARK_READ(id), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

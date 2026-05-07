import { API_ENDPOINTS } from '../utils/urls';

export const addTalentToBench = async (token: string, professionalId: number) => {
  return fetch(API_ENDPOINTS.STUDIO.TALENT_BENCH, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ professionalId }),
  });
};

export const removeTalentFromBench = async (token: string, professionalId: number) => {
  return fetch(API_ENDPOINTS.STUDIO.REMOVE_TALENT_BENCH(professionalId), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getTalentBench = async (token: string) => {
  return fetch(API_ENDPOINTS.STUDIO.TALENT_BENCH, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createStudioRequestProfessional = async (
  token: string,
  data: {
    professionalId: number;
    projectTimeline: string;
    productionType: 'film' | 'tv' | 'web' | 'ads' | 'other';
    engagementBrief: string;
    proposedBudget?: string;
    startDate?: string;
  }
) => {
  return fetch(API_ENDPOINTS.STUDIO.REQUEST_PROFESSIONALS, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const getStudioRequestProfessionals = async (token: string) => {
  return fetch(API_ENDPOINTS.STUDIO.REQUEST_PROFESSIONALS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createStudioJobPosting = async (
  token: string,
  data: {
    title: string;
    projectType?: string;
    experienceRequired?: string;
    artistCount?: number;
    startDate?: string;
    description?: string;
    status?: 'open' | 'paused' | 'closed';
  }
) => {
  return fetch(API_ENDPOINTS.STUDIO.JOB_POSTINGS, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const getStudioJobPostings = async (token: string) => {
  return fetch(API_ENDPOINTS.STUDIO.JOB_POSTINGS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStudioInfo = async (token: string) => {
  return fetch(API_ENDPOINTS.STUDIO.PROFILE, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateStudioInfo = async (token: string, data: any) => {
  return fetch(API_ENDPOINTS.STUDIO.PROFILE, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

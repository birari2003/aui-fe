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
    professionalId?: number;
    professionalIds?: number[];
    roleTitle?: string;
    productionType?: string;
    projectFormat?: string;
    opportunityOverview?: string;
    roleRequirements?: string;
    startAvailability?: string;
    workMode?: string;
    location?: string;
    includeCompensation?: boolean;
    verificationFields?: any;
    projectTimeline?: string;
    engagementBrief?: string;
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

export const updateStudioRequestProfessional = async (token: string, id: number, data: any) => {
  return fetch(API_ENDPOINTS.STUDIO.UPDATE_REQUEST_PROFESSIONAL(id), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const createStudioJobPosting = async (token: string, data: any) => {
  return fetch(API_ENDPOINTS.STUDIO.JOB_POSTINGS, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const updateStudioJobPosting = async (token: string, id: number, data: any) => {
  return fetch(API_ENDPOINTS.STUDIO.UPDATE_JOB_POSTING(id), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const deleteStudioJobPosting = async (token: string, id: number) => {
  return fetch(API_ENDPOINTS.STUDIO.DELETE_JOB_POSTING(id), {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getStudioJobPostings = async (token: string) => {
  return fetch(API_ENDPOINTS.STUDIO.JOB_POSTINGS, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getJobApplications = async (token: string, jobPostingId?: number, status?: string) => {
  let url = API_ENDPOINTS.STUDIO.APPLICATIONS;
  const params = new URLSearchParams();
  if (jobPostingId) params.append('jobPostingId', jobPostingId.toString());
  if (status) params.append('status', status);
  if (params.toString()) url += `?${params.toString()}`;

  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateApplicationStatus = async (token: string, applicationId: number, data: { status?: string; contactInfoShared?: boolean }) => {
  return fetch(API_ENDPOINTS.STUDIO.UPDATE_APPLICATION_STATUS(applicationId), {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

export const finalizeAgreement = async (token: string, applicationId: number, agreementDetails: any) => {
  return fetch(API_ENDPOINTS.STUDIO.FINALIZE_AGREEMENT(applicationId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ agreementDetails }),
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

export const uploadJobPostingAttachments = async (token: string, jobId: number, files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('attachments', file);
  });

  return fetch(API_ENDPOINTS.STUDIO.UPLOAD_JOB_ATTACHMENTS(jobId), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

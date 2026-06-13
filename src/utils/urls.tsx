const ENV: string = 'local';

export const BASE_URL = ENV === 'production'
  ? 'https://api.auitalent.com'
  : 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    OTP: `${BASE_URL}/api/auth/request-otp`,
    VERIFY: `${BASE_URL}/api/auth/verify-otp`,
    ME: `${BASE_URL}/api/auth/me`,
    CHECK_STATUS: `${BASE_URL}/api/auth/check-status`,
  },
  ADMIN: {
    PENDING: `${BASE_URL}/api/admin/pending`,
    APPROVE: `${BASE_URL}/api/admin/approve`,
    REJECT: `${BASE_URL}/api/admin/reject`,
  },
  PROFESSIONAL: {
    GET_PROFILE: `${BASE_URL}/api/professionals/profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/professionals/profile`,
    PUBLIC_PROFILE: (talentCode: string) => `${BASE_URL}/api/professionals/profile/public/${talentCode}`,
    STUDIO_REQUESTS: `${BASE_URL}/api/professionals/studio-requests`,
    RESPOND_STUDIO_REQUEST: (requestId: number) => `${BASE_URL}/api/professionals/studio-requests/${requestId}/status`,
    STUDIO_JOB_POSTINGS: `${BASE_URL}/api/professionals/studio-job-postings`,
    NOTIFICATIONS: `${BASE_URL}/api/professionals/notifications`,
    MARK_READ: (id: number) => `${BASE_URL}/api/professionals/notifications/${id}/read`,
    APPLICATIONS: `${BASE_URL}/api/professionals/applications`,
    RESPOND_AGREEMENT: (id: number) => `${BASE_URL}/api/professionals/applications/${id}/respond-agreement`,
  },
  INSTITUTE: {
    GET_PROFILE: `${BASE_URL}/api/institutes/profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/institutes/profile`,
    PUBLIC_PROFILE: (talentCode: string) => `${BASE_URL}/api/institutes/profile/public/${talentCode}`,
    WORKSHOPS: `${BASE_URL}/api/institute-workshops`,
  },
  SEARCH: {
    PROFESSIONALS: `${BASE_URL}/api/search/professionals`,
    INSTITUTES: `${BASE_URL}/api/search/institutes`,
    STUDIO_JOB_POSTINGS: `${BASE_URL}/api/search/studio-job-postings`,
  },
  STUDIO: {
    PROFILE: `${BASE_URL}/api/studios/profile`,
    TALENT_BENCH: `${BASE_URL}/api/studios/talent-bench`,
    REMOVE_TALENT_BENCH: (professionalId: number) => `${BASE_URL}/api/studios/talent-bench/${professionalId}`,
    REQUEST_PROFESSIONALS: `${BASE_URL}/api/studios/request-professionals`,
    UPDATE_REQUEST_PROFESSIONAL: (id: number) => `${BASE_URL}/api/studios/request-professionals/${id}`,
    JOB_POSTINGS: `${BASE_URL}/api/studios/job-postings`,
    UPDATE_JOB_POSTING: (id: number) => `${BASE_URL}/api/studios/job-postings/${id}`,
    DELETE_JOB_POSTING: (id: number) => `${BASE_URL}/api/studios/job-postings/${id}`,
    APPLICATIONS: `${BASE_URL}/api/studios/applications`,
    UPDATE_APPLICATION_STATUS: (id: number) => `${BASE_URL}/api/studios/applications/${id}/status`,
    FINALIZE_AGREEMENT: (id: number) => `${BASE_URL}/api/studios/applications/${id}/finalize-agreement`,
    UPLOAD_JOB_ATTACHMENTS: (id: number) => `${BASE_URL}/api/studios/job-postings/${id}/upload-attachments`,
  },
  COLLABORATION: {
    SEND_REQUEST: `${BASE_URL}/api/collaboration`,
    GET_MY_REQUESTS: `${BASE_URL}/api/collaboration/my-requests`,
    RESPOND: (id: number) => `${BASE_URL}/api/collaboration/${id}/respond`,
  },
  SPECIAL_REQUESTS: {
    BASE: `${BASE_URL}/api/special-requests`,
    CREATE: `${BASE_URL}/api/special-requests`,
    GET_ALL: `${BASE_URL}/api/special-requests`,
    GET_MY: `${BASE_URL}/api/special-requests/my`,
    UPDATE_STATUS: (id: number) => `${BASE_URL}/api/special-requests/${id}/status`,
  },
  WORKSHOP_REQUESTS: {
    BASE: `${BASE_URL}/api/workshop-requests`,
    MY_REQUESTS: `${BASE_URL}/api/workshop-requests/my-requests`,
    ALL: `${BASE_URL}/api/workshop-requests/all`,
    STATUS: (id: number) => `${BASE_URL}/api/workshop-requests/${id}/status`,
  },
  ADMIN_EXTRA: {
    USERS: `${BASE_URL}/api/admin/users`,
    USER_STATUS: (userId: number) => `${BASE_URL}/api/admin/users/${userId}/status`,
    ANALYTICS: `${BASE_URL}/api/admin/analytics`,
  },
  NEXUS: {
    BASE: `${BASE_URL}/api/nexus`,
  }
};


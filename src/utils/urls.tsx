const ENV: string = 'production';

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
  },
  INSTITUTE: {
    GET_PROFILE: `${BASE_URL}/api/institutes/profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/institutes/profile`,
    PUBLIC_PROFILE: (talentCode: string) => `${BASE_URL}/api/institutes/profile/public/${talentCode}`,
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
    JOB_POSTINGS: `${BASE_URL}/api/studios/job-postings`,
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
  }
};


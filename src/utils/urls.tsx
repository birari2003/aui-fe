const ENV: string = 'production'; // Set to 'production' for production API, 'local' for local API

export const BASE_URL = ENV === 'production' 
  ? 'https://api.auitalent.com' // Replace with actual production URL when ready
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
  },
  INSTITUTE: {
    GET_PROFILE: `${BASE_URL}/api/institutes/profile`,
    UPDATE_PROFILE: `${BASE_URL}/api/institutes/profile`,
    PUBLIC_PROFILE: (talentCode: string) => `${BASE_URL}/api/institutes/profile/public/${talentCode}`,
  },
  SEARCH: {
    PROFESSIONALS: `${BASE_URL}/api/search/professionals`,
    INSTITUTES: `${BASE_URL}/api/search/institutes`,
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


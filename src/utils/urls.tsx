const ENV: string = 'local'; // Set to 'production' for production API, 'local' for local API

export const BASE_URL = ENV === 'production' 
  ? 'https://aui-api.onrender.com' // Replace with actual production URL when ready
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
  }
};

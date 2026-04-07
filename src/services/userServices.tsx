import { API_ENDPOINTS } from '../utils/urls';

export const registerUser = async (data: any) => {
  const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
};

export const loginUser = async (email: string, otp: string) => {
  const response = await fetch(API_ENDPOINTS.AUTH.VERIFY, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });
  return response;
};

export const requestOtp = async (email: string) => {
  const response = await fetch(API_ENDPOINTS.AUTH.OTP, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return response;
};

export const getMe = async (token: string) => {
  const response = await fetch(API_ENDPOINTS.AUTH.ME, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response;
};

export const checkUserStatus = async (email: string) => {
  const response = await fetch(API_ENDPOINTS.AUTH.CHECK_STATUS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  return response;
};

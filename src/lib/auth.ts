
import { LoginResponse } from './types/auth';

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

export function saveAuthData(data: LoginResponse) {
  localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getUserData(): any | null {
  const userData = localStorage.getItem(USER_DATA_KEY);
  return userData ? JSON.parse(userData) : null;
}

export function removeAuthData() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

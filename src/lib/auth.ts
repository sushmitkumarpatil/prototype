
import { LoginResponse } from './types/auth';

const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';
const REFRESH_TOKEN_KEY = 'refreshToken';


function logAuth(msg: string, ...args: any[]) {
  // eslint-disable-next-line no-console
  console.error('[auth]', msg, ...args);
}

/**
 * Save authentication data to localStorage and cookies in a browser-safe way.
 * Stores access token, user payload, and optionally the refresh token.
 */
export function saveAuthData(data: LoginResponse) {
  if (typeof window === 'undefined') return;
  try {
    if (!data || typeof data !== 'object') {
      logAuth('Invalid auth data structure', data);
      return;
    }
    if (data?.accessToken) {
      localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken);
      // Also save to cookies for middleware access
      document.cookie = `authToken=${data.accessToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure=${window.location.protocol === 'https:'}`;
      logAuth('Saved access token to localStorage and cookies');
    }
    if (data?.user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
      logAuth('Saved user data');
    }
    if (data?.refreshToken) {
      saveRefreshToken(data.refreshToken);
      logAuth('Saved refresh token');
    }
  } catch (e) {
    logAuth('Error saving auth data', e);
  }
}


export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      logAuth('No valid auth token found');
      return null;
    }
    return token;
  } catch (e) {
    logAuth('Error retrieving auth token', e);
    return null;
  }
}


export function getUserData(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (!userData) {
      logAuth('No user data found');
      return null;
    }
    return JSON.parse(userData);
  } catch (e) {
    logAuth('Error retrieving user data', e);
    return null;
  }
}

/**
 * Persist refresh token after basic validation; no-op on SSR.
 */

export function saveRefreshToken(token: string) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof token === 'string' && token.trim().length > 0) {
      localStorage.setItem(REFRESH_TOKEN_KEY, token);
      logAuth('Saved refresh token');
    } else {
      logAuth('Attempted to save invalid refresh token', token);
    }
  } catch (e) {
    logAuth('Error saving refresh token', e);
  }
}

/**
 * Retrieve refresh token with guards; returns null if invalid or unavailable.
 */

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const token = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      logAuth('No valid refresh token found');
      return null;
    }
    return token;
  } catch (e) {
    logAuth('Error retrieving refresh token', e);
    return null;
  }
}

/**
 * Clear only the refresh token from storage; safe for SSR.
 */

export function clearRefreshToken() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    logAuth('Cleared refresh token');
  } catch (e) {
    logAuth('Error clearing refresh token', e);
  }
}

/**
 * Remove all auth-related data from localStorage and cookies; safe for SSR.
 */

export function removeAuthData() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    clearRefreshToken();
    // Also clear the auth token cookie
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    logAuth('Removed all auth data from localStorage and cookies');
  } catch (e) {
    logAuth('Error removing auth data', e);
  }
}

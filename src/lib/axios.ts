
import axios, { AxiosError, AxiosResponse, AxiosHeaders } from 'axios';
import { getAuthToken, removeAuthData, getRefreshToken, saveRefreshToken } from './auth';
import { refreshTokenRequest } from './refreshClient';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = { ...(config.headers as any), Authorization: `Bearer ${token}` };
      }
    }

    // Add tenant ID if available (SSR-safe)
    if (typeof window !== 'undefined') {
      const tenantId = localStorage.getItem('tenant');
      if (tenantId) {
        if (config.headers instanceof AxiosHeaders) {
          config.headers.set('X-Tenant-ID', tenantId);
        } else {
          const base = typeof config.headers === 'object' && config.headers !== null ? config.headers : {};
          config.headers = { ...base, 'X-Tenant-ID': tenantId } as any;
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===== Enhanced auth-aware response handling with refresh queuing and backoff =====

export let isRefreshing = false;
export let pendingRequestsQueue: Array<(token: string | null) => void> = [];
const MAX_REFRESH_RETRIES = 2;
const BASE_BACKOFF_MS = 500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function logAxios(msg: string, ...args: any[]) {
  // eslint-disable-next-line no-console
  console.error('[axios]', msg, ...args);
}

export type RefreshResult = { token: string | null, reason?: 'invalid' | 'network' | 'server', recoverable: boolean, error?: any };
export function getRefreshState() {
  return {
    isRefreshing,
    pendingRequestsQueueLength: pendingRequestsQueue.length,
  };
}

export async function performTokenRefresh(): Promise<RefreshResult> {
  if (isRefreshing) {
    logAxios('Refresh already in progress, queuing request');
    return new Promise((resolve) => pendingRequestsQueue.push((token) => resolve({ token, recoverable: true })));
  }
  isRefreshing = true;
  let success = false;
  let latestToken: string | null = null;
  let lastError: any = null;
  let failReason: 'invalid' | 'network' | 'server' | undefined = undefined;
  let recoverable = false;
  const start = Date.now();
  try {
    for (let attempt = 0; attempt <= MAX_REFRESH_RETRIES; attempt++) {
      if (attempt > 0) {
        const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt - 1);
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
          logAxios(`Refresh retry #${attempt} after ${backoff}ms`);
        }
        await wait(backoff);
      }
      try {
        const stored = getRefreshToken();
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
          logAxios('Attempting token refresh', { attempt });
        }
        const response = await refreshTokenRequest(stored);
        const newAccessToken = response?.accessToken || response?.access_token || null;
        const newRefreshToken = response?.refreshToken || null;
        if (newAccessToken) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', newAccessToken);
            if (newRefreshToken) {
              saveRefreshToken(newRefreshToken);
            }
          }
          if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
            const masked = newAccessToken ? `${newAccessToken.slice(0, 3)}…${newAccessToken.slice(-3)}` : null;
            logAxios('Refresh successful');
          }
          success = true;
          latestToken = newAccessToken;
          break;
        } else {
          if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
            logAxios('Refresh response missing access token', response);
          }
        }
      } catch (e: any) {
        lastError = e;
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
          logAxios('Refresh error', e?.message, e?.status, e?.data, e?.errorCode);
        }
        // Standardized error code handling
        if (e?.isInvalidToken || [400, 401, 403].includes(e?.status) || [
          'INVALID_REFRESH_TOKEN',
          'TOKEN_EXPIRED',
          'TOKEN_NOT_ACTIVE',
          'REFRESH_TOKEN_MISSING',
          'REFRESH_TOKEN_INVALID_FORMAT',
        ].includes(e?.errorCode)) {
          if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
            logAxios('Invalid refresh token, will not retry');
          }
          failReason = 'invalid';
          recoverable = false;
          break;
        } else if (e?.isNetworkError || e?.errorCode === 'NETWORK_ERROR' || e?.errorCode === 'TIMEOUT') {
          if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
            logAxios('Network error during refresh, will retry if attempts remain');
          }
          failReason = 'network';
          recoverable = true;
        } else if (e?.isServerError) {
          if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
            logAxios('Server error during refresh, will not retry');
          }
          failReason = 'server';
          recoverable = true;
          break;
        }
      }
    }
  } finally {
    isRefreshing = false;
    const ms = Date.now() - start;
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
      logAxios('Refresh complete', { success, ms });
    }
    const resolveToken = success ? latestToken : null;
    pendingRequestsQueue.forEach((resolve) => resolve(resolveToken));
    pendingRequestsQueue = [];
  }
  if (!success) {
    if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
      logAxios('All refresh attempts failed');
    }
    if (failReason) {
      const err: any = new Error('Token refresh failed');
      err.reason = failReason;
      err.recoverable = recoverable;
      err.error = lastError;
      return { token: null, reason: failReason, recoverable, error: lastError };
    }
    return { token: null, recoverable: false, error: lastError };
  }
  return { token: latestToken, recoverable: true };
}


export function classifyAuthError(error: AxiosError) {
  const status = error.response?.status || error.status || 0;
  const data: any = error.response?.data || {};
  const code = data.errorCode || data.error_code || data.code || error.code || '';
  const message = error?.message || '';
  const isNetworkError = !error.response || code === 'NETWORK_ERROR' || message === 'Network Error';
  const isTimeout = code === 'ECONNABORTED' || code === 'TIMEOUT' || message.toLowerCase().includes('timeout');
  const isServerError = status >= 500;
  let normalizedCode = code;
  if (isNetworkError) normalizedCode = 'NETWORK_ERROR';
  else if (isTimeout) normalizedCode = 'TIMEOUT';
  else if ([400, 401, 403].includes(status) || [
    'INVALID_TOKEN',
    'INVALID_REFRESH_TOKEN',
    'TOKEN_EXPIRED',
    'TOKEN_NOT_ACTIVE',
    'REFRESH_TOKEN_MISSING',
    'REFRESH_TOKEN_INVALID_FORMAT',
  ].includes(code)) {
    normalizedCode = 'INVALID_TOKEN';
  } else if (isServerError) {
    normalizedCode = 'SERVER_ERROR';
  }
  // If error is network/timeout, treat as recoverable
  let recoverable: boolean;
  if (isNetworkError || isTimeout) {
    recoverable = true;
  } else if (normalizedCode === 'INVALID_TOKEN') {
    recoverable = false;
  } else if (isServerError) {
    recoverable = true;
  } else {
    recoverable = true;
  }
  return { status, code, recoverable, isNetworkError, isTimeout, isServerError, normalizedCode };
}

// Response handler: return only data
// TODO: Audit all api consumers to confirm contract. If callers need headers/status, change to return response.
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config || {};
    const { status, code, recoverable } = classifyAuthError(error);

    // Network errors and timeouts: exponential backoff retry (once) for idempotent GETs
    if (!error.response) {
      if (error.code === 'ECONNABORTED' || (error as any).message === 'Network Error') {
        if (!originalRequest._networkRetry && (originalRequest.method || 'get').toLowerCase() === 'get') {
          originalRequest._networkRetry = true;
          await wait(BASE_BACKOFF_MS);
          return api(originalRequest);
        }
      }
      const err: any = new Error('Network error. Please check your connection and try again.');
      err.isNetworkError = true;
      err.code = error.code;
      err.recoverable = true;
      return Promise.reject(err);
    }

    // 401 handling with intelligent refresh and queuing
    if (status === 401) {
      logAxios('401 received', { code, recoverable, url: originalRequest.url });
      // NotBeforeError (token not active yet): small delay then retry once
      if (code === 'TOKEN_NOT_ACTIVE' && !originalRequest._nbfRetry) {
        logAxios('Token not active yet, retrying after 500ms');
        originalRequest._nbfRetry = true;
        await wait(500);
        return api(originalRequest);
      }
      // If non-recoverable token issue, clear session immediately
      if (code === 'INVALID_TOKEN' || code === 'INVALID_REFRESH_TOKEN' || recoverable === false) {
        logAxios('Non-recoverable token issue, clearing session');
        removeAuthData();
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        const err: any = new Error('Your session is invalid. Please sign in again.');
        err.isAuthError = true;
        err.recoverable = false;
        err.status = status;
        err.code = code;
        return Promise.reject(err);
      }

      // Handle expired token (recoverable): single-flight refresh; do not retry with stale
      if (!originalRequest._retry) {
        logAxios('Attempting token refresh for expired token');
        originalRequest._retry = true;
        const refreshResult = await performTokenRefresh();
        if (refreshResult.token) {
          logAxios('Token refresh succeeded, retrying original request');
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${refreshResult.token}`;
          return api(originalRequest);
        }
        // If refresh failed, only clear session for non-recoverable (invalid) errors
        if (!refreshResult.recoverable) {
          logAxios('Token refresh failed (non-recoverable), clearing session and redirecting');
          removeAuthData();
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
            window.location.href = '/login?reason=expired';
          }
          const err: any = new Error('Session expired. Please sign in again.');
          err.isAuthError = true;
          err.recoverable = false;
          err.status = status;
          err.code = code;
          err.refreshReason = refreshResult.reason;
          return Promise.reject(err);
        } else {
          // For recoverable (network/server) errors, reject with recoverable error and preserve session
          const err: any = new Error('Token refresh failed (recoverable). Please check your connection and try again.');
          err.isAuthError = true;
          err.recoverable = true;
          err.status = status;
          err.code = code;
          err.refreshReason = refreshResult.reason;
          err.refreshError = refreshResult.error;
          return Promise.reject(err);
        }
      }
    }

    // 403 forbidden: map account/tenant issues to actionable messages
    if (status === 403) {
      const data: any = error.response?.data || {};
      const serverMessage = data.message || data.error || '';
      const errCode = data.error_code || '';
      const msgLower = String(serverMessage).toLowerCase();
      if (errCode === 'ACCOUNT_DEACTIVATED') {
        return Promise.reject(new Error('Your account is deactivated. Contact support.'));
      }
      if (errCode === 'ACCOUNT_REJECTED') {
        return Promise.reject(new Error('Your account access was denied. Contact admin.'));
      }
      if (errCode === 'TENANT_MISMATCH') {
        return Promise.reject(new Error('Wrong tenant selected. Switch tenant and retry.'));
      }
      if (msgLower.includes('pending') && msgLower.includes('approval')) {
        return Promise.reject(new Error('Your account is pending approval. Please wait for admin approval to create content.'));
      }
  const err: any = new Error('Access denied. You do not have permission to perform this action.');
  err.status = status;
  err.code = errCode;
  err.recoverable = false;
  return Promise.reject(err);
    }

    // 404 not found
    if (status === 404) {
  const err: any = new Error('Resource not found.');
  err.status = status;
  err.recoverable = false;
  return Promise.reject(err);
    }

    // 429 rate limited: backoff and retry once for GETs
    if (status === 429 && (originalRequest.method || 'get').toLowerCase() === 'get' && !originalRequest._rateLimitedRetry) {
      originalRequest._rateLimitedRetry = true;
      const retryAfter = Number(error.response?.headers?.['retry-after']) || 1;
      await wait(retryAfter * 1000);
      return api(originalRequest);
    }

    // 5xx server errors: support Retry-After and avoid retrying non-idempotent
    if (status && status >= 500) {
      const retryAfter = Number(error.response?.headers?.['retry-after']);
      if (
        retryAfter &&
        (originalRequest.method || 'get').toLowerCase() === 'get' &&
        !originalRequest._serverRetry
      ) {
        originalRequest._serverRetry = true;
        await wait(Math.max(1, Math.floor(retryAfter)) * 1000);
        return api(originalRequest);
      }
  const err: any = new Error('Server error. Please try again later.');
  err.status = status;
  err.recoverable = true;
  return Promise.reject(err);
    }

    // Fallback: surface server-provided message if available
    const errorData = error.response?.data as any;
    const message = errorData?.message || errorData?.error || 'An unexpected error occurred';
  const err: any = new Error(message);
  err.status = status;
  err.recoverable = false;
  return Promise.reject(err);
  }
);

export default api;

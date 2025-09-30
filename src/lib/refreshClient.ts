
import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Bare axios instance without interceptors for refresh-only calls
const bare = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

export interface RefreshResponse {
  accessToken?: string;
  access_token?: string;
  refreshToken?: string;
  message?: string;
}

export interface RefreshError extends Error {
  isNetworkError?: boolean;
  isServerError?: boolean;
  isInvalidToken?: boolean;
  status?: number;
  data?: any;
  errorCode?: string;
}

function logRefresh(msg: string, ...args: any[]) {
  // eslint-disable-next-line no-console
  console.error('[refreshClient]', msg, ...args);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Tries body-based refresh if a token is provided; always sends cookies
export async function refreshTokenRequest(refreshToken?: string | null): Promise<RefreshResponse> {
  const url = '/api/auth/refresh';
  let lastError: RefreshError | undefined;
  const debug = process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true';
  try {
    if (debug) logRefresh(`Refreshing token (${refreshToken ? 'body' : 'cookie'})`);
    let response;
    const config = {
      withCredentials: true,
      timeout: 10000,
    };
    if (refreshToken) {
      response = await bare.post(url, { refreshToken }, config);
    } else {
      response = await bare.post(url, {}, config);
    }
    if (debug) logRefresh('Refresh successful', { status: response.status });
    return response.data as RefreshResponse;
  } catch (err) {
    const error = err as AxiosError;
    lastError = new Error('Refresh token request failed') as RefreshError;
    lastError.data = error.response?.data;
    lastError.status = error.response?.status;
    lastError.isNetworkError = !!error.isAxiosError && !error.response;
    lastError.isServerError = !!error.response && error.response.status >= 500;
    // Enhanced error code classification
    let errorCode: string | undefined = undefined;
    if (error.response?.data && typeof error.response.data === 'object' && 'error_code' in error.response.data) {
      errorCode = (error.response.data as any).error_code;
      if (
        typeof errorCode === 'string' &&
        [
          'INVALID_REFRESH_TOKEN',
          'TOKEN_EXPIRED',
          'TOKEN_NOT_ACTIVE',
          'REFRESH_TOKEN_MISSING',
          'REFRESH_TOKEN_INVALID_FORMAT',
        ].includes(errorCode)
      ) {
        lastError.isInvalidToken = true;
      }
      if (typeof errorCode === 'string') {
        lastError.errorCode = errorCode;
      }
    }
    if (error.code === 'ECONNABORTED') {
      lastError.errorCode = 'TIMEOUT';
    }
    if (lastError.isNetworkError) {
      lastError.errorCode = 'NETWORK_ERROR';
    }
    if (debug) {
      logRefresh(
        `Refresh failed:`,
        error.message,
        error.response?.status,
        error.response?.data,
        lastError.errorCode
      );
    }
    throw lastError;
  }
}

export default refreshTokenRequest;



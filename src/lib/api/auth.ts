import api from '../axios';
import { saveAuthData, removeAuthData } from '../auth';
import type { LoginResponse, User } from '../types/auth';

export interface RegistrationData {
  userType: 'student' | 'alumnus';
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  course: string;
  batch: string;
  usn: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  userId?: number;
  timestamp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  tenant_id: number;
}

export interface VerifyTokenResponse {
  success: boolean;
  valid: boolean;
  user?: any;
  message?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
  tenant_id: number;
}

export interface ResetPasswordRequest {
  password: string;
  tenant_id: number;
}

export interface VerifyEmailRequest {
  tenant_id: number;
}

// Authentication API functions
export async function registerUser(data: RegistrationData): Promise<RegistrationResponse> {
  let tenantId = localStorage.getItem('tenant');
  if (!tenantId) {
    tenantId = '1';
    localStorage.setItem('tenant', tenantId);
  }

  try {
    // Map form data to backend API expectations
    const apiData = {
      full_name: data.fullName,
      email: data.email,
      password: data.password,
      mobile_number: data.mobileNumber,
      course_name: data.course,
      batch_year: parseInt(data.batch),
      usn: data.usn,
      role: data.userType === 'student' ? 'STUDENT' : 'ALUMNUS',
      tenant_id: parseInt(tenantId, 10)
    };

    console.log('Sending registration data:', { ...apiData, password: '[HIDDEN]' });

    const resp = await api.post('/api/account/register', apiData);
    const dataResp = resp as any;
    return {
      success: true,
      message: dataResp.message || 'Registration successful',
      userId: dataResp.user?.id,
      timestamp: dataResp.timestamp || new Date().toISOString(),
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    // If backend is not available, fallback to mock API
    if (error.message?.includes('Network error') || error.message?.includes('Failed to connect')) {
      console.log('Backend not available, using mock API');
      const { MockApiService } = await import('../mock-api');
      const mockApi = MockApiService.getInstance();
      return await mockApi.registerUser(data);
    }
    throw error;
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  let tenantId = localStorage.getItem('tenant');
  if (!tenantId) {
    tenantId = '1';
    localStorage.setItem('tenant', tenantId);
  }

  const loginData: LoginRequest = {
    email,
    password,
    tenant_id: parseInt(tenantId, 10)
  };

  console.log('Sending login data:', { ...loginData, password: '[HIDDEN]' });

  try {
    const data: LoginResponse = await api.post('/api/auth/login', loginData);
    saveAuthData(data);
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw error;
  }
}

export async function logoutUser(): Promise<{ success: boolean; message: string }> {
  try {
    const resp = await api.post('/api/auth/logout');
    removeAuthData();
    const data = resp as any;
    return { success: !!data.success, message: data.message || 'Logged out' };
  } catch (error: any) {
    console.error('Logout error:', error);
    throw error;
  }
}

export async function verifyToken(): Promise<VerifyTokenResponse> {
  try {
    const resp = await api.post('/api/auth/verify');
    const data: VerifyTokenResponse = resp && typeof resp === 'object' && 'data' in resp ? (resp as any).data : resp;
    return data;
  } catch (error: any) {
    console.error('Token verification error:', error);
    throw error;
  }
}

export async function getCurrentUser(): Promise<{ success: boolean; user?: User }> {
  try {
    const resp = await api.get('/api/auth/me');
    const data: { success: boolean; user?: User } = resp && typeof resp === 'object' && 'data' in resp ? (resp as any).data : resp;
    return data;
  } catch (error: any) {
    console.error('Get current user error:', error);
    throw error;
  }
}

// Removed duplicate refreshToken function. Use refreshClient.ts for all refresh logic.

export async function changePassword(data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
  try {
    const resp = await api.post('/api/auth/change-password', data);
    const dataResp = resp as any;
    return { success: !!dataResp.success, message: dataResp.message || '' };
  } catch (error: any) {
    console.error('Change password error:', error);
    throw error;
  }
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<{ success: boolean; message: string }> {
  try {
    const resp = await api.post('/api/auth/forgot-password', data);
    const dataResp = resp as any;
    return { success: !!dataResp.success, message: dataResp.message || '' };
  } catch (error: any) {
    console.error('Forgot password error:', error);
    throw error;
  }
}

export async function resetPassword(token: string, data: ResetPasswordRequest): Promise<{ success: boolean; message: string }> {
  try {
    const resp = await api.post(`/api/auth/reset-password/${token}`, data);
    const dataResp = resp as any;
    return { success: !!dataResp.success, message: dataResp.message || '' };
  } catch (error: any) {
    console.error('Reset password error:', error);
    throw error;
  }
}

export async function verifyEmail(token: string, data: VerifyEmailRequest): Promise<{ success: boolean; message: string }> {
  try {
    const resp = await api.post(`/api/auth/verify/${token}`, data);
    const dataResp = resp && typeof resp === 'object' && 'data' in resp ? (resp as any).data : resp;
    return { success: !!dataResp.success, message: dataResp.message || '' };
  } catch (error: any) {
    console.error('Email verification error:', error);
    throw error;
  }
}

export async function revokeAllSessions(): Promise<{ success: boolean; message: string }> {
  try {
    const resp = await api.post('/api/auth/revoke-sessions');
    const dataResp = resp && typeof resp === 'object' && 'data' in resp ? (resp as any).data : resp;
    return { success: !!dataResp.success, message: dataResp.message || '' };
  } catch (error: any) {
    console.error('Revoke sessions error:', error);
    throw error;
  }
}

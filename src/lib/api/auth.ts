import api from '../axios';
import { LoginResponse } from '../types/auth';
import { MockApiService } from '../mock-api';

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
      course_name: data.course, // Try course_name instead of course
      batch: data.batch,
      usn: data.usn,
      role: data.userType === 'student' ? 'STUDENT' : 'ALUMNI', // Try uppercase role values
      tenant_id: parseInt(tenantId, 10)
    };

    console.log('Sending registration data:', apiData); // Debug log

    // Try to use the real API first
    return await api.post('/api/auth/register', apiData);
  } catch (error) {
    console.warn('Real API not available, using mock service:', error);
    // Fallback to mock service for development
    const mockService = MockApiService.getInstance();
    return await mockService.registerUser(data);
  }
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  let tenantId = localStorage.getItem('tenant');
  if (!tenantId) {
    tenantId = '1';
    localStorage.setItem('tenant', tenantId);
  }

  const loginData = { 
    email, 
    password, 
    tenant_id: parseInt(tenantId, 10) 
  };

  console.log('Sending login data:', { ...loginData, password: '[HIDDEN]' }); // Debug log

  try {
    // Try to use the real API first
    return await api.post('/api/auth/login', loginData);
  } catch (error: any) {
    // Don't fall back to mock service for authentication errors (401, 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Authentication failed:', error.response.data);
      throw error; // Re-throw authentication errors
    }
    
    // Only fall back to mock service for connection/network errors
    console.warn('Real API not available, using mock service:', error);
    const mockService = MockApiService.getInstance();
    return await mockService.loginUser(email, password);
  }
}

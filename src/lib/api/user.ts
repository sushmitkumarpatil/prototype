import api from '../axios';

export interface UserProfile {
  user_id: number;
  tenant_id: number;
  course_id?: number;
  batch_year?: number;
  current_location?: string;
  linkedin_url?: string;
  company?: string;
  job_title?: string;
  profile_picture_url?: string;
  privacy_settings?: {
    show_email: boolean;
    show_mobile: boolean;
    show_linkedin: boolean;
  };
  updated_at: string;
}

export interface UpdateProfileRequest {
  current_location?: string;
  linkedin_url?: string;
  company?: string;
  job_title?: string;
  privacy_settings?: {
    show_email: boolean;
    show_mobile: boolean;
    show_linkedin: boolean;
  };
}

export interface User {
  id: number;
  tenant_id: number;
  full_name: string;
  email: string;
  mobile_number?: string;
  usn: string;
  role: string;
  account_status: string;
  email_verified: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  tenant: {
    id: number;
    name: string;
    subdomain: string;
    is_active: boolean;
  };
  profile?: UserProfile & {
    course?: {
      course_name: string;
    };
  };
}

// User Management API functions
export async function getUserProfile(): Promise<{ success: boolean; user: User }> {
  try {
    const response = await api.get('/api/profile');
    return response;
  } catch (error: any) {
    console.error('Get user profile error:', error);
    throw error;
  }
}

export async function updateUserProfile(data: UpdateProfileRequest & { full_name?: string; mobile_number?: string; batch_year?: number; course_id?: number }): Promise<{ success: boolean; message: string; user: User }> {
  try {
    const response = await api.put('/api/profile', data);
    return response;
  } catch (error: any) {
    console.error('Update user profile error:', error);
    throw error;
  }
}

export async function uploadProfileImage(file: File): Promise<{ success: boolean; message: string; profile_picture_url: string }> {
  try {
    const formData = new FormData();
    formData.append('picture', file); // Backend expects 'picture' not 'profilePicture'

    const response = await api.post('/api/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error: any) {
    console.error('Upload profile image error:', error);
    throw error;
  }
}

export async function deleteProfileImage(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete('/api/users/profile/picture');
    return response;
  } catch (error: any) {
    console.error('Delete profile image error:', error);
    throw error;
  }
}

export async function getAllUsers(page: number = 1, limit: number = 10, search?: string): Promise<{
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }

    const response = await api.get(`/api/users?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get all users error:', error);
    throw error;
  }
}

export async function getUserById(userId: number): Promise<{ success: boolean; user: User }> {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response;
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    throw error;
  }
}

export async function updateUserStatus(userId: number, status: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.put(`/api/users/${userId}/status`, { status });
    return response;
  } catch (error: any) {
    console.error('Update user status error:', error);
    throw error;
  }
}

export async function deleteUser(userId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/api/users/${userId}`);
    return response;
  } catch (error: any) {
    console.error('Delete user error:', error);
    throw error;
  }
}

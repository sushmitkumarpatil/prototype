import api from '../axios';

// Admin Dashboard Types
export interface DashboardStats {
  total_users: number;
  active_users: number;
  pending_users: number;
  total_jobs: number;
  pending_jobs: number;
  total_events: number;
  pending_events: number;
  total_posts: number;
  recent_activity: Array<{
    id: number;
    type: string;
    description: string;
    user_name: string;
    created_at: string;
  }>;
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
  profile?: {
    user_id: number;
    course_id?: number;
    batch_year?: number;
    current_location?: string;
    linkedin_url?: string;
    company?: string;
    job_title?: string;
    profile_picture_url?: string;
    course?: {
      course_name: string;
    };
  };
}

export interface ContentModerationItem {
  id: number;
  type: 'job' | 'event' | 'post';
  title: string;
  content: string;
  author: {
    id: number;
    full_name: string;
    email: string;
  };
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  updated_at: string;
}

export interface UpdateUserStatusRequest {
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'DEACTIVATED';
}

export interface ApproveContentRequest {
  action: 'APPROVE' | 'REJECT';
  reason?: string;
}

// Admin Dashboard API functions
export async function getDashboardStats(): Promise<{ success: boolean; stats: DashboardStats }> {
  try {
    const response = await api.get('/api/admin/dashboard/stats');
    return response;
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
}

export async function getAllUsers(page: number = 1, limit: number = 20, filters?: {
  role?: string;
  status?: string;
  search?: string;
}): Promise<{
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
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const response = await api.get(`/api/admin/users?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get all users error:', error);
    throw error;
  }
}

export async function getUserById(userId: number): Promise<{ success: boolean; user: User }> {
  try {
    const response = await api.get(`/api/admin/users/${userId}`);
    return response;
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    throw error;
  }
}

export async function updateUserStatus(userId: number, data: UpdateUserStatusRequest): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.put(`/api/admin/users/${userId}/status`, data);
    return response;
  } catch (error: any) {
    console.error('Update user status error:', error);
    throw error;
  }
}

export async function deleteUser(userId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response;
  } catch (error: any) {
    console.error('Delete user error:', error);
    throw error;
  }
}

export async function getContentModeration(page: number = 1, limit: number = 20, filters?: {
  type?: string;
  status?: string;
}): Promise<{
  success: boolean;
  content: ContentModerationItem[];
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
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const response = await api.get(`/api/admin/content/moderation?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get content moderation error:', error);
    throw error;
  }
}

export async function approveContent(contentId: number, type: 'job' | 'event' | 'post', data: ApproveContentRequest): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/admin/approvals/${type}/${contentId}`, data);
    return response;
  } catch (error: any) {
    console.error('Approve content error:', error);
    throw error;
  }
}

// Admin Analytics
export async function getAnalytics(filters?: {
  start_date?: string;
  end_date?: string;
  metric?: string;
}): Promise<{
  success: boolean;
  analytics: {
    user_growth: Array<{ date: string; count: number }>;
    content_creation: Array<{ date: string; jobs: number; events: number; posts: number }>;
    engagement: Array<{ date: string; views: number; interactions: number }>;
  };
}> {
  try {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }

    const response = await api.get(`/api/analytics?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get analytics error:', error);
    throw error;
  }
}

// Admin Notifications
export async function sendNotificationToUsers(data: {
  user_ids?: number[];
  roles?: string[];
  title: string;
  message: string;
  type: string;
  priority?: 'low' | 'medium' | 'high';
}): Promise<{ success: boolean; message: string; sent_count: number }> {
  try {
    const response = await api.post('/api/admin/notifications/send', data);
    return response;
  } catch (error: any) {
    console.error('Send notification to users error:', error);
    throw error;
  }
}

export async function getNotificationTemplates(): Promise<{
  success: boolean;
  templates: Array<{
    id: number;
    key: string;
    title: string;
    subject: string;
    html: string;
    created_at: string;
    updated_at: string;
  }>;
}> {
  try {
    const response = await api.get('/api/admin/notifications/templates');
    return response;
  } catch (error: any) {
    console.error('Get notification templates error:', error);
    throw error;
  }
}

export async function createNotificationTemplate(data: {
  key: string;
  title: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean; message: string; template: any }> {
  try {
    const response = await api.post('/api/admin/notifications/templates', data);
    return response;
  } catch (error: any) {
    console.error('Create notification template error:', error);
    throw error;
  }
}

export async function updateNotificationTemplate(templateId: number, data: {
  title?: string;
  subject?: string;
  html?: string;
}): Promise<{ success: boolean; message: string; template: any }> {
  try {
    const response = await api.put(`/api/admin/notifications/templates/${templateId}`, data);
    return response;
  } catch (error: any) {
    console.error('Update notification template error:', error);
    throw error;
  }
}

export async function deleteNotificationTemplate(templateId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/api/admin/notifications/templates/${templateId}`);
    return response;
  } catch (error: any) {
    console.error('Delete notification template error:', error);
    throw error;
  }
}

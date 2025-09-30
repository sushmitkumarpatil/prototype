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

// Actual API response format
export interface DashboardResponse {
  users: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    deactivated: number;
    alumni: number;
    students: number;
  };
  content: {
    posts: number;
    jobs: number;
    events: number;
  };
  recentActivity: {
    users: number;
    posts: number;
    jobs: number;
    events: number;
  };
  pending: {
    jobs: number;
    events: number;
    users: number;
  };
  tenants?: Array<{
    id: number;
    name: string;
    subdomain: string;
    is_active: boolean;
    _count: {
      users: number;
      general_posts: number;
      jobs: number;
      events: number;
    };
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
export async function getDashboardStats(): Promise<{ success: boolean; data: DashboardResponse }> {
  try {
    const response = await api.get('/api/admin/dashboard');
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

    const response = await api.get(`/api/admin/approvals/content/moderation?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get content moderation error:', error);
    throw error;
  }
}

export async function approveContent(contentId: number, type: 'job' | 'event' | 'post', data: ApproveContentRequest): Promise<{ success: boolean; message: string }> {
  try {
    if (data.action === 'REJECT') {
      // Use reject endpoint for reject action
      const response = await api.post(`/api/admin/approvals/content/${type}/${contentId}/reject`, { reason: data.reason });
      return response;
    } else {
      // Use approve endpoint for approve action
      const response = await api.post(`/api/admin/approvals/content/${type}/${contentId}/approve`, data);
      return response;
    }
  } catch (error: any) {
    console.error('Approve content error:', error);
    throw error;
  }
}

export async function rejectContent(contentId: number, type: 'job' | 'event' | 'post', reason: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/admin/approvals/content/${type}/${contentId}/reject`, { reason });
    return response;
  } catch (error: any) {
    console.error('Reject content error:', error);
    throw error;
  }
}

// Approval API Functions
export async function getApprovalStats(): Promise<{
  success: boolean;
  stats: {
    pending_jobs: number;
    pending_events: number;
    pending_posts: number;
    pending_users: number;
  };
}> {
  try {
    const response = await api.get('/api/admin/approvals/stats');
    return response;
  } catch (error: any) {
    console.error('Get approval stats error:', error);
    throw error;
  }
}

export async function getPendingJobs(): Promise<{
  success: boolean;
  jobs: Array<{
    id: number;
    title: string;
    company_name: string;
    location?: string;
    description: string;
    author: {
      id: number;
      full_name: string;
      is_verified: boolean;
    };
    created_at: string;
  }>;
}> {
  try {
    const response = await api.get('/api/admin/approvals/content/pending?type=jobs');
    return { success: response.success, jobs: response.content || [] };
  } catch (error: any) {
    console.error('Get pending jobs error:', error);
    throw error;
  }
}

export async function getPendingEvents(): Promise<{
  success: boolean;
  events: Array<{
    id: number;
    title: string;
    description?: string;
    location?: string;
    start_time: string;
    end_time?: string;
    author: {
      id: number;
      full_name: string;
      is_verified: boolean;
    };
    created_at: string;
  }>;
}> {
  try {
    const response = await api.get('/api/admin/approvals/content/pending?type=events');
    return { success: response.success, events: response.content || [] };
  } catch (error: any) {
    console.error('Get pending events error:', error);
    throw error;
  }
}

export async function getAllEvents(page: number = 1, limit: number = 20, search?: string): Promise<{
  success: boolean;
  events: Array<{
    id: number;
    title: string;
    description?: string;
    location?: string;
    start_time: string;
    end_time?: string;
    approval_status: string;
    author: {
      id: number;
      full_name: string;
      email: string;
      role: string;
    };
    tenant?: {
      name: string;
      subdomain: string;
    };
    created_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
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

    const response = await api.get(`/api/admin/events?${params.toString()}`);
    return {
      success: response.success,
      events: response.data?.events || [],
      pagination: response.data?.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false,
      }
    };
  } catch (error: any) {
    console.error('Get all events error:', error);
    throw error;
  }
}

export async function getAllJobs(page: number = 1, limit: number = 20, search?: string, jobType?: string): Promise<{
  success: boolean;
  jobs: Array<{
    id: number;
    title: string;
    company_name: string;
    location?: string;
    description: string;
    job_type: string;
    approval_status: string;
    author: {
      id: number;
      full_name: string;
      email: string;
      role: string;
    };
    tenant?: {
      name: string;
      subdomain: string;
    };
    created_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
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

    if (jobType) {
      params.append('job_type', jobType);
    }

    const response = await api.get(`/api/admin/jobs?${params.toString()}`);
    return {
      success: response.success,
      jobs: response.data?.jobs || [],
      pagination: response.data?.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false,
      }
    };
  } catch (error: any) {
    console.error('Get all jobs error:', error);
    throw error;
  }
}

export async function getAllPosts(page: number = 1, limit: number = 20, search?: string): Promise<{
  success: boolean;
  posts: Array<{
    id: number;
    title?: string;
    content: string;
    image_url?: string;
    approval_status: string;
    author: {
      id: number;
      full_name: string;
      email: string;
      role: string;
    };
    tenant?: {
      name: string;
      subdomain: string;
    };
    created_at: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
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

    const response = await api.get(`/api/admin/posts?${params.toString()}`);
    return {
      success: response.success,
      posts: response.data?.posts || [],
      pagination: response.data?.pagination || {
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false,
      }
    };
  } catch (error: any) {
    console.error('Get all posts error:', error);
    throw error;
  }
}

export async function getPendingPosts(): Promise<{
  success: boolean;
  posts: Array<{
    id: number;
    title?: string;
    content: string;
    image_url?: string;
    author: {
      id: number;
      full_name: string;
      is_verified: boolean;
    };
    created_at: string;
  }>;
}> {
  try {
    const response = await api.get('/api/admin/approvals/content/pending?type=posts');
    return { success: response.success, posts: response.content || [] };
  } catch (error: any) {
    console.error('Get pending posts error:', error);
    throw error;
  }
}

export async function approveJob(jobId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/admin/approvals/content/job/${jobId}/approve`, { reason: 'Approved by admin' });
    return response;
  } catch (error: any) {
    console.error('Approve job error:', error);
    throw error;
  }
}

export async function rejectJob(jobId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/admin/approvals/content/job/${jobId}/reject`, { reason: 'Rejected by admin' });
    return response;
  } catch (error: any) {
    console.error('Reject job error:', error);
    throw error;
  }
}

export async function approveEvent(eventId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/admin/approvals/content/event/${eventId}/approve`, { reason: 'Approved by admin' });
    return response;
  } catch (error: any) {
    console.error('Approve event error:', error);
    throw error;
  }
}

export async function rejectEvent(eventId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/admin/approvals/content/event/${eventId}/reject`, { reason: 'Rejected by admin' });
    return response;
  } catch (error: any) {
    console.error('Reject event error:', error);
    throw error;
  }
}

export async function approvePost(postId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/admin/approvals/content/post/${postId}/approve`, { reason: 'Approved by admin' });
    return response;
  } catch (error: any) {
    console.error('Approve post error:', error);
    throw error;
  }
}

export async function rejectPost(postId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/admin/approvals/content/post/${postId}/reject`, { reason: 'Rejected by admin' });
    return response;
  } catch (error: any) {
    console.error('Reject post error:', error);
    throw error;
  }
}

export async function verifyUser(userId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.patch(`/api/admin/approvals/users/${userId}/verify`);
    return response;
  } catch (error: any) {
    console.error('Verify user error:', error);
    throw error;
  }
}

export async function unverifyUser(userId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.patch(`/api/admin/approvals/users/${userId}/unverify`);
    return response;
  } catch (error: any) {
    console.error('Unverify user error:', error);
    throw error;
  }
}

// Course Management API Functions
export async function getCourses(): Promise<{
  success: boolean;
  data: {
    courses: Array<{
      id: number;
      course_name: string;
      created_at: string;
      student_count: number;
    }>;
  };
}> {
  try {
    const response = await api.get('/api/courses');
    return response;
  } catch (error: any) {
    console.error('Get courses error:', error);
    throw error;
  }
}

export async function addCourse(courseName: string): Promise<{
  success: boolean;
  message: string;
  data: {
    course: {
      id: number;
      course_name: string;
      created_at: string;
    };
  };
}> {
  try {
    const response = await api.post('/api/courses', { course_name: courseName });
    return response;
  } catch (error: any) {
    console.error('Add course error:', error);
    throw error;
  }
}

export async function updateCourse(courseId: number, courseName: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await api.put(`/api/courses/${courseId}`, { course_name: courseName });
    return response;
  } catch (error: any) {
    console.error('Update course error:', error);
    throw error;
  }
}

export async function deleteCourse(courseId: number): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const response = await api.delete(`/api/courses/${courseId}`);
    return response;
  } catch (error: any) {
    console.error('Delete course error:', error);
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

import api from '../axios';

export interface DirectoryUser {
  id: number;
  full_name: string;
  email: string;
  role: 'STUDENT' | 'ALUMNUS' | 'TENANT_ADMIN';
  account_status: string;
  created_at: string;
  last_login: string;
  profile: {
    profile_picture_url?: string;
    company?: string;
    job_title?: string;
    current_location?: string;
    batch_year?: number;
    course?: {
      course_name: string;
    };
    linkedin_url?: string;
    bio?: string;
  };
}

export interface DirectoryResponse {
  success: boolean;
  data: DirectoryUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DirectoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'STUDENT' | 'ALUMNUS' | 'ALL';
  course?: string;
  batch_year?: number;
  company?: string;
  location?: string;
}

// Get user directory with filtering and pagination
export const getUserDirectory = async (filters: DirectoryFilters = {}, excludeCurrentUser: boolean = true) => {
  const params = new URLSearchParams();

  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());
  if (filters.search) params.append('search', filters.search);
  if (filters.role && filters.role !== 'ALL') params.append('role', filters.role);
  if (filters.course) params.append('course', filters.course);
  if (filters.batch_year) params.append('batch_year', filters.batch_year.toString());
  if (filters.company) params.append('company', filters.company);
  if (filters.location) params.append('location', filters.location);

  const response = await api.get(`/api/directory?${params.toString()}`);

  if (response.success && response.data && excludeCurrentUser) {
    // Filter out current user
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      try {
        const payload = JSON.parse(atob(authToken.split('.')[1]));
        const currentUserId = payload.userId;
        response.data = response.data.filter((user: DirectoryUser) => user.id !== parseInt(currentUserId));
      } catch (error) {
        console.warn('Could not parse auth token to filter current user');
      }
    }
  }

  return response as DirectoryResponse;
};

// Get recently active users (sorted by last login)
export const getRecentlyActiveUsers = async (limit: number = 20, excludeCurrentUser: boolean = true) => {
  const response = await api.get(`/api/directory?limit=${limit}&role=ALL`);

  if (response.success && response.data) {
    let users = response.data;

    // Filter out current user if requested
    if (excludeCurrentUser) {
      // Get current user ID from localStorage or auth context
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          const payload = JSON.parse(atob(authToken.split('.')[1]));
          const currentUserId = payload.userId;
          users = users.filter((user: DirectoryUser) => user.id !== parseInt(currentUserId));
        } catch (error) {
          console.warn('Could not parse auth token to filter current user');
        }
      }
    }

    // Sort by last_login descending to get most recently active users
    const sortedUsers = users.sort((a: DirectoryUser, b: DirectoryUser) => {
      const dateA = new Date(a.last_login || a.created_at);
      const dateB = new Date(b.last_login || b.created_at);
      return dateB.getTime() - dateA.getTime();
    });

    return {
      ...response,
      data: sortedUsers
    };
  }

  return response;
};

// Get user by ID
export const getUserById = async (userId: number) => {
  const response = await api.get(`/api/directory/${userId}`);
  return response;
};

// Search users
export const searchUsers = async (query: string, filters: Omit<DirectoryFilters, 'search'> = {}) => {
  return getUserDirectory({ ...filters, search: query });
};

// Get alumni only
export const getAlumni = async (filters: Omit<DirectoryFilters, 'role'> = {}) => {
  return getUserDirectory({ ...filters, role: 'ALUMNUS' });
};

// Get students only
export const getStudents = async (filters: Omit<DirectoryFilters, 'role'> = {}) => {
  return getUserDirectory({ ...filters, role: 'STUDENT' });
};

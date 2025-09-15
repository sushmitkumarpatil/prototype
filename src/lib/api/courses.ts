import api from '../axios';

export interface Course {
  id: number;
  tenant_id: number;
  course_name: string;
  created_at: string;
  profiles?: Array<{
    user_id: number;
    batch_year?: number;
    user: {
      id: number;
      full_name: string;
      email: string;
    };
  }>;
}

export interface CreateCourseRequest {
  course_name: string;
}

export interface UpdateCourseRequest {
  course_name: string;
}

export interface EnrollUserRequest {
  user_id: number;
  batch_year?: number;
}

// Course Management API functions
export async function getCourses(page: number = 1, limit: number = 20, filters?: {
  search?: string;
}): Promise<{
  success: boolean;
  courses: Course[];
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
    
    if (filters?.search) {
      params.append('search', filters.search);
    }

    const response = await api.get(`/api/courses?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get courses error:', error);
    throw error;
  }
}

export async function getCourseById(courseId: number): Promise<{ success: boolean; course: Course }> {
  try {
    const response = await api.get(`/api/courses/${courseId}`);
    return response;
  } catch (error: any) {
    console.error('Get course by ID error:', error);
    throw error;
  }
}

export async function createCourse(data: CreateCourseRequest): Promise<{ success: boolean; message: string; course: Course }> {
  try {
    const response = await api.post('/api/courses', data);
    return response;
  } catch (error: any) {
    console.error('Create course error:', error);
    throw error;
  }
}

export async function updateCourse(courseId: number, data: UpdateCourseRequest): Promise<{ success: boolean; message: string; course: Course }> {
  try {
    const response = await api.put(`/api/courses/${courseId}`, data);
    return response;
  } catch (error: any) {
    console.error('Update course error:', error);
    throw error;
  }
}

export async function deleteCourse(courseId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/api/courses/${courseId}`);
    return response;
  } catch (error: any) {
    console.error('Delete course error:', error);
    throw error;
  }
}

export async function enrollUserInCourse(courseId: number, data: EnrollUserRequest): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/courses/${courseId}/enroll`, data);
    return response;
  } catch (error: any) {
    console.error('Enroll user in course error:', error);
    throw error;
  }
}

export async function unenrollUserFromCourse(courseId: number, userId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/api/courses/${courseId}/enroll/${userId}`);
    return response;
  } catch (error: any) {
    console.error('Unenroll user from course error:', error);
    throw error;
  }
}

export async function getCourseEnrollments(courseId: number, page: number = 1, limit: number = 20): Promise<{
  success: boolean;
  enrollments: Array<{
    user_id: number;
    batch_year?: number;
    enrolled_at: string;
    user: {
      id: number;
      full_name: string;
      email: string;
      role: string;
      account_status: string;
    };
  }>;
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

    const response = await api.get(`/api/courses/${courseId}/enrollments?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get course enrollments error:', error);
    throw error;
  }
}

export async function getAvailableCourses(): Promise<{ success: boolean; courses: Course[] }> {
  try {
    const response = await api.get('/api/courses/available');
    return response;
  } catch (error: any) {
    console.error('Get available courses error:', error);
    throw error;
  }
}

export async function getCourseStatistics(courseId: number): Promise<{
  success: boolean;
  statistics: {
    total_enrollments: number;
    active_enrollments: number;
    batch_distribution: Array<{ batch_year: number; count: number }>;
    role_distribution: Array<{ role: string; count: number }>;
  };
}> {
  try {
    const response = await api.get(`/api/courses/${courseId}/statistics`);
    return response;
  } catch (error: any) {
    console.error('Get course statistics error:', error);
    throw error;
  }
}

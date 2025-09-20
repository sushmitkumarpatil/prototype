import api from '../axios';

// Job Management
export interface Job {
  id: number;
  tenant_id: number;
  author_id: number;
  title: string;
  company_name: string;
  location?: string;
  description: string;
  apply_link_or_email: string;
  job_type?: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';
  work_mode: 'Remote' | 'Hybrid' | 'Onsite';
  experience_level?: string;
  is_public: boolean;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    full_name: string;
    email: string;
  };
}

export interface CreateJobRequest {
  title: string;
  company_name: string;
  location?: string;
  description: string;
  apply_link_or_email: string;
  job_type?: 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT';
  work_mode: 'Remote' | 'Hybrid' | 'Onsite';
  experience_level?: string;
  is_public?: boolean;
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  id: number;
}

// Event Management
export interface Event {
  id: number;
  tenant_id: number;
  author_id: number;
  title: string;
  description?: string;
  image_url?: string;
  rsvp_link?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  is_public: boolean;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    full_name: string;
    email: string;
  };
  rsvps?: Array<{
    id: number;
    user_id: number;
    status: 'PENDING' | 'INTERESTED' | 'GOING' | 'NOT_GOING';
    user: {
      id: number;
      full_name: string;
    };
  }>;
}

export interface CreateEventRequest {
  title: string;
  description?: string;
  image_url?: string;
  rsvp_link?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  is_public?: boolean;
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  id: number;
}

// Post Management
export interface Post {
  id: number;
  tenant_id: number;
  author_id: number;
  title?: string;
  content: string;
  is_public: boolean;
  approval_status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: number;
  approved_at?: string;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    full_name: string;
    email: string;
    profile?: {
      profile_picture_url?: string;
    };
  };
}

export interface CreatePostRequest {
  title?: string;
  content: string;
  is_public?: boolean;
}

export interface UpdatePostRequest extends Partial<CreatePostRequest> {
  id: number;
}

// Job API functions
export async function createJob(data: CreateJobRequest): Promise<{ success: boolean; message: string; job: Job }> {
  try {
    const response = await api.post('/api/jobs', data);
    return response;
  } catch (error: any) {
    console.error('Create job error:', error);
    throw error;
  }
}

export async function getJobs(page: number = 1, limit: number = 10, filters?: {
  job_type?: string;
  work_mode?: string;
  location?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data: {
    jobs: Job[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
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

    const response = await api.get(`/api/jobs?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get jobs error:', error);
    throw error;
  }
}

export async function getJobById(jobId: number): Promise<{ success: boolean; job: Job }> {
  try {
    const response = await api.get(`/api/jobs/${jobId}`);
    return response;
  } catch (error: any) {
    console.error('Get job by ID error:', error);
    throw error;
  }
}

export async function updateJob(jobId: number, data: Partial<CreateJobRequest>): Promise<{ success: boolean; message: string; job: Job }> {
  try {
    const response = await api.put(`/api/jobs/${jobId}`, data);
    return response;
  } catch (error: any) {
    console.error('Update job error:', error);
    throw error;
  }
}

export async function deleteJob(jobId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/api/jobs/${jobId}`);
    return response;
  } catch (error: any) {
    console.error('Delete job error:', error);
    throw error;
  }
}

// Event API functions
export async function createEvent(data: CreateEventRequest): Promise<{ success: boolean; message: string; data: { event: Event; meta?: any } }> {
  try {
    const response = await api.post('/api/events', data);
    return response;
  } catch (error: any) {
    console.error('Create event error:', error);
    throw error;
  }
}

export async function getEvents(page: number = 1, limit: number = 10, filters?: {
  start_date?: string;
  end_date?: string;
  location?: string;
  search?: string;
}): Promise<{
  success: boolean;
  events: Event[];
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

    const response = await api.get(`/api/events?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get events error:', error);
    throw error;
  }
}

export async function getEventById(eventId: number): Promise<{ success: boolean; data: { event: Event; meta?: any } }> {
  try {
    const response = await api.get(`/api/events/${eventId}`);
    return response;
  } catch (error: any) {
    console.error('Get event by ID error:', error);
    throw error;
  }
}

export async function updateEvent(eventId: number, data: Partial<CreateEventRequest>): Promise<{ success: boolean; message: string; event: Event }> {
  try {
    const response = await api.put(`/api/events/${eventId}`, data);
    return response;
  } catch (error: any) {
    console.error('Update event error:', error);
    throw error;
  }
}

export async function deleteEvent(eventId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/api/events/${eventId}`);
    return response;
  } catch (error: any) {
    console.error('Delete event error:', error);
    throw error;
  }
}

// RSVP functions
export async function rsvpToEvent(eventId: number, status: 'INTERESTED' | 'GOING' | 'NOT_GOING'): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post(`/api/events/${eventId}/rsvp`, { status });
    return response;
  } catch (error: any) {
    console.error('RSVP to event error:', error);
    throw error;
  }
}

// Post API functions
export async function createPost(data: CreatePostRequest): Promise<{ success: boolean; message: string; post: Post }> {
  try {
    const response = await api.post('/api/posts', data);
    return response;
  } catch (error: any) {
    console.error('Create post error:', error);
    throw error;
  }
}

export async function getPosts(page: number = 1, limit: number = 10, filters?: {
  search?: string;
  author_id?: number;
}): Promise<{
  success: boolean;
  posts: Post[];
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
        if (value) params.append(key, value.toString());
      });
    }

    const response = await api.get(`/api/posts?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get posts error:', error);
    throw error;
  }
}

export async function getPostById(postId: number): Promise<{ success: boolean; post: Post }> {
  try {
    const response = await api.get(`/api/posts/${postId}`);
    return response;
  } catch (error: any) {
    console.error('Get post by ID error:', error);
    throw error;
  }
}

export async function updatePost(postId: number, data: Partial<CreatePostRequest>): Promise<{ success: boolean; message: string; post: Post }> {
  try {
    const response = await api.put(`/api/posts/${postId}`, data);
    return response;
  } catch (error: any) {
    console.error('Update post error:', error);
    throw error;
  }
}

export async function deletePost(postId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/api/posts/${postId}`);
    return response;
  } catch (error: any) {
    console.error('Delete post error:', error);
    throw error;
  }
}

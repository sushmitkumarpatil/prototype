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
    profile?: {
      profile_picture_url?: string;
    };
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
  rsvp_counts?: {
    interested: number;
    going: number;
    notGoing: number;
    total: number;
  };
  user_rsvp_status?: 'INTERESTED' | 'GOING' | 'NOT_GOING' | null;
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
  like_count: number;
  comment_count: number;
  liked_by_user: boolean;
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
  jobs: Job[];
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

    const response = await api.get(`/api/jobs?${params.toString()}`);

    // Transform the response to match expected structure
    if (response.success) {
      // Handle both response structures: { data: { jobs, pagination } } and { jobs, pagination }
      const jobs = response.data?.jobs || response.jobs || [];
      const pagination = response.data?.pagination || response.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      };

      return {
        success: response.success,
        jobs,
        pagination
      };
    }

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

// Get user's own jobs
export async function getMyJobs(): Promise<{ success: boolean; jobs: Job[] }> {
  try {
    const response = await api.get('/api/jobs/my');
    // The API returns { jobs: [...] }
    return {
      success: true,
      jobs: response.jobs || []
    };
  } catch (error: any) {
    console.error('Get my jobs error:', error);
    return {
      success: false,
      jobs: []
    };
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

    // Transform the response to match expected structure
    if (response.success && response.data) {
      return {
        success: response.success,
        events: response.data || [],
        pagination: response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }

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

// Get user's own events
export async function getMyEvents(): Promise<{ success: boolean; events: Event[] }> {
  try {
    const response = await api.get('/api/events/my-events');
    // The API returns a direct array, not an object with events property
    return {
      success: true,
      events: Array.isArray(response) ? response : []
    };
  } catch (error: any) {
    console.error('Get my events error:', error);
    return {
      success: false,
      events: []
    };
  }
}

// RSVP functions
export async function rsvpToEvent(eventId: number, status: 'INTERESTED' | 'GOING' | 'NOT_GOING'): Promise<any> {
  try {
    const response = await api.post(`/api/events/${eventId}/rsvp`, { status });
    return response;
  } catch (error: any) {
    console.error('RSVP to event error:', error);
    throw error;
  }
}

export async function getUserRSVP(eventId: number): Promise<any> {
  try {
    const response = await api.get(`/api/events/${eventId}/rsvp`);
    return response;
  } catch (error: any) {
    console.error('Get user RSVP error:', error);
    throw error;
  }
}

export async function getEventRSVPs(eventId: number, status?: string): Promise<any> {
  try {
    const params = status ? { status } : {};
    const response = await api.get(`/api/events/${eventId}/rsvps`, { params });
    return response;
  } catch (error: any) {
    console.error('Get event RSVPs error:', error);
    throw error;
  }
}

export async function cancelRSVP(eventId: number): Promise<any> {
  try {
    const response = await api.delete(`/api/events/${eventId}/rsvp`);
    return response;
  } catch (error: any) {
    console.error('Cancel RSVP error:', error);
    throw error;
  }
}

// Upload event image
export async function uploadEventImage(file: File): Promise<{ success: boolean; message: string; image_url: string }> {
  try {
    const formData = new FormData();
    formData.append('eventImage', file);

    const response = await api.post('/api/events/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error: any) {
    console.error('Upload event image error:', error);
    throw error;
  }
}

// Post like functions
export async function likePost(postId: number): Promise<{ success: boolean; message: string; like_count: number; liked: boolean }> {
  try {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response;
  } catch (error: any) {
    console.error('Like post error:', error);
    throw error;
  }
}

export async function unlikePost(postId: number): Promise<{ success: boolean; message: string; like_count: number; liked: boolean }> {
  try {
    const response = await api.delete(`/api/posts/${postId}/unlike`);
    return response;
  } catch (error: any) {
    console.error('Unlike post error:', error);
    throw error;
  }
}

// Post comment functions
export interface Comment {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    full_name: string;
    profile?: {
      profile_picture_url?: string;
    };
  };
}

export async function getPostComments(postId: number, page: number = 1, limit: number = 20): Promise<{
  success: boolean;
  data: {
    comments: Comment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}> {
  try {
    const response = await api.get(`/api/posts/${postId}/comments?page=${page}&limit=${limit}`);
    return response;
  } catch (error: any) {
    if (error?.status !== 404) {
      console.error('Get post comments error:', error);
    }
    throw error;
  }
}

export async function addPostComment(postId: number, content: string): Promise<{
  success: boolean;
  data: {
    message: string;
    comment: Comment;
    comment_count: number;
  };
}> {
  try {
    const response = await api.post(`/api/posts/${postId}/comments`, { content });
    return response;
  } catch (error: any) {
    if (error?.status !== 404) {
      console.error('Add post comment error:', error);
    }
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

    // Transform the response to match expected structure
    if (response.success && response.data) {
      return {
        success: response.success,
        posts: response.data.posts || [],
        pagination: response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      };
    }

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

// Get user's own posts
export async function getMyPosts(userId: number): Promise<{ success: boolean; posts: Post[] }> {
  try {
    const response = await api.get('/api/posts', {
      params: { author_id: userId, limit: 100 } // Get all user's posts
    });
    // The API returns { success: true, data: { posts: [...], pagination: {...} } }
    return {
      success: response.success || false,
      posts: response.data?.posts || response.posts || []
    };
  } catch (error: any) {
    console.error('Get my posts error:', error);
    return {
      success: false,
      posts: []
    };
  }
}

// User Stats API function
export interface UserStats {
  myJobs: number;
  myEvents: number;
  myPosts: number;
  pendingJobs: number;
  pendingEvents: number;
  pendingPosts: number;
  unreadNotifications: number;
}

export async function getUserStats(): Promise<{ success: boolean; stats: UserStats }> {
  try {
    const response = await api.get('/api/user/stats');
    return response;
  } catch (error: any) {
    console.error('Get user stats error:', error);
    throw error;
  }
}

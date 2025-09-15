import api from '../axios';

export interface Notification {
  id: number;
  user_id: number;
  tenant_id: number;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority: 'low' | 'medium' | 'high';
  read_at?: string;
  created_at: string;
}

export interface NotificationPreference {
  id: number;
  user_id: number;
  email_enabled: boolean;
  push_enabled: boolean;
  frequency: 'immediate' | 'daily' | 'weekly';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateNotificationPreferenceRequest {
  email_enabled?: boolean;
  push_enabled?: boolean;
  frequency?: 'immediate' | 'daily' | 'weekly';
  quiet_hours_start?: string;
  quiet_hours_end?: string;
}

// Notification API functions
export async function getNotifications(page: number = 1, limit: number = 20, filters?: {
  type?: string;
  priority?: string;
  read?: boolean;
}): Promise<{
  success: boolean;
  notifications: Notification[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  unread_count: number;
}> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) params.append(key, value.toString());
      });
    }

    const response = await api.get(`/api/notifications?${params.toString()}`);
    return response;
  } catch (error: any) {
    console.error('Get notifications error:', error);
    throw error;
  }
}

export async function getNotificationById(notificationId: number): Promise<{ success: boolean; notification: Notification }> {
  try {
    const response = await api.get(`/api/notifications/${notificationId}`);
    return response;
  } catch (error: any) {
    console.error('Get notification by ID error:', error);
    throw error;
  }
}

export async function markNotificationAsRead(notificationId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response;
  } catch (error: any) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
}

export async function deleteNotification(notificationId: number): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete(`/api/notifications/${notificationId}`);
    return response;
  } catch (error: any) {
    console.error('Delete notification error:', error);
    throw error;
  }
}

export async function markAllNotificationsAsRead(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post('/api/notifications/mark-all-read');
    return response;
  } catch (error: any) {
    console.error('Mark all notifications as read error:', error);
    throw error;
  }
}

export async function getUnreadNotificationCount(): Promise<{ success: boolean; count: number }> {
  try {
    const response = await api.get('/api/notifications/unread-count');
    return response;
  } catch (error: any) {
    console.error('Get unread notification count error:', error);
    throw error;
  }
}

// Notification Preferences API functions
export async function getNotificationPreferences(): Promise<{ success: boolean; preferences: NotificationPreference }> {
  try {
    const response = await api.get('/api/notifications/preferences');
    return response;
  } catch (error: any) {
    console.error('Get notification preferences error:', error);
    throw error;
  }
}

export async function updateNotificationPreferences(data: UpdateNotificationPreferenceRequest): Promise<{ success: boolean; message: string; preferences: NotificationPreference }> {
  try {
    const response = await api.put('/api/notifications/preferences', data);
    return response;
  } catch (error: any) {
    console.error('Update notification preferences error:', error);
    throw error;
  }
}

// Device Token Management (for push notifications)
export async function registerDeviceToken(token: string, platform: 'web' | 'ios' | 'android'): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.post('/api/device-tokens', { token, platform });
    return response;
  } catch (error: any) {
    console.error('Register device token error:', error);
    throw error;
  }
}

export async function unregisterDeviceToken(token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await api.delete('/api/device-tokens', { data: { token } });
    return response;
  } catch (error: any) {
    console.error('Unregister device token error:', error);
    throw error;
  }
}

export async function getDeviceTokens(): Promise<{ success: boolean; tokens: Array<{ id: number; token: string; platform: string; created_at: string; last_seen: string }> }> {
  try {
    const response = await api.get('/api/device-tokens');
    return response;
  } catch (error: any) {
    console.error('Get device tokens error:', error);
    throw error;
  }
}

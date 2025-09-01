

export interface Tenant {
  id: number;
  name: string;
  subdomain: string;
  is_active: boolean;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  account_status: string;
  tenant: Tenant;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
  timestamp: string;
}


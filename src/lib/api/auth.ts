
import api from '../axios';
import { LoginResponse } from '../types/auth';

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  let tenantId = localStorage.getItem('tenant');
  if (!tenantId) {
    tenantId = '1';
    localStorage.setItem('tenant', tenantId);
  }

  return api.post('/api/auth/login', { email, password, tenant_id: parseInt(tenantId, 10) });
}

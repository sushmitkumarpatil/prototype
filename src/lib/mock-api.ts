import { RegistrationData, RegistrationResponse } from './api/auth';

// Mock API for development/testing purposes
export class MockApiService {
  private static instance: MockApiService;
  private users: any[] = [];

  static getInstance(): MockApiService {
    if (!MockApiService.instance) {
      MockApiService.instance = new MockApiService();
    }
    return MockApiService.instance;
  }

  async registerUser(data: RegistrationData): Promise<RegistrationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = this.users.find(user => user.email === data.email);
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists.',
        timestamp: new Date().toISOString()
      };
    }

    // Create new user
    const newUser = {
      id: this.users.length + 1,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);

    return {
      success: true,
      message: 'Registration successful. Your account is pending verification.',
      userId: newUser.id,
      timestamp: new Date().toISOString()
    };
  }

  async loginUser(email: string, password: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    // In a real app, you'd verify the password hash
    if (user.password !== password) {
      throw new Error('Invalid credentials');
    }

    return {
      success: true,
      message: 'Login successful',
      accessToken: `mock-token-${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        role: user.userType,
        account_status: user.status,
        tenant: { id: 1, name: 'Default', subdomain: 'default', is_active: true }
      },
      timestamp: new Date().toISOString()
    };
  }

  getUsers() {
    return this.users;
  }
}

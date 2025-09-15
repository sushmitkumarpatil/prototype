'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { 
  loginUser, 
  logoutUser, 
  verifyToken, 
  getCurrentUser,
  LoginResponse,
  User 
} from '@/lib/api/auth';
import { getAuthToken, getUserData, saveAuthData, removeAuthData } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, redirectTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const isAuthenticated = !!user && !!getAuthToken();

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      // Try to get user data from localStorage first (faster)
      const cachedUser = getUserData();
      if (cachedUser) {
        setUser(cachedUser);
        setIsLoading(false);
        
        // Verify token in background without blocking UI
        try {
          const response = await verifyToken();
          if (response.valid && response.user) {
            // Update user data if verification succeeds
            setUser(response.user);
          } else {
            // Token is invalid, clear auth data
            removeAuthData();
            setUser(null);
          }
        } catch (verifyError: any) {
          console.warn('Background token verification failed:', verifyError);
          // Only clear auth data if it's a clear authentication error
          if (verifyError.message?.includes('401') || verifyError.message?.includes('Invalid token')) {
            removeAuthData();
            setUser(null);
          }
          // For network errors, keep cached data and let axios interceptor handle it
        }
        return;
      }

      // If no cached user data, verify token with backend
      const response = await verifyToken();
      if (response.valid && response.user) {
        setUser(response.user);
      } else {
        // Token is invalid, clear auth data
        removeAuthData();
        setUser(null);
      }
    } catch (error: any) {
      console.error('Auth check failed:', error);
      // Only clear auth data if it's a critical error, not network issues
      if (error.message?.includes('Network error') || error.message?.includes('timeout')) {
        // Keep cached user data for network issues
        const cachedUser = getUserData();
        if (cachedUser) {
          setUser(cachedUser);
        }
      } else {
        // Clear auth data for other errors
        removeAuthData();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, redirectTo?: string) => {
    try {
      setIsLoading(true);
      const response: LoginResponse = await loginUser(email, password);
      
      if (response.success) {
        saveAuthData(response);
        setUser(response.user);
        
        toast({
          title: 'Login Successful',
          description: 'Welcome back!',
        });
        
        // Redirect to specified URL or dashboard
        router.push(redirectTo || '/dashboard');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Call logout API to invalidate token on server
      try {
        await logoutUser();
      } catch (error) {
        console.warn('Logout API call failed:', error);
        // Continue with local logout even if API call fails
      }
      
      // Clear local auth data
      removeAuthData();
      setUser(null);
      
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out',
      });
      
      // Redirect to login page
      router.push('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local data
      removeAuthData();
      setUser(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await getCurrentUser();
      if (response.success && response.user) {
        setUser(response.user);
      }
    } catch (error: any) {
      console.error('Refresh user error:', error);
      // If refresh fails, user might need to login again
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        removeAuthData();
        setUser(null);
        router.push('/login');
      }
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

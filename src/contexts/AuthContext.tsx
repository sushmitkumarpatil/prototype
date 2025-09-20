'use client';

import { useToast } from '@/hooks/use-toast';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  verifyToken
} from '@/lib/api/auth';
import { getAuthToken, getUserData, removeAuthData, saveAuthData } from '@/lib/auth';
import { classifyAuthError, getRefreshState } from '@/lib/axios';
import type { LoginResponse, User } from '@/lib/types/auth';
import { useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
  // Helper to wait for in-flight refresh to finish
  async function waitForRefreshIfInFlight() {
    const { isRefreshing, pendingRequestsQueueLength } = getRefreshState();
    if (isRefreshing) {
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
        // eslint-disable-next-line no-console
        console.log('[AuthContext] Waiting for in-flight token refresh to complete...');
      }
      // Wait for all pending requests to resolve
      await new Promise((resolve) => {
        const check = () => {
          const { isRefreshing: stillRefreshing, pendingRequestsQueueLength: qlen } = getRefreshState();
          if (!stillRefreshing && qlen === 0) resolve(null);
          else setTimeout(check, 50);
        };
        check();
      });
    }
  }

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

  // Enhanced error classification for auth
  function classifyError(error: any) {
    if (!error) return { type: 'unknown', recoverable: false };
    if (error.isAxiosError || error.response || error.code) {
      const { status, code, isNetworkError, isTimeout, isServerError, normalizedCode, recoverable } = classifyAuthError(error);
      if (isNetworkError) return { type: 'network', recoverable: true };
      if (isTimeout) return { type: 'timeout', recoverable: true };
      if (isServerError) return { type: 'server', recoverable: true };
      if (normalizedCode === 'INVALID_TOKEN' || [401, 403].includes(status)) return { type: 'auth', recoverable: false };
      return { type: 'other', recoverable: recoverable ?? false };
    }
    if (error.message?.toLowerCase().includes('network error')) {
      return { type: 'network', recoverable: true };
    }
    return { type: 'unknown', recoverable: false };
  }

  // Exponential backoff helper
  async function retryWithBackoff(fn: () => Promise<any>, maxAttempts = 3, baseDelay = 500) {
    let attempt = 0;
    let lastError;
    while (attempt < maxAttempts) {
      try {
        return await fn();
      } catch (err) {
        lastError = err;
        const { type, recoverable } = classifyError(err);
        if (!recoverable) throw err;
        attempt++;
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
          // eslint-disable-next-line no-console
          console.warn(`[AuthContext] Retry attempt ${attempt} after error:`, err);
        }
        await new Promise((res) => setTimeout(res, baseDelay * Math.pow(2, attempt - 1)));
      }
    }
    throw lastError;
  }

  const checkAuth = async () => {
    await waitForRefreshIfInFlight();
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
          await retryWithBackoff(async () => {
            // Guard: if refresh is in-flight, do not clear session on failure
            await waitForRefreshIfInFlight();
            const response = await verifyToken();
            if (response.valid && response.user) {
              setUser(response.user);
            } else {
              // Only clear session if not in-flight refresh
              const { isRefreshing } = getRefreshState();
              if (!isRefreshing) {
                removeAuthData();
                setUser(null);
              }
            }
          });
        } catch (verifyError: any) {
          const { type, recoverable } = classifyError(verifyError);
          if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
            // eslint-disable-next-line no-console
            console.warn('[AuthContext] Background token verification failed:', verifyError, type, recoverable);
          }
          // Only clear session if not in-flight refresh
          const { isRefreshing } = getRefreshState();
          if (!recoverable && !isRefreshing) {
            removeAuthData();
            setUser(null);
          }
          // For network/server errors, keep cached data and let axios handle it
        }
        return;
      }

      // If no cached user data, verify token with backend
      await retryWithBackoff(async () => {
        await waitForRefreshIfInFlight();
        const response = await verifyToken();
        if (response.valid && response.user) {
          setUser(response.user);
        } else {
          const { isRefreshing } = getRefreshState();
          if (!isRefreshing) {
            removeAuthData();
            setUser(null);
          }
        }
      });
    } catch (error: any) {
      const { type, recoverable } = classifyError(error);
      if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
        // eslint-disable-next-line no-console
        console.error('[AuthContext] Auth check failed:', error, type, recoverable);
      }
      const { isRefreshing } = getRefreshState();
      if (!recoverable && !isRefreshing) {
        removeAuthData();
        setUser(null);
      } else {
        // For network/server errors, keep cached user data
        const cachedUser = getUserData();
        if (cachedUser) setUser(cachedUser);
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
        // Check if this is a returning user
        const existingUserData = getUserData();
        const isReturningUser = existingUserData && existingUserData.email === email;
        
        // Save auth data with returning user flag
        saveAuthData(response);
        
        // Store welcome message state in localStorage
        if (isReturningUser) {
          localStorage.setItem('welcomeMessage', 'back');
        } else {
          localStorage.setItem('welcomeMessage', 'first');
        }
        
        setUser(response.user);
        
        toast({
          title: 'Login Successful',
          description: 'Sign-in successful',
          variant: 'success',
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
    await waitForRefreshIfInFlight();
    let attempts = 0;
    const maxAttempts = 3;
    const baseDelay = 500;
    while (attempts < maxAttempts) {
      try {
        await waitForRefreshIfInFlight();
        const response = await getCurrentUser();
        if (response.success && response.user) {
          setUser(response.user);
          return;
        }
        throw new Error('User not found');
      } catch (error: any) {
        const { type, recoverable } = classifyError(error);
        if (process.env.NEXT_PUBLIC_DEBUG_AUTH === 'true') {
          // eslint-disable-next-line no-console
          console.error('[AuthContext] Refresh user error:', error, type, recoverable);
        }
        const { isRefreshing } = getRefreshState();
        if (!recoverable && !isRefreshing) {
          removeAuthData();
          setUser(null);
          router.push('/login');
          return;
        }
        attempts++;
        await new Promise((res) => setTimeout(res, baseDelay * Math.pow(2, attempts - 1)));
      }
    }
    // If all retries fail, show a toast but do not clear session immediately
    toast({
      title: 'Network Issue',
      description: 'Unable to refresh user info. Please check your connection.',
      variant: 'warning',
    });
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

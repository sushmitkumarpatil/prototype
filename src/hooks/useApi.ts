'use client';

import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error: any) {
        const errorMessage = error.message || 'An unexpected error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

interface UseApiWithDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseApiWithDataReturn<T> extends UseApiWithDataState<T> {
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export function useApiWithData<T = any>(
  apiFunction: (...args: any[]) => Promise<T>,
  initialData: T | null = null
): UseApiWithDataReturn<T> {
  const [state, setState] = useState<UseApiWithDataState<T>>({
    data: initialData,
    loading: false,
    error: null,
    refetch: async () => {},
  });

  const refetch = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(...args);
      setState(prev => ({ ...prev, data: result, loading: false, error: null }));
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, [apiFunction]);

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  return {
    ...state,
    refetch,
    setData,
    setError,
    setLoading,
  };
}

interface UsePaginatedApiState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  total: number;
  totalPages: number;
}

interface UsePaginatedApiReturn<T> extends UsePaginatedApiState<T> {
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export function usePaginatedApi<T = any>(
  apiFunction: (page: number, limit: number, ...args: any[]) => Promise<{
    data: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>,
  limit: number = 10
): UsePaginatedApiReturn<T> {
  const [state, setState] = useState<UsePaginatedApiState<T>>({
    data: [],
    loading: false,
    error: null,
    hasMore: false,
    page: 1,
    total: 0,
    totalPages: 0,
  });

  const loadMore = useCallback(async (...args: any[]) => {
    if (state.loading || !state.hasMore) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction(state.page, limit, ...args);
      setState(prev => ({
        ...prev,
        data: [...prev.data, ...result.data],
        loading: false,
        error: null,
        hasMore: result.pagination.page < result.pagination.totalPages,
        page: result.pagination.page + 1,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      }));
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, [apiFunction, limit, state.loading, state.hasMore, state.page]);

  const refresh = useCallback(async (...args: any[]) => {
    setState(prev => ({ ...prev, loading: true, error: null, page: 1, data: [] }));
    
    try {
      const result = await apiFunction(1, limit, ...args);
      setState({
        data: result.data,
        loading: false,
        error: null,
        hasMore: result.pagination.page < result.pagination.totalPages,
        page: result.pagination.page + 1,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
    }
  }, [apiFunction, limit]);

  const reset = useCallback(() => {
    setState({
      data: [],
      loading: false,
      error: null,
      hasMore: false,
      page: 1,
      total: 0,
      totalPages: 0,
    });
  }, []);

  return {
    ...state,
    loadMore,
    refresh,
    reset,
  };
}

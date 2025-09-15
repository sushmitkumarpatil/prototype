'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorDisplayProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  className?: string;
  variant?: 'default' | 'destructive' | 'warning';
  showRetry?: boolean;
}

export function ErrorDisplay({
  error,
  title = 'An error occurred',
  onRetry,
  className,
  variant = 'destructive',
  showRetry = true,
}: ErrorDisplayProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                        errorMessage.toLowerCase().includes('connection') ||
                        errorMessage.toLowerCase().includes('timeout');

  const Icon = isNetworkError ? WifiOff : AlertTriangle;

  return (
    <Alert variant={variant} className={cn('', className)}>
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-3">
          <p>{errorMessage}</p>
          {showRetry && onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-2"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface ErrorPageProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export function ErrorPage({
  error,
  title = 'Something went wrong',
  onRetry,
  showRetry = true,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <ErrorDisplay
          error={error}
          title={title}
          onRetry={onRetry}
          showRetry={showRetry}
        />
      </div>
    </div>
  );
}

interface ErrorCardProps {
  error: string | Error;
  title?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorCard({
  error,
  title = 'Error',
  onRetry,
  className,
}: ErrorCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-6', className)}>
      <ErrorDisplay
        error={error}
        title={title}
        onRetry={onRetry}
        variant="destructive"
      />
    </div>
  );
}

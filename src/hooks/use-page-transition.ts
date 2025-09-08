import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export const usePageTransition = () => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  const navigateWithTransition = useCallback((href: string, delay: number = 300) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      router.push(href);
      setIsTransitioning(false);
    }, delay);
  }, [router]);

  return {
    isTransitioning,
    navigateWithTransition,
    setIsTransitioning
  };
};

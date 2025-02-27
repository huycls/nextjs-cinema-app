'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loadingSpinner';
import { LoadingDots } from './ui/loadingDots';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  startLoading: () => {},
  stopLoading: () => {},
});

export const useLoading = () => useContext(LoadingContext);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Reset loading state on route change
  useEffect(() => {
    setIsLoading(false);
  }, [pathname, searchParams]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {children}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
            {/* <LoadingSpinner className="text-primary mb-4" />
            <p className="text-foreground">Loading...</p> */}
            <LoadingDots />
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
}
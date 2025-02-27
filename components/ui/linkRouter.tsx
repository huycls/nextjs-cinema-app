'use client';

import Link from 'next/link';
import { useLoading } from '../loading-provider';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface LinkRouterProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function LinkRouter({ href, children, className, onClick }: LinkRouterProps) {
  const { startLoading } = useLoading();
  const pathname = usePathname();
  
  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger loading for external links or anchor links
    if (href.startsWith('http') || href.startsWith('#') || href === '#') {
      if (onClick) onClick();
      return;
    }

    // Check if the link points to the current page
    const linkPath = href.split('?')[0]; // Remove query parameters
    const currentPath = pathname;
    
    if (linkPath !== currentPath) {
      startLoading();
    }
    
    if (onClick) onClick();
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
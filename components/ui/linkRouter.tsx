'use client';

import Link from 'next/link';
import { useLoading } from '../loading-provider';
import { ReactNode } from 'react';

interface LinkRouterProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function LinkRouter({ href, children, className, onClick }: LinkRouterProps) {
  const { startLoading } = useLoading();
  
  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger loading for external links or anchor links
    // if (href.startsWith('http') || href.startsWith('#') || href === '#') {
    //   if (onClick) onClick();
    //   return;
    // }
    
    startLoading();
    if (onClick) onClick();
  };

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
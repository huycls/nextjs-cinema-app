'use client';

import { cn } from "@/lib/utils";

interface LoadingDotsProps {
  className?: string;
  color?: string;
}

export function LoadingDots({ className, color = "bg-current" }: LoadingDotsProps) {
  return (
    <span className={cn("inline-flex items-center space-x-1", className)}>
      <span className={`${color} h-2 w-2 rounded-full animate-bounce`} style={{ animationDelay: "0ms" }} />
      <span className={`${color} h-2 w-2 rounded-full animate-bounce`} style={{ animationDelay: "150ms" }} />
      <span className={`${color} h-2 w-2 rounded-full animate-bounce`} style={{ animationDelay: "300ms" }} />
    </span>
  );
}
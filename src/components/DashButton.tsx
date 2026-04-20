import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export function DashButton({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-95',
        variant === 'primary' && 'bg-black text-white hover:bg-black/90 shadow-sm hover:shadow-md',
        variant === 'secondary' && 'border border-border bg-white text-black hover:bg-secondary/50 shadow-sm',
        variant === 'outline' && 'border-2 border-black bg-transparent text-black hover:bg-black/5',
        variant === 'ghost' && 'bg-transparent hover:bg-secondary/50 text-muted-foreground hover:text-black',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

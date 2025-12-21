import React from 'react';
import { cn } from '@/lib/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text, className }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div
        className={cn(
          'rounded-full border-primary/30 border-t-primary animate-spin',
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground font-medium">{text}</p>
      )}
    </div>
  );
};

export default Loader;

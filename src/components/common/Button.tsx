import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-md hover:bg-primary-light hover:shadow-lg active:scale-[0.98]',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline:
          'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground',
        ghost:
          'text-foreground hover:bg-muted hover:text-foreground',
        destructive:
          'bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90',
        success:
          'bg-success text-success-foreground shadow-md hover:bg-success/90',
        warning:
          'bg-warning text-warning-foreground shadow-md hover:bg-warning/90',
        link:
          'text-primary underline-offset-4 hover:underline',
        hero:
          'bg-gradient-to-r from-primary to-primary-light text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
        cbt:
          'bg-primary text-primary-foreground font-bold shadow hover:bg-primary-light',
        'cbt-outline':
          'border-2 border-border bg-card text-foreground hover:border-primary hover:bg-primary/5',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

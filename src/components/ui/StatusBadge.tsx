import React from 'react';

type BadgeVariant = 'high' | 'medium' | 'low' | 'info' | 'easy' | 'hard' | 'neutral';

interface StatusBadgeProps {
  variant: BadgeVariant;
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

const variantClasses: Record<BadgeVariant, string> = {
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
  info: 'badge-info',
  easy: 'difficulty-easy',
  hard: 'difficulty-hard',
  neutral: 'bg-muted text-muted-foreground',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export default function StatusBadge({ variant, label, size = 'md' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center font-semibold rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}>
      {label}
    </span>
  );
}
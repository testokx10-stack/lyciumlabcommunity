import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dims = {
    sm: { box: 'h-8 w-8', icon: 18, text: 'text-lg' },
    md: { box: 'h-10 w-10', icon: 22, text: 'text-xl' },
    lg: { box: 'h-12 w-12', icon: 26, text: 'text-2xl' },
  }[size];

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'relative grid place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md shadow-primary/20',
          dims.box,
        )}
      >
        <Sprout size={dims.icon} strokeWidth={2.5} />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 ring-2 ring-background" />
      </span>
      <span className={cn('font-display font-semibold tracking-tight', dims.text)}>
        Lycium<span className="text-accent"> Lab</span>
      </span>
    </span>
  );
}

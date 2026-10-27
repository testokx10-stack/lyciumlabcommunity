import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, size = 'md' }: { className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const dims = {
    sm: { box: 'h-8 w-8', text: 'text-lg' },
    md: { box: 'h-10 w-10', text: 'text-xl' },
    lg: { box: 'h-12 w-12', text: 'text-2xl' },
  }[size];

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <Image
        src="/lycium-bio-lab-mark.png"
        alt=""
        width={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
        height={size === 'sm' ? 32 : size === 'md' ? 40 : 48}
        className={cn('shrink-0 rounded-lg object-cover', dims.box)}
        priority
      />
      <span className={cn('font-display font-semibold tracking-tight', dims.text)}>
        Lycium <span className="text-accent">Bio Lab</span>
      </span>
    </span>
  );
}

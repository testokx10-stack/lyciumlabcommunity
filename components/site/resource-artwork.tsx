import {
  Bug,
  ChartColumnIncreasing,
  Droplets,
  FlaskConical,
  Gauge,
  Layers,
  Leaf,
  Map,
  Microscope,
  ScanSearch,
  Sprout,
  Sun,
  TestTube,
  Wheat,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const resourceArtwork: Record<string, { icon: LucideIcon; theme: string }> = {
  a7: { icon: Wheat, theme: 'from-lime-100 via-emerald-50 to-green-200 text-emerald-800' },
  a8: { icon: FlaskConical, theme: 'from-amber-100 via-yellow-50 to-orange-200 text-amber-800' },
  a9: { icon: Gauge, theme: 'from-sky-100 via-cyan-50 to-blue-200 text-sky-800' },
  a10: { icon: Map, theme: 'from-emerald-100 via-teal-50 to-lime-200 text-emerald-800' },
  a11: { icon: Layers, theme: 'from-orange-100 via-amber-50 to-yellow-200 text-orange-800' },
  a12: { icon: TestTube, theme: 'from-yellow-100 via-lime-50 to-emerald-200 text-lime-800' },
  a13: { icon: Sprout, theme: 'from-green-100 via-emerald-50 to-lime-200 text-green-800' },
  a14: { icon: Sun, theme: 'from-yellow-100 via-amber-50 to-orange-200 text-amber-800' },
  a15: { icon: ScanSearch, theme: 'from-rose-100 via-orange-50 to-amber-200 text-rose-800' },
  a16: { icon: Bug, theme: 'from-lime-100 via-green-50 to-emerald-200 text-green-800' },
  a17: { icon: Microscope, theme: 'from-violet-100 via-indigo-50 to-sky-200 text-indigo-800' },
  a18: { icon: ChartColumnIncreasing, theme: 'from-teal-100 via-cyan-50 to-blue-200 text-teal-800' },
};

export function ResourceArtwork({
  resourceId,
  className,
  compact = false,
}: {
  resourceId: string;
  className?: string;
  compact?: boolean;
}) {
  const artwork = resourceArtwork[resourceId] || {
    icon: Leaf,
    theme: 'from-emerald-100 via-green-50 to-lime-200 text-emerald-800',
  };
  const Icon = artwork.icon;

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative isolate grid place-items-center overflow-hidden bg-gradient-to-br',
        artwork.theme,
        compact ? 'aspect-[16/9] rounded-lg' : 'aspect-[16/9]',
        className,
      )}
    >
      <div className="absolute -right-8 -top-12 h-40 w-40 rounded-full bg-white/40" />
      <div className="absolute right-[18%] top-[16%] h-10 w-10 rounded-full bg-amber-300/70 blur-[1px]" />
      <svg
        viewBox="0 0 640 360"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <path d="M0 245c88-61 152-43 235-4 88 41 156 32 239-11 60-31 114-28 166 4v126H0V245Z" fill="currentColor" fillOpacity=".12" />
        <path d="M0 285c88-44 172-26 253 8 89 37 170 20 244-14 55-25 99-26 143-9v90H0v-75Z" fill="currentColor" fillOpacity=".18" />
        <path d="M0 316c112-29 189-8 273 15 103 29 197 1 270-17 37-9 68-10 97-3v49H0v-44Z" fill="currentColor" fillOpacity=".12" />
        <path d="M68 275c58-19 112-15 163 5M391 291c57-26 103-33 155-27" stroke="currentColor" strokeOpacity=".22" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className={cn(
        'relative grid place-items-center rounded-[2rem] border border-white/60 bg-white/55 shadow-lg shadow-emerald-950/10 backdrop-blur-sm',
        compact ? 'h-12 w-12 rounded-2xl' : 'h-24 w-24',
      )}>
        <Icon
          className={cn('drop-shadow-sm', compact ? 'h-6 w-6' : 'h-12 w-12')}
          strokeWidth={1.5}
        />
      </div>
      {!compact && (
        <>
          <div className="absolute bottom-[22%] left-[18%] h-2 w-2 rounded-full bg-white/80" />
          <div className="absolute bottom-[30%] right-[21%] h-3 w-3 rounded-full bg-white/70" />
          <Droplets className="absolute bottom-[20%] right-[12%] h-5 w-5 text-white/75" strokeWidth={1.5} />
        </>
      )}
    </div>
  );
}

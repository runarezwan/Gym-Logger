'use client';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-bg-tertiary/10 rounded-2xl relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 rounded-[2.5rem] border border-border-color space-y-4">
       <div className="flex items-center justify-between">
          <div className="space-y-2">
             <Skeleton className="h-3 w-20" />
             <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-12 w-12 rounded-2xl" />
       </div>
       <div className="flex gap-2">
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
       </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

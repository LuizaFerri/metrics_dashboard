import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MetricCardSkeletonProps {
  className?: string;
}

export function MetricCardSkeleton({ className }: MetricCardSkeletonProps) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-xl border transition-all duration-200",
        "bg-slate-800/40 backdrop-blur-sm border-slate-700/50",
        "animate-pulse",
        className
      )}
    >
      <Skeleton className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-slate-700" />

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-11 w-11 rounded-lg bg-slate-700" />

          <div>
            <Skeleton className="h-4 w-24 mb-2 bg-slate-700" />
            <Skeleton className="h-3 w-16 bg-slate-600" />
          </div>
        </div>

        <Skeleton className="h-6 w-12 rounded-full bg-slate-700" />
      </div>

      <div className="mb-2">
        <Skeleton className="h-8 w-32 bg-slate-700" />
      </div>
    </div>
  );
}

export function MetricCardSkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <MetricCardSkeleton key={index} />
      ))}
    </div>
  );
}

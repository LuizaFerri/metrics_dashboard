import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartSkeletonProps {
  className?: string;
  height?: string;
}

export function ChartSkeleton({
  className,
  height = "h-64 sm:h-80",
}: ChartSkeletonProps) {
  return (
    <div className={cn("bg-slate-800/30 rounded-lg p-6", className)}>
      <Skeleton className="h-6 w-48 mb-4 bg-slate-700" />

      <div className={cn(height, "relative")}>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-600" />
        <div className="absolute bottom-0 left-0 top-0 w-px bg-slate-600" />

        <div className="absolute inset-0 flex flex-col justify-between py-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-px bg-slate-700/30" />
          ))}
        </div>

        <div className="absolute inset-4 flex items-end justify-between">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton
              key={i}
              className="w-1 bg-slate-600 animate-pulse"
              style={{
                height: `${Math.random() * 60 + 20}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        <svg className="absolute inset-4 w-full h-full opacity-30">
          <path
            d="M0,80 Q50,40 100,60 T200,50 T300,70"
            stroke="#06B6D4"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
        </svg>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-slate-800/50 rounded-lg p-4">
          <Skeleton className="h-4 w-20 mb-2 bg-slate-700" />
          <Skeleton className="h-6 w-24 mb-2 bg-slate-600" />
          <Skeleton className="h-3 w-16 bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

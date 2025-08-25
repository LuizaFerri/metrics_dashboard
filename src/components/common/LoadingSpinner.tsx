import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3",
        className
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "border-2 border-slate-600 border-t-cyan-400 rounded-full animate-spin",
            sizeClasses[size]
          )}
        />
        <div
          className={cn(
            "absolute inset-0 border-2 border-transparent border-t-cyan-400/30 rounded-full animate-spin",
            sizeClasses[size]
          )}
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        />
      </div>

      {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
    </div>
  );
}

export function LoadingOverlay({
  isLoading,
  children,
  text = "Carregando...",
}: {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
}) {
  return (
    <div className="relative">
      {children}

      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
          <LoadingSpinner text={text} />
        </div>
      )}
    </div>
  );
}

export function PageLoadingState() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center space-y-6">
        <LoadingSpinner size="lg" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Carregando Dashboard
          </h2>
          <p className="text-slate-400">Obtendo dados das criptomoedas...</p>
        </div>
      </div>
    </div>
  );
}

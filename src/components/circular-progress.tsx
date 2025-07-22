import { cn } from "@/lib/utils";

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  enableColorTransition?: boolean;
  timeRemaining?: number;
  totalTime?: number;
  accentColor?: string;
}

export function CircularProgress({
  progress,
  size = 200,
  strokeWidth = 6,
  className,
  enableColorTransition = true,
  timeRemaining = 0,
  totalTime = 1,
  accentColor = "blue",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  // Reverse the progress calculation for countdown effect
  const reverseProgress = 100 - progress;
  const strokeDashoffset =
    circumference - (reverseProgress / 100) * circumference;

  // Calculate color based on time remaining and accent color
  const getProgressColor = () => {
    if (!enableColorTransition) {
      const accentColors: Record<string, string> = {
        blue: "text-blue-500",
        red: "text-red-500",
        green: "text-green-500",
        yellow: "text-yellow-500",
        purple: "text-purple-500",
        orange: "text-orange-500",
      };
      return accentColors[accentColor] || "text-blue-500";
    }

    const timeRatio = timeRemaining / totalTime;

    if (timeRatio > 0.5) {
      return "text-green-500";
    } else if (timeRatio > 0.25) {
      return "text-yellow-500";
    } else if (timeRatio > 0.1) {
      return "text-orange-500";
    } else {
      return "text-red-500";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-muted-foreground/20"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            "transition-all duration-1000 ease-in-out",
            getProgressColor()
          )}
        />
      </svg>
    </div>
  );
}

import { cn } from "@/lib/utils";
import type { Stage } from "@/contexts/timer-context";

interface StageIndicatorProps {
  stages: Stage[];
  currentStageIndex: number;
  className?: string;
}

export function StageIndicator({
  stages,
  currentStageIndex,
  className,
}: StageIndicatorProps) {
  const showNames = stages.length <= 4; // Show names only if 4 or fewer stages

  return (
    <div className={cn("flex items-center justify-center px-4", className)}>
      <div className="flex items-center gap-2 overflow-x-auto max-w-full">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-3 h-3 rounded-full border-2 transition-colors flex-shrink-0",
                  index === currentStageIndex
                    ? "bg-primary border-primary"
                    : index < currentStageIndex
                    ? "bg-primary/50 border-primary/50"
                    : "bg-background border-muted-foreground/30"
                )}
              />
              {showNames && (
                <span
                  className={cn(
                    "text-xs mt-1 text-center transition-colors whitespace-nowrap",
                    index === currentStageIndex
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {stage.title}
                </span>
              )}
            </div>

            {index < stages.length - 1 && (
              <div
                className={cn(
                  "w-8 h-0.5 mx-2 transition-colors flex-shrink-0",
                  index < currentStageIndex
                    ? "bg-primary/50"
                    : "bg-muted-foreground/20"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

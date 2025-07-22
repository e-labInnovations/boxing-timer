import { Trash2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useTimer,
  type Stage,
  type TimerConfig,
} from "@/contexts/timer-context";
import { formatTime } from "@/lib/utils";

export function TemplatesDrawer() {
  const { state, dispatch } = useTimer();

  const handleClose = () => {
    dispatch({ type: "TOGGLE_TEMPLATES" });
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = state.templates.find((t) => t.id === templateId);
    if (template) {
      dispatch({ type: "LOAD_TEMPLATE", payload: template.config });
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    dispatch({ type: "DELETE_TEMPLATE", payload: templateId });
  };

  const getTemplateSummary = (config: TimerConfig) => {
    const totalDuration = config.stages.reduce(
      (sum: number, stage: Stage) => sum + stage.duration,
      0
    );
    const stageCount = config.stages.length;
    const roundText = config.isInfinite
      ? "∞ rounds"
      : `${config.totalRounds} rounds`;

    return `${stageCount} stages • ${roundText} • ${formatTime(
      totalDuration
    )} per round`;
  };

  return (
    <Sheet open={state.isTemplatesOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[70vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Saved Templates</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 py-4">
          {state.templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No templates saved yet.</p>
              <p className="text-sm mt-2">
                Create a configuration and save it as a template!
              </p>
            </div>
          ) : (
            state.templates.map((template) => (
              <div
                key={template.id}
                className="flex items-center gap-3 p-4 bg-card border rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {template.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getTemplateSummary(template.config)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Created {new Date(template.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadTemplate(template.id)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Load
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

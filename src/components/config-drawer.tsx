"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  ChevronRight,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TimePicker } from "@/components/time-picker";
import { useTimer } from "@/contexts/timer-context";
import { useSounds } from "@/hooks/use-sounds";
import { generateId } from "@/lib/utils";
import type { Stage, TimerConfig } from "@/contexts/timer-context";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function CompactStageItem({
  stage,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: {
  stage: Stage;
  index: number;
  onUpdate: (stage: Stage) => void;
  onDelete: (id: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const { availableSounds } = useSounds();
  const [isOpen, setIsOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="border rounded-lg bg-card">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div
                  {...attributes}
                  {...listeners}
                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
                  onClick={(e) => e.stopPropagation()}
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <ChevronRight
                  className={`h-4 w-4 transition-transform ${
                    isOpen ? "rotate-90" : ""
                  }`}
                />
                <span className="font-medium">{stage.title}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.floor(stage.duration / 60)}:
                  {(stage.duration % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveUp();
                  }}
                  disabled={!canMoveUp}
                  className="h-8 w-8 p-0"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMoveDown();
                  }}
                  disabled={!canMoveDown}
                  className="h-8 w-8 p-0"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(stage.id);
                  }}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="p-3 pt-0 space-y-3 border-t">
              <div>
                <Label htmlFor={`title-${stage.id}`}>Stage Name</Label>
                <Input
                  id={`title-${stage.id}`}
                  value={stage.title}
                  onChange={(e) =>
                    onUpdate({ ...stage, title: e.target.value })
                  }
                  placeholder="e.g., Fight, Rest"
                  className="mt-1"
                />
              </div>

              <TimePicker
                value={stage.duration}
                onChange={(duration) => onUpdate({ ...stage, duration })}
                label="Duration"
                id={`duration-${stage.id}`}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`start-sound-${stage.id}`}>Start Sound</Label>
                  <Select
                    value={stage.startSoundId}
                    onValueChange={(value) =>
                      onUpdate({ ...stage, startSoundId: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSounds.map((sound) => (
                        <SelectItem key={sound.id} value={sound.id}>
                          {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`end-sound-${stage.id}`}>End Sound</Label>
                  <Select
                    value={stage.endSoundId}
                    onValueChange={(value) =>
                      onUpdate({ ...stage, endSoundId: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSounds.map((sound) => (
                        <SelectItem key={sound.id} value={sound.id}>
                          {sound.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}

export function ConfigDrawer() {
  const { state, dispatch } = useTimer();
  const { availableSounds } = useSounds();
  const [localConfig, setLocalConfig] = useState<TimerConfig>({
    ...state.config,
    endOfRoundSoundId: state.config.endOfRoundSoundId || undefined,
    enableColorTransition: state.config.enableColorTransition ?? true,
    enableVibration: state.config.enableVibration ?? true,
    enableVoiceAnnouncements: state.config.enableVoiceAnnouncements ?? false,
    accentColor: state.config.accentColor || "blue",
    enableCountdown: state.config.enableCountdown ?? true,
  });
  const [templateName, setTemplateName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleClose = () => {
    dispatch({ type: "TOGGLE_CONFIG" });
    setLocalConfig(state.config);
  };

  const handleSave = () => {
    dispatch({ type: "SET_CONFIG", payload: localConfig });
    dispatch({ type: "TOGGLE_CONFIG" });
  };

  const handleAddStage = () => {
    const newStage: Stage = {
      id: generateId(),
      title: `Stage ${localConfig.stages.length + 1}`,
      duration: 60,
      startSoundId: "bell",
      endSoundId: "bell",
    };
    setLocalConfig({
      ...localConfig,
      stages: [...localConfig.stages, newStage],
    });
  };

  const handleUpdateStage = (updatedStage: Stage) => {
    setLocalConfig({
      ...localConfig,
      stages: localConfig.stages.map((stage) =>
        stage.id === updatedStage.id ? updatedStage : stage
      ),
    });
  };

  const handleDeleteStage = (stageId: string) => {
    if (localConfig.stages.length > 1) {
      setLocalConfig({
        ...localConfig,
        stages: localConfig.stages.filter((stage) => stage.id !== stageId),
      });
    }
  };

  const handleMoveStage = (index: number, direction: "up" | "down") => {
    const newStages = [...localConfig.stages];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < newStages.length) {
      [newStages[index], newStages[targetIndex]] = [
        newStages[targetIndex],
        newStages[index],
      ];
      setLocalConfig({ ...localConfig, stages: newStages });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = localConfig.stages.findIndex(
        (stage) => stage.id === active.id
      );
      const newIndex = localConfig.stages.findIndex(
        (stage) => stage.id === over?.id
      );

      if (oldIndex !== -1 && newIndex !== -1) {
        setLocalConfig({
          ...localConfig,
          stages: arrayMove(localConfig.stages, oldIndex, newIndex),
        });
      }
    }
  };

  const handleSaveTemplate = () => {
    if (templateName.trim()) {
      const template = {
        id: generateId(),
        name: templateName.trim(),
        config: localConfig,
        createdAt: Date.now(),
      };
      dispatch({ type: "ADD_TEMPLATE", payload: template });
      setTemplateName("");
    }
  };

  const handleExportTemplate = () => {
    const templateData = {
      name: templateName || "Exported Template",
      config: localConfig,
      exportedAt: Date.now(),
    };
    const jsonString = JSON.stringify(templateData, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      // Could add a toast notification here
      console.log("Template copied to clipboard");
    });
  };

  const accentColors = [
    { id: "blue", name: "Blue", class: "text-blue-500" },
    { id: "red", name: "Red", class: "text-red-500" },
    { id: "green", name: "Green", class: "text-green-500" },
    { id: "yellow", name: "Yellow", class: "text-yellow-500" },
    { id: "purple", name: "Purple", class: "text-purple-500" },
    { id: "orange", name: "Orange", class: "text-orange-500" },
  ];

  return (
    <Sheet open={state.isConfigOpen} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Timer Configuration</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          {/* Rounds Configuration */}
          <div className="space-y-3 p-3 border rounded-lg bg-card">
            <h3 className="font-semibold">Rounds</h3>
            <div className="flex items-center justify-between">
              <Label htmlFor="infinite">Infinite Mode</Label>
              <Switch
                id="infinite"
                checked={localConfig.isInfinite}
                onCheckedChange={(checked) =>
                  setLocalConfig({ ...localConfig, isInfinite: checked })
                }
              />
            </div>

            {!localConfig.isInfinite && (
              <div>
                <Label htmlFor="rounds">Total Rounds</Label>
                <Input
                  id="rounds"
                  type="number"
                  min="1"
                  value={localConfig.totalRounds}
                  onChange={(e) =>
                    setLocalConfig({
                      ...localConfig,
                      totalRounds: Math.max(
                        1,
                        Number.parseInt(e.target.value) || 1
                      ),
                    })
                  }
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {/* Stages */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Stages</h3>
              <Button onClick={handleAddStage} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Stage
              </Button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={localConfig.stages.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {localConfig.stages.map((stage, index) => (
                    <CompactStageItem
                      key={stage.id}
                      stage={stage}
                      index={index}
                      onUpdate={handleUpdateStage}
                      onDelete={handleDeleteStage}
                      onMoveUp={() => handleMoveStage(index, "up")}
                      onMoveDown={() => handleMoveStage(index, "down")}
                      canMoveUp={index > 0}
                      canMoveDown={index < localConfig.stages.length - 1}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Audio & Feedback */}
          <div className="space-y-3 p-3 border rounded-lg bg-card">
            <h3 className="font-semibold">Audio & Feedback</h3>

            <div>
              <Label htmlFor="end-sound">End of Round Sound</Label>
              <Select
                value={localConfig.endOfRoundSoundId || "none"}
                onValueChange={(value) =>
                  setLocalConfig({
                    ...localConfig,
                    endOfRoundSoundId: value === "none" ? undefined : value,
                  })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select sound (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {availableSounds.map((sound) => (
                    <SelectItem key={sound.id} value={sound.id}>
                      {sound.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="vibration">Vibration Alerts</Label>
              <Switch
                id="vibration"
                checked={localConfig.enableVibration}
                onCheckedChange={(checked) =>
                  setLocalConfig({ ...localConfig, enableVibration: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="voice">Voice Announcements</Label>
              <Switch
                id="voice"
                checked={localConfig.enableVoiceAnnouncements}
                onCheckedChange={(checked) =>
                  setLocalConfig({
                    ...localConfig,
                    enableVoiceAnnouncements: checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="countdown">3-2-1 Countdown</Label>
              <Switch
                id="countdown"
                checked={localConfig.enableCountdown}
                onCheckedChange={(checked) =>
                  setLocalConfig({ ...localConfig, enableCountdown: checked })
                }
              />
            </div>
          </div>

          {/* Visual Effects */}
          <div className="space-y-3 p-3 border rounded-lg bg-card">
            <h3 className="font-semibold">Visual Effects</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="color-transition">Color Transition</Label>
              <Switch
                id="color-transition"
                checked={localConfig.enableColorTransition}
                onCheckedChange={(checked) =>
                  setLocalConfig({
                    ...localConfig,
                    enableColorTransition: checked,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="accent-color">Accent Color</Label>
              <Select
                value={localConfig.accentColor}
                onValueChange={(value) =>
                  setLocalConfig({ ...localConfig, accentColor: value })
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accentColors.map((color) => (
                    <SelectItem key={color.id} value={color.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${color.class.replace(
                            "text-",
                            "bg-"
                          )}`}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Save as Template */}
          <div className="space-y-3 p-3 border rounded-lg bg-card">
            <h3 className="font-semibold">Save as Template</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
              <Button
                onClick={handleSaveTemplate}
                disabled={!templateName.trim()}
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
            <Button
              onClick={handleExportTemplate}
              variant="outline"
              className="w-full bg-transparent"
            >
              Export Template (Copy JSON)
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2 sticky bottom-0 bg-background">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Apply Configuration
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

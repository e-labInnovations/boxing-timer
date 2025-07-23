import { useState } from "react";
import { Play, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSounds } from "@/hooks/use-sounds";
import { useTimer } from "@/contexts/timer-context";
import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";

interface SoundPickerProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  includeNone?: boolean;
  className?: string;
}

export function SoundPicker({
  label,
  value,
  onValueChange,
  id,
  placeholder = "Select sound",
  includeNone = false,
  className = "",
}: SoundPickerProps) {
  const [open, setOpen] = useState(false);
  const { availableSounds } = useSounds();
  const { playSound } = useTimer();

  const handlePlaySound = (soundId: string) => {
    if (soundId !== "none") {
      playSound(soundId);
    }
  };

  const handleSelectSound = (soundId: string) => {
    onValueChange(soundId);
    setOpen(false);
  };

  const getSelectedSoundName = () => {
    if (value === "none") return "None";
    const sound = availableSounds.find((s) => s.id === value);
    return sound?.name || placeholder;
  };

  const allOptions = [
    ...(includeNone ? [{ id: "none", name: "None" }] : []),
    ...availableSounds,
  ];

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor={id}>{label}</Label>
      </div>
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen} modal={true}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={open}
              className="flex-1 justify-between h-9 px-3"
            >
              <span className="truncate text-sm">{getSelectedSoundName()}</span>
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0" align="start">
            <ScrollArea className="h-[200px]">
              <div className="p-1 space-y-1">
                {allOptions.map((sound) => (
                  <div
                    key={sound.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-2 cursor-pointer hover:bg-muted/50 transition-colors rounded-sm",
                      value === sound.id && "bg-muted"
                    )}
                  >
                    <button
                      className="flex-1 text-left flex items-center gap-2 min-w-0"
                      onClick={() => handleSelectSound(sound.id)}
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          value === sound.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="flex-1 truncate text-sm">
                        {sound.name}
                      </span>
                    </button>
                    {sound.id !== "none" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handlePlaySound(sound.id);
                        }}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
        {value && value !== "none" && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 shrink-0"
            onClick={() => handlePlaySound(value)}
          >
            <Play className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

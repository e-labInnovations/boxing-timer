import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CounterUnit {
  value: number;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  presets?: number[];
  formatter?: (value: number) => string;
}

interface CounterProps {
  label: string;
  units: CounterUnit[];
  onChange: (values: number[]) => void;
  separator?: string;
  id?: string;
  className?: string;
}

export function Counter({
  label,
  units,
  onChange,
  separator,
  id,
  className = "",
}: CounterProps) {
  const [openPopovers, setOpenPopovers] = useState<boolean[]>(
    units.map(() => false)
  );

  const handleValueChange = (unitIndex: number, newValue: number) => {
    const unit = units[unitIndex];
    const clampedValue = Math.max(
      unit.min ?? 0,
      Math.min(unit.max ?? 999, newValue)
    );

    const newValues = units.map((_, index) =>
      index === unitIndex ? clampedValue : units[index].value
    );
    onChange(newValues);
  };

  const handlePresetSelect = (unitIndex: number, presetValue: number) => {
    handleValueChange(unitIndex, presetValue);
    setOpenPopovers((prev) =>
      prev.map((open, index) => (index === unitIndex ? false : open))
    );
  };

  const togglePopover = (unitIndex: number, open: boolean) => {
    setOpenPopovers((prev) =>
      prev.map((prevOpen, index) => (index === unitIndex ? open : prevOpen))
    );
  };

  const isSingleUnit = units.length === 1;
  const buttonSize = isSingleUnit ? "h-10 w-10" : "h-8 w-8";
  const iconSize = isSingleUnit ? "h-4 w-4" : "h-3 w-3";
  const valueSize = isSingleUnit ? "text-3xl" : "text-xl";

  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      <div
        className={`flex items-center mt-1 ${
          isSingleUnit ? "justify-center gap-4" : "gap-3"
        }`}
      >
        {units.map((unit, index) => (
          <div key={index} className="flex items-center gap-2">
            {/* Unit Counter */}
            <div
              className={`flex items-center justify-center space-x-2 ${
                isSingleUnit ? "w-full" : ""
              }`}
            >
              <Button
                variant="outline"
                size="icon"
                className={`${buttonSize} shrink-0 rounded-full`}
                onClick={() =>
                  handleValueChange(index, unit.value - (unit.step ?? 1))
                }
                disabled={unit.value <= (unit.min ?? 0)}
              >
                <Minus className={iconSize} />
                <span className="sr-only">Decrease {unit.label}</span>
              </Button>

              <div
                className={`flex-1 text-center ${
                  isSingleUnit ? "min-w-[100px]" : "min-w-[60px]"
                }`}
              >
                {unit.presets ? (
                  <Popover
                    open={openPopovers[index]}
                    onOpenChange={(open) => togglePopover(index, open)}
                  >
                    <PopoverTrigger asChild>
                      <button className="hover:bg-muted/50 rounded p-2 transition-colors">
                        <div
                          className={`${valueSize} font-bold tracking-tighter`}
                        >
                          {unit.formatter
                            ? unit.formatter(unit.value)
                            : unit.value}
                        </div>
                        <div className="text-muted-foreground text-[0.65rem] uppercase">
                          {unit.label}
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className={unit.presets.length > 8 ? "w-48" : "w-32"}
                    >
                      <div
                        className={`grid gap-2 ${
                          unit.presets.length > 8
                            ? "grid-cols-4"
                            : "grid-cols-2"
                        }`}
                      >
                        {unit.presets.map((preset) => (
                          <Button
                            key={preset}
                            variant={
                              unit.value === preset ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => handlePresetSelect(index, preset)}
                            className="h-8"
                          >
                            {unit.formatter ? unit.formatter(preset) : preset}
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <>
                    <div className={`${valueSize} font-bold tracking-tighter`}>
                      {unit.formatter ? unit.formatter(unit.value) : unit.value}
                    </div>
                    <div className="text-muted-foreground text-[0.65rem] uppercase">
                      {unit.label}
                    </div>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                className={`${buttonSize} shrink-0 rounded-full`}
                onClick={() =>
                  handleValueChange(index, unit.value + (unit.step ?? 1))
                }
                disabled={unit.value >= (unit.max ?? 999)}
              >
                <Plus className={iconSize} />
                <span className="sr-only">Increase {unit.label}</span>
              </Button>
            </div>

            {/* Separator */}
            {separator && index < units.length - 1 && (
              <div className="text-2xl font-bold text-muted-foreground px-1">
                {separator}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

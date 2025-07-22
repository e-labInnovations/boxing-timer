import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimePickerProps {
  value: number; // seconds
  onChange: (seconds: number) => void;
  label?: string;
  id?: string;
}

export function TimePicker({ value, onChange, label, id }: TimePickerProps) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  const handleMinutesChange = (newMinutes: string) => {
    const mins = Number.parseInt(newMinutes) || 0;
    onChange(mins * 60 + seconds);
  };

  const handleSecondsChange = (newSeconds: string) => {
    const secs = Number.parseInt(newSeconds) || 0;
    onChange(minutes * 60 + secs);
  };

  // Generate options for minutes (0-59) and seconds (0-59)
  const minuteOptions = Array.from({ length: 60 }, (_, i) => i);
  const secondOptions = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select
            value={minutes.toString()}
            onValueChange={handleMinutesChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {minuteOptions.map((min) => (
                <SelectItem key={min} value={min.toString()}>
                  {min.toString().padStart(2, "0")}m
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-muted-foreground">:</span>

        <div className="flex-1">
          <Select
            value={seconds.toString()}
            onValueChange={handleSecondsChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-48">
              {secondOptions.map((sec) => (
                <SelectItem key={sec} value={sec.toString()}>
                  {sec.toString().padStart(2, "0")}s
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

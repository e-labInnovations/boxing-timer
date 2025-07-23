import { Counter } from "@/components/ui/counter";

interface TimePickerProps {
  value: number; // seconds
  onChange: (seconds: number) => void;
  label?: string;
  id?: string;
}

export function TimePicker({ value, onChange, label, id }: TimePickerProps) {
  const minutes = Math.floor(value / 60);
  const seconds = value % 60;

  // Common fitness time presets
  const commonMinutes = [0, 1, 2, 3, 5, 10, 12, 15, 20, 30, 45, 60];
  const commonSeconds = [0, 15, 30, 45];

  const handleChange = (values: number[]) => {
    const [newMinutes, newSeconds] = values;
    onChange(newMinutes * 60 + newSeconds);
  };

  const padZero = (num: number) => num.toString().padStart(2, "0");

  return (
    <Counter
      label={label || "Duration"}
      units={[
        {
          value: minutes,
          label: "min",
          min: 0,
          max: 59,
          step: 1,
          presets: commonMinutes,
          formatter: padZero,
        },
        {
          value: seconds,
          label: "sec",
          min: 0,
          max: 59,
          step: 1,
          presets: commonSeconds,
          formatter: padZero,
        },
      ]}
      onChange={handleChange}
      separator=":"
      id={id}
      className="space-y-2"
    />
  );
}

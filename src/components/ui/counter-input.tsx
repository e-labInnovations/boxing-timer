import { Counter } from "./counter";

interface CounterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  presets?: number[];
  id?: string;
  className?: string;
}

export function CounterInput({
  label,
  value,
  onChange,
  min = 1,
  max = 999,
  step = 1,
  presets,
  id,
  className = "",
}: CounterInputProps) {
  const handleChange = (values: number[]) => {
    onChange(values[0]);
  };

  return (
    <div className={className}>
      <Counter
        label={label}
        units={[
          {
            value,
            label: label.toLowerCase(),
            min,
            max,
            step,
            presets,
          },
        ]}
        onChange={handleChange}
        id={id}
        className="w-full"
      />
    </div>
  );
}

import * as React from "react";

interface SliderProps {
  value: [number];
  onValueChange?: (value: [number]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function Slider({
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = "",
}: SliderProps) {
  return (
    <div className={["w-full", className].filter(Boolean).join(" ")}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={(e) =>
          onValueChange?.([Number(e.target.value) as number])
        }
        className="w-full accent-primary"
      />
    </div>
  );
}


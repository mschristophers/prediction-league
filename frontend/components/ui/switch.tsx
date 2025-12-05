import * as React from "react";

interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  id?: string;
}

export function Switch({ checked, onCheckedChange, id }: SwitchProps) {
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={[
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
        checked ? "bg-emerald-500" : "bg-slate-700",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform",
          checked ? "translate-x-4" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}


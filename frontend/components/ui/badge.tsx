import * as React from "react";

type Variant = "default" | "secondary" | "outline";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-slate-800 text-slate-100",
  outline: "border border-slate-700 text-slate-200",
};

export function Badge({
  className = "",
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <div
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}


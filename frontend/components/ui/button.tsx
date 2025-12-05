import * as React from "react";

type Variant = "default" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  asChild?: boolean;
}

const baseClasses =
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 disabled:opacity-60 disabled:pointer-events-none";

const variantClasses: Record<Variant, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline:
    "border border-slate-700 bg-transparent text-slate-100 hover:bg-slate-800/60",
  ghost: "bg-transparent text-slate-200 hover:bg-slate-800/60",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "md", asChild, ...props }, ref) => {
    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (asChild) {
      const Comp = (props as any).as || "button";
      return <Comp ref={ref} className={classes} {...props} />;
    }

    return <button ref={ref} className={classes} {...props} />;
  }
);

Button.displayName = "Button";


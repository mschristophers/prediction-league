import * as React from "react";

export function Skeleton({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[
        "animate-pulse rounded-md bg-slate-800/70",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}


import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "gold" | "cyan" | "purple" | "emerald" | "rose" | "slate";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800 text-slate-300 border-slate-700",
    gold: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    cyan: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
    emerald: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    slate: "bg-slate-800/80 text-slate-400 border-slate-700",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2 py-0.5 font-medium",
    md: "text-xs px-2.5 py-1 font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border tracking-wide uppercase",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

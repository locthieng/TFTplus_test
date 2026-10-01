import React from "react";
import { cn } from "@/utils/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: "none" | "gold" | "cyan" | "purple";
}

export function Card({
  className,
  hoverEffect = false,
  glow = "none",
  children,
  ...props
}: CardProps) {
  const glowStyles = {
    none: "",
    gold: "shadow-lg shadow-amber-500/10 border-amber-500/30",
    cyan: "shadow-lg shadow-cyan-500/10 border-cyan-500/30",
    purple: "shadow-lg shadow-purple-500/10 border-purple-500/30",
  };

  return (
    <div
      className={cn(
        "bg-[#131924] border border-[#222c3d] rounded-xl text-slate-200 transition-all duration-200",
        hoverEffect && "hover:border-[#384863] hover:bg-[#18202e] hover:shadow-xl",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-4 border-b border-[#222c3d]/60 flex items-center justify-between", className)}
      {...props}
    />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4", className)} {...props} />;
}

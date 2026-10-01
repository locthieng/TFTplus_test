import React from "react";
import { cn } from "@/utils/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[#1d2636]/70 border border-[#2b394f]/30",
        className
      )}
      {...props}
    />
  );
}

export function TeamCompCardSkeleton() {
  return (
    <div className="bg-[#131924] border border-[#222c3d] rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="w-36 h-5" />
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
        <Skeleton className="w-16 h-6 rounded-md" />
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="w-12 h-12 rounded-lg" />
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-[#222c3d]/60">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-16 h-5 rounded-md" />
        ))}
      </div>
    </div>
  );
}

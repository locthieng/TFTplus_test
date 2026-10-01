"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

export interface DataErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function DataErrorState({
  title = "Failed to load data",
  message,
  onRetry,
  className = "",
}: DataErrorStateProps) {
  return (
    <div
      className={`rounded-2xl border border-rose-500/20 bg-[#141722]/80 backdrop-blur-sm p-8 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto my-8 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-slate-100">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {message}
        </p>
      </div>

      {onRetry && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onRetry}
          className="gap-2 cursor-pointer border-rose-500/20 hover:border-rose-400/40 text-slate-200"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}

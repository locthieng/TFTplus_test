"use client";

import React, { useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";
import { cn } from "@/utils/cn";

export type StaticImport = StaticImageData | { default: StaticImageData };

export interface GameImageProps extends Omit<ImageProps, "onError" | "src"> {
  src?: string | StaticImport | null;
  fallbackSrc?: string;
  fallbackText?: string;
  containerClassName?: string;
}

// Sleek dark SVG placeholder for fallback
const DEFAULT_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100%25' height='100%25' fill='%23131b28'/%3E%3Cpath d='M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z' fill='%231a2436' stroke='%232b3c58' stroke-width='2'/%3E%3Ccircle cx='50' cy='50' r='10' fill='%23f59e0b' opacity='0.4'/%3E%3C/svg%3E";

export function GameImage({
  src,
  alt,
  fallbackSrc = DEFAULT_PLACEHOLDER,
  fallbackText,
  className,
  containerClassName,
  ...props
}: GameImageProps) {
  const [error, setError] = useState(false);

  // If no source provided or failed to load
  const finalSrc = !src || error ? fallbackSrc : src;

  return (
    <span
      className={cn(
        "inline-block relative overflow-hidden select-none",
        containerClassName
      )}
    >
      <Image
        {...props}
        src={finalSrc}
        alt={alt || "TFT Asset"}
        className={cn(className, error ? "opacity-75" : "")}
        onError={() => setError(true)}
        unoptimized
      />
      {error && fallbackText && (
        <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-amber-400/80 bg-black/60 text-center px-0.5">
          {fallbackText}
        </span>
      )}
    </span>
  );
}

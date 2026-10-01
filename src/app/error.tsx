"use client";

import React, { useEffect } from "react";
import { DataErrorState } from "@/components/common/DataErrorState";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
      <DataErrorState
        title="Unable to load page"
        message={
          error.message ||
          "An unexpected error occurred while loading this page. Please try again."
        }
        onRetry={() => reset()}
      />
    </div>
  );
}

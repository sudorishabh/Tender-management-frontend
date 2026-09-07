"use client";

import { LoaderCircle } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface PageLoadingProps {
  /**
   * Optional message to display below the spinner
   */
  message?: string;
  /**
   * Size variant of the loader
   * - "sm": Small loader (24px)
   * - "md": Medium loader (32px) - default
   * - "lg": Large loader (48px)
   */
  size?: "sm" | "md" | "lg";
  /**
   * Whether to display as fullscreen (min-h-screen) or container-based
   */
  fullScreen?: boolean;
  /**
   * Additional className for the container
   */
  className?: string;
}

const sizeMap = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const PageLoading = ({
  message,
  size = "md",
  fullScreen = false,
  className,
}: PageLoadingProps) => {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-center",
        fullScreen ? "min-h-screen" : "mt-40",
        className
      )}
      aria-busy="true"
      aria-label={message || "Loading content"}>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          {/* Primary spinner */}
          <LoaderCircle
            className={cn(
              "animate-spin text-primary",
              sizeMap[size]
            )}
          />
          {/* Subtle glow effect */}
          <div
            className={cn(
              "absolute inset-0 rounded-full blur-md bg-primary/20 animate-pulse",
              sizeMap[size]
            )}
          />
        </div>
        {message && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default PageLoading;

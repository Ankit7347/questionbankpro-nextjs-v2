// src/app/components/ui/GlassCard.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { Card as BaseCard } from "./card";

export interface GlassCardProps extends React.ComponentProps<typeof BaseCard> {}

/**
 * A simple wrapper around the base `Card` that adds a glassmorphic
 * background and some helper utilities.  Use this when you want a
 * frosted/glass effect without retyping the same Tailwind classes.
 *
 * The styles mimic the scheme used in `CourseCard` but can be used
 * anywhere generic content is rendered.
 */
export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <BaseCard
      className={cn(
        "relative overflow-hidden bg-white/15 dark:bg-slate-900/40",
        "backdrop-blur-xl backdrop-saturate-150",
        "border border-white/20 dark:border-white/10 shadow-sm",
        className
      )}
      {...props}
    >
      {/* overlay positioned behind the content */}
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />

      {/* content wrapper ensures anything passed in sits above the overlay */}
      <div className="relative z-10">
        {children}
      </div>
    </BaseCard>
  );
}

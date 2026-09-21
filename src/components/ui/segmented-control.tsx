import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = {
  value: T;
  label: React.ReactNode;
  count?: number;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

/**
 * Horizontal filter/segment control with a sliding active indicator.
 * Replaces the hand-rolled category pill rows (HelpBoard, OriginsLab).
 */
function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  size = "default",
  "aria-label": ariaLabel,
}: {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "default";
  "aria-label"?: string;
}) {
  // Scopes the shared layoutId so multiple controls on one page don't animate
  // their indicators into each other.
  const groupId = React.useId();

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "custom-scrollbar flex items-center gap-1 overflow-x-auto",
        "rounded-control border border-rule bg-notice p-1",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "relative flex shrink-0 items-center gap-1.5 rounded-control font-medium",
              "transition-colors duration-150 ease-app",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              size === "sm" ? "px-2.5 py-1 text-[12px]" : "px-3 py-1.5 text-[13px]",
              isActive ? "text-sage" : "text-chalk-2 hover:text-chalk",
            )}
          >
            {isActive && (
              <motion.span
                layoutId={`segmented-${groupId}`}
                className="absolute inset-0 rounded-control border border-sage/30 bg-sage-wash"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span className="relative flex items-center gap-1.5">
              {Icon && <Icon className="size-3.5" strokeWidth={1.8} />}
              {option.label}
              {option.count !== undefined && (
                <span
                  className={cn(
                    "ml-0.5 tabular-nums",
                    isActive ? "text-sage/70" : "text-chalk-3",
                  )}
                >
                  {option.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { SegmentedControl };

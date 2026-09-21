import * as React from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * The shared UI states. The app previously rendered loading, empty and error
 * states ad hoc per screen (or omitted them), so this centralises them.
 */

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-control bg-notice", className)}
      {...props}
    />
  );
}

/** Placeholder matching the shape of a feed/grid card. */
function SkeletonCard({ className }: { className?: string }) {
  return (
    <Card className={cn("flex flex-col gap-4 p-5", className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                */
/* -------------------------------------------------------------------------- */

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      variant="dashed"
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <div className="mb-1 flex size-10 items-center justify-center rounded-control border border-rule bg-notice">
          <Icon className="size-5 text-chalk-3" strokeWidth={1.6} />
        </div>
      )}
      <p className="text-[15px] font-medium text-chalk">{title}</p>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-chalk-2">
          {description}
        </p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function LoadingState({
  label = "Loading…",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center justify-center gap-2.5 px-6 py-14 text-sm text-chalk-2",
        className,
      )}
    >
      <Loader2 className="size-4 animate-spin text-sage" aria-hidden="true" />
      {label}
    </div>
  );
}

/** Inline spinner for buttons, rows and composers. */
function Spinner({ className }: { className?: string }) {
  return (
    <Loader2
      className={cn("size-4 animate-spin", className)}
      aria-hidden="true"
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Error state                                                                */
/* -------------------------------------------------------------------------- */

function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col items-center gap-3 border-clay/25 bg-clay-wash px-6 py-12 text-center",
        className,
      )}
      role="alert"
    >
      <p className="text-[15px] font-medium text-chalk">{title}</p>
      {description && (
        <p className="max-w-sm text-sm leading-relaxed text-chalk-2">
          {description}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-1" onClick={onRetry}>
          Try again
        </Button>
      )}
    </Card>
  );
}

/** Compact inline form/section error. */
function InlineError({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      role="alert"
      className={cn("text-[13px] leading-snug text-clay", className)}
    >
      {children}
    </p>
  );
}

export {
  Skeleton,
  SkeletonCard,
  EmptyState,
  LoadingState,
  Spinner,
  ErrorState,
  InlineError,
};

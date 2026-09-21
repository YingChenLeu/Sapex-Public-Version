import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 whitespace-nowrap",
    "rounded-notice border px-2 py-0.5 text-[11px] font-medium leading-4",
    "[&>svg]:pointer-events-none [&>svg]:size-3",
  ],
  {
    variants: {
      variant: {
        default: "border-rule-strong bg-notice text-chalk-2",
        /* Academic / system register. */
        sage: "border-sage/30 bg-sage-wash text-sage",
        /* Something happening right now. */
        live: "border-signal/30 bg-signal-wash text-signal",
        /* The human / peer register. */
        community: "border-brass/30 bg-brass-wash text-brass",
        danger: "border-clay/30 bg-clay-wash text-clay",
        outline: "border-rule-strong bg-transparent text-chalk-2",
        solid: "border-transparent bg-chalk text-board",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

/**
 * Small coloured dot for online / status indicators, so the app stops
 * reimplementing this with one-off spans.
 */
function StatusDot({
  status = "neutral",
  className,
  ...props
}: React.ComponentProps<"span"> & {
  status?: "online" | "busy" | "away" | "neutral";
}) {
  const tone = {
    online: "bg-signal",
    busy: "bg-clay",
    away: "bg-brass",
    neutral: "bg-chalk-3",
  }[status];

  return (
    <span
      data-slot="status-dot"
      className={cn("inline-block size-2 shrink-0 rounded-full", tone, className)}
      {...props}
    />
  );
}

export { Badge, StatusDot, badgeVariants };

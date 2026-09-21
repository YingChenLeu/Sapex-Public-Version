import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
    "rounded-control font-medium",
    "transition-[background-color,border-color,color,opacity] duration-150 ease-app",
    "disabled:pointer-events-none disabled:opacity-40",
    "outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        /* A paper notice pinned to a dark board. */
        default: "bg-chalk text-board hover:bg-white",
        /* The community register: joining, helping, posting for others. */
        brass: "bg-brass text-board hover:bg-brass/90",
        outline:
          "border border-rule-strong bg-transparent text-chalk hover:border-chalk-3 hover:bg-notice",
        secondary:
          "bg-notice text-chalk border border-rule hover:border-rule-strong",
        ghost: "bg-transparent text-chalk-2 hover:bg-notice hover:text-chalk",
        destructive: "bg-clay text-white hover:bg-clay/90",
        "destructive-ghost":
          "bg-transparent text-chalk-2 hover:bg-clay-wash hover:text-clay",
        /* Reads as prose, not chrome. */
        link: "bg-transparent text-sage underline decoration-sage/35 decoration-1 underline-offset-4 hover:decoration-sage",
      },
      size: {
        sm: "h-8 gap-1.5 px-3 text-[13px]",
        default: "h-9 px-4 text-sm",
        lg: "h-11 px-6 text-[15px]",
        icon: "size-9",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    loading?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={Comp === "button" ? disabled || loading : undefined}
      {...props}
    >
      {/* asChild forwards to a single child, so the spinner can only be
          injected for real button elements. */}
      {loading && Comp === "button" ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {children}
        </>
      ) : (
        children
      )}
    </Comp>
  );
}

export { Button, buttonVariants };

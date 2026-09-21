import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        data-slot="input"
        className={cn(
          "flex h-9 w-full min-w-0 rounded-control border border-rule-strong bg-recess px-3 py-2",
          "text-sm text-chalk",
          "transition-[border-color,box-shadow] duration-150 ease-app",
          "hover:border-chalk-3",
          "focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/25",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Native validation + Radix/aria error styling share one look.
          "aria-invalid:border-clay aria-invalid:ring-2 aria-invalid:ring-clay/20",
          "file:mr-3 file:h-7 file:cursor-pointer file:rounded file:border-0 file:bg-notice file:px-2.5 file:text-[13px] file:font-medium file:text-chalk",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };

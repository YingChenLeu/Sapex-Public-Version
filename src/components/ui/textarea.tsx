import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-20 w-full rounded-control border border-rule-strong bg-recess px-3 py-2.5",
        "text-sm leading-relaxed text-chalk",
        "transition-[border-color,box-shadow] duration-150 ease-app",
        "hover:border-chalk-3",
        "focus-visible:border-sage focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage/25",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-clay aria-invalid:ring-2 aria-invalid:ring-clay/20",
        "resize-y field-sizing-content",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };

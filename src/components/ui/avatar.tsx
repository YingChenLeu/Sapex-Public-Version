import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    data-slot="avatar"
    className={cn(
      "relative flex size-9 shrink-0 overflow-hidden rounded-full",
      "ring-1 ring-inset ring-white/10",
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    loading="eager"
    className={cn("aspect-square size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/* A fixed palette tuned for the dark surfaces, rather than Tailwind's
   saturated 500s. Index is derived from the fallback text so a given user
   keeps the same colour across renders and sessions. */
const FALLBACK_TONES = [
  "bg-[#2C4A63] text-[#BEDCF0]",
  "bg-[#2F4F45] text-[#B6E5D3]",
  "bg-[#4A3B63] text-[#D6C8F0]",
  "bg-[#5A3F4A] text-[#F2C9D5]",
  "bg-[#5A4A2E] text-[#F0DCB0]",
  "bg-[#2E4A54] text-[#B8DDE8]",
  "bg-[#463A56] text-[#CFC2E4]",
  "bg-[#3E4A2F] text-[#D3E5B4]",
] as const;

function toneFor(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return FALLBACK_TONES[Math.abs(hash) % FALLBACK_TONES.length];
}

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, children, ...props }, ref) => {
  // Previously this picked at random on every render, so a user's avatar
  // colour changed on each re-render. Derive it from the initials instead.
  const seed = React.useMemo(
    () => (typeof children === "string" ? children : String(children ?? "?")),
    [children],
  );

  return (
    <AvatarPrimitive.Fallback
      ref={ref}
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full",
        "text-xs font-semibold uppercase",
        toneFor(seed),
        className,
      )}
      {...props}
    >
      {children}
    </AvatarPrimitive.Fallback>
  );
});
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };

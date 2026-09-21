import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Layout primitives for every signed-in page.
 *
 * Before this existed each page hardcoded its own sidebar offset
 * (`pl-[74px] sm:pl-[92px]`, `sm:pl-[96px]`, `pl-[80px]`, `pl-[0px]`…), which
 * is why content never lined up between screens. Pages now use `AppPage` and
 * inherit the gutter from the `--app-gutter` custom property that
 * SidebarProvider keeps in sync.
 */

const CONTENT_WIDTHS = {
  /* Forms, single-column reading. */
  narrow: "max-w-2xl",
  /* Detail screens, profile. */
  default: "max-w-5xl",
  /* Dense grids and feeds. */
  wide: "max-w-[1400px]",
  /* Chat and other full-bleed surfaces. */
  full: "max-w-none",
} as const;

type AppPageProps = React.HTMLAttributes<HTMLDivElement> & {
  width?: keyof typeof CONTENT_WIDTHS;
  /** Set for pages that render their own full-height scroll container. */
  flush?: boolean;
};

const AppPage = React.forwardRef<HTMLDivElement, AppPageProps>(
  ({ className, width = "default", flush = false, children, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="app-page"
      className={cn("app-gutter min-h-screen bg-transparent", className)}
      {...props}
    >
      <div
        className={cn(
          "mx-auto w-full",
          CONTENT_WIDTHS[width],
          !flush && "px-5 pb-20 pt-10 sm:px-8",
        )}
      >
        {children}
      </div>
    </div>
  ),
);
AppPage.displayName = "AppPage";

/**
 * Page masthead on the ruled page: the margin carries the section the user is
 * in, the body carries the title and any actions. No entrance animation — the
 * page-load sequence belongs to the hero, not to every screen.
 */
function PageHeader({
  margin,
  title,
  description,
  actions,
  className,
}: {
  /** Short marginal note: where this screen sits in the product. */
  margin?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("ruled mb-10", className)}>
      <div className="ruled-margin">{margin}</div>
      <div className="ruled-body">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0">
            <h1 className="display-3 text-chalk">{title}</h1>
            {description && (
              <p className="measure mt-3 text-sm leading-relaxed text-chalk-2">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/** A titled block within a page, giving every screen the same section rhythm. */
function Section({
  title,
  description,
  actions,
  className,
  children,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("mb-12", className)}>
      {(title || actions) && (
        <div className="mb-5 flex items-end justify-between gap-4 border-b border-rule pb-3">
          <div className="min-w-0">
            {title && (
              <h2 className="font-sans text-[13px] font-semibold tracking-normal text-chalk">
                {title}
              </h2>
            )}
            {description && (
              <p className="measure mt-1 text-[13px] leading-relaxed text-chalk-2">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

export { AppPage, PageHeader, Section, CONTENT_WIDTHS };

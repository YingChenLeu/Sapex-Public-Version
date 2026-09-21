import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  RYC_DISCLAIMER,
  RYCVerdict,
  VERDICT_META,
} from "@/lib/rateYourChance";

export function VerdictStamp({
  verdict,
  className,
}: {
  verdict: RYCVerdict | null;
  className?: string;
}) {
  if (!verdict) return null;
  const meta = VERDICT_META[verdict];
  return (
    <span
      className={cn(
        "inline-flex rotate-[-7deg] items-center border-[1.5px] px-1.5 py-0.5 font-display text-[11px] font-semibold tracking-[0.08em] uppercase",
        className,
      )}
      style={{ color: meta.color, borderColor: meta.color }}
    >
      {meta.label}
    </span>
  );
}

export function ChanceScale({
  value,
  className,
}: {
  value: number | null;
  className?: string;
}) {
  const pct = value === null ? 0 : Math.max(0, Math.min(100, value));
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] text-chalk-3">Crowd chance</span>
        <span className="numeric text-sm text-chalk">
          {value === null ? "—" : `${value}%`}
        </span>
      </div>
      <div className="mt-2 h-px bg-rule-strong">
        <div
          className="h-px bg-brass"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function SpecCell({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[12px] text-chalk-3">{label}</p>
      <p className="numeric mt-0.5 truncate text-sm text-chalk">{value}</p>
    </div>
  );
}

export function Disclaimer({ className }: { className?: string }) {
  return (
    <aside
      className={cn(
        "flex items-start gap-3 border border-brass/25 bg-brass-wash px-4 py-3",
        className,
      )}
    >
      <ShieldAlert
        className="mt-0.5 size-4 shrink-0 text-brass"
        strokeWidth={1.7}
      />
      <p className="text-[13px] leading-relaxed text-chalk-2">
        {RYC_DISCLAIMER}
      </p>
    </aside>
  );
}

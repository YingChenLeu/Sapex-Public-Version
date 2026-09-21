import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface DemoFrameProps {
  badge?: string;
  accent?: string;
  children: ReactNode;
  contentHeight?: number;
}

const DemoFrame = ({
  badge = "Sapex",
  accent = "#A8D3CC",
  children,
  contentHeight = 380,
}: DemoFrameProps) => {
  return (
    <div
      className="relative mx-auto w-full max-w-[360px] select-none pointer-events-none"
      aria-hidden
    >
      <motion.div
        className="absolute -inset-8 rounded-[40px] blur-2xl"
        style={{
          background: `radial-gradient(60% 55% at 50% 35%, ${accent}33, transparent 70%)`,
        }}
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1E2430]/95 shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.025] px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            />
            <span className="truncate font-syncopate text-[10px] uppercase tracking-[0.18em] text-[#F0F2F2]/70">
              {badge}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        <div
          className="relative w-full overflow-hidden"
          style={{ height: contentHeight }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default DemoFrame;

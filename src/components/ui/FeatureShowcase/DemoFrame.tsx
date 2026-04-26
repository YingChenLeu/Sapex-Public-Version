import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface DemoFrameProps {
  badge?: string;
  accent?: string;
  children: ReactNode;
  /** Height of the inner content area in pixels. */
  contentHeight?: number;
}

/**
 * Decorative, non-interactive container for showcasing feature animations.
 * Renders a small "device-like" window chrome around its children.
 * Children are absolutely positioned and fill the inner content area.
 */
const DemoFrame = ({
  badge = "Sapex",
  accent = "#A8D3CC",
  children,
  contentHeight = 380,
}: DemoFrameProps) => {
  return (
    <div
      className="relative w-full max-w-[360px] mx-auto select-none pointer-events-none"
      aria-hidden
    >
      {/* Soft accent glow behind the frame */}
      <motion.div
        className="absolute -inset-8 rounded-[40px] blur-2xl"
        style={{
          background: `radial-gradient(60% 55% at 50% 35%, ${accent}33, transparent 70%)`,
        }}
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative rounded-[28px] border border-white/10 bg-[#0C111C]/95 shadow-2xl shadow-black/40 overflow-hidden backdrop-blur-sm">
        {/* Window chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/[0.025]">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ background: accent, boxShadow: `0 0 8px ${accent}` }}
            />
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#D8DEDE]/70 font-syncopate truncate">
              {badge}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
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

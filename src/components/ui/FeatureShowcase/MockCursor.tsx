import { motion, useReducedMotion } from "framer-motion";

export type CursorWaypoint = {
  /** Time in seconds since the cursor mounts. */
  t: number;
  /** Horizontal position as a percentage of the parent (0–100). */
  x: number;
  /** Vertical position as a percentage of the parent (0–100). */
  y: number;
  /** Show a click ripple at this waypoint. */
  click?: boolean;
};

interface MockCursorProps {
  waypoints: CursorWaypoint[];
  /**
   * Optional override for the easing of the cursor movement.
   * Defaults to a smooth, slightly-overshooting ease.
   */
  ease?: "easeInOut" | "easeOut" | "easeIn" | "linear";
}

/**
 * Decorative cursor that traces a path of waypoints inside its (relatively
 * positioned) parent. The cursor is purely visual — pointer-events disabled.
 *
 * Waypoint times are in seconds and assumed to be monotonically increasing.
 * Position values are percentages so the cursor scales with the parent.
 */
const MockCursor = ({ waypoints, ease = "easeInOut" }: MockCursorProps) => {
  const reduce = useReducedMotion();
  if (waypoints.length === 0) return null;

  const last = waypoints[waypoints.length - 1];
  const totalDuration = Math.max(last.t, 0.01);
  const xs = waypoints.map((w) => `${w.x}%`);
  const ys = waypoints.map((w) => `${w.y}%`);
  const times = waypoints.map((w) => w.t / totalDuration);

  // Reduced motion: just snap to the first waypoint, no animation.
  if (reduce) {
    return (
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          left: `${waypoints[0].x}%`,
          top: `${waypoints[0].y}%`,
          width: 14,
          height: 18,
        }}
      >
        <CursorIcon />
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="absolute z-30 pointer-events-none"
        style={{ width: 14, height: 18 }}
        initial={{ opacity: 0, left: xs[0], top: ys[0] }}
        animate={{
          opacity: [0, 1, 1, 1],
          left: xs,
          top: ys,
        }}
        transition={{
          opacity: { duration: 0.3, times: [0, 0.05, 0.95, 1] },
          left: { duration: totalDuration, times, ease },
          top: { duration: totalDuration, times, ease },
        }}
      >
        <CursorIcon />
        {waypoints.map((w, i) =>
          w.click ? (
            <ClickRipple key={i} delay={w.t} />
          ) : null,
        )}
      </motion.div>
    </>
  );
};

const CursorIcon = () => (
  <svg
    width="14"
    height="18"
    viewBox="0 0 14 18"
    className="drop-shadow-[0_2px_3px_rgba(0,0,0,0.6)]"
    aria-hidden
  >
    <path
      d="M1 1 L1 14 L4.2 11 L6.7 16.5 L9 15.5 L6.5 10 L11 10 Z"
      fill="white"
      stroke="#0A0D17"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
  </svg>
);

const ClickRipple = ({ delay }: { delay: number }) => (
  <motion.span
    className="absolute rounded-full border-2 border-white"
    style={{
      left: -8,
      top: -2,
      width: 24,
      height: 24,
      mixBlendMode: "screen",
    }}
    initial={{ opacity: 0, scale: 0.4 }}
    animate={{ opacity: [0, 0.85, 0], scale: [0.4, 1.4, 1.7] }}
    transition={{
      delay,
      duration: 0.55,
      times: [0, 0.4, 1],
      ease: "easeOut",
    }}
  />
);

export default MockCursor;

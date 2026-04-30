import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { REGIONS, RegionId } from "@/lib/rateYourChance";

type WorldRegionMapProps = {
  selected: RegionId | null;
  counts?: Partial<Record<RegionId, number>>;
  onSelect: (regionId: RegionId | null) => void;
  className?: string;
};

const ACCENT = "#7CDCBD";

const LANDMASSES = [
  "M114 128C142 95 196 86 244 100C267 107 287 123 293 143C298 159 290 175 269 181C250 187 239 196 223 207C192 228 148 229 121 208C102 193 95 171 97 151C98 141 103 134 114 128Z",
  "M265 216C285 225 305 242 319 264C336 291 344 327 334 361C330 375 321 389 309 397C300 403 290 400 286 388C282 372 275 354 262 334C249 313 241 284 245 254C248 238 255 224 265 216Z",
  "M435 112C455 98 492 93 520 96C548 98 575 112 584 134C589 147 581 159 564 163C541 168 523 167 506 174C490 181 477 193 459 192C443 191 425 184 419 169C412 153 419 125 435 112Z",
  "M512 184C533 178 564 184 585 199C610 217 626 250 623 280C621 304 611 326 593 344C580 358 562 368 547 365C532 361 532 341 536 325C542 299 534 279 521 260C510 243 497 226 497 208C498 197 503 188 512 184Z",
  "M618 116C647 98 693 97 735 108C771 118 802 138 816 165C823 179 815 194 798 199C770 207 748 206 727 216C710 224 694 240 673 240C650 238 625 228 612 208C599 187 600 134 618 116Z",
  "M706 247C728 236 757 240 777 255C793 267 800 287 791 302C780 321 760 328 741 326C723 323 708 310 700 292C694 276 696 253 706 247Z",
  "M835 334C856 324 889 324 914 335C933 344 942 362 935 378C926 396 899 405 871 399C847 394 827 378 825 361C824 349 827 340 835 334Z",
] as const;

const REGION_LABELS: Record<
  RegionId,
  { dx: number; dy: number; align: "start" | "middle" | "end" }
> = {
  "north-america": { dx: -56, dy: -38, align: "end" },
  "latin-america": { dx: -34, dy: 24, align: "end" },
  "western-europe": { dx: -36, dy: -28, align: "end" },
  "eastern-europe": { dx: 20, dy: -30, align: "start" },
  mena: { dx: 20, dy: 4, align: "start" },
  "sub-saharan-africa": { dx: 18, dy: 28, align: "start" },
  "central-asia": { dx: 18, dy: -28, align: "start" },
  "south-asia": { dx: 18, dy: 10, align: "start" },
  "east-asia": { dx: 24, dy: -24, align: "start" },
  "southeast-asia": { dx: 26, dy: 20, align: "start" },
  oceania: { dx: -26, dy: 26, align: "end" },
};

const REGION_LINKS: Array<[RegionId, RegionId]> = [
  ["north-america", "latin-america"],
  ["north-america", "western-europe"],
  ["western-europe", "eastern-europe"],
  ["western-europe", "mena"],
  ["eastern-europe", "central-asia"],
  ["central-asia", "south-asia"],
  ["south-asia", "southeast-asia"],
  ["central-asia", "east-asia"],
  ["east-asia", "southeast-asia"],
  ["mena", "sub-saharan-africa"],
  ["southeast-asia", "oceania"],
] as const;

const WorldRegionMap = ({
  selected,
  counts = {},
  onSelect,
  className,
}: WorldRegionMapProps) => {
  const [hoverId, setHoverId] = useState<RegionId | null>(null);
  const maxCount = Math.max(0, ...Object.values(counts));
  const activeId = hoverId ?? selected;
  const activeRegion = REGIONS.find((region) => region.id === activeId) ?? null;

  const activeLabel = useMemo(() => {
    if (activeRegion) return activeRegion;
    return selected ? REGIONS.find((region) => region.id === selected) ?? null : null;
  }, [activeRegion, selected]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-[28px] border border-white/10 bg-[#09101b] ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(124,220,189,0.12),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(96,165,250,0.12),transparent_24%),radial-gradient(circle_at_52%_100%,rgba(167,139,250,0.12),transparent_30%)]" />

      <svg
        viewBox="0 0 1000 520"
        className="relative z-10 w-full h-auto select-none"
        role="img"
        aria-label="Interactive world regions"
      >
        <defs>
          <linearGradient id="ryc-sea" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10182A" />
            <stop offset="65%" stopColor="#0A0F18" />
            <stop offset="100%" stopColor="#060A11" />
          </linearGradient>
          <linearGradient id="ryc-land" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(124,220,189,0.28)" />
            <stop offset="100%" stopColor="rgba(124,220,189,0.08)" />
          </linearGradient>
          <pattern id="ryc-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(255,255,255,0.035)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="ryc-node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.9" />
            <stop offset="50%" stopColor={ACCENT} stopOpacity="0.25" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x="0" y="0" width="1000" height="520" fill="url(#ryc-sea)" />
        <rect x="0" y="0" width="1000" height="520" fill="url(#ryc-grid)" />

        {[90, 180, 270, 360, 450].map((y) => (
          <path
            key={y}
            d={`M 40 ${y} Q 500 ${y - 28} 960 ${y}`}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        {[190, 360, 520, 680, 840].map((x) => (
          <path
            key={x}
            d={`M ${x} 40 Q ${x - 26} 260 ${x} 480`}
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="1"
          />
        ))}

        {LANDMASSES.map((path, index) => (
          <path
            key={path}
            d={path}
            fill="url(#ryc-land)"
            stroke="rgba(124,220,189,0.18)"
            strokeWidth="1.2"
            opacity={0.75 + index * 0.02}
          />
        ))}

        {REGION_LINKS.map(([from, to]) => {
          const start = REGIONS.find((region) => region.id === from);
          const end = REGIONS.find((region) => region.id === to);
          if (!start || !end) return null;
          const controlY = Math.min(start.pinY, end.pinY) - 22;

          return (
            <path
              key={`${from}-${to}`}
              d={`M ${start.pinX} ${start.pinY} Q ${(start.pinX + end.pinX) / 2} ${controlY} ${end.pinX} ${end.pinY}`}
              fill="none"
              stroke="rgba(124,220,189,0.14)"
              strokeWidth="1.25"
              strokeDasharray="4 8"
            />
          );
        })}

        {REGIONS.map((region) => {
          const isSelected = selected === region.id;
          const isHovered = hoverId === region.id;
          const emphasized = isSelected || isHovered;
          const count = counts[region.id] ?? 0;
          const strength = maxCount > 0 ? count / maxCount : 0;
          const pulseScale = emphasized ? 1.18 : 1;
          const labelMeta = REGION_LABELS[region.id];
          const labelWidth = Math.max(74, region.short.length * 6.25 + 20);
          const labelX =
            labelMeta.align === "end"
              ? -labelWidth
              : labelMeta.align === "middle"
                ? -labelWidth / 2
                : 0;

          return (
            <g
              key={region.id}
              transform={`translate(${region.pinX} ${region.pinY})`}
              role="button"
              tabIndex={0}
              aria-label={`${region.label}${count ? `, ${count} profiles` : ""}`}
              onClick={() => onSelect(isSelected ? null : region.id)}
              onMouseEnter={() => setHoverId(region.id)}
              onMouseLeave={() =>
                setHoverId((current) => (current === region.id ? null : current))
              }
              onFocus={() => setHoverId(region.id)}
              onBlur={() =>
                setHoverId((current) => (current === region.id ? null : current))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(isSelected ? null : region.id);
                }
              }}
              className="cursor-pointer focus:outline-none"
            >
              <motion.circle
                r={emphasized ? 25 : 18}
                fill="url(#ryc-node-glow)"
                animate={{ scale: [1, pulseScale, 1] }}
                transition={{
                  duration: emphasized ? 1.8 : 2.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                pointerEvents="none"
              />
              <circle
                r={10.5}
                fill="rgba(9,16,27,0.88)"
                stroke={emphasized ? ACCENT : "rgba(255,255,255,0.28)"}
                strokeWidth={emphasized ? 1.8 : 1.2}
              />
              <circle
                r={4.8}
                fill={emphasized ? ACCENT : "rgba(124,220,189,0.7)"}
                opacity={0.76 + strength * 0.24}
              />

              <motion.circle
                r={13.5 + strength * 4}
                fill="none"
                stroke={emphasized ? "rgba(124,220,189,0.65)" : "rgba(255,255,255,0.12)"}
                strokeWidth="1"
                animate={{ opacity: emphasized ? [0.4, 0.95, 0.4] : 0.35 }}
                transition={{
                  duration: emphasized ? 1.6 : 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {count > 0 && (
                <g transform="translate(11 -11)" pointerEvents="none">
                  <rect
                    x="-2"
                    y="-7"
                    width={count > 9 ? 20 : 16}
                    height="14"
                    rx="7"
                    fill="rgba(9,16,27,0.92)"
                    stroke={ACCENT}
                    strokeOpacity={emphasized ? 1 : 0.4}
                  />
                  <text
                    x={count > 9 ? 8 : 6}
                    y="0.5"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontSize: 9, fontWeight: 700, fill: ACCENT }}
                  >
                    {count}
                  </text>
                </g>
              )}

              <path
                d={`M 0 0 L ${labelMeta.dx * 0.52} ${labelMeta.dy * 0.52}`}
                fill="none"
                stroke={emphasized ? "rgba(124,220,189,0.48)" : "rgba(255,255,255,0.14)"}
                strokeWidth="1"
                strokeDasharray="2 4"
                pointerEvents="none"
              />

              <g
                transform={`translate(${labelMeta.dx} ${labelMeta.dy})`}
                pointerEvents="none"
              >
                <rect
                  x={labelX}
                  y="-10"
                  width={labelWidth}
                  height="20"
                  rx="10"
                  fill={emphasized ? "rgba(124,220,189,0.16)" : "rgba(9,16,27,0.86)"}
                  stroke={emphasized ? "rgba(124,220,189,0.75)" : "rgba(255,255,255,0.18)"}
                />
                <text
                  x={
                    labelMeta.align === "end"
                      ? -10
                      : labelMeta.align === "middle"
                        ? 0
                        : 10
                  }
                  y="0.5"
                  textAnchor={labelMeta.align}
                  dominantBaseline="middle"
                  className="font-syncopate"
                  style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    fill: emphasized ? "#EAFBF6" : "#C8D1D7",
                    letterSpacing: "0.04em",
                  }}
                >
                  {region.short}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <div className="relative z-10 border-t border-white/10 bg-[#09101b]/85 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.24em] text-white/35">
              Global application pools
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              {activeLabel ? activeLabel.label : "Choose a region to focus the view"}
            </div>
            <div className="mt-1 text-[12px] leading-snug text-white/55">
              {activeLabel
                ? `${activeLabel.description}. ${activeLabel.examples}`
                : "Hover around the map or click a region badge to lock selection."}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 sm:self-auto">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7CDCBD]/10 text-[#7CDCBD]">
              <span className="text-[11px] font-semibold">
                {activeLabel ? String(counts[activeLabel.id] ?? 0) : String(maxCount)}
              </span>
            </div>
            <div className="text-[11px] leading-tight text-white/65">
              <div className="font-medium text-white/85">
                {activeLabel ? "profiles in view" : "largest regional pool"}
              </div>
              <div>
                {activeLabel
                  ? "Click again to clear selection"
                  : "Counts appear directly on each hotspot"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldRegionMap;

import { useState } from "react";
import { REGIONS, RegionId } from "@/lib/rateYourChance";
import worldMapUrl from "@/assets/worldmap.png";

type WorldRegionMapProps = {
  /** Currently active region. `null` means "All regions". */
  selected: RegionId | null;
  /** Profile counts keyed by region id. Used for tooltips + intensity. */
  counts?: Partial<Record<RegionId, number>>;
  onSelect: (regionId: RegionId | null) => void;
  /** Adds a CSS height. */
  className?: string;
};

const ACCENT = "#7CDCBD";

const WorldRegionMap = ({
  selected,
  counts = {},
  onSelect,
  className,
}: WorldRegionMapProps) => {
  const [hoverId, setHoverId] = useState<RegionId | null>(null);

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-auto select-none"
        role="img"
        aria-label="World region map"
      >
        <defs>
          <linearGradient id="ryc-ocean" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f1322" />
            <stop offset="100%" stopColor="#0a0d17" />
          </linearGradient>
          <pattern
            id="ryc-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="ryc-pin-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ACCENT} stopOpacity="0.35" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect
          x="0"
          y="0"
          width="1000"
          height="500"
          rx="20"
          fill="url(#ryc-ocean)"
          stroke="rgba(255,255,255,0.06)"
        />
        <rect
          x="0"
          y="0"
          width="1000"
          height="500"
          rx="20"
          fill="url(#ryc-grid)"
        />

        {/* World map asset (decorative). Tinted with mint via filter. */}
        <image
          href={worldMapUrl}
          xlinkHref={worldMapUrl}
          x={0}
          y={0}
          width={1000}
          height={500}
          preserveAspectRatio="none"
          opacity={0.55}
          style={{
            filter:
              "brightness(0) saturate(100%) invert(82%) sepia(28%) saturate(610%) hue-rotate(110deg) brightness(95%) contrast(90%)",
          }}
          pointerEvents="none"
        />

        {/* Region pins */}
        {REGIONS.map((region) => {
          const isSelected = selected === region.id;
          const isHover = hoverId === region.id;
          const count = counts[region.id] ?? 0;
          const elevated = isSelected || isHover;
          const pinScale = elevated ? 1.18 : 1;

          return (
            <g
              key={region.id}
              role="button"
              tabIndex={0}
              aria-label={`${region.label} (${count} ${
                count === 1 ? "profile" : "profiles"
              })`}
              onMouseEnter={() => setHoverId(region.id)}
              onMouseLeave={() =>
                setHoverId((cur) => (cur === region.id ? null : cur))
              }
              onClick={() => onSelect(isSelected ? null : region.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect(isSelected ? null : region.id);
                }
              }}
              className="cursor-pointer focus:outline-none"
              style={{
                transform: `translate(${region.pinX}px, ${region.pinY}px) scale(${pinScale})`,
                transformBox: "fill-box",
                transformOrigin: "0 0",
                transition: "transform 180ms ease",
              }}
            >
              {/* Halo */}
              {elevated && (
                <circle
                  r={26}
                  fill="url(#ryc-pin-glow)"
                  pointerEvents="none"
                />
              )}

              {/* Pin shadow */}
              <ellipse
                cx={0}
                cy={3}
                rx={11}
                ry={3}
                fill="rgba(0,0,0,0.45)"
                pointerEvents="none"
              />

              {/* Pin (Lucide MapPin shape) */}
              <g transform="translate(-12 -28)">
                <path
                  d="M12 0c-5 0-9 4-9 9 0 6 9 19 9 19s9-13 9-19c0-5-4-9-9-9z"
                  fill={isSelected ? ACCENT : isHover ? "#A0E6CD" : "#0A0D17"}
                  stroke={ACCENT}
                  strokeWidth={isSelected ? 2.2 : 1.6}
                />
                <circle
                  cx={12}
                  cy={9}
                  r={3.8}
                  fill={isSelected ? "#0A0D17" : ACCENT}
                />
              </g>

              {/* Count chip on pin head */}
              {count > 0 && (
                <g pointerEvents="none" transform="translate(8 -28)">
                  <circle
                    cx={0}
                    cy={0}
                    r={9}
                    fill="#0A0D17"
                    stroke={ACCENT}
                    strokeWidth={1.2}
                  />
                  <text
                    x={0}
                    y={0.5}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      fill: ACCENT,
                    }}
                  >
                    {count}
                  </text>
                </g>
              )}

              {/* Label */}
              <g pointerEvents="none">
                <rect
                  x={-44}
                  y={6}
                  width={88}
                  height={18}
                  rx={9}
                  fill={isSelected ? ACCENT : "rgba(10,13,23,0.85)"}
                  stroke={ACCENT}
                  strokeOpacity={isSelected ? 1 : isHover ? 0.6 : 0.3}
                />
                <text
                  x={0}
                  y={15.5}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-syncopate"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    fill: isSelected ? "#0A0D17" : "#E5E7EB",
                  }}
                >
                  {region.short}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <div className="pointer-events-none absolute bottom-3 right-3 hidden sm:block">
        <div className="rounded-lg bg-black/40 border border-white/10 px-2.5 py-1.5 text-[10px] text-gray-300">
          {selected
            ? `Showing: ${REGIONS.find((r) => r.id === selected)?.label}`
            : "Click a pin to filter"}
        </div>
      </div>
    </div>
  );
};

export default WorldRegionMap;

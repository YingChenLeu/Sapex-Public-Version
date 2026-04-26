import { motion } from "framer-motion";

import img1 from "@/assets/landingPageAssets/memories/IMG_9415.jpg";
import img2 from "@/assets/landingPageAssets/memories/IMG_9418.jpg";
import img3 from "@/assets/landingPageAssets/memories/IMG_9419.jpg";
import img4 from "@/assets/landingPageAssets/memories/IMG_9420.jpg";
import img5 from "@/assets/landingPageAssets/memories/Sapex 3.png";
import img6 from "@/assets/landingPageAssets/memories/aisaGissSapex.jpeg";
import img7 from "@/assets/landingPageAssets/memories/aisaGissSapex1.jpeg";
import img8 from "@/assets/landingPageAssets/memories/aisaGissSapex2.jpeg";
import img9 from "@/assets/landingPageAssets/memories/betatesting.png";
import img10 from "@/assets/landingPageAssets/memories/businesscards.png";

type Tile = {
  src: string;
  // visual height class for bento variation
  h: string;
};

// Each column is a vertical bento stack with varied tile heights.
// We duplicate the list so the y-translate marquee loops seamlessly.
const COLUMN_A: Tile[] = [
  { src: img1, h: "h-44 sm:h-56" },
  { src: img6, h: "h-32 sm:h-40" },
  { src: img9, h: "h-52 sm:h-64" },
  { src: img4, h: "h-36 sm:h-44" },
];

const COLUMN_B: Tile[] = [
  { src: img5, h: "h-36 sm:h-44" },
  { src: img2, h: "h-56 sm:h-72" },
  { src: img8, h: "h-32 sm:h-40" },
  { src: img10, h: "h-44 sm:h-56" },
];

const COLUMN_C: Tile[] = [
  { src: img7, h: "h-48 sm:h-60" },
  { src: img3, h: "h-36 sm:h-44" },
  { src: img1, h: "h-32 sm:h-40" },
  { src: img9, h: "h-44 sm:h-56" },
];

const COLUMN_D: Tile[] = [
  { src: img8, h: "h-40 sm:h-52" },
  { src: img4, h: "h-52 sm:h-64" },
  { src: img2, h: "h-32 sm:h-40" },
  { src: img6, h: "h-36 sm:h-48" },
];

function BentoColumn({
  tiles,
  duration,
  direction,
  className = "",
}: {
  tiles: Tile[];
  duration: number;
  direction: "up" | "down";
  className?: string;
}) {
  // Duplicate tiles so the loop is continuous when y goes from 0 -> -50%.
  const loop = [...tiles, ...tiles];
  const animate =
    direction === "up"
      ? { y: ["0%", "-50%"] }
      : { y: ["-50%", "0%"] };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        className="flex flex-col gap-3 sm:gap-4 will-change-transform"
        animate={animate}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
      >
        {loop.map((tile, i) => (
          <div
            key={`${tile.src}-${i}`}
            className={`${tile.h} w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg shadow-black/30`}
          >
            <img
              src={tile.src}
              alt=""
              loading="lazy"
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function MemoriesBento({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Bento columns */}
      <div
        className="absolute inset-0 grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:gap-4 sm:p-4 md:grid-cols-4"
        style={{
          // soft fade so columns feel embedded in the section
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0) 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.95) 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0) 100%)",
        }}
      >
        <BentoColumn tiles={COLUMN_A} duration={42} direction="up" />
        <BentoColumn tiles={COLUMN_B} duration={56} direction="down" />
        <BentoColumn
          tiles={COLUMN_C}
          duration={48}
          direction="up"
          className="hidden sm:block"
        />
        <BentoColumn
          tiles={COLUMN_D}
          duration={62}
          direction="down"
          className="hidden md:block"
        />
      </div>

      {/* Darkening + brand wash so text on top stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,13,23,0.85) 0%, rgba(10,13,23,0.65) 35%, rgba(10,13,23,0.65) 65%, rgba(10,13,23,0.9) 100%)",
        }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(168,211,204,0.18), transparent 70%)",
        }}
      />
    </div>
  );
}

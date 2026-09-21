import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpenText, Eclipse, Codesandbox, Video, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import { useSidebar } from "./SideBar";

const ORBIT_RADIUS = 160;
const ORBIT_DURATION = 24;

const orbitalItems = [
  {
    to: "/helpboard",
    label: "Academic Hub",
    shortLabel: "Academics",
    icon: BookOpenText,
    color: "#7CDCBD",
    angle: 0,
  },
  {
    to: "/rate-your-chance",
    label: "Rate Your Chance",
    shortLabel: "Chance",
    icon: GraduationCap,
    color: "#D9A441",
    angle: 72,
  },
  {
    to: "/study-rooms",
    label: "Study Rooms",
    shortLabel: "Study",
    icon: Video,
    color: "#A8D3CC",
    angle: 144,
  },
  {
    to: "/wellness-support",
    label: "Wellness Support",
    shortLabel: "Wellness",
    icon: Eclipse,
    color: "#A8D3CC",
    angle: 216,
  },
  {
    to: "/origins-lab",
    label: "Origins Lab",
    shortLabel: "Origins",
    icon: Codesandbox,
    color: "#5FBFAA",
    angle: 288,
  },
];

const Main = () => {
  const { collapsed } = useSidebar();
  const [isCompactLayout, setIsCompactLayout] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateLayout = () => setIsCompactLayout(mediaQuery.matches);

    updateLayout();
    mediaQuery.addEventListener("change", updateLayout);
    return () => mediaQuery.removeEventListener("change", updateLayout);
  }, []);

  const orbitRadius = isCompactLayout ? 122 : ORBIT_RADIUS;
  const orbitCardSize = isCompactLayout ? 74 : 88;
  const orbitCardHalf = orbitCardSize / 2;
  const orbitIconSize = isCompactLayout ? 24 : 32;

  return (
    <div className="app-gutter relative min-h-screen overflow-hidden">
      {/* Ambient glow with subtle pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 36% 32% at 100% 0%, rgba(255, 255, 255, 0.16), rgba(120, 220, 189, 0.14) 48%, transparent 72%),
            radial-gradient(ellipse 40% 36% at 100% 100%, rgba(168, 211, 204, 0.16), transparent 68%)
          `,
        }}
        animate={{ opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <motion.header
          className={`pt-[40px] transition-all duration-300 shrink-0 ${
            collapsed ? "px-6" : "px-10"
          }`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="marginalia mb-2">control center</p>
          <h1 className="display-3 text-chalk">Sapex Control Center</h1>
          <p className="measure mt-2 text-sm text-chalk-2">
            Pick a place to go. The rest of the school is already there.
          </p>
        </motion.header>

        {/* Orbital area */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div
            className="relative flex items-center justify-center"
            style={{
              width: orbitRadius * 2 + 60,
              height: orbitRadius * 2 + 60,
              transform: isCompactLayout
                ? "translate(0, -6%)"
                : "translate(-12%, -10%)",
            }}
          >
            {/* Inner ring */}
            <motion.div
              className="absolute rounded-full border border-white/[0.06]"
              style={{
                width: orbitRadius * 2 - 48,
                height: orbitRadius * 2 - 48,
                left: "50%",
                top: "50%",
                marginLeft: -(orbitRadius - 24),
                marginTop: -(orbitRadius - 24),
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: ORBIT_DURATION * 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            {/* Main orbital ring */}
            <motion.div
              className="absolute rounded-full border border-white/10"
              style={{
                width: orbitRadius * 2,
                height: orbitRadius * 2,
                left: "50%",
                top: "50%",
                marginLeft: -orbitRadius,
                marginTop: -orbitRadius,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: ORBIT_DURATION,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Outer ring (counter-rotate) */}
            <motion.div
              className="absolute rounded-full border border-signal/15"
              style={{
                width: orbitRadius * 2 + 28,
                height: orbitRadius * 2 + 28,
                left: "50%",
                top: "50%",
                marginLeft: -(orbitRadius + 14),
                marginTop: -(orbitRadius + 14),
              }}
              animate={{ rotate: -360 }}
              transition={{
                duration: ORBIT_DURATION * 1.5,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Ferris wheel: wheel rotates, each gondola counter-rotates to stay upright */}
            <motion.div
              className="absolute inset-0"
              style={{ width: "100%", height: "100%" }}
              animate={{ rotate: 360 }}
              transition={{
                duration: ORBIT_DURATION,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {orbitalItems.map((item, i) => {
                const Icon = item.icon;
                const rad = (item.angle * Math.PI) / 180;
                const x = Math.cos(rad) * orbitRadius;
                const y = Math.sin(rad) * orbitRadius;

                return (
                  <div
                    key={item.to}
                    className="absolute z-20"
                    style={{
                      width: orbitCardSize,
                      height: orbitCardSize,
                      left: `calc(50% + ${x - orbitCardHalf}px)`,
                      top: `calc(50% + ${y - orbitCardHalf}px)`,
                    }}
                  >
                    {/* Counter-rotate so the card stays level like a ferris wheel gondola */}
                    <motion.div
                      className="w-full h-full"
                      animate={{ rotate: -360 }}
                      transition={{
                        duration: ORBIT_DURATION,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.15 * (i + 1),
                          duration: 0.4,
                          ease: "easeOut",
                        }}
                        className="w-full h-full"
                      >
                        <Link to={item.to} className="block w-full h-full">
                          <motion.div
                            className="flex cursor-pointer flex-col items-center justify-center gap-1.5 overflow-hidden rounded-notice border-2 bg-notice/95 backdrop-blur-sm"
                            style={{
                              width: orbitCardSize,
                              height: orbitCardSize,
                              borderColor: `${item.color}40`,
                              boxShadow: `0 0 20px ${item.color}12, 0 4px 12px rgba(0,0,0,0.2)`,
                            }}
                            whileHover={{
                              scale: 1.1,
                              borderColor: item.color,
                              boxShadow: `0 0 28px ${item.color}30, 0 8px 20px rgba(0,0,0,0.25)`,
                              transition: { duration: 0.2 },
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon
                              className="shrink-0"
                              style={{ color: item.color, width: orbitIconSize, height: orbitIconSize }}
                            />
                            <span
                              className={`truncate px-1 font-medium text-chalk ${isCompactLayout ? "max-w-[64px] text-[9px]" : "max-w-[72px] text-[10px]"}`}
                            >
                              {collapsed ? item.shortLabel : item.label}
                            </span>
                          </motion.div>
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;

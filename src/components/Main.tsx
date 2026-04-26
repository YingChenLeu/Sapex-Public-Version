import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpenText, Eclipse, Codesandbox, Video } from "lucide-react";
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
    to: "/study-rooms",
    label: "Study Rooms",
    shortLabel: "Study",
    icon: Video,
    color: "#60A5FA",
    angle: 90,
  },
  {
    to: "/wellness-support",
    label: "Wellness Support",
    shortLabel: "Wellness",
    icon: Eclipse,
    color: "#A78BFA",
    angle: 180,
  },
  {
    to: "/origins-lab",
    label: "Origins Lab",
    shortLabel: "Origins",
    icon: Codesandbox,
    color: "#5FBFAA",
    angle: 270,
  },
];

const Main = () => {
  const { collapsed } = useSidebar();

  return (
    <div
      className={`relative min-h-screen overflow-hidden transition-all duration-300 ${
        collapsed ? "pl-[100px]" : "pl-[280px]"
      }`}
    >
      {/* Ambient glow with subtle pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% 40%, rgba(120, 220, 189, 0.18), transparent 55%),
            radial-gradient(ellipse 60% 40% at 50% 55%, rgba(95, 191, 170, 0.12), transparent 50%)
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
          <h1 className="text-3xl font-bold text-white font-syncopate tracking-tight">
            Sapex Control Center
          </h1>
          <p className="mt-2 text-muted-foreground max-w-xl text-sm">
            Your central access point. Choose a destination to orbit into.
          </p>
        </motion.header>

        {/* Orbital area */}
        <div className="flex-1 flex items-center justify-center min-h-0">
          <div
            className="relative w-[380px] h-[380px] flex items-center justify-center"
            style={{ transform: "translate(-12%, -10%)" }}
          >
            {/* Inner ring */}
            <motion.div
              className="absolute rounded-full border border-white/[0.06]"
              style={{
                width: ORBIT_RADIUS * 2 - 48,
                height: ORBIT_RADIUS * 2 - 48,
                left: "50%",
                top: "50%",
                marginLeft: -(ORBIT_RADIUS - 24),
                marginTop: -(ORBIT_RADIUS - 24),
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
                width: ORBIT_RADIUS * 2,
                height: ORBIT_RADIUS * 2,
                left: "50%",
                top: "50%",
                marginLeft: -ORBIT_RADIUS,
                marginTop: -ORBIT_RADIUS,
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
              className="absolute rounded-full border border-[#7CDCBD]/15"
              style={{
                width: ORBIT_RADIUS * 2 + 28,
                height: ORBIT_RADIUS * 2 + 28,
                left: "50%",
                top: "50%",
                marginLeft: -(ORBIT_RADIUS + 14),
                marginTop: -(ORBIT_RADIUS + 14),
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
                const x = Math.cos(rad) * ORBIT_RADIUS;
                const y = Math.sin(rad) * ORBIT_RADIUS;

                return (
                  <div
                    key={item.to}
                    className="absolute z-20 w-[88px] h-[88px]"
                    style={{
                      left: `calc(50% + ${x - 44}px)`,
                      top: `calc(50% + ${y - 44}px)`,
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
                            className="w-[88px] h-[88px] rounded-2xl bg-[#12162A]/95 border-2 flex flex-col items-center justify-center gap-1.5 cursor-pointer overflow-hidden backdrop-blur-sm"
                            style={{
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
                              className="w-8 h-8 shrink-0"
                              style={{ color: item.color }}
                            />
                            <span className="text-[10px] font-medium text-white/90 max-w-[72px] truncate px-1">
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

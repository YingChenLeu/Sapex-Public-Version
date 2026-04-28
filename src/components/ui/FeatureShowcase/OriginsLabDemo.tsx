import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import {
  Cpu,
  Film,
  HandHelping,
  Lightbulb,
  Music2,
  Palette,
  PenTool,
  Plus,
  Sparkles,
  Wrench,
} from "lucide-react";
import DemoFrame from "./DemoFrame";
import MockCursor from "./MockCursor";
import TypedInput from "./TypedInput";
import { useSceneLoop } from "./useSceneLoop";

const ACCENT = "#7CDCBD";

const FIELDS = [
  { id: "fine-arts", label: "Fine Arts", Icon: Palette, color: "#A78BFA" },
  { id: "music", label: "Music", Icon: Music2, color: "#7CDCBD" },
  { id: "film", label: "Film", Icon: Film, color: "#F97316" },
  { id: "design", label: "Design", Icon: PenTool, color: "#5FBFAA" },
  { id: "tech", label: "Technology", Icon: Cpu, color: "#60A5FA", highlighted: true },
  { id: "engineering", label: "Engineering", Icon: Wrench, color: "#94A3B8" },
  { id: "service", label: "Service", Icon: HandHelping, color: "#F59E0B" },
];

/* ------------------------------------------------------------------ */
/* Scene 1 — Field selection grid                                      */
/* ------------------------------------------------------------------ */

const FieldSelectScene = () => (
  <motion.div
    key="fields"
    className="absolute inset-0 flex flex-col bg-[#0A0D17]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    {/* Header */}
    <div className="px-3 pt-3 pb-2 flex items-center gap-2">
      <div className="w-6 h-6 rounded-md bg-[#7CDCBD]/20 flex items-center justify-center">
        <Sparkles className="w-3 h-3 text-[#7CDCBD]" />
      </div>
      <div>
        <div className="text-[12px] font-bold text-white font-syncopate tracking-tight">
          Origins Lab
        </div>
        <div className="text-[8.5px] text-white/55">
          Pick a field and brainstorm project ideas
        </div>
      </div>
    </div>

    <motion.div
      className="px-3 text-[9.5px] text-white/55 leading-snug mb-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.12, duration: 0.3 }}
    >
      Showcase your extracurricular work or spark something new — get prompts
      and a space to jot ideas down.
    </motion.div>

    {/* Field grid */}
    <div className="px-3 grid grid-cols-3 gap-1.5">
      {FIELDS.map((field, i) => {
        const isHighlighted = "highlighted" in field && field.highlighted;
        return (
          <motion.div
            key={field.id}
            className="rounded-lg border-2 bg-[#12162A] p-2 flex flex-col items-start gap-1"
            style={{
              borderColor: isHighlighted ? field.color : `${field.color}40`,
              boxShadow: isHighlighted
                ? `0 6px 18px ${field.color}30`
                : undefined,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={
              isHighlighted
                ? {
                    opacity: 1,
                    y: 0,
                    scale: [1, 1.04, 1],
                  }
                : { opacity: 1, y: 0 }
            }
            transition={
              isHighlighted
                ? {
                    opacity: { delay: 0.18 + i * 0.04, duration: 0.3 },
                    y: { delay: 0.18 + i * 0.04, duration: 0.3 },
                    scale: {
                      delay: 1.2,
                      duration: 1.4,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                    },
                  }
                : { delay: 0.18 + i * 0.04, duration: 0.3 }
            }
          >
            <field.Icon className="w-4 h-4" style={{ color: field.color }} />
            <span className="text-[9px] font-medium text-white leading-tight">
              {field.label}
            </span>
          </motion.div>
        );
      })}
    </div>

    {/* "Opening Technology…" cue */}
    <motion.div
      className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-white/40 font-medium tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1] }}
      transition={{ duration: 3.2, times: [0, 0.7, 1] }}
    >
      Opening Technology lab…
    </motion.div>

    {/* Cursor: enter → hover Music → click Technology (highlighted) */}
    <MockCursor
      waypoints={[
        { t: 0.4, x: 92, y: 92 },
        { t: 1.6, x: 50, y: 32 },
        { t: 2.6, x: 50, y: 50 },
        { t: 3.0, x: 50, y: 50, click: true },
      ]}
    />
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Scene 2 — Brainstorm view                                           */
/* ------------------------------------------------------------------ */

type Idea = { id: number; text: string; delay: number };

const IDEAS: Idea[] = [
  {
    id: 1,
    text: "Build a tutoring matchmaker app for our school",
    delay: 1.2,
  },
  {
    id: 2,
    text: "Solar phone-charging benches for the courtyard",
    delay: 2.2,
  },
  {
    id: 3,
    text: "AI study-plan generator from your test scores",
    delay: 3.2,
  },
];

const BrainstormScene = () => (
  <motion.div
    key="brainstorm"
    className="absolute inset-0 flex flex-col bg-[#0A0D17]"
    initial={{ opacity: 0, x: 16 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -16 }}
    transition={{ duration: 0.35 }}
  >
    {/* Field header */}
    <div className="px-3 pt-3 pb-2 flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center"
        style={{ background: "rgba(96,165,250,0.18)" }}
      >
        <Cpu className="w-4 h-4" style={{ color: "#60A5FA" }} />
      </div>
      <div>
        <div className="text-[11.5px] font-semibold text-white">
          Technology
        </div>
        <div className="text-[8.5px] text-white/55">
          Brainstorm project ideas
        </div>
      </div>
    </div>

    {/* Prompt card */}
    <motion.div
      className="mx-3 rounded-lg border px-2.5 py-2 mb-2"
      style={{
        borderColor: "rgba(96,165,250,0.32)",
        background: "rgba(96,165,250,0.08)",
      }}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Lightbulb className="w-3 h-3" style={{ color: "#60A5FA" }} />
        <span className="text-[8.5px] font-semibold uppercase tracking-wider text-white/55">
          Prompt
        </span>
      </div>
      <p className="text-[10.5px] text-white font-medium leading-snug">
        What would you build to help your school or community?
      </p>
    </motion.div>

    {/* Add-idea input */}
    <div className="px-3 mb-2">
      <div className="text-[8.5px] font-medium text-white/65 mb-1">
        Add an idea
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex-1 px-2 py-1.5 rounded-md bg-[#12162A] border border-white/10 text-[9.5px]">
          <TypedInput
            placeholder="Type an idea and press Enter or Add"
            placeholderClassName="text-white/35"
            textClassName="text-white/90"
            sequences={[
              {
                text: "Showcase my robotics club's planter",
                typeStart: 0.7,
                charDelay: 0.04,
              },
            ]}
          />
        </div>
        <div className="inline-flex items-center gap-1 px-2 py-1.5 rounded-md bg-[#7CDCBD] text-[#0A0D17] text-[9px] font-semibold shrink-0">
          <Plus className="w-2.5 h-2.5" strokeWidth={3} />
          Add
        </div>
      </div>
    </div>

    {/* Ideas list */}
    <div className="px-3">
      <div className="text-[8.5px] font-medium text-white/55 mb-1.5">
        My ideas (3)
      </div>
      <ul className="space-y-1.5">
        {IDEAS.map((idea) => (
          <motion.li
            key={idea.id}
            className="rounded-md bg-[#12162A] border border-white/10 px-2.5 py-1.5 text-[10px] text-white/90 leading-snug"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idea.delay, duration: 0.3 }}
          >
            {idea.text}
          </motion.li>
        ))}
      </ul>
    </div>

    {/* Cursor: enter → hover input while idea types → click Add → drift down to ideas */}
    <MockCursor
      waypoints={[
        { t: 0.3, x: 92, y: 92 },
        { t: 0.9, x: 40, y: 38 },
        { t: 2.4, x: 40, y: 38 },
        { t: 2.7, x: 86, y: 38 },
        { t: 3.0, x: 86, y: 38, click: true },
        { t: 4.4, x: 50, y: 75 },
      ]}
    />
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Scene 3 — Everyone's ideas (community board)                        */
/* ------------------------------------------------------------------ */

type PeerSession = {
  id: number;
  name: string;
  initials: string;
  color: string;
  ideas: string[];
  delay: number;
};

const PEER_SESSIONS: PeerSession[] = [
  {
    id: 1,
    name: "Alex",
    initials: "AX",
    color: "#A78BFA",
    ideas: [
      "AR app that overlays solutions on textbook pages",
      "Smart locker reservation system",
    ],
    delay: 0.4,
  },
  {
    id: 2,
    name: "Remy",
    initials: "RM",
    color: "#F472B6",
    ideas: [
      "Open-source design system for school clubs",
      "Sticker-pack fundraiser for the art club",
    ],
    delay: 1.2,
  },
  {
    id: 3,
    name: "Nova",
    initials: "NV",
    color: "#7CDCBD",
    ideas: ["Recycled-material skate ramp build log"],
    delay: 2.0,
  },
];

const EveryoneScene = () => (
  <motion.div
    key="everyone"
    className="absolute inset-0 flex flex-col bg-[#0A0D17]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    {/* Header */}
    <div className="px-3 pt-3 pb-2">
      <div className="text-[12px] font-semibold text-white">
        Everyone's ideas
      </div>
      <div className="text-[9px] text-white/55 mt-0.5">
        Showcase what your peers are building in Technology.
      </div>
    </div>

    <div className="px-3 space-y-2 overflow-hidden">
      {PEER_SESSIONS.map((session) => (
        <motion.div
          key={session.id}
          className="rounded-lg border border-white/10 bg-[#12162A] px-2.5 py-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: session.delay, duration: 0.35 }}
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[8.5px] font-semibold text-[#0A0D17] shrink-0"
              style={{ background: session.color }}
            >
              {session.initials}
            </div>
            <span className="text-[10px] font-semibold text-white">
              {session.name}
            </span>
            <span className="text-[8.5px]" style={{ color: ACCENT }}>
              · sapex helper
            </span>
          </div>
          <ul className="space-y-1">
            {session.ideas.map((idea, i) => (
              <li
                key={i}
                className="text-[9.5px] text-white/80 pl-2 border-l-2 leading-snug"
                style={{ borderColor: `${ACCENT}55` }}
              >
                {idea}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>

    <motion.div
      className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-white/40 font-medium tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2, duration: 0.4 }}
    >
      Project boards refresh as students post.
    </motion.div>

    {/* Cursor: enter → scroll-style hover down each peer's card */}
    <MockCursor
      waypoints={[
        { t: 0.4, x: 92, y: 92 },
        { t: 1.6, x: 55, y: 32 },
        { t: 2.8, x: 55, y: 52 },
        { t: 4.0, x: 55, y: 72 },
      ]}
    />
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

const OriginsLabDemo = () => {
  const reduce = useReducedMotion();
  const durations = useMemo(() => [3800, 5400, 4800], []);
  const scene = useSceneLoop(durations, !!reduce);

  return (
    <DemoFrame badge="Origins Lab" accent={ACCENT} contentHeight={400}>
      <AnimatePresence mode="wait" initial={false}>
        {scene === 0 ? (
          <FieldSelectScene key="fields" />
        ) : scene === 1 ? (
          <BrainstormScene key="brainstorm" />
        ) : (
          <EveryoneScene key="everyone" />
        )}
      </AnimatePresence>
    </DemoFrame>
  );
};

export default OriginsLabDemo;

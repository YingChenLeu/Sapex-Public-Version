import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import {
  BookOpen,
  Hand,
  Mic,
  MicOff,
  Plus,
  Users,
  Video,
} from "lucide-react";
import DemoFrame from "./DemoFrame";
import MockCursor from "./MockCursor";
import TypedInput from "./TypedInput";
import { useSceneLoop } from "./useSceneLoop";

const ACCENT = "#60A5FA";

type Tile = {
  initials: string;
  name: string;
  bg: string;
  muted?: boolean;
  raised?: boolean;
};

const TILES: Tile[] = [
  { initials: "ZR", name: "Zoro", bg: "#A78BFA" },
  { initials: "NA", name: "Nami", bg: "#F472B6", raised: true },
  { initials: "RB", name: "Robin", bg: "#7CDCBD", muted: true },
  { initials: "LF", name: "Luffy", bg: "#60A5FA" },
];

const Waveform = ({ active }: { active: boolean }) => (
  <div className="flex items-end gap-[2px] h-3">
    {[0, 1, 2, 3].map((i) => (
      <motion.span
        key={i}
        className="w-[2px] rounded-full bg-white/80"
        animate={
          active
            ? { height: ["20%", "100%", "40%", "80%", "20%"] }
            : { height: "20%" }
        }
        transition={
          active
            ? {
                duration: 1.1,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }
            : undefined
        }
        style={{ height: "20%" }}
      />
    ))}
  </div>
);

/* ------------------------------------------------------------------ */
/* Scene 1 — Study Rooms list                                          */
/* ------------------------------------------------------------------ */

const SESSIONS = [
  {
    subject: "Calculus exam prep",
    by: "Zoro",
    when: "starting now",
    color: "#A78BFA",
  },
  {
    subject: "AP Chem review",
    by: "Nami",
    when: "in 10 min",
    color: "#F472B6",
  },
  {
    subject: "AP Lit essay lab",
    by: "Robin",
    when: "30 min ago",
    color: "#7CDCBD",
  },
];

const RoomsListScene = () => (
  <motion.div
    key="rooms"
    className="absolute inset-0 flex flex-col bg-[#0A0D17]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    {/* Header */}
    <div className="px-3 pt-3 pb-2">
      <div className="text-[12px] font-bold text-white font-syncopate tracking-tight">
        Study Rooms
      </div>
      <div className="text-[9.5px] text-white/55 mt-0.5 leading-snug">
        Create a study session by subject and join others to focus together.
      </div>
    </div>

    {/* Create form */}
    <motion.div
      className="mx-3 mt-1 mb-3 rounded-lg border border-white/10 bg-[#12162A]/80 px-2.5 py-2"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12, duration: 0.3 }}
    >
      <div className="flex items-center gap-1.5">
        <div className="flex-1 relative">
          <BookOpen
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-[#7CDCBD]/70"
            aria-hidden
          />
          <div className="pl-5 pr-2 py-1.5 rounded-md bg-[#0A0D17] border border-white/15 text-[10px]">
            <TypedInput
              placeholder="Enter subject (e.g. Calculus, Biology)"
              placeholderClassName="text-white/35"
              textClassName="text-white/90"
              sequences={[
                {
                  text: "Calculus exam prep",
                  typeStart: 0.7,
                  charDelay: 0.05,
                },
              ]}
            />
          </div>
        </div>
        <div className="inline-flex items-center gap-1 rounded-md bg-[#7CDCBD] text-[#0A0D17] text-[9.5px] font-semibold px-2 py-1.5 shrink-0">
          <Plus className="w-2.5 h-2.5" strokeWidth={3} />
          Create
        </div>
      </div>
    </motion.div>

    {/* Sessions list */}
    <div className="px-3 mb-2">
      <div className="text-[9.5px] font-semibold text-white/85 flex items-center gap-1.5">
        <Users className="w-3 h-3" style={{ color: ACCENT }} />
        Study sessions
      </div>
    </div>

    <div className="px-3 space-y-2">
      {SESSIONS.map((s, i) => (
        <motion.div
          key={s.subject}
          className="rounded-lg border border-white/10 bg-[#12162A]/80 px-2.5 py-2 flex items-center gap-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.1, duration: 0.3 }}
        >
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{ background: `${s.color}26` }}
          >
            <Video className="w-3.5 h-3.5" style={{ color: s.color }} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10.5px] font-semibold text-white truncate">
              {s.subject}
            </div>
            <div className="text-[9px] text-white/50 truncate">
              by {s.by} · {s.when}
            </div>
          </div>
          <div className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-[#7CDCBD]/20 text-[#7CDCBD] shrink-0">
            Join
          </div>
        </motion.div>
      ))}
    </div>

    {/* "Joining…" cue */}
    <motion.div
      className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-white/40 font-medium tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0, 1] }}
      transition={{ duration: 3, times: [0, 0.7, 1] }}
    >
      Joining "Calculus exam prep"…
    </motion.div>

    {/* Cursor: enter → input (typing) → hover Create → drop down to first Join */}
    <MockCursor
      waypoints={[
        { t: 0.3, x: 92, y: 92 },
        { t: 0.8, x: 35, y: 22 },
        { t: 2.0, x: 35, y: 22 },
        { t: 2.4, x: 86, y: 22 },
        { t: 3.2, x: 86, y: 38 },
        { t: 3.6, x: 86, y: 38, click: true },
      ]}
    />
  </motion.div>
);

/* ------------------------------------------------------------------ */
/* Scene 2 — Inside the video room                                     */
/* ------------------------------------------------------------------ */

const VideoRoomScene = () => {
  const reduceFlag = false;
  return (
    <motion.div
      key="room"
      className="absolute inset-0 flex flex-col bg-[#0a0d17]"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {/* Room header */}
      <div className="px-3 py-2 border-b border-white/10 bg-[#11141d] flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[10.5px] font-semibold text-white truncate">
            Calculus exam prep
          </div>
          <div className="text-[8.5px] text-white/50">
            4 in room · Live
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          <span className="text-[9px] text-white/70">REC</span>
        </div>
      </div>

      {/* Tile grid */}
      <div className="flex-1 p-2.5 grid grid-cols-2 gap-2">
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.initials}
            className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10"
            style={{
              background: `linear-gradient(140deg, ${tile.bg}40, #0A0D17 65%)`,
            }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.35 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-semibold text-[#0A0D17] shadow-md"
                style={{ background: tile.bg }}
              >
                {tile.initials}
              </div>
            </div>

            {/* Speaking ring (rotates between people) */}
            <motion.div
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                border: `2px solid ${ACCENT}`,
                boxShadow: `inset 0 0 14px ${ACCENT}55`,
              }}
              animate={{
                opacity: [0, i === 0 ? 1 : 0, i === 1 ? 1 : 0, i === 2 ? 1 : 0, i === 3 ? 1 : 0, 0],
              }}
              transition={{
                duration: 5,
                times: [0, 0.15, 0.4, 0.6, 0.8, 1],
                repeat: Infinity,
                delay: 0.6,
                ease: "linear",
              }}
            />

            {/* Bottom row: name + indicators */}
            <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center gap-1">
              <span className="text-[9px] font-medium text-white/95 truncate">
                {tile.name}
              </span>
              <div className="flex items-center gap-1 ml-auto">
                {tile.raised && (
                  <motion.span
                    className="text-amber-300/95"
                    animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      repeatDelay: 1.2,
                      ease: "easeInOut",
                    }}
                  >
                    <Hand className="w-2.5 h-2.5" />
                  </motion.span>
                )}
                {tile.muted ? (
                  <MicOff className="w-2.5 h-2.5 text-rose-300/95" />
                ) : (
                  <>
                    <Mic className="w-2.5 h-2.5 text-white/75" />
                    <Waveform active={!reduceFlag} />
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Side chat strip */}
      <motion.div
        className="mx-2.5 mb-2.5 rounded-md border border-white/10 bg-[#11141d] px-2.5 py-1.5 flex items-start gap-1.5"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.35 }}
      >
        <Video
          className="w-3 h-3 mt-0.5 shrink-0"
          style={{ color: ACCENT }}
        />
        <div className="min-w-0">
          <div className="text-[9px] text-white/50">Nami · 0:34</div>
          <div className="text-[10px] text-white/85 leading-snug truncate">
            sharing my screen for the integral on slide 4
          </div>
        </div>
      </motion.div>

      {/* Cursor: enter → Nami's raised hand → Robin's mute icon → chat strip */}
      <MockCursor
        waypoints={[
          { t: 0.4, x: 95, y: 95 },
          { t: 1.6, x: 85, y: 42 },
          { t: 3.2, x: 42, y: 75 },
          { t: 5.0, x: 50, y: 88 },
        ]}
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

const StudyRoomsDemo = () => {
  const reduce = useReducedMotion();
  const durations = useMemo(() => [4500, 6500], []);
  const scene = useSceneLoop(durations, !!reduce);

  return (
    <DemoFrame badge="Study Rooms" accent={ACCENT} contentHeight={400}>
      <AnimatePresence mode="wait" initial={false}>
        {scene === 0 ? (
          <RoomsListScene key="rooms" />
        ) : (
          <VideoRoomScene key="room" />
        )}
      </AnimatePresence>
    </DemoFrame>
  );
};

export default StudyRoomsDemo;

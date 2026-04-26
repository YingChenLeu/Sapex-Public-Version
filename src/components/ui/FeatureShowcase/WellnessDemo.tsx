import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import {
  Flame,
  Handshake,
  HeartCrack,
  Info,
  Loader2,
  Send,
  Siren,
  Smile,
  SquareLibrary,
  UserRound,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";
import DemoFrame from "./DemoFrame";
import MockCursor from "./MockCursor";
import TypedInput from "./TypedInput";
import { useSceneLoop } from "./useSceneLoop";

const ACCENT = "#A78BFA";

type Person = {
  name: string;
  initials: string;
  color: string;
};

const JP: Person = { name: "JP", initials: "JP", color: "#7CDCBD" };
const BIANCA: Person = { name: "Bianca", initials: "BD", color: "#A78BFA" };

const TOPICS = [
  { Icon: Handshake, title: "New Friendships" },
  { Icon: Users, title: "Loneliness" },
  { Icon: HeartCrack, title: "Heartbreak" },
  { Icon: Flame, title: "Burnout" },
  { Icon: Siren, title: "Anxiety", highlighted: true },
  { Icon: UserRoundPlus, title: "New Student" },
  { Icon: SquareLibrary, title: "Study" },
] as const;

/* ------------------------------------------------------------------ */
/* Scene 1 — Topic chooser                                             */
/* ------------------------------------------------------------------ */

const TopicChooserScene = () => {
  const highlightedIndex = TOPICS.findIndex((t) => "highlighted" in t && t.highlighted);

  return (
    <motion.div
      key="chooser"
      className="absolute inset-0 flex flex-col bg-[#0A0D17]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* In-app header */}
      <div className="px-3 pt-3 pb-2">
        <div className="text-[12px] font-bold text-white font-syncopate tracking-tight">
          Wellness Support
        </div>
        <div className="text-[9.5px] text-white/55 mt-0.5 leading-snug">
          Choose a topic and we'll match you with someone who can listen and
          support.
        </div>
      </div>

      {/* Notice card */}
      <motion.div
        className="mx-3 rounded-lg border border-amber-500/30 bg-amber-950/25 px-2.5 py-1.5 flex items-start gap-1.5"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <Info className="w-3 h-3 text-amber-300 shrink-0 mt-[1px]" />
        <div className="text-[9.5px] text-amber-100/85 leading-snug">
          <span className="font-semibold text-amber-200">
            Before you start:
          </span>{" "}
          complete the{" "}
          <span className="underline text-amber-300">personality test</span>.
        </div>
      </motion.div>

      {/* "Choose a topic" label */}
      <div className="px-3 mt-3 mb-1.5 text-[8.5px] font-semibold text-white/45 uppercase tracking-wider">
        Choose a topic
      </div>

      {/* Floating dock */}
      <motion.div
        className="mx-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur px-2.5 py-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.35 }}
      >
        <div className="flex items-end justify-between gap-1">
          {TOPICS.map((topic, i) => {
            const isHighlighted = i === highlightedIndex;
            return (
              <motion.div
                key={topic.title}
                className="relative flex flex-col items-center"
                animate={
                  isHighlighted
                    ? { y: [0, -4, 0] }
                    : { y: 0 }
                }
                transition={
                  isHighlighted
                    ? {
                        delay: 0.6,
                        duration: 1.2,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                      }
                    : {}
                }
              >
                <motion.div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: isHighlighted ? 32 : 26,
                    height: isHighlighted ? 32 : 26,
                    background: isHighlighted
                      ? `${ACCENT}26`
                      : "rgba(255,255,255,0.06)",
                    border: isHighlighted
                      ? `1px solid ${ACCENT}66`
                      : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <topic.Icon
                    className={isHighlighted ? "w-4 h-4" : "w-3 h-3"}
                    style={{
                      color: isHighlighted ? ACCENT : "rgba(229,231,235,0.85)",
                    }}
                  />
                </motion.div>
                {isHighlighted && (
                  <motion.div
                    className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8.5px] text-white px-1.5 py-0.5 rounded bg-[#1a1f2e] border border-white/10 shadow-md"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.25 }}
                  >
                    Anxiety & Stress
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* "Finding match" stub appears toward end */}
      <motion.div
        className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 text-[10px] text-white/55"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ duration: 3, times: [0, 0.7, 1] }}
      >
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Finding your match…</span>
      </motion.div>

      {/* Cursor: enter → hover Anxiety topic → click → linger near loader */}
      <MockCursor
        waypoints={[
          { t: 0.4, x: 92, y: 92 },
          { t: 1.6, x: 30, y: 55 },
          { t: 2.3, x: 63, y: 50 },
          { t: 2.7, x: 63, y: 50, click: true },
          { t: 3.5, x: 50, y: 90 },
        ]}
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — Finding match (full-screen overlay)                       */
/* ------------------------------------------------------------------ */

const MatchingScene = () => {
  return (
    <motion.div
      key="matching"
      className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0A0D17]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="relative w-16 h-16">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-dashed"
          style={{ borderColor: `${ACCENT}66` }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-1 rounded-full"
          style={{
            background: `radial-gradient(circle, ${ACCENT}33 0%, transparent 70%)`,
          }}
          animate={{ scale: [0.9, 1.05, 0.9], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-3 rounded-full bg-[#0C111C] flex items-center justify-center">
          <Siren className="w-5 h-5" style={{ color: ACCENT }} />
        </div>
      </div>

      <div className="text-[11px] text-white/85 font-medium">
        Matching you with a calm, empathetic peer…
      </div>

      <div className="flex -space-x-1.5">
        {[
          { initials: "WW", color: "#A78BFA" },
          { initials: "BD", color: "#F472B6" },
          { initials: "JN", color: "#60A5FA" },
          { initials: "EM", color: "#7CDCBD" },
        ].map((p, i) => (
          <motion.div
            key={p.initials}
            className="w-6 h-6 rounded-full border-2 border-[#0C111C] flex items-center justify-center text-[8.5px] font-semibold text-[#0A0D17]"
            style={{ background: p.color }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.92, 1.04, 0.92] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.18,
              ease: "easeInOut",
            }}
          >
            {p.initials}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 3 — WellnessChatDialog                                        */
/* ------------------------------------------------------------------ */

type ChatMsg = {
  id: number;
  person: Person;
  text: string;
  isOwn: boolean;
  delay: number;
};

const MESSAGES: ChatMsg[] = [
  {
    id: 1,
    person: JP,
    text: "yo bianca i'm stressed bro 😭 idk how to study for ap exams",
    isOwn: true,
    delay: 2.7,
  },
  {
    id: 2,
    person: BIANCA,
    text: "fr same a few months ago lol — which ones hitting hardest?",
    isOwn: false,
    delay: 3.8,
  },
  {
    id: 3,
    person: JP,
    text: "ap chem AND lit at the same time fml",
    isOwn: true,
    delay: 6.5,
  },
  {
    id: 4,
    person: BIANCA,
    text: "okay we got this — lemme send my study plan rn",
    isOwn: false,
    delay: 7.6,
  },
];

const WellnessBubble = ({ msg }: { msg: ChatMsg }) => {
  const { person, text, isOwn } = msg;
  return (
    <motion.div
      className={`flex items-start gap-1.5 ${
        isOwn ? "justify-end" : "justify-start"
      }`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: msg.delay }}
    >
      {!isOwn && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-900 to-green-800 flex items-center justify-center shrink-0">
          <span className="text-[8.5px] font-semibold text-white">
            {person.initials}
          </span>
        </div>
      )}
      <div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <div className="px-2.5 py-1.5 rounded-2xl text-[10.5px] leading-snug max-w-[200px] break-words bg-emerald-400/15 border border-emerald-400/30 text-emerald-50">
          {text}
        </div>
        <span
          className={`text-[8.5px] text-white/40 mt-0.5 px-1 ${
            isOwn ? "text-right" : "text-left"
          }`}
        >
          14:2{msg.id}
        </span>
      </div>
    </motion.div>
  );
};

const ChatDialogScene = () => {
  return (
    <motion.div
      key="chat"
      className="absolute inset-0 flex flex-col"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
      style={{
        background:
          "linear-gradient(160deg, #1b2742 0%, #0e1b2c 40%, #0A0D17 100%)",
      }}
    >
      {/* Soft scenic overlay (mimics the photo background) */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 20% 0%, rgba(96,165,250,0.18), transparent 60%),
            radial-gradient(ellipse 60% 40% at 90% 100%, rgba(124,220,189,0.15), transparent 65%)
          `,
        }}
      />

      {/* Header */}
      <div className="relative bg-[#1e212d]/95 border-b border-white/10 px-2.5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-900 to-green-800 flex items-center justify-center shrink-0">
            <UserRound className="text-white w-3.5 h-3.5" />
          </div>
          <h3 className="text-white font-medium text-[10.5px] truncate">
            Sapex Emotional Support
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[9px] text-white px-2 py-1 rounded bg-emerald-600/90 font-medium">
            Resolve Issue
          </span>
          <span className="text-white/50">
            <X className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="relative flex-1 px-2.5 py-2.5 space-y-2 overflow-hidden">
        {MESSAGES.map((m) => (
          <WellnessBubble key={m.id} msg={m} />
        ))}

        {/* Typing indicator */}
        <motion.div
          className="flex items-center gap-1.5 pl-7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 8.4, duration: 0.3 }}
        >
          <div className="px-2 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/25 flex items-center gap-[3px]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-emerald-200/70"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.18,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Input bar */}
      <div className="relative bg-[#1e212d]/95 border-t border-white/10 px-2.5 py-2">
        <div className="flex items-center gap-1.5">
          <Smile className="w-3.5 h-3.5 text-white/45 shrink-0" />
          <div className="flex-1 rounded-md bg-[#101524] px-2 py-1.5 text-[10px]">
            <TypedInput
              placeholder="Type your message…"
              placeholderClassName="text-white/40"
              textClassName="text-white/95"
              sequences={[
                {
                  text: "yo bianca i'm stressed bro idk how to study for ap exams",
                  typeStart: 0.6,
                  charDelay: 0.035,
                  clearAt: 2.6,
                },
                {
                  text: "ap chem AND lit at the same time fml",
                  typeStart: 4.6,
                  charDelay: 0.04,
                  clearAt: 6.4,
                },
              ]}
            />
          </div>
          <div className="w-6 h-6 rounded-md bg-blue-600/90 flex items-center justify-center">
            <Send className="w-3 h-3 text-white" />
          </div>
        </div>
        <p className="text-[8px] text-white/35 mt-1 text-center leading-snug">
          Safe space — private and anonymous.
        </p>
      </div>

      {/* Cursor: input → typing → send (msg 1) → drift up → input → typing → send (msg 2) */}
      <MockCursor
        waypoints={[
          { t: 0.0, x: 95, y: 95 },
          { t: 0.5, x: 50, y: 86 },
          { t: 2.4, x: 50, y: 86 },
          { t: 2.55, x: 92, y: 86 },
          { t: 2.65, x: 92, y: 86, click: true },
          { t: 3.6, x: 35, y: 35 },
          { t: 4.5, x: 50, y: 86 },
          { t: 6.2, x: 50, y: 86 },
          { t: 6.35, x: 92, y: 86 },
          { t: 6.45, x: 92, y: 86, click: true },
          { t: 7.8, x: 35, y: 55 },
        ]}
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

const WellnessDemo = () => {
  const reduce = useReducedMotion();
  const durations = useMemo(() => [3800, 2200, 9800], []);
  const scene = useSceneLoop(durations, !!reduce);

  return (
    <DemoFrame badge="Wellness Support" accent={ACCENT} contentHeight={400}>
      <AnimatePresence mode="wait" initial={false}>
        {scene === 0 ? (
          <TopicChooserScene key="chooser" />
        ) : scene === 1 ? (
          <MatchingScene key="matching" />
        ) : (
          <ChatDialogScene key="chat" />
        )}
      </AnimatePresence>
    </DemoFrame>
  );
};

export default WellnessDemo;

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import {
  AtSign,
  CircleUserRound,
  MessageCircle,
  Paperclip,
  Plus,
  Sigma,
  Smile,
} from "lucide-react";
import DemoFrame from "./DemoFrame";
import MockCursor from "./MockCursor";
import TypedInput from "./TypedInput";
import { useSceneLoop } from "./useSceneLoop";

const ACCENT = "#7CDCBD";

type Person = {
  name: string;
  initials: string;
  color: string;
  ringColor: string;
};

const JP: Person = {
  name: "JP",
  initials: "JP",
  color: "#7CDCBD",
  ringColor: "rgba(52,211,153,0.25)",
};
const ALEX: Person = {
  name: "Alex",
  initials: "AX",
  color: "#A78BFA",
  ringColor: "rgba(167,139,250,0.3)",
};
const REMY: Person = {
  name: "Remy",
  initials: "RM",
  color: "#F472B6",
  ringColor: "rgba(244,114,182,0.3)",
};

const Avatar = ({ person, size = 32 }: { person: Person; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center text-[11px] font-semibold text-[#0A0D17] shrink-0"
    style={{
      width: size,
      height: size,
      background: person.color,
      boxShadow: `0 0 0 2px ${person.ringColor}`,
    }}
  >
    {person.initials}
  </div>
);

/* ------------------------------------------------------------------ */
/* Scene 1 — HelpBoard list view                                       */
/* ------------------------------------------------------------------ */

const HelpBoardScene = () => {
  return (
    <motion.div
      key="board"
      className="absolute inset-0 flex flex-col bg-[#0A0D17]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* In-app header */}
      <div className="px-3 pt-3 pb-2">
        <div className="text-[12px] font-bold text-white font-syncopate tracking-tight">
          Academic Center
        </div>
        <div className="text-[9.5px] text-white/50 mt-0.5">
          Post your problems and help others solve theirs
        </div>
      </div>

      {/* Post a Problem button */}
      <motion.div
        className="px-3 pb-2"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <div
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10.5px] font-semibold text-[#0A0D17]"
          style={{
            background: ACCENT,
            boxShadow: "0 0 14px -4px rgba(124,220,189,0.45)",
          }}
        >
          <span className="flex items-center justify-center w-3.5 h-3.5 rounded bg-[#0A0D17]/15">
            <Plus className="w-2.5 h-2.5" strokeWidth={3} />
          </span>
          Post a Problem
        </div>
      </motion.div>

      {/* Category tabs */}
      <motion.div
        className="px-3 pb-2.5 flex gap-3 text-[10px]"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18, duration: 0.3 }}
      >
        {[
          { label: "All", active: false },
          { label: "Mathematics", active: true },
          { label: "Science", active: false },
          { label: "English", active: false },
        ].map((c) => (
          <span
            key={c.label}
            className={`pb-0.5 border-b-2 ${
              c.active
                ? "text-white border-white font-semibold"
                : "text-white/45 border-transparent"
            }`}
          >
            {c.label}
          </span>
        ))}
      </motion.div>

      {/* HelpBoardCard */}
      <motion.div
        className="mx-3 rounded-xl border border-[#1b1f30] bg-[#101320] overflow-hidden"
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.28, duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="px-3 pt-2.5 pb-2">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="w-fit text-[9px] font-medium text-slate-200/90 px-1.5 py-0.5 rounded bg-[#181c2c] border border-slate-600/40">
                Algebra II
              </span>
              <span className="text-[8.5px] uppercase tracking-[0.12em] text-slate-500">
                Mathematics
              </span>
            </div>
            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300">
              Medium urgency
            </span>
          </div>
          <div className="text-[12px] text-white font-semibold leading-snug mb-1">
            Need help with completing the square
          </div>
          <div className="text-[10.5px] text-white/55 leading-snug line-clamp-2">
            I keep getting stuck on the +c step — anyone free to walk me through
            it before tomorrow?
          </div>
        </div>
        <div className="border-t border-white/[0.05] px-3 py-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Avatar person={JP} size={20} />
            <div className="leading-tight">
              <div className="text-[10px] text-slate-100">JP</div>
              <div className="text-[8.5px] text-slate-500">5m ago</div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[9.5px] text-white/55">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" style={{ color: ACCENT }} />
              <span className="font-medium">3</span>
            </div>
            <div className="flex items-center gap-1 opacity-70">
              <Paperclip className="w-3 h-3" />
              <span>No attachment</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Second faint card peeking */}
      <motion.div
        className="mx-3 mt-2 rounded-xl border border-[#1b1f30] bg-[#101320] px-3 py-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] text-slate-200/90 px-1.5 py-0.5 rounded bg-[#181c2c] border border-slate-600/40">
            Calculus
          </span>
          <span className="text-[8.5px] text-blue-300/80">Low</span>
        </div>
        <div className="text-[10.5px] text-white/85 truncate">
          Why does u-substitution work here?
        </div>
      </motion.div>

      {/* "Opening…" cue */}
      <motion.div
        className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-white/35 font-medium tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1] }}
        transition={{ duration: 2.6, times: [0, 0.7, 1] }}
      >
        Opening conversation…
      </motion.div>

      {/* Cursor path: enter → hover Mathematics tab → click HelpBoard card */}
      <MockCursor
        waypoints={[
          { t: 0.4, x: 92, y: 92 },
          { t: 1.5, x: 22, y: 27 },
          { t: 2.6, x: 50, y: 50 },
          { t: 3.0, x: 50, y: 50, click: true },
        ]}
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — ProblemChatDialog view                                    */
/* ------------------------------------------------------------------ */

type ChatMessage = {
  id: number;
  person: Person;
  text: string;
  isOwn: boolean;
  delay: number;
};

const CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    person: ALEX,
    text: "Move the constant over, then halve b.",
    isOwn: false,
    delay: 0.4,
  },
  {
    id: 2,
    person: JP,
    text: "ohhh wait, divide it by 2?",
    isOwn: true,
    delay: 3.1,
  },
  {
    id: 3,
    person: REMY,
    text: "Yes — then square (b/2) and add it to both sides.",
    isOwn: false,
    delay: 4.2,
  },
];

const Bubble = ({ msg }: { msg: ChatMessage }) => {
  const { person, text, isOwn } = msg;
  return (
    <motion.div
      className={`flex items-end gap-1.5 ${isOwn ? "flex-row-reverse" : ""}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: msg.delay }}
    >
      <Avatar person={person} size={22} />
      <div
        className={`flex flex-col min-w-0 max-w-[78%] ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`flex items-baseline gap-1.5 mb-0.5 px-0.5 text-[9px] ${
            isOwn ? "flex-row-reverse" : ""
          }`}
        >
          <span className="font-semibold text-white/90 truncate">
            {isOwn ? "You" : person.name}
          </span>
          <span className="text-white/35 tabular-nums">now</span>
        </div>
        <div
          className={[
            "px-2.5 py-1.5 text-[10.5px] leading-snug w-fit max-w-full",
            "rounded-[1rem] break-words text-gray-100 bg-transparent border",
            isOwn
              ? "rounded-br-[0.4rem] border-emerald-400/40 shadow-[0_0_18px_-10px_rgba(52,211,153,0.4)]"
              : "rounded-bl-[0.4rem] border-violet-400/35 shadow-[0_0_18px_-10px_rgba(167,139,250,0.3)]",
          ].join(" ")}
        >
          {text}
        </div>
      </div>
    </motion.div>
  );
};

const ChatDialogScene = () => {
  return (
    <motion.div
      key="chat"
      className="absolute inset-0 flex flex-col bg-[#11141d]"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {/* Dialog header */}
      <div className="px-3 py-2.5 border-b border-white/10">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-white leading-tight line-clamp-2">
              Need help with completing the square
            </div>
            <div className="mt-1 flex items-center gap-1 flex-wrap">
              <span
                className="text-[8.5px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: `${ACCENT}26`, color: ACCENT }}
              >
                Algebra II
              </span>
              <span className="text-[8.5px] px-1.5 py-0.5 rounded-full uppercase tracking-wide bg-yellow-500/20 text-yellow-300">
                Medium
              </span>
              <span className="text-[8.5px] text-white/45 truncate">
                Help JP solve it
              </span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 rounded-full bg-[#181c27] px-2 py-0.5 shrink-0">
            <CircleUserRound className="h-2.5 w-2.5 text-emerald-400" />
            <span className="text-[9px] font-semibold text-white">3</span>
            <span className="text-[8.5px] text-white/45">online</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-3 py-2.5 space-y-2 bg-[#0d1019] overflow-hidden">
        {CHAT_MESSAGES.map((m) => (
          <Bubble key={m.id} msg={m} />
        ))}

        {/* Typing indicator */}
        <motion.div
          className="px-1 text-[9.5px] text-white/45 flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 5.4, duration: 0.3 }}
        >
          <span>Nova is typing</span>
          <span className="flex gap-[2px]">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-white/45"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  delay: i * 0.18,
                }}
              />
            ))}
          </span>
        </motion.div>
      </div>

      {/* Input bar */}
      <div className="border-t border-white/10 bg-[#11141d] px-2.5 py-2">
        <div className="rounded-lg border border-white/10 bg-[#0d1019]">
          <div className="px-2.5 py-2 text-[10.5px]">
            <TypedInput
              placeholder="Message…"
              placeholderClassName="text-white/35"
              textClassName="text-white/95"
              sequences={[
                {
                  text: "ohhh wait, divide it by 2?",
                  typeStart: 1.0,
                  charDelay: 0.045,
                  clearAt: 3.0,
                },
              ]}
            />
          </div>
          <div className="flex items-center gap-1 border-t border-white/[0.06] bg-[#0a0c12]/90 px-1.5 py-1">
            <button
              type="button"
              className="rounded p-1 text-white/45"
              tabIndex={-1}
            >
              <AtSign className="w-3 h-3" />
            </button>
            <button
              type="button"
              className="rounded p-1 text-white/45"
              tabIndex={-1}
            >
              <Sigma className="w-3 h-3" />
            </button>
            <button
              type="button"
              className="rounded p-1 text-white/45"
              tabIndex={-1}
            >
              <Smile className="w-3 h-3" />
            </button>
            <div className="ml-auto flex items-center justify-center w-6 h-6 rounded-full bg-[#7CDCBD]/40">
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="#0a0d17"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Cursor path: enter → hover input while JP types → click send → drift up to read */}
      <MockCursor
        waypoints={[
          { t: 0.0, x: 95, y: 95 },
          { t: 0.8, x: 50, y: 86 },
          { t: 2.7, x: 50, y: 86 },
          { t: 2.9, x: 92, y: 94 },
          { t: 3.0, x: 92, y: 94, click: true },
          { t: 4.2, x: 35, y: 40 },
          { t: 5.8, x: 25, y: 65 },
        ]}
      />
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Demo                                                                */
/* ------------------------------------------------------------------ */

const AcademicHubDemo = () => {
  const reduce = useReducedMotion();
  const durations = useMemo(() => [3800, 7200], []);
  const scene = useSceneLoop(durations, !!reduce);

  return (
    <DemoFrame badge="Academic Center" accent={ACCENT} contentHeight={400}>
      <AnimatePresence mode="wait" initial={false}>
        {scene === 0 ? <HelpBoardScene key="board" /> : <ChatDialogScene key="chat" />}
      </AnimatePresence>
    </DemoFrame>
  );
};

export default AcademicHubDemo;

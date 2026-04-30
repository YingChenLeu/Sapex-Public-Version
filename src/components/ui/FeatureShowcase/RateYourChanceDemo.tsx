import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import {
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import DemoFrame from "./DemoFrame";
import MockCursor from "./MockCursor";
import TypedInput from "./TypedInput";
import { useSceneLoop } from "./useSceneLoop";

const ACCENT = "#7CDCBD";

const chips = ["Anonymous", "Peer verdicts", "Actionable comments"] as const;

const profiles = [
  {
    school: "Stanford University",
    track: "Computer Science",
    region: "East Asia",
    chance: 71,
    ratings: 18,
    comments: 6,
    glow: "#7CDCBD",
    featured: true,
  },
  {
    school: "MIT",
    track: "Physics",
    region: "North America",
    chance: 42,
    ratings: 9,
    comments: 3,
    glow: "#A78BFA",
  },
  {
    school: "UCLA",
    track: "Biology",
    region: "North America",
    chance: 63,
    ratings: 12,
    comments: 4,
    glow: "#60A5FA",
  },
] as const;

const crowdMix = [
  { label: "Reach", pct: 18, color: "#F87171" },
  { label: "Target", pct: 47, color: "#FBBF24" },
  { label: "Likely", pct: 27, color: "#7CDCBD" },
  { label: "Safety", pct: 8, color: "#60A5FA" },
] as const;

const FeedScene = () => (
  <motion.div
    key="feed"
    className="absolute inset-0 flex flex-col bg-[#0A0D17]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    <div className="px-3 pt-3 pb-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-[12px] font-bold text-white font-syncopate tracking-tight">
            Rate Your Chance
          </div>
          <div className="mt-0.5 text-[9.5px] leading-snug text-white/55">
            Post anonymously. Get honest peer reads on your application.
          </div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-[#0A0D17]"
          style={{
            background: ACCENT,
            boxShadow: "0 0 14px -4px rgba(124,220,189,0.5)",
          }}
        >
          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
          Live
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-white/70"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>

    <motion.div
      className="mx-3 rounded-xl border border-emerald-400/20 bg-emerald-400/8 px-3 py-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.3 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7CDCBD]/15">
            <TrendingUp className="h-3.5 w-3.5 text-[#7CDCBD]" />
          </div>
          <div>
            <div className="text-[10px] font-semibold text-white">
              High activity tonight
            </div>
            <div className="text-[9px] text-white/55">
              27 fresh ratings in the last hour
            </div>
          </div>
        </div>
        <span className="rounded-full bg-[#7CDCBD]/15 px-2 py-0.5 text-[9px] font-semibold text-[#7CDCBD]">
          +9 now
        </span>
      </div>
    </motion.div>

    <div className="px-3 pb-2 pt-2">
      <div className="space-y-2 rounded-2xl border border-white/10 bg-[#12162A]/75 p-2.5">
        {profiles.map((profile, index) => (
          <ProfileCard key={profile.school} {...profile} index={index} />
        ))}
      </div>
    </div>

    <div className="mt-auto px-3 pb-3">
      <motion.div
        className="rounded-xl border border-white/10 bg-[#0C111C]/75 px-3 py-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ delay: 2.1, duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/70">
            Open the hottest profile to review
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7CDCBD]">
            Review
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </motion.div>
    </div>

    <MockCursor
      waypoints={[
        { t: 0.3, x: 94, y: 94 },
        { t: 1.2, x: 76, y: 43 },
        { t: 2.6, x: 76, y: 43, click: true },
        { t: 3.8, x: 82, y: 46 },
      ]}
    />
  </motion.div>
);

const ReviewScene = () => (
  <motion.div
    key="review"
    className="absolute inset-0 flex flex-col bg-[#0A0D17]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    <div className="px-3 pt-3 pb-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[12px] font-bold text-white font-syncopate tracking-tight">
            Anonymous Review
          </div>
          <div className="mt-0.5 text-[9.5px] leading-snug text-white/55">
            Crowd signal plus context, not a final admissions verdict.
          </div>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[9px] text-white/65">
          18 peers rated
        </span>
      </div>
    </div>

    <div className="px-3 pb-2">
      <div className="rounded-2xl border border-white/10 bg-[#12162A]/75 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-white/45">
              <GraduationCap className="h-3 w-3" />
              Dream school
            </div>
            <div className="mt-1 text-[13px] font-semibold leading-snug text-white">
              Stanford University
            </div>
            <div className="mt-0.5 text-[10px] text-white/55">
              CS · East Asia · strong spike in robotics
            </div>
          </div>
          <div className="rounded-xl border border-[#7CDCBD]/20 bg-[#7CDCBD]/10 px-2.5 py-2 text-right">
            <div className="text-[8.5px] uppercase tracking-[0.18em] text-[#7CDCBD]/75">
              Avg chance
            </div>
            <div className="text-[18px] font-bold tabular-nums text-white">71%</div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {crowdMix.map((item, index) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/10 bg-[#0A0D17]/60 px-2 py-2"
            >
              <div className="flex items-center justify-between gap-2 text-[8.5px] uppercase tracking-[0.14em]">
                <span style={{ color: item.color }}>{item.label}</span>
                <span className="tabular-nums text-white/60">{item.pct}%</span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ delay: 0.15 + index * 0.06, duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="px-3 pb-2">
      <div className="rounded-2xl border border-white/10 bg-[#0C111C]/80 p-3">
        <div className="flex items-center justify-between text-[10px] text-white/65">
          <span>Your rating</span>
          <span className="font-semibold tabular-nums text-white">68%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: ACCENT }}
            initial={{ width: "0%" }}
            animate={{ width: ["0%", "68%"] }}
            transition={{ delay: 0.45, duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { label: "Reach", active: false },
            { label: "Target", active: true },
            { label: "Likely", active: false },
            { label: "Safety", active: false },
          ].map((option) => (
            <span
              key={option.label}
              className={`rounded-full border px-2 py-0.5 text-[9px] ${
                option.active
                  ? "border-[#7CDCBD]/55 bg-[#7CDCBD]/15 text-[#7CDCBD]"
                  : "border-white/10 bg-white/5 text-white/65"
              }`}
            >
              {option.label}
            </span>
          ))}
        </div>
      </div>
    </div>

    <div className="px-3 pb-3">
      <div className="rounded-2xl border border-white/10 bg-[#12162A]/75 p-3">
        <div className="flex items-center justify-between text-[10px] text-white/65">
          <span>Anonymous comment</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[9px] text-white/55">
            <ShieldCheck className="h-3 w-3" />
            respectful only
          </span>
        </div>
        <div className="mt-2 rounded-xl border border-white/10 bg-[#0A0D17]/70 px-2.5 py-2 text-[10px] text-white/75">
          <TypedInput
            placeholder="Leave advice for this student"
            placeholderClassName="text-white/35"
            textClassName="text-white/85"
            sequences={[
              {
                text: "Strong rigor and clear spike. Essays could push this into a target.",
                typeStart: 0.7,
                charDelay: 0.03,
              },
            ]}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[9px] text-white/40">Advice is anonymous</span>
          <motion.div
            className="inline-flex items-center gap-1 rounded-lg bg-[#7CDCBD] px-2.5 py-1 text-[9.5px] font-semibold text-[#0A0D17]"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ delay: 2.9, duration: 0.5 }}
          >
            <Send className="h-3 w-3" />
            Post
          </motion.div>
        </div>
      </div>
    </div>

    <MockCursor
      waypoints={[
        { t: 0.2, x: 93, y: 93 },
        { t: 0.8, x: 43, y: 60 },
        { t: 1.5, x: 58, y: 60, click: true },
        { t: 1.9, x: 53, y: 60 },
        { t: 2.8, x: 47, y: 84 },
        { t: 4.7, x: 47, y: 84 },
        { t: 5.1, x: 85, y: 90 },
        { t: 5.25, x: 85, y: 90, click: true },
      ]}
    />
  </motion.div>
);

const ResultScene = () => (
  <motion.div
    key="result"
    className="absolute inset-0 flex flex-col bg-[#0A0D17]"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    <div className="px-3 pt-3 pb-2">
      <motion.div
        className="rounded-xl border border-[#7CDCBD]/20 bg-[#7CDCBD]/10 px-3 py-2"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7CDCBD]/15">
              <CheckCircle2 className="h-4 w-4 text-[#7CDCBD]" />
            </div>
            <div>
              <div className="text-[10px] font-semibold text-white">
                Your review was added
              </div>
              <div className="text-[9px] text-white/55">
                Crowd consensus refreshed instantly
              </div>
            </div>
          </div>
          <span className="rounded-full bg-[#7CDCBD]/15 px-2 py-0.5 text-[9px] font-semibold text-[#7CDCBD]">
            Live
          </span>
        </div>
      </motion.div>
    </div>

    <div className="px-3 pb-2">
      <div className="rounded-2xl border border-white/10 bg-[#12162A]/75 p-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] text-white/70">Stanford University</div>
            <div className="mt-0.5 text-[13px] font-semibold text-white">
              Community snapshot
            </div>
          </div>
          <motion.div
            className="text-right"
            initial={{ scale: 0.94, opacity: 0.8 }}
            animate={{ scale: [0.94, 1.04, 1], opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/45">
              New avg
            </div>
            <div className="text-[22px] font-bold tabular-nums text-white">73%</div>
          </motion.div>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
          <div className="space-y-2">
            <SignalRow label="Target votes" value="51%" color="#FBBF24" width="51%" />
            <SignalRow label="Likely votes" value="29%" color="#7CDCBD" width="29%" />
            <SignalRow label="Helpful comments" value="7" color="#60A5FA" width="82%" />
          </div>
          <div className="rounded-xl border border-white/10 bg-[#0A0D17]/60 px-3 py-2">
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/40">
              Momentum
            </div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#7CDCBD]">
              <TrendingUp className="h-3.5 w-3.5" />
              +2%
            </div>
            <div className="mt-2 flex -space-x-1">
              {["#7CDCBD", "#A78BFA", "#60A5FA", "#FBBF24"].map((color, index) => (
                <motion.span
                  key={color}
                  className="flex h-5 w-5 items-center justify-center rounded-full border border-[#0A0D17] text-[7px] font-semibold text-[#0A0D17]"
                  style={{ background: color }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.08, duration: 0.25 }}
                >
                  {index + 1}
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="px-3 pb-2">
      <div className="rounded-2xl border border-white/10 bg-[#0C111C]/80 p-3">
        <div className="flex items-center justify-between text-[10px] text-white/65">
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="h-3.5 w-3.5 text-[#7CDCBD]" />
            Newest advice
          </span>
          <span className="text-white/45">anonymous</span>
        </div>
        <motion.div
          className="mt-2 rounded-xl border border-[#7CDCBD]/20 bg-[#7CDCBD]/8 px-2.5 py-2 text-[10px] leading-snug text-white/80"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
        >
          Strong rigor and clear spike. Essays could push this into a target.
        </motion.div>
        <div className="mt-2 flex items-center justify-between text-[9px] text-white/45">
          <span>Marked helpful by 4 peers</span>
          <span className="inline-flex items-center gap-1 text-[#7CDCBD]">
            <Star className="h-3 w-3 fill-current" />
            top insight
          </span>
        </div>
      </div>
    </div>

    <div className="mt-auto px-3 pb-3">
      <div className="rounded-2xl border border-white/10 bg-[#12162A]/75 px-3 py-2.5">
        <div className="flex items-center justify-between text-[10px] text-white/65">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#7CDCBD]" />
            19 ratings now
          </span>
          <span className="inline-flex items-center gap-1.5 text-[#7CDCBD]">
            <Sparkles className="h-3 w-3" />
            feedback loop
          </span>
        </div>
      </div>
    </div>
  </motion.div>
);

const ProfileCard = ({
  school,
  track,
  region,
  chance,
  ratings,
  comments,
  glow,
  featured = false,
  index,
}: {
  school: string;
  track: string;
  region: string;
  chance: number;
  ratings: number;
  comments: number;
  glow: string;
  featured?: boolean;
  index: number;
}) => (
  <motion.div
    className={`rounded-2xl border px-3 py-2.5 ${
      featured
        ? "border-[#7CDCBD]/30 bg-[#0A0D17]/85"
        : "border-white/10 bg-[#0A0D17]/60"
    }`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.12 + index * 0.08, duration: 0.28 }}
    style={
      featured
        ? { boxShadow: "0 0 0 1px rgba(124,220,189,0.08), 0 0 24px rgba(124,220,189,0.08)" }
        : undefined
    }
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <div
            className="h-6 w-6 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${glow}55, transparent)`,
              border: `1px solid ${glow}22`,
            }}
          />
          <div className="min-w-0">
            <div className="truncate text-[11px] font-semibold leading-snug text-white">
              {school}
            </div>
            <div className="truncate text-[9.5px] text-white/55">
              {track} · {region}
            </div>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[9px] uppercase tracking-[0.18em] text-white/40">Chance</div>
        <div className="text-[13px] font-bold tabular-nums text-white">{chance}%</div>
      </div>
    </div>

    <div className="mt-2 flex items-center justify-between text-[9px] text-white/60">
      <span className="inline-flex items-center gap-1">
        <Users className="h-3.5 w-3.5" style={{ color: glow }} />
        {ratings}
      </span>
      <span className="inline-flex items-center gap-1">
        <MessageCircle className="h-3.5 w-3.5" style={{ color: glow }} />
        {comments}
      </span>
      <span className="inline-flex items-center gap-1">
        <Star className="h-3.5 w-3.5" style={{ color: glow }} />
        crowd
      </span>
    </div>
  </motion.div>
);

const SignalRow = ({
  label,
  value,
  color,
  width,
}: {
  label: string;
  value: string;
  color: string;
  width: string;
}) => (
  <div>
    <div className="flex items-center justify-between gap-2 text-[9px] text-white/60">
      <span>{label}</span>
      <span className="font-semibold text-white/80">{value}</span>
    </div>
    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/5">
      <motion.div
        className="h-full rounded-full"
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      />
    </div>
  </div>
);

const RateYourChanceDemo = () => {
  const reduceMotion = useReducedMotion();
  const durations = useMemo(() => [4200, 5600, 4600], []);
  const scene = useSceneLoop(durations, !!reduceMotion);

  return (
    <DemoFrame badge="Rate Your Chance" accent={ACCENT} contentHeight={400}>
      <AnimatePresence mode="wait" initial={false}>
        {scene === 0 ? (
          <FeedScene key="feed" />
        ) : scene === 1 ? (
          <ReviewScene key="review" />
        ) : (
          <ResultScene key="result" />
        )}
      </AnimatePresence>
    </DemoFrame>
  );
};

export default RateYourChanceDemo;

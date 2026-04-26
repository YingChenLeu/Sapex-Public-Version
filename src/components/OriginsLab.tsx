"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Film,
  Music2,
  Video,
  PenTool,
  Cpu,
  BookOpen,
  Sparkles,
  ArrowLeft,
  Plus,
  Trash2,
  Lightbulb,
  Loader2,
  Wrench,
  Leaf,
  Atom,
  Dna,
  HandHelping,
  TrendingUp,
  Stethoscope,
} from "lucide-react";
import { useSidebar } from "./SideBar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const ORIGINS_LABS_COLLECTION = "origins-labs";

type OriginsSession = {
  id: string;
  userId: string;
  userDisplayName: string | null;
  userEmail: string | null;
  fieldId: string;
  fieldLabel: string;
  ideas: string[];
  expandedIdea: string | null;
};

function getSessionDocId(uid: string, fieldId: string) {
  return `${uid}_${fieldId}`;
}

const FIELDS = [
  { id: "fine-arts", label: "Fine Arts", icon: Palette, color: "#A78BFA" },
  { id: "animation", label: "Animation", icon: Film, color: "#F472B6" },
  { id: "music", label: "Music", icon: Music2, color: "#7CDCBD" },
  { id: "film", label: "Film & Video", icon: Video, color: "#F97316" },
  { id: "design", label: "Design", icon: PenTool, color: "#5FBFAA" },
  { id: "technology", label: "Technology", icon: Cpu, color: "#60A5FA" },
  { id: "engineering", label: "Engineering", icon: Wrench, color: "#94A3B8" },
  {
    id: "environmental-science",
    label: "Environmental Science",
    icon: Leaf,
    color: "#22C55E",
  },
  { id: "physics", label: "Physics", icon: Atom, color: "#A78BFA" },
  { id: "biochemistry", label: "Biochemistry", icon: Dna, color: "#EC4899" },
  { id: "medicine", label: "Medicine", icon: Stethoscope, color: "#EF4444" },
  {
    id: "economics-business",
    label: "Economics / Business",
    icon: TrendingUp,
    color: "#3B82F6",
  },
  { id: "service", label: "Service", icon: HandHelping, color: "#F59E0B" },
  { id: "writing", label: "Writing", icon: BookOpen, color: "#FBBF24" },
] as const;

const PROMPTS: Record<string, string[]> = {
  "fine-arts": [
    "What would you make if you had no limits?",
    "What emotion do you want people to feel when they see your work?",
    "What medium have you never tried but want to?",
  ],
  animation: [
    "What story do you want to tell in 60 seconds?",
    "What character or world lives in your head?",
    "What would make you laugh or cry if you saw it animated?",
  ],
  music: [
    "What sound or mood do you want to capture?",
    "What would you create if you could collaborate with anyone?",
    "What genre or instrument do you want to explore?",
  ],
  film: [
    "What moment in your life would make a great short film?",
    "What documentary topic are you curious about?",
    "What would you shoot with one day and no budget?",
  ],
  design: [
    "What product or app do you wish existed?",
    "Who would benefit most from something you could design?",
    "What problem in daily life could design solve?",
  ],
  technology: [
    "What would you build to help your school or community?",
    "What boring task would you love to automate?",
    "What app or tool do you wish you had?",
  ],
  engineering: [
    "What system or machine would you want to build or improve?",
    "What real-world problem could engineering solve in your community?",
    "What project would you tackle if you had the skills and resources?",
  ],
  "environmental-science": [
    "What environmental issue do you want to understand or address?",
    "What would you study in the field if you had unlimited time?",
    "What change do you wish to see in how we treat the planet?",
  ],
  physics: [
    "What question about how the universe works do you want to answer?",
    "What phenomenon would you love to measure or model?",
    "What experiment would you run if you had the equipment?",
  ],
  biochemistry: [
    "What process in living systems fascinates you most?",
    "What would you want to discover or design at the molecular level?",
    "What question at the intersection of biology and chemistry drives you?",
  ],
  medicine: [
    "What aspect of health or healing do you want to improve?",
    "Who would you most want to help as a future clinician or researcher?",
    "What medical or public health problem would you tackle first?",
  ],
  "economics-business": [
    "What kind of venture or initiative would you want to start?",
    "What market or community need do you want to address?",
    "What would you build or change in the economy or in business?",
  ],
  service: [
    "Who or which community do you most want to serve?",
    "What kind of impact do you want to have on people's lives?",
    "What cause or need would you dedicate your time to?",
  ],
  writing: [
    "What story have you never told anyone?",
    "What world would you want to live in on the page?",
    "Who is the audience you most want to reach?",
  ],
};

const DEFAULT_PROMPTS = [
  "What problem bothers you in this field?",
  "What would you make just for fun?",
  "What do you wish existed?",
];

export const OriginsLab = () => {
  const { collapsed } = useSidebar();
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<string[]>([]);
  const [newIdea, setNewIdea] = useState("");
  const [expandedIdea, setExpandedIdea] = useState("");
  const [promptIndex, setPromptIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [everyoneSessions, setEveryoneSessions] = useState<OriginsSession[]>(
    []
  );
  const [loadingEveryone, setLoadingEveryone] = useState(false);

  const auth = getAuth();
  const uid = auth.currentUser?.uid ?? localStorage.getItem("uid");

  const fieldConfig = selectedField
    ? FIELDS.find((f) => f.id === selectedField)
    : null;
  const prompts = selectedField
    ? PROMPTS[selectedField] ?? DEFAULT_PROMPTS
    : DEFAULT_PROMPTS;
  const currentPrompt = prompts[promptIndex % prompts.length];

  // Load saved session from Firestore when user selects a field
  useEffect(() => {
    if (!selectedField || !uid) {
      setIdeas([]);
      setExpandedIdea("");
      return;
    }
    const loadSession = async () => {
      setLoading(true);
      try {
        const docRef = doc(
          db,
          ORIGINS_LABS_COLLECTION,
          getSessionDocId(uid, selectedField)
        );
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setIdeas(Array.isArray(data.ideas) ? data.ideas : []);
          setExpandedIdea(
            typeof data.expandedIdea === "string" ? data.expandedIdea : ""
          );
        } else {
          setIdeas([]);
          setExpandedIdea("");
        }
      } catch (err) {
        console.error("Failed to load Origins Lab session:", err);
        setIdeas([]);
        setExpandedIdea("");
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, [selectedField, uid]);

  const fetchEveryoneSessions = useCallback(async () => {
    if (!selectedField) return;
    setLoadingEveryone(true);
    try {
      const q = query(
        collection(db, ORIGINS_LABS_COLLECTION),
        where("fieldId", "==", selectedField)
      );
      const snap = await getDocs(q);
      const sessions: OriginsSession[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          userId: data.userId ?? "",
          userDisplayName: data.userDisplayName ?? null,
          userEmail: data.userEmail ?? null,
          fieldId: data.fieldId ?? "",
          fieldLabel: data.fieldLabel ?? "",
          ideas: Array.isArray(data.ideas) ? data.ideas : [],
          expandedIdea: data.expandedIdea ?? null,
        };
      });
      setEveryoneSessions(sessions);
    } catch (err) {
      console.error("Failed to fetch everyone's ideas:", err);
      setEveryoneSessions([]);
    } finally {
      setLoadingEveryone(false);
    }
  }, [selectedField]);

  useEffect(() => {
    if (!selectedField) {
      setEveryoneSessions([]);
      return;
    }
    fetchEveryoneSessions();
  }, [selectedField, fetchEveryoneSessions]);

  // Persist ideas and expandedIdea to Firestore (always store email from auth or users collection)
  const saveToFirestore = useCallback(
    async (ideasToSave: string[], expandedToSave: string) => {
      if (!uid || !selectedField || !fieldConfig) return;
      setSaving(true);
      try {
        let userEmail: string | null = auth.currentUser?.email ?? null;
        if (!userEmail) {
          const userSnap = await getDoc(doc(db, "users", uid));
          if (userSnap.exists()) {
            const data = userSnap.data();
            userEmail = typeof data.email === "string" ? data.email : null;
          }
        }

        const docRef = doc(
          db,
          ORIGINS_LABS_COLLECTION,
          getSessionDocId(uid, selectedField)
        );
        const snap = await getDoc(docRef);
        const payload: Record<string, unknown> = {
          userId: uid,
          userDisplayName: auth.currentUser?.displayName ?? null,
          userEmail,
          fieldId: selectedField,
          fieldLabel: fieldConfig.label,
          ideas: ideasToSave,
          expandedIdea: expandedToSave || null,
          updatedAt: serverTimestamp(),
        };
        if (!snap.exists()) {
          payload.createdAt = serverTimestamp();
        }
        await setDoc(docRef, payload, { merge: true });
        await fetchEveryoneSessions();
      } catch (err) {
        console.error("Failed to save Origins Lab session:", err);
      } finally {
        setSaving(false);
      }
    },
    [
      uid,
      selectedField,
      fieldConfig,
      auth.currentUser?.displayName,
      auth.currentUser?.email,
      fetchEveryoneSessions,
    ]
  );

  const handleAddIdea = () => {
    const trimmed = newIdea.trim();
    if (trimmed) {
      const next = [...ideas, trimmed];
      setIdeas(next);
      setNewIdea("");
      saveToFirestore(next, expandedIdea);
    }
  };

  const handleRemoveIdea = (index: number) => {
    const next = ideas.filter((_, i) => i !== index);
    setIdeas(next);
    saveToFirestore(next, expandedIdea);
  };

  const handleClearAllIdeas = () => {
    setIdeas([]);
    saveToFirestore([], expandedIdea);
  };

  const handleExpandedIdeaChange = (value: string) => {
    setExpandedIdea(value);
  };

  const handleExpandedIdeaBlur = () => {
    saveToFirestore(ideas, expandedIdea);
  };

  const handleBack = () => {
    setSelectedField(null);
    setIdeas([]);
    setNewIdea("");
    setExpandedIdea("");
    setPromptIndex(0);
  };

  const ease = [0.4, 0, 0.2, 1] as const;

  return (
    <div
      className={`bg-[#0A0D17] min-h-screen pt-[30px] pb-16 transition-all duration-300 ${
        collapsed ? "pl-[74px] sm:pl-[96px]" : "pl-[220px] xl:pl-[280px]"
      }`}
    >
      <div className="px-6 md:px-10 pb-12">
        {/* Header */}
        <motion.header
          className="flex items-center gap-3 mb-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#7CDCBD]/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#7CDCBD]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white font-syncopate tracking-tight">
              Origins Lab
            </h1>
            <p className="text-muted-foreground text-sm mt-0.5">
              Pick a field and brainstorm project ideas
            </p>
          </div>
        </motion.header>

        <AnimatePresence mode="wait">
          {!selectedField ? (
            /* Field selection */
            <motion.div
              key="fields"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease }}
              className="mt-8"
            >
              <motion.p
                className="text-muted-foreground mb-6 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.08, ease }}
              >
                Choose a majority or interest area to spark ideas. You’ll get
                prompts and space to jot down whatever comes to mind.
              </motion.p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {FIELDS.map((field, i) => {
                  const Icon = field.icon;
                  return (
                    <motion.button
                      key={field.id}
                      type="button"
                      onClick={() => setSelectedField(field.id)}
                      className="rounded-2xl border-2 bg-[#12162A] p-5 text-left transition-colors hover:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0A0D17]"
                      style={{
                        borderColor: `${field.color}40`,
                      }}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12 + i * 0.04, duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      whileHover={{
                        scale: 1.02,
                        borderColor: field.color,
                        boxShadow: `0 8px 24px ${field.color}20`,
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon
                        className="w-8 h-8 mb-3"
                        style={{ color: field.color }}
                      />
                      <span className="font-medium text-white block">
                        {field.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            /* Brainstorm view */
            <motion.div
              key="brainstorm"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              className="mt-8 max-w-2xl relative"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.05, ease }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-400 hover:text-white mb-6 gap-2 -ml-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change field
                </Button>
              </motion.div>

              {fieldConfig && (
                <motion.div
                  className="flex items-center gap-3 mb-6"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1, ease }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${fieldConfig.color}25` }}
                  >
                    <fieldConfig.icon
                      className="w-6 h-6"
                      style={{ color: fieldConfig.color }}
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {fieldConfig.label}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Brainstorm project ideas
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Prompt card */}
              <motion.div
                className="rounded-2xl border p-5 mb-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.15, ease }}
                style={{
                  borderColor: `${fieldConfig?.color ?? "#7CDCBD"}30`,
                  backgroundColor: `${fieldConfig?.color ?? "#7CDCBD"}08`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb
                    className="w-4 h-4 shrink-0"
                    style={{ color: fieldConfig?.color ?? "#7CDCBD" }}
                  />
                  <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    Prompt
                  </span>
                </div>
                <p className="text-white font-medium mb-4">{currentPrompt}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPromptIndex((i) => i + 1)}
                  className="border-gray-600 text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  Next prompt
                </Button>
              </motion.div>

              {/* Add idea */}
              <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2, ease }}
              >
                <label className="text-sm font-medium text-gray-300 block mb-2">
                  Add an idea
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newIdea}
                    onChange={(e) => setNewIdea(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddIdea()}
                    placeholder="Type an idea and press Enter or Add"
                    className="bg-[#12162A] border-gray-700 text-white placeholder:text-gray-500 flex-1"
                  />
                  <Button
                    onClick={handleAddIdea}
                    className="bg-[#7CDCBD] text-[#0A0D17] hover:bg-[#5FBFAA] shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </motion.div>

              {/* Ideas list */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.25, ease }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-400">
                    My ideas ({ideas.length})
                  </span>
                  {ideas.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-300 text-xs"
                      onClick={handleClearAllIdeas}
                    >
                      Clear all
                    </Button>
                  )}
                  {saving && (
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Saving…
                    </span>
                  )}
                </div>
                {ideas.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-700 p-8 text-center text-gray-500 text-sm">
                    No ideas yet. Use the prompt above and add whatever comes to
                    mind—you can refine later.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {ideas.map((idea, index) => (
                      <motion.li
                        key={`${idea}-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2 rounded-xl bg-[#12162A] border border-gray-800 p-3"
                      >
                        <span className="flex-1 text-white text-sm">
                          {idea}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIdea(index)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          aria-label="Remove idea"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </motion.div>

              {/* Optional: expand into full concept */}
              {ideas.length > 0 && (
                <motion.div
                  className="mt-8 rounded-2xl border border-white/10 bg-[#12162A]/80 p-5"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05, ease }}
                >
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Expand one idea (optional)
                  </label>
                  <Textarea
                    value={expandedIdea}
                    onChange={(e) => handleExpandedIdeaChange(e.target.value)}
                    onBlur={handleExpandedIdeaBlur}
                    placeholder="Pick one idea and describe it in more detail—who it's for, what it does, why it matters..."
                    className="min-h-[100px] bg-[#0A0D17] border-gray-700 text-white placeholder:text-gray-500 resize-none"
                  />
                </motion.div>
              )}

              {loading && (
                <div className="absolute inset-0 bg-[#0A0D17]/80 flex items-center justify-center rounded-2xl mt-8">
                  <Loader2 className="w-8 h-8 text-[#7CDCBD] animate-spin" />
                </div>
              )}

              {/* Everyone's ideas for this field */}
              <motion.div
                className="mt-12 pt-8 border-t border-white/10"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3, ease }}
              >
                <h3 className="text-lg font-semibold text-white mb-1">
                  Everyone&apos;s ideas
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ideas from everyone who brainstormed in {fieldConfig?.label}.
                </p>
                {loadingEveryone ? (
                  <div className="flex items-center gap-2 text-gray-500 py-6">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading…
                  </div>
                ) : everyoneSessions.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-700 p-6 text-center text-gray-500 text-sm">
                    No one has shared ideas for this field yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {everyoneSessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        className="rounded-xl border border-white/10 bg-[#12162A] p-4"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: index * 0.05,
                          ease,
                        }}
                      >
                        <div className="flex flex-wrap items-baseline gap-2 mb-2">
                          <span className="font-medium text-white">
                            {session.userDisplayName || "Anonymous"}
                          </span>
                          {session.userEmail && (
                            <span className="text-sm text-[#7CDCBD]">
                              {session.userEmail}
                            </span>
                          )}
                          {!session.userEmail && (
                            <span className="text-sm text-gray-500">
                              No email
                            </span>
                          )}
                        </div>
                        {session.ideas.length === 0 ? (
                          <p className="text-gray-500 text-sm">No ideas yet</p>
                        ) : (
                          <ul className="space-y-1.5">
                            {session.ideas.map((idea, i) => (
                              <li
                                key={`${session.id}-${i}`}
                                className="text-sm text-gray-300 pl-3 border-l-2 border-[#7CDCBD]/30"
                              >
                                {idea}
                              </li>
                            ))}
                          </ul>
                        )}
                        {session.expandedIdea && (
                          <div className="mt-3 pt-3 border-t border-white/5">
                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                              Expanded idea
                            </p>
                            <p className="text-sm text-gray-300 whitespace-pre-wrap">
                              {session.expandedIdea}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

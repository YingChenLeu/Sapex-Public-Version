import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "./SideBar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  BookOpen,
  Plus,
  Users,
  Clock,
  Video,
  User,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { incrementUsage } from "@/lib/stats";

const STUDY_SESSIONS_COLLECTION = "studySessions";

const JITSI_BASE = "https://meet.jit.si";

/** Sanitize subject for Jitsi room name: alphanumeric and hyphens only, max length. */
function toJitsiRoomName(subject: string): string {
  const sanitized = subject
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50);
  return sanitized || "StudyRoom";
}

/**
 * Jitsi URL config: no display name required, no prejoin required when possible,
 * no third-party requests, disable lobby/wait-for-moderator behavior where supported.
 */
const JITSI_GUEST_CONFIG =
  "&config.prejoinConfig.enabled=false" +
  "&config.disableThirdPartyRequests=true" +
  "&config.disableDeepLinking=true" +
  "&config.startWithAudioMuted=true" +
  "&config.startWithVideoMuted=true" +
  "&interfaceConfig.SHOW_JITSI_WATERMARK=false" +
  "&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false";

/** Generate a unique Jitsi Meet URL for a study session (guest-friendly, no moderator/auth required). */
function createJitsiLink(subject: string, sessionId: string): string {
  const room = `${toJitsiRoomName(subject)}-${sessionId.slice(0, 8)}`;
  const base = `${JITSI_BASE}/${encodeURIComponent(room)}`;
  return `${base}#${JITSI_GUEST_CONFIG}`;
}

export type StudySession = {
  id: string;
  subject: string;
  createdAt: Date;
  meetLink: string;
  createdBy: {
    uid: string;
    displayName: string;
    photoURL?: string;
  };
};

const StudyRooms = () => {
  const { collapsed } = useSidebar();
  const [subject, setSubject] = useState("");
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const q = query(
          collection(db, STUDY_SESSIONS_COLLECTION),
          orderBy("createdAt", "desc"),
        );
        const snapshot = await getDocs(q);
        const list: StudySession[] = snapshot.docs.map((docSnap) => {
          const d = docSnap.data();
          return {
            id: docSnap.id,
            subject: d.subject ?? "",
            createdAt: (d.createdAt as Timestamp)?.toDate?.() ?? new Date(),
            meetLink: d.meetLink ?? "",
            createdBy: {
              uid: d.createdBy?.uid ?? "",
              displayName: d.createdBy?.displayName ?? "Someone",
              photoURL: d.createdBy?.photoURL ?? undefined,
            },
          };
        });
        setSessions(list);
      } catch (err) {
        console.error("Failed to fetch study sessions:", err);
        toast.error("Could not load study sessions.");
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);
    const trimmed = subject.trim();
    if (!trimmed) return;

    const user = getAuth().currentUser;
    if (!user) {
      setCreateError("Please sign in to create a study session.");
      toast.error("Please sign in to create a study session.");
      return;
    }

    setCreating(true);
    try {
      const id = crypto.randomUUID();
      const meetLink = createJitsiLink(trimmed, id);

      const createdBy: Record<string, unknown> = {
        uid: user.uid,
        displayName: user.displayName ?? "Anonymous",
      };
      if (user.photoURL) createdBy.photoURL = user.photoURL;

      const docRef = await addDoc(collection(db, STUDY_SESSIONS_COLLECTION), {
        subject: trimmed,
        meetLink,
        createdAt: serverTimestamp(),
        createdBy,
      });

      await incrementUsage(db, "studyRoomsUsed");

      const newSession: StudySession = {
        id: docRef.id,
        subject: trimmed,
        createdAt: new Date(),
        meetLink,
        createdBy: {
          uid: user.uid,
          displayName: user.displayName ?? "Anonymous",
          photoURL: user.photoURL ?? undefined,
        },
      };
      setSessions((prev) => [newSession, ...prev]);
      setSubject("");
      setCreateError(null);
      toast.success("Study session created with Jitsi video room.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create study session.";
      setCreateError(message);
      console.error("Failed to create study session:", err);
      toast.error("Failed to create study session. Try again.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (sessionId: string) => {
    const user = getAuth().currentUser;
    const session = sessions.find((s) => s.id === sessionId);
    if (!user || !session || session.createdBy.uid !== user.uid) return;
    setDeletingId(sessionId);
    try {
      await deleteDoc(doc(db, STUDY_SESSIONS_COLLECTION, sessionId));
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      toast.success("Study session deleted.");
    } catch (err) {
      console.error("Failed to delete study session:", err);
      toast.error("Failed to delete session. Try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const currentUserId = getAuth().currentUser?.uid ?? null;
  const ease = [0.4, 0, 0.2, 1] as const;

  return (
    <div
      className={`bg-[#0A0D17] pt-[30px] min-h-screen pb-16 transition-all duration-300 ${
        collapsed ? "pl-[74px] sm:pl-[96px]" : "pl-[220px] xl:pl-[280px]"
      }`}
    >
      <div className="px-4 max-w-4xl">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <h1 className="text-3xl font-bold text-white font-syncopate tracking-tight">
            Study Rooms
          </h1>
          <p className="text-muted-foreground mt-1">
            Create a study session by subject and join others to focus together.
          </p>
        </motion.header>

        {/* Create session form */}
        <motion.form
          onSubmit={handleCreate}
          className="mt-8 p-6 rounded-xl border border-white/10 bg-[#12162A]/80 backdrop-blur-sm"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <BookOpen
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7CDCBD]/70"
                aria-hidden
              />
              <Input
                type="text"
                placeholder="Enter subject (e.g. Calculus, Biology, English)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="pl-10 h-11 bg-[#0A0D17] border-white/15 text-white placeholder:text-gray-500 focus-visible:ring-[#7CDCBD]/50 focus-visible:border-[#7CDCBD]/50"
                maxLength={80}
              />
            </div>
            <Button
              type="submit"
              disabled={!subject.trim() || creating}
              className="h-11 px-6 bg-[#7CDCBD] hover:bg-[#5FBFAA] text-[#0A0D17] font-medium shrink-0"
            >
              <Plus className="w-4 h-4" />
              {creating ? "Creating…" : "Create session"}
            </Button>
          </div>
          {createError && (
            <p className="mt-3 text-sm text-red-400" role="alert">
              {createError}
            </p>
          )}
        </motion.form>

        {/* Study sessions list */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease }}
        >
          <h2 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#7CDCBD]" />
            Study sessions
          </h2>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease }}
              className="rounded-xl border border-white/10 bg-[#12162A]/40 p-12 text-center"
            >
              <p className="text-gray-400">Loading study sessions…</p>
            </motion.div>
          ) : sessions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease }}
              className="rounded-xl border border-dashed border-white/20 bg-[#12162A]/40 p-12 text-center"
            >
              <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
              <p className="text-gray-400">No study sessions yet.</p>
              <p className="text-sm text-gray-500 mt-1">
                Enter a subject above and click Create session to start one.
              </p>
            </motion.div>
          ) : (
            <ul className="space-y-4">
              <AnimatePresence mode="popLayout">
                {sessions.map((session, index) => (
                  <motion.li
                    key={session.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.04,
                      ease,
                    }}
                  >
                    <Card className="border-white/10 bg-[#12162A]/80 overflow-hidden hover:border-[#7CDCBD]/30 transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#7CDCBD]" />
                          {session.subject}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          Created{" "}
                          {formatDistanceToNow(session.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1">
                          <User className="w-3 h-3" />
                          by {session.createdBy.displayName}
                        </p>
                        <p className="text-xs text-[#7CDCBD]/90 flex items-center gap-1.5 mt-1.5">
                          <Video className="w-3 h-3" />
                          Jitsi video room
                        </p>
                      </CardContent>
                      <CardFooter className="pt-0 flex flex-wrap items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-[#7CDCBD]/40 text-[#7CDCBD] hover:bg-[#7CDCBD]/10 hover:border-[#7CDCBD]/60"
                          onClick={() =>
                            window.open(
                              session.meetLink,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                        >
                          <Video className="w-3.5 h-3.5 mr-1.5" />
                          Join video
                        </Button>
                        {currentUserId === session.createdBy.uid && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500/60"
                            onClick={() => handleDelete(session.id)}
                            disabled={deletingId === session.id}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            {deletingId === session.id ? "Deleting…" : "Delete"}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </motion.div>
      </div>

      {/* Full-screen Jitsi overlay (iframe version – commented out; using redirect instead) */}
      {/* <AnimatePresence>
        {activeMeetingLink && (
          <>
            <motion.div
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              onClick={() => setActiveMeetingLink(null)}
              aria-hidden
            />
            <motion.div
              className="fixed inset-0 z-[201] flex flex-col p-4 md:p-6 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-end items-center gap-2 mb-2 pointer-events-auto shrink-0">
                <span className="text-white/60 text-xs mr-auto">
                  If the video doesn’t load, use &quot;Open in new tab&quot;.
                </span>
                <a
                  href={activeMeetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 hover:bg-black/70 text-white border border-white/20 transition-colors text-sm"
                  aria-label="Open Jitsi in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open in new tab
                </a>
                <button
                  type="button"
                  onClick={() => setActiveMeetingLink(null)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/20 transition-colors"
                  aria-label="Close video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <motion.div
                className="flex-1 min-h-0 rounded-xl overflow-hidden border border-white/10 shadow-2xl pointer-events-auto"
                initial={{ scale: 0.96, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ minHeight: "calc(100vh - 6rem)" }}
              >
                <iframe
                  src={activeMeetingLink}
                  title="Jitsi Meet"
                  className="w-full h-full min-h-[400px] rounded-xl"
                  allow="camera; microphone; fullscreen; display-capture"
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default StudyRooms;

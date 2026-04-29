import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Flag,
  Loader2,
  Lock,
  MessageCircle,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { getAuth } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  RYCPost,
  RYCRating,
  RYCVerdict,
  RYC_DISCLAIMER,
  REGION_BY_ID,
  US_STATES,
  VERDICT_META,
  VERDICT_ORDER,
  averageChance,
  isRegionId,
  topVerdict,
} from "@/lib/rateYourChance";

type Comment = {
  id: string;
  authorUid: string;
  content: string;
  createdAt: Date | null;
};

const verdictCountKey = (v: RYCVerdict) =>
  ({
    reach: "reachCount",
    target: "targetCount",
    likely: "likelyCount",
    safety: "safetyCount",
  })[v];

const RateYourChanceDetail = () => {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const [post, setPost] = useState<RYCPost | null>(null);
  const [postLoading, setPostLoading] = useState(true);
  const [postMissing, setPostMissing] = useState(false);

  const [myRating, setMyRating] = useState<RYCRating | null>(null);
  const [chance, setChance] = useState<number>(50);
  const [verdict, setVerdict] = useState<RYCVerdict>("target");
  const [note, setNote] = useState("");
  const [savingRating, setSavingRating] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [postingComment, setPostingComment] = useState(false);
  const commentRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    const ref = doc(db, "chances", id);
    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        if (!snapshot.exists()) {
          setPostMissing(true);
          setPost(null);
          setPostLoading(false);
          return;
        }
        const data = snapshot.data();
        setPost({
          id: snapshot.id,
          authorUid: data.authorUid || "",
          dreamSchool: data.dreamSchool || "",
          intendedMajor: data.intendedMajor || "",
          region: isRegionId(data.region) ? data.region : "north-america",
          usState: data.usState || "",
          schoolType: data.schoolType || "",
          gpaUnweighted:
            typeof data.gpaUnweighted === "number" ? data.gpaUnweighted : null,
          gpaWeighted:
            typeof data.gpaWeighted === "number" ? data.gpaWeighted : null,
          classRank: data.classRank || "",
          satScore: typeof data.satScore === "number" ? data.satScore : null,
          actScore: typeof data.actScore === "number" ? data.actScore : null,
          rigor: data.rigor || "",
          extracurriculars: data.extracurriculars || "",
          awards: data.awards || "",
          essaysSummary: data.essaysSummary || "",
          spike: data.spike || "",
          demographics: data.demographics || "",
          additionalContext: data.additionalContext || "",
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
          ratingsCount: data.ratingsCount ?? 0,
          chanceTotal: data.chanceTotal ?? 0,
          reachCount: data.reachCount ?? 0,
          targetCount: data.targetCount ?? 0,
          likelyCount: data.likelyCount ?? 0,
          safetyCount: data.safetyCount ?? 0,
          commentsCount: data.commentsCount ?? 0,
        });
        setPostLoading(false);
      },
      (err) => {
        console.error("Failed to load chance post:", err);
        setPostLoading(false);
      },
    );
    return () => unsub();
  }, [id]);

  useEffect(() => {
    if (!id || !currentUser) return;
    const ratingRef = doc(db, "chances", id, "ratings", currentUser.uid);
    const unsub = onSnapshot(ratingRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const next: RYCRating = {
          chance: typeof data.chance === "number" ? data.chance : 50,
          verdict: (data.verdict as RYCVerdict) || "target",
          note: typeof data.note === "string" ? data.note : "",
        };
        setMyRating(next);
        setChance(next.chance);
        setVerdict(next.verdict);
        setNote(next.note);
      } else {
        setMyRating(null);
      }
    });
    return () => unsub();
  }, [id, currentUser]);

  useEffect(() => {
    if (!id) return;
    const ref = query(
      collection(db, "chances", id, "comments"),
      orderBy("createdAt", "asc"),
    );
    const unsub = onSnapshot(ref, (snapshot) => {
      const next: Comment[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          authorUid: data.authorUid || "",
          content: data.content || "",
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
        };
      });
      setComments(next);
    });
    return () => unsub();
  }, [id]);

  const isAuthor = !!currentUser && currentUser.uid === post?.authorUid;

  const avg = post ? averageChance(post) : null;
  const top = post ? topVerdict(post) : null;
  const stateName = post
    ? US_STATES.find((s) => s.code === post.usState)?.name
    : undefined;
  const regionDef = post ? REGION_BY_ID[post.region] : undefined;

  const verdictBreakdown = useMemo(() => {
    if (!post || post.ratingsCount === 0) return [];
    return VERDICT_ORDER.map((v) => {
      const count =
        v === "reach"
          ? post.reachCount
          : v === "target"
            ? post.targetCount
            : v === "likely"
              ? post.likelyCount
              : post.safetyCount;
      return { verdict: v, count, pct: (count / post.ratingsCount) * 100 };
    });
  }, [post]);

  const handleSaveRating = async () => {
    if (!post || !currentUser) return;
    if (isAuthor) {
      toast.error("You can’t rate your own profile.");
      return;
    }
    if (chance < 0 || chance > 100) {
      toast.error("Chance must be between 0 and 100.");
      return;
    }

    setSavingRating(true);
    try {
      const postRef = doc(db, "chances", post.id);
      const ratingRef = doc(db, "chances", post.id, "ratings", currentUser.uid);
      await runTransaction(db, async (tx) => {
        const ratingSnap = await tx.get(ratingRef);
        const previous = ratingSnap.exists()
          ? (ratingSnap.data() as RYCRating)
          : null;

        if (previous) {
          tx.update(postRef, {
            chanceTotal: increment(chance - previous.chance),
            [verdictCountKey(previous.verdict)]: increment(-1),
            [verdictCountKey(verdict)]: increment(1),
          });
        } else {
          tx.update(postRef, {
            ratingsCount: increment(1),
            chanceTotal: increment(chance),
            [verdictCountKey(verdict)]: increment(1),
          });
        }

        tx.set(ratingRef, {
          chance,
          verdict,
          note: note.trim(),
          createdAt: previous ? ratingSnap.data()?.createdAt : serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });
      toast.success(myRating ? "Rating updated." : "Rating posted.");
    } catch (err) {
      console.error("Failed to save rating:", err);
      toast.error("Could not save rating. Try again.");
    } finally {
      setSavingRating(false);
    }
  };

  const handleRemoveRating = async () => {
    if (!post || !currentUser || !myRating) return;
    if (
      !window.confirm(
        "Remove your rating? Your verdict and note will be cleared.",
      )
    ) {
      return;
    }
    setSavingRating(true);
    try {
      const postRef = doc(db, "chances", post.id);
      const ratingRef = doc(db, "chances", post.id, "ratings", currentUser.uid);
      await runTransaction(db, async (tx) => {
        const ratingSnap = await tx.get(ratingRef);
        if (!ratingSnap.exists()) return;
        const prev = ratingSnap.data() as RYCRating;
        tx.update(postRef, {
          ratingsCount: increment(-1),
          chanceTotal: increment(-prev.chance),
          [verdictCountKey(prev.verdict)]: increment(-1),
        });
        tx.delete(ratingRef);
      });
      toast.success("Rating removed.");
    } catch (err) {
      console.error("Failed to remove rating:", err);
      toast.error("Could not remove rating.");
    } finally {
      setSavingRating(false);
    }
  };

  const handleAddComment = async () => {
    if (!post || !currentUser) return;
    if (commentRef.current) return;
    const text = newComment.trim();
    if (!text) return;

    commentRef.current = true;
    setPostingComment(true);
    try {
      await addDoc(collection(db, "chances", post.id, "comments"), {
        authorUid: currentUser.uid,
        content: text,
        createdAt: serverTimestamp(),
      });
      await updateDoc(doc(db, "chances", post.id), {
        commentsCount: increment(1),
      });
      setNewComment("");
    } catch (err) {
      console.error("Failed to post comment:", err);
      toast.error("Could not post comment.");
    } finally {
      commentRef.current = false;
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    if (!post || !currentUser) return;
    if (comment.authorUid !== currentUser.uid && !isAuthor) return;
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteDoc(doc(db, "chances", post.id, "comments", comment.id));
      await updateDoc(doc(db, "chances", post.id), {
        commentsCount: increment(-1),
      });
    } catch (err) {
      console.error("Failed to delete comment:", err);
      toast.error("Could not delete comment.");
    }
  };

  const handleDeletePost = async () => {
    if (!post || !isAuthor) return;
    if (
      !window.confirm(
        "Delete this profile post? Ratings and comments will be removed.",
      )
    ) {
      return;
    }
    try {
      await deleteDoc(doc(db, "chances", post.id));
      toast.success("Profile removed.");
      navigate("/rate-your-chance");
    } catch (err) {
      console.error("Failed to delete profile:", err);
      toast.error("Could not delete profile.");
    }
  };

  if (postLoading) {
    return (
      <div className="min-h-screen bg-[#0A0D17] text-white flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-[#7CDCBD]" />
      </div>
    );
  }

  if (postMissing || !post) {
    return (
      <div className="min-h-screen bg-[#0A0D17] text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
          <Button
            type="button"
            variant="ghost"
            className="mb-6 -ml-2 gap-2 text-gray-400 hover:text-white hover:bg-white/5"
            onClick={() => navigate("/rate-your-chance")}
          >
            <ArrowLeft size={18} />
            Back
          </Button>
          <div className="rounded-2xl border border-white/10 bg-[#11141d]/90 p-8 text-center">
            <p className="text-white text-base font-medium">
              This profile is no longer available.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              It may have been removed by the original poster.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D17] text-white pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <Button
          type="button"
          variant="ghost"
          className="mb-6 -ml-2 gap-2 text-gray-400 hover:text-white hover:bg-white/5"
          onClick={() => navigate("/rate-your-chance")}
        >
          <ArrowLeft size={18} />
          All profiles
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.08] bg-[#11141d]/90 p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)]"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="min-w-0 flex flex-col gap-2">
              <div className="inline-flex flex-wrap items-center gap-2">
                <Badge className="bg-[#181c2c] text-[11px] font-medium text-slate-200/90 border border-slate-600/40 uppercase tracking-wider">
                  Anonymous
                </Badge>
                {regionDef && (
                  <Badge className="bg-[#7CDCBD]/15 text-[11px] font-semibold text-[#7CDCBD] border border-[#7CDCBD]/30 uppercase tracking-wider">
                    {regionDef.short}
                  </Badge>
                )}
                {top && (
                  <Badge
                    className="border-0 text-[11px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${VERDICT_META[top].color}22`,
                      color: VERDICT_META[top].color,
                    }}
                  >
                    Crowd: {VERDICT_META[top].label}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white font-syncopate tracking-tight">
                {post.dreamSchool}
              </h1>
              <p className="text-sm text-gray-400 flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7CDCBD]" />
                  {post.intendedMajor || "Undeclared major"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Flag className="w-3.5 h-3.5 text-[#7CDCBD]" />
                  {regionDef?.label ?? "—"}
                  {post.region === "north-america" &&
                    (stateName || post.usState) && (
                      <span className="text-gray-500">
                        · {stateName || post.usState}
                      </span>
                    )}
                </span>
                {post.schoolType && (
                  <span className="text-gray-500">· {post.schoolType}</span>
                )}
              </p>
            </div>
            {isAuthor && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeletePost}
                className="self-start border-red-500/40 text-red-300 hover:bg-red-500/10 hover:text-red-200 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete profile
              </Button>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <SummaryStat
              label="Average chance"
              value={avg !== null ? `${avg}%` : "—"}
            />
            <SummaryStat
              label="Ratings"
              value={post.ratingsCount}
              icon={<Users className="w-4 h-4 text-[#7CDCBD]" />}
            />
            <SummaryStat
              label="Comments"
              value={post.commentsCount}
              icon={<MessageCircle className="w-4 h-4 text-[#7CDCBD]" />}
            />
          </div>

          {verdictBreakdown.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
              {verdictBreakdown.map(({ verdict: v, count, pct }) => (
                <div
                  key={v}
                  className="rounded-xl border border-white/10 bg-[#0A0D17]/60 px-3 py-2.5"
                >
                  <p
                    className="text-[10px] uppercase tracking-wider font-semibold"
                    style={{ color: VERDICT_META[v].color }}
                  >
                    {VERDICT_META[v].label}
                  </p>
                  <p className="text-white text-base font-semibold tabular-nums mt-0.5">
                    {count}
                  </p>
                  <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: VERDICT_META[v].color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Stat label="GPA (UW)" value={post.gpaUnweighted ?? "—"} />
            <Stat label="GPA (W)" value={post.gpaWeighted ?? "—"} />
            <Stat label="SAT" value={post.satScore ?? "—"} />
            <Stat label="ACT" value={post.actScore ?? "—"} />
            <Stat
              label="Class rank"
              value={post.classRank || "—"}
              full
            />
          </div>

          <Block label="Course rigor" body={post.rigor} />
          <Block
            label="Extracurriculars"
            body={post.extracurriculars}
            mono
          />
          <Block label="Awards & honors" body={post.awards} />
          <Block label="Spike / hook" body={post.spike} />
          <Block label="Essays summary" body={post.essaysSummary} />
          <Block label="Demographics & context" body={post.demographics} />
          <Block label="Anything else" body={post.additionalContext} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/5 p-3 sm:p-4 flex items-start gap-3"
        >
          <ShieldAlert className="w-4 h-4 mt-0.5 text-amber-300 shrink-0" />
          <div className="text-[12px] sm:text-[13px] text-amber-100/95 leading-snug">
            <span className="font-semibold text-amber-200">Disclaimer.</span>{" "}
            {RYC_DISCLAIMER}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 rounded-2xl border border-white/[0.08] bg-[#11141d]/90 p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#7CDCBD]" />
            <h2 className="text-lg sm:text-xl font-syncopate text-white">
              Rate this profile
            </h2>
          </div>

          {isAuthor ? (
            <div className="rounded-xl border border-white/10 bg-[#0A0D17]/60 p-4 text-sm text-gray-400 flex items-start gap-2">
              <Lock className="w-4 h-4 mt-0.5 text-gray-500 shrink-0" />
              You can’t rate your own profile. Wait for peers to weigh in.
            </div>
          ) : !currentUser ? (
            <div className="rounded-xl border border-white/10 bg-[#0A0D17]/60 p-4 text-sm text-gray-400">
              Sign in to rate this profile.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <Label className="text-gray-300">Chance of admission</Label>
                  <span className="text-white font-semibold tabular-nums">
                    {chance}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={chance}
                  onChange={(e) => setChance(Number(e.target.value))}
                  className="w-full accent-[#7CDCBD]"
                  disabled={savingRating}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Your verdict</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {VERDICT_ORDER.map((v) => {
                    const meta = VERDICT_META[v];
                    const active = verdict === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVerdict(v)}
                        disabled={savingRating}
                        className={`rounded-xl border p-3 text-left transition-all ${
                          active
                            ? "bg-white/[0.06]"
                            : "bg-[#0A0D17]/60 hover:bg-white/[0.03]"
                        }`}
                        style={{
                          borderColor: active
                            ? meta.color
                            : "rgba(255,255,255,0.1)",
                        }}
                      >
                        <span
                          className="block text-[11px] uppercase tracking-wider font-semibold"
                          style={{ color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="block text-[11px] text-gray-400 mt-1 leading-snug">
                          {meta.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">
                  Quick reasoning (optional)
                </Label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What stood out, what you’d strengthen, etc."
                  className="min-h-[80px] bg-[#0d1019] border-white/10 text-white placeholder:text-gray-500 rounded-xl focus-visible:ring-2 focus-visible:ring-[#7cdcbd]/35 focus-visible:border-[#7cdcbd]/25 resize-y"
                  maxLength={500}
                  disabled={savingRating}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={handleSaveRating}
                  disabled={savingRating}
                  className="rounded-xl bg-[#7CDCBD] text-[#0A0D17] font-semibold hover:bg-[#5FBFAA]"
                >
                  {savingRating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving…
                    </>
                  ) : myRating ? (
                    "Update rating"
                  ) : (
                    "Submit rating"
                  )}
                </Button>
                {myRating && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRemoveRating}
                    disabled={savingRating}
                    className="rounded-xl border-red-500/40 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                  >
                    Remove my rating
                  </Button>
                )}
              </div>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 rounded-2xl border border-white/[0.08] bg-[#11141d]/90 p-6 sm:p-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-[#7CDCBD]" />
            <h2 className="text-lg sm:text-xl font-syncopate text-white">
              Comments
            </h2>
            <span className="text-xs text-gray-500">
              {post.commentsCount} total
            </span>
          </div>

          {currentUser ? (
            <div className="rounded-xl border border-white/10 bg-[#0A0D17]/60 p-3 sm:p-4">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share constructive thoughts. Be kind."
                className="min-h-[72px] bg-transparent border-0 text-white placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 resize-y"
                maxLength={1000}
                disabled={postingComment}
              />
              <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t border-white/[0.06]">
                <p className="text-[11px] text-gray-500">
                  Posted as Anonymous.
                </p>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddComment}
                  disabled={postingComment || !newComment.trim()}
                  className="rounded-lg bg-[#7CDCBD] text-[#0A0D17] hover:bg-[#5FBFAA] gap-1.5"
                >
                  {postingComment ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  Comment
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-[#0A0D17]/60 p-4 text-sm text-gray-400">
              Sign in to leave a comment.
            </div>
          )}

          <div className="mt-4 space-y-3">
            {comments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">
                No comments yet.
              </p>
            ) : (
              comments.map((c) => {
                const canDelete =
                  !!currentUser &&
                  (c.authorUid === currentUser.uid || isAuthor);
                return (
                  <div
                    key={c.id}
                    className="rounded-xl border border-white/10 bg-[#0A0D17]/60 px-3 py-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] text-gray-500">
                      <span className="uppercase tracking-wider">
                        Anonymous
                      </span>
                      <div className="flex items-center gap-2">
                        {c.createdAt && (
                          <span>
                            {c.createdAt.toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </span>
                        )}
                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(c)}
                            className="rounded-md p-1 text-gray-500 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-200 mt-1 whitespace-pre-wrap break-words leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const SummaryStat = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-xl border border-white/10 bg-[#0A0D17]/60 px-4 py-3">
    <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-gray-500">
      {icon}
      {label}
    </div>
    <p className="text-2xl font-bold text-white tabular-nums mt-1">{value}</p>
  </div>
);

const Stat = ({
  label,
  value,
  full,
}: {
  label: string;
  value: string | number;
  full?: boolean;
}) => (
  <div
    className={`rounded-lg border border-white/10 bg-[#0A0D17]/60 px-4 py-3 ${
      full ? "sm:col-span-2" : ""
    }`}
  >
    <p className="text-[10px] uppercase tracking-wider text-gray-500">
      {label}
    </p>
    <p className="text-white text-sm font-medium mt-0.5 truncate">{value}</p>
  </div>
);

const Block = ({
  label,
  body,
  mono,
}: {
  label: string;
  body: string;
  mono?: boolean;
}) => {
  if (!body) return null;
  return (
    <div className="mt-5">
      <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1.5">
        {label}
      </p>
      <div
        className={`rounded-xl border border-white/10 bg-[#0A0D17]/60 px-4 py-3 text-sm text-gray-200 whitespace-pre-wrap break-words leading-relaxed ${
          mono ? "font-mono text-[13px]" : ""
        }`}
      >
        {body}
      </div>
    </div>
  );
};

export default RateYourChanceDetail;

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Flag,
  Lock,
  MessageCircle,
  Send,
  Trash2,
  Users,
} from "lucide-react";
import { getAuth } from "firebase/auth";
import {
  addDoc,
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
} from "firebase/firestore";
import { toast } from "sonner";

import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AppPage, PageHeader } from "@/components/ui/app-shell";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/states";
import {
  ChanceScale,
  Disclaimer,
  SpecCell,
  VerdictStamp,
} from "@/components/ryc/marks";
import {
  RYCPost,
  RYCRating,
  RYCVerdict,
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
  const [chance, setChance] = useState(50);
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
    if (!window.confirm("Remove your rating? The stamp and note will go with it.")) {
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
        "Delete this profile? Ratings and comments will be removed.",
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
      <AppPage>
        <LoadingState label="Opening packet…" />
      </AppPage>
    );
  }

  if (postMissing || !post) {
    return (
      <AppPage width="narrow">
        <Button
          type="button"
          variant="ghost"
          className="mb-6 -ml-2"
          onClick={() => navigate("/rate-your-chance")}
        >
          <ArrowLeft className="size-4" />
          All profiles
        </Button>
        <ErrorState
          title="This packet is gone."
          description="It may have been removed by the original poster."
          onRetry={() => navigate("/rate-your-chance")}
        />
      </AppPage>
    );
  }

  return (
    <AppPage width="wide">
      <Button
        type="button"
        variant="ghost"
        className="mb-6 -ml-2"
        onClick={() => navigate("/rate-your-chance")}
      >
        <ArrowLeft className="size-4" />
        All profiles
      </Button>

      <PageHeader
        margin="packet"
        title={post.dreamSchool}
        description={
          <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{post.intendedMajor || "Undeclared"}</span>
            <span className="inline-flex items-center gap-1.5">
              <Flag className="size-3.5" />
              {regionDef?.label ?? "—"}
              {post.region === "north-america" &&
                (stateName || post.usState) &&
                ` · ${stateName || post.usState}`}
            </span>
            {post.schoolType && <span>{post.schoolType}</span>}
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <VerdictStamp verdict={top} />
            {isAuthor && (
              <Button
                variant="destructive-ghost"
                size="sm"
                onClick={handleDeletePost}
              >
                <Trash2 className="size-3.5" />
                Delete
              </Button>
            )}
          </div>
        }
      />

      <Disclaimer className="mb-10" />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="min-w-0">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <ChanceScale value={avg} />
            </div>
            <SpecCell label="Reads" value={post.ratingsCount} />
            <SpecCell label="Notes" value={post.commentsCount} />
            <SpecCell
              label="Crowd stamp"
              value={top ? VERDICT_META[top].label : "—"}
            />
          </div>

          {verdictBreakdown.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-px bg-rule sm:grid-cols-4">
              {verdictBreakdown.map(({ verdict: v, count, pct }) => (
                <div key={v} className="bg-board px-3 py-3">
                  <p
                    className="text-[12px] font-medium"
                    style={{ color: VERDICT_META[v].color }}
                  >
                    {VERDICT_META[v].label}
                  </p>
                  <p className="numeric mt-1 text-lg text-chalk">{count}</p>
                  <div className="mt-3 h-px bg-rule-strong">
                    <div
                      className="h-px"
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

          <div className="mt-8 grid gap-5 border-t border-rule pt-6 sm:grid-cols-2">
            <SpecCell label="GPA, unweighted" value={post.gpaUnweighted ?? "—"} />
            <SpecCell label="GPA, weighted" value={post.gpaWeighted ?? "—"} />
            <SpecCell label="SAT" value={post.satScore ?? "—"} />
            <SpecCell label="ACT" value={post.actScore ?? "—"} />
            <div className="sm:col-span-2">
              <SpecCell label="Class rank" value={post.classRank || "—"} />
            </div>
          </div>

          <PacketBlock label="Course rigor" body={post.rigor} />
          <PacketBlock label="Extracurriculars" body={post.extracurriculars} mono />
          <PacketBlock label="Awards" body={post.awards} />
          <PacketBlock label="The hook" body={post.spike} />
          <PacketBlock label="Essays" body={post.essaysSummary} />
          <PacketBlock label="Context" body={post.demographics} />
          <PacketBlock label="Anything else" body={post.additionalContext} />
        </article>

        <aside className="space-y-8 lg:sticky lg:top-8 lg:self-start">
          <section className="border border-rule bg-notice p-5">
            <h2 className="text-[13px] font-semibold text-chalk">Your stamp</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-chalk-2">
              Mark the packet, then leave a short reason if you want.
            </p>

            {isAuthor ? (
              <p className="mt-4 flex items-start gap-2 text-sm text-chalk-3">
                <Lock className="mt-0.5 size-4 shrink-0" />
                You can’t rate your own profile.
              </p>
            ) : !currentUser ? (
              <p className="mt-4 text-sm text-chalk-3">
                Sign in to stamp this packet.
              </p>
            ) : (
              <div className="mt-5 space-y-5">
                <div>
                  <div className="flex items-baseline justify-between">
                    <Label>Chance of admission</Label>
                    <span className="numeric text-sm text-chalk">{chance}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={chance}
                    onChange={(e) => setChance(Number(e.target.value))}
                    className="chance-scale mt-3"
                    disabled={savingRating}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {VERDICT_ORDER.map((v) => {
                    const meta = VERDICT_META[v];
                    const active = verdict === v;
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVerdict(v)}
                        disabled={savingRating}
                        className={`rounded-notice border p-2.5 text-left transition-colors ${
                          active ? "bg-overlay" : "bg-recess hover:border-rule-strong"
                        }`}
                        style={{
                          borderColor: active ? meta.color : undefined,
                        }}
                      >
                        <span
                          className="block text-[12px] font-semibold"
                          style={{ color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        <span className="mt-1 block text-[11px] leading-snug text-chalk-3">
                          {meta.description}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <Label htmlFor="ryc-note">Reasoning (optional)</Label>
                  <Textarea
                    id="ryc-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What stood out, what you’d strengthen."
                    className="mt-1.5 min-h-[80px] resize-y"
                    maxLength={500}
                    disabled={savingRating}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    onClick={handleSaveRating}
                    loading={savingRating}
                  >
                    {myRating ? "Update stamp" : "Stamp packet"}
                  </Button>
                  {myRating && (
                    <Button
                      type="button"
                      variant="destructive-ghost"
                      onClick={handleRemoveRating}
                      disabled={savingRating}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-rule pb-2">
              <h2 className="text-[13px] font-semibold text-chalk">
                <span className="inline-flex items-center gap-1.5">
                  <MessageCircle className="size-3.5" />
                  Notes
                </span>
              </h2>
              <span className="numeric text-[12px] text-chalk-3">
                {post.commentsCount}
              </span>
            </div>

            {currentUser ? (
              <div className="border border-rule bg-recess p-3">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Constructive, specific, kind."
                  className="min-h-[72px] resize-y border-0 bg-transparent p-0 focus-visible:outline-none"
                  maxLength={1000}
                  disabled={postingComment}
                />
                <div className="mt-2 flex items-center justify-between gap-3 border-t border-rule pt-2">
                  <p className="text-[11px] text-chalk-3">Posted as Anonymous.</p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddComment}
                    disabled={postingComment || !newComment.trim()}
                    loading={postingComment}
                  >
                    <Send className="size-3.5" />
                    Note
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-chalk-3">Sign in to leave a note.</p>
            )}

            <div className="mt-4 space-y-3">
              {comments.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No notes yet."
                  description="Be the first reader to leave one."
                  className="py-8"
                />
              ) : (
                comments.map((c) => {
                  const canDelete =
                    !!currentUser &&
                    (c.authorUid === currentUser.uid || isAuthor);
                  return (
                    <div key={c.id} className="border border-rule bg-notice px-3 py-2.5">
                      <div className="flex items-center justify-between gap-2 text-[11px] text-chalk-3">
                        <span>Anonymous</span>
                        <div className="flex items-center gap-2">
                          {c.createdAt && (
                            <span className="numeric">
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
                              className="rounded-control p-1 text-chalk-3 hover:bg-clay-wash hover:text-clay"
                              title="Delete note"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-chalk-2">
                        {c.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </aside>
      </div>
    </AppPage>
  );
};

function PacketBlock({
  label,
  body,
  mono,
}: {
  label: string;
  body: string;
  mono?: boolean;
}) {
  if (!body) return null;
  return (
    <section className="mt-8">
      <h3 className="mb-2 text-[13px] font-semibold text-chalk">{label}</h3>
      <div
        className={`whitespace-pre-wrap break-words border border-rule bg-recess px-4 py-3 text-sm leading-relaxed text-chalk-2 ${
          mono ? "font-mono text-[13px]" : ""
        }`}
      >
        {body}
      </div>
    </section>
  );
}

export default RateYourChanceDetail;

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSidebar } from "./SideBar";
import {
  GraduationCap,
  Plus,
  Search,
  ShieldAlert,
  Sparkles,
  MessageCircle,
  Users,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RYC_DISCLAIMER,
  RYCPost,
  REGION_BY_ID,
  REGIONS,
  RegionId,
  VERDICT_META,
  averageChance,
  isRegionId,
  topVerdict,
  US_STATES,
} from "@/lib/rateYourChance";
import WorldRegionMap from "@/components/ui/WorldRegionMap";
import { Globe2, MapPinned } from "lucide-react";

const FILTERS = ["All", "Most rated", "Newest", "No ratings yet"] as const;
type FilterKey = (typeof FILTERS)[number];

const RateYourChance = () => {
  const { collapsed } = useSidebar();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<RYCPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<RegionId | null>(null);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    const ref = query(collection(db, "chances"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        const next: RYCPost[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
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
          };
        });
        setPosts(next);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load chance posts:", err);
        setLoading(false);
      },
    );
    return () => unsub();
  }, []);

  const regionCounts = useMemo(() => {
    const counts: Partial<Record<RegionId, number>> = {};
    for (const p of posts) {
      counts[p.region] = (counts[p.region] ?? 0) + 1;
    }
    return counts;
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    let working = posts.filter((p) => {
      if (regionFilter && p.region !== regionFilter) return false;
      if (!search) return true;
      const haystack = [
        p.dreamSchool,
        p.intendedMajor,
        p.usState,
        p.schoolType,
        p.spike,
        p.extracurriculars,
        REGION_BY_ID[p.region]?.label ?? "",
      ]
        .join(" \n")
        .toLowerCase();
      return haystack.includes(search);
    });

    switch (filter) {
      case "Most rated":
        working = [...working].sort(
          (a, b) => b.ratingsCount - a.ratingsCount,
        );
        break;
      case "Newest":
        working = [...working].sort((a, b) => {
          const ta = a.createdAt?.getTime() ?? 0;
          const tb = b.createdAt?.getTime() ?? 0;
          return tb - ta;
        });
        break;
      case "No ratings yet":
        working = working.filter((p) => p.ratingsCount === 0);
        break;
      default:
        break;
    }
    return working;
  }, [posts, filter, searchTerm, regionFilter]);

  const selectedRegion = regionFilter ? REGION_BY_ID[regionFilter] : null;

  return (
    <div
      className={`bg-[#0A0D17] min-h-screen transition-all duration-300 ${
        collapsed ? "pl-[74px] sm:pl-[92px]" : "pl-[220px] xl:pl-[280px]"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-6 lg:pr-8 pt-8 pb-16">
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#7CDCBD]/15 border border-[#7CDCBD]/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#7CDCBD]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-white font-syncopate tracking-tight">
                Rate Your Chance
              </h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Share your college profile anonymously and see what peers think
                of your shot at your dream school.
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/rate-your-chance/new")}
            className="self-start group flex items-center gap-2 rounded-xl bg-[#7CDCBD] text-[#0A0D17] font-semibold shadow-[0_0_20px_-4px_rgba(124,220,189,0.4)] hover:bg-[#5FBFAA] hover:shadow-[0_0_24px_-2px_rgba(124,220,189,0.5)] h-11 px-5 border-0 transition-all duration-300"
          >
            <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#0A0D17]/10">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
            </span>
            Post your profile
          </Button>
        </motion.header>

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
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(17,22,35,0.92),rgba(10,13,23,0.96))] shadow-[0_20px_60px_-32px_rgba(0,0,0,0.7)]"
        >
          <div className="border-b border-white/8 px-4 py-4 sm:px-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm text-white/90">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#7CDCBD]/20 bg-[#7CDCBD]/10">
                    <Globe2 className="h-4 w-4 text-[#7CDCBD]" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Browse by region</div>
                    <div className="mt-0.5 text-xs leading-snug text-gray-500">
                      {selectedRegion
                        ? `Focused on ${selectedRegion.label}`
                        : "Use the interactive atlas or region chips to narrow the feed."}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedRegion && (
                  <div className="rounded-xl border border-[#7CDCBD]/25 bg-[#7CDCBD]/10 px-3 py-1.5 text-[11px] text-[#DFF8EF]">
                    <span className="font-semibold text-[#7CDCBD]">
                      {selectedRegion.short}
                    </span>
                    <span className="ml-2 text-white/55">
                      {regionCounts[selectedRegion.id] ?? 0} profiles
                    </span>
                  </div>
                )}
              {regionFilter && (
                <button
                  type="button"
                  onClick={() => setRegionFilter(null)}
                  className="rounded-xl border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  Clear region
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowMap((s) => !s)}
                className="rounded-xl border border-white/10 bg-transparent px-3 py-1.5 text-xs font-medium text-gray-300 hover:bg-white/5 hover:text-white"
              >
                {showMap ? "Hide atlas" : "Show atlas"}
              </button>
              </div>
            </div>
          </div>

          {showMap && (
            <div className="px-4 pt-4 sm:px-5">
              <WorldRegionMap
                selected={regionFilter}
                counts={regionCounts}
                onSelect={(r) => setRegionFilter(r)}
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2 px-4 py-4 sm:px-5">
            <button
              type="button"
              onClick={() => setRegionFilter(null)}
              className={`rounded-xl px-3 py-1.5 text-[11px] transition-colors ${
                regionFilter === null
                  ? "bg-[#7CDCBD] font-semibold text-[#0A0D17]"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              All regions
            </button>
            {REGIONS.map((r) => {
              const active = regionFilter === r.id;
              const count = regionCounts[r.id] ?? 0;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegionFilter(active ? null : r.id)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] transition-colors ${
                    active
                      ? "bg-[#7CDCBD] font-semibold text-[#0A0D17]"
                      : "border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                  title={r.examples}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      active ? "bg-[#0A0D17]/70" : "bg-[#7CDCBD]"
                    }`}
                  />
                  <MapPinned className="h-3 w-3" />
                  <span>{r.short}</span>
                  {count > 0 && (
                    <span
                      className={`tabular-nums ${
                        active ? "text-[#0A0D17]/70" : "text-gray-500"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center"
        >
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by school, major, region…"
              className="w-full rounded-xl border border-white/10 bg-[#101320]/60 pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7CDCBD]/40 focus:ring-2 focus:ring-[#7CDCBD]/20"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#101320]/60 p-2">
            {FILTERS.map((key) => {
              const active = filter === key;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-xl transition-colors ${
                    active
                      ? "bg-[#7CDCBD] text-[#0A0D17] font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {key}
                </button>
              );
            })}
          </div>
        </motion.div>

        {loading ? (
          <div className="mt-10 flex items-center justify-center text-sm text-gray-500">
            Loading posts…
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/10 bg-[#101320]/40 px-6 py-16"
          >
            <div className="w-12 h-12 rounded-full bg-[#7CDCBD]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5 text-[#7CDCBD]" />
            </div>
            <p className="text-base font-medium text-white">
              {searchTerm
                ? "No posts match that search."
                : "No profiles posted yet."}
            </p>
            <p className="text-sm text-gray-400 mt-1 max-w-sm">
              {searchTerm
                ? "Try a different keyword, or be the first to post."
                : "Be the first to share your profile and let peers weigh in."}
            </p>
          </motion.div>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.28, delay: index * 0.03 }}
                >
                  <RYCCard post={post} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

const RYCCard = ({ post }: { post: RYCPost }) => {
  const avg = averageChance(post);
  const top = topVerdict(post);
  const stateName = US_STATES.find((s) => s.code === post.usState)?.name;
  const regionLabel = REGION_BY_ID[post.region]?.short ?? "—";

  const locationLabel =
    post.region === "north-america" && stateName
      ? stateName
      : REGION_BY_ID[post.region]?.label ?? regionLabel;

  return (
    <Link to={`/rate-your-chance/${post.id}`} className="block h-full">
      <Card className="h-full flex flex-col bg-[#101320] border border-[#1b1f30] hover:border-[#7CDCBD]/50 transition-colors duration-200 rounded-2xl overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start gap-2">
            <div className="min-w-0 flex flex-col gap-1.5">
              <div className="flex flex-wrap gap-1.5">
                <Badge className="w-fit bg-[#181c2c] text-xs font-medium text-slate-200/90 border border-slate-600/40">
                  {post.intendedMajor || "Undeclared"}
                </Badge>
                <Badge className="w-fit bg-[#7CDCBD]/15 text-[11px] font-medium text-[#7CDCBD] border border-[#7CDCBD]/30">
                  {regionLabel}
                </Badge>
              </div>
              <CardTitle className="text-base sm:text-lg text-white line-clamp-2 leading-snug">
                {post.dreamSchool}
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 flex items-center gap-1.5">
                <Flag className="w-3 h-3" />
                {locationLabel}
                {post.schoolType ? ` · ${post.schoolType}` : ""}
              </CardDescription>
            </div>
            {top && (
              <Badge
                className="shrink-0 border-0 text-[10px] font-semibold uppercase tracking-wide"
                style={{
                  backgroundColor: `${VERDICT_META[top].color}22`,
                  color: VERDICT_META[top].color,
                }}
              >
                {VERDICT_META[top].label}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-grow space-y-3">
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <Stat label="UW GPA" value={post.gpaUnweighted ?? "—"} />
            <Stat
              label="SAT/ACT"
              value={
                post.satScore
                  ? String(post.satScore)
                  : post.actScore
                    ? `${post.actScore} ACT`
                    : "—"
              }
            />
            <Stat label="Rigor" value={post.rigor ? "Listed" : "—"} />
          </div>
          {post.spike && (
            <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
              {post.spike}
            </p>
          )}
        </CardContent>

        <CardFooter className="border-t border-white/[0.06] pt-3 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#7CDCBD]" />
              {post.ratingsCount} {post.ratingsCount === 1 ? "rate" : "rates"}
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-[#7CDCBD]" />
              {post.commentsCount}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-500">
              Avg chance
            </p>
            <p className="text-base font-semibold text-white tabular-nums">
              {avg !== null ? `${avg}%` : "—"}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

const Stat = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => (
  <div className="rounded-lg border border-white/10 bg-[#0A0D17]/60 px-2.5 py-2">
    <p className="text-[10px] uppercase tracking-wider text-gray-500">
      {label}
    </p>
    <p className="text-white text-sm font-medium mt-0.5 truncate">{value}</p>
  </div>
);

export default RateYourChance;

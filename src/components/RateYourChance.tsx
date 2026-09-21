import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Flag, MessageCircle, Plus, Search, Users } from "lucide-react";

import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppPage, PageHeader } from "@/components/ui/app-shell";
import { EmptyState, LoadingState } from "@/components/ui/states";
import { SegmentedControl } from "@/components/ui/segmented-control";
import WorldRegionMap from "@/components/ui/WorldRegionMap";
import {
  ChanceScale,
  Disclaimer,
  SpecCell,
  VerdictStamp,
} from "@/components/ryc/marks";
import {
  REGION_BY_ID,
  REGIONS,
  RYCPost,
  RegionId,
  US_STATES,
  averageChance,
  isRegionId,
  topVerdict,
} from "@/lib/rateYourChance";

const FILTERS = ["All", "Most rated", "Newest", "Unrated"] as const;
type FilterKey = (typeof FILTERS)[number];

const RateYourChance = () => {
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
            satScore: typeof data.satScore === "number" ? data.satScore : null,
            actScore: typeof data.actScore === "number" ? data.actScore : null,
            classRank: data.classRank || "",
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
        .join(" ")
        .toLowerCase();
      return haystack.includes(search);
    });

    switch (filter) {
      case "Most rated":
        working = [...working].sort((a, b) => b.ratingsCount - a.ratingsCount);
        break;
      case "Newest":
        working = [...working].sort((a, b) => {
          const ta = a.createdAt?.getTime() ?? 0;
          const tb = b.createdAt?.getTime() ?? 0;
          return tb - ta;
        });
        break;
      case "Unrated":
        working = working.filter((p) => p.ratingsCount === 0);
        break;
      default:
        break;
    }
    return working;
  }, [posts, filter, searchTerm, regionFilter]);

  const selectedRegion = regionFilter ? REGION_BY_ID[regionFilter] : null;

  return (
    <AppPage width="wide">
      <PageHeader
        margin="rate your chance"
        title="The reading room"
        description="Anonymous application packets. Peers leave a stamp and a note — not an admissions decision."
        actions={
          <Button onClick={() => navigate("/rate-your-chance/new")}>
            <Plus className="size-4" strokeWidth={2} />
            Post a profile
          </Button>
        }
      />

      <Disclaimer className="mb-10" />

      <div className="ruled mb-8">
        <div className="ruled-margin">
          <span className="numeric">{posts.length}</span> packets
          {selectedRegion && (
            <>
              <br />
              {selectedRegion.short}
            </>
          )}
        </div>
        <div className="ruled-body space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-chalk-2">
              {selectedRegion
                ? `Reading from ${selectedRegion.label}.`
                : "Browse by region, then open a packet."}
            </p>
            <div className="flex items-center gap-2">
              {regionFilter && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRegionFilter(null)}
                >
                  Clear region
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowMap((s) => !s)}
              >
                {showMap ? "Hide atlas" : "Show atlas"}
              </Button>
            </div>
          </div>

          {showMap && (
            <WorldRegionMap
              selected={regionFilter}
              counts={regionCounts}
              onSelect={(r) => setRegionFilter(r)}
            />
          )}

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setRegionFilter(null)}
              className={`rounded-control px-2.5 py-1 text-[12px] transition-colors ${
                regionFilter === null
                  ? "bg-chalk text-board"
                  : "border border-rule text-chalk-2 hover:text-chalk"
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
                  title={r.examples}
                  onClick={() => setRegionFilter(active ? null : r.id)}
                  className={`inline-flex items-center gap-1.5 rounded-control px-2.5 py-1 text-[12px] transition-colors ${
                    active
                      ? "bg-chalk text-board"
                      : "border border-rule text-chalk-2 hover:text-chalk"
                  }`}
                >
                  {r.short}
                  {count > 0 && (
                    <span className="numeric opacity-70">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-chalk-3" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search school, major, region"
            className="h-9 w-full rounded-control border border-rule bg-recess pl-9 pr-3 text-sm text-chalk placeholder:text-chalk-3 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
          />
        </div>
        <SegmentedControl
          aria-label="Sort profiles"
          value={filter}
          onChange={setFilter}
          options={FILTERS.map((key) => ({ value: key, label: key }))}
        />
      </div>

      {loading ? (
        <LoadingState label="Opening packets…" />
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={Flag}
          title={searchTerm ? "Nothing matches that search." : "No packets yet."}
          description={
            searchTerm
              ? "Try a different school, major, or region."
              : "Be the first to post a profile for peers to read."
          }
          action={
            !searchTerm ? (
              <Button onClick={() => navigate("/rate-your-chance/new")}>
                Post a profile
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => (
            <DossierCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </AppPage>
  );
};

const DossierCard = ({ post }: { post: RYCPost }) => {
  const avg = averageChance(post);
  const top = topVerdict(post);
  const stateName = US_STATES.find((s) => s.code === post.usState)?.name;
  const locationLabel =
    post.region === "north-america" && stateName
      ? stateName
      : (REGION_BY_ID[post.region]?.label ?? "—");

  return (
    <Link to={`/rate-your-chance/${post.id}`} className="block h-full">
      <Card interactive className="flex h-full flex-col">
        <CardHeader className="gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge>{post.intendedMajor || "Undeclared"}</Badge>
                <Badge variant="community">
                  {REGION_BY_ID[post.region]?.short ?? "—"}
                </Badge>
              </div>
              <h2 className="display-3 mt-3 line-clamp-2 text-chalk">
                {post.dreamSchool}
              </h2>
              <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-chalk-3">
                <Flag className="size-3" />
                {locationLabel}
                {post.schoolType ? ` · ${post.schoolType}` : ""}
              </p>
            </div>
            <VerdictStamp verdict={top} />
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          <div className="grid grid-cols-3 gap-3 border-t border-rule pt-4">
            <SpecCell label="UW GPA" value={post.gpaUnweighted ?? "—"} />
            <SpecCell
              label="SAT / ACT"
              value={
                post.satScore
                  ? post.satScore
                  : post.actScore
                    ? `${post.actScore} ACT`
                    : "—"
              }
            />
            <SpecCell label="Rigor" value={post.rigor ? "Listed" : "—"} />
          </div>
          {post.spike && (
            <p className="line-clamp-3 text-[13px] leading-relaxed text-chalk-2">
              {post.spike}
            </p>
          )}
          <ChanceScale value={avg} />
        </CardContent>

        <CardFooter className="justify-between text-[12px] text-chalk-3">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-3.5" />
            {post.ratingsCount} {post.ratingsCount === 1 ? "read" : "reads"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle className="size-3.5" />
            {post.commentsCount}
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RateYourChance;

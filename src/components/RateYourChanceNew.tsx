import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, ShieldAlert, Sparkles } from "lucide-react";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  RYC_DISCLAIMER,
  REGIONS,
  RegionId,
  SCHOOL_TYPES,
  US_STATES,
  parseOptionalNumber,
} from "@/lib/rateYourChance";
import WorldRegionMap from "@/components/ui/WorldRegionMap";

const fieldClass =
  "bg-[#0d1019] border-white/10 text-white placeholder:text-gray-500 rounded-xl focus-visible:ring-2 focus-visible:ring-[#7cdcbd]/35 focus-visible:border-[#7cdcbd]/25";

const selectContentClass =
  "bg-[#11141d] text-white border border-white/10 rounded-xl shadow-xl z-50";

const RateYourChanceNew = () => {
  const navigate = useNavigate();
  const submittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dreamSchool, setDreamSchool] = useState("");
  const [intendedMajor, setIntendedMajor] = useState("");
  const [region, setRegion] = useState<RegionId | "">("");
  const [usState, setUsState] = useState<string>("");
  const [schoolType, setSchoolType] = useState<string>("");
  const [gpaUnweighted, setGpaUnweighted] = useState("");
  const [gpaWeighted, setGpaWeighted] = useState("");
  const [classRank, setClassRank] = useState("");
  const [satScore, setSatScore] = useState("");
  const [actScore, setActScore] = useState("");
  const [rigor, setRigor] = useState("");
  const [extracurriculars, setExtracurriculars] = useState("");
  const [awards, setAwards] = useState("");
  const [essaysSummary, setEssaysSummary] = useState("");
  const [spike, setSpike] = useState("");
  const [demographics, setDemographics] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    if (!dreamSchool.trim()) {
      toast.error("Please add a dream school.");
      return;
    }
    if (!region) {
      toast.error("Please pick a region.");
      return;
    }
    if (!extracurriculars.trim()) {
      toast.error("Add at least a few extracurriculars so peers can rate.");
      return;
    }

    const user = getAuth().currentUser;
    if (!user?.uid) {
      toast.error("You must be signed in to post.");
      navigate("/login");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const docRef = await addDoc(collection(db, "chances"), {
        authorUid: user.uid,
        dreamSchool: dreamSchool.trim(),
        intendedMajor: intendedMajor.trim(),
        region,
        usState: region === "north-america" ? usState : "",
        schoolType,
        gpaUnweighted: parseOptionalNumber(gpaUnweighted),
        gpaWeighted: parseOptionalNumber(gpaWeighted),
        classRank: classRank.trim(),
        satScore: parseOptionalNumber(satScore),
        actScore: parseOptionalNumber(actScore),
        rigor: rigor.trim(),
        extracurriculars: extracurriculars.trim(),
        awards: awards.trim(),
        essaysSummary: essaysSummary.trim(),
        spike: spike.trim(),
        demographics: demographics.trim(),
        additionalContext: additionalContext.trim(),
        createdAt: serverTimestamp(),
        ratingsCount: 0,
        chanceTotal: 0,
        reachCount: 0,
        targetCount: 0,
        likelyCount: 0,
        safetyCount: 0,
        commentsCount: 0,
      });
      toast.success("Profile posted anonymously.");
      navigate(`/rate-your-chance/${docRef.id}`);
    } catch (err) {
      console.error("Failed to post chance profile:", err);
      toast.error("Could not post profile. Please try again.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D17] text-white pb-20">
      <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6 sm:pt-10">
        <Button
          type="button"
          variant="ghost"
          className="mb-6 -ml-2 gap-2 text-gray-400 hover:text-white hover:bg-white/5"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          <ArrowLeft size={18} />
          Back
        </Button>

        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-[#7CDCBD]/15 border border-[#7CDCBD]/25 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#7CDCBD]" />
            </div>
            <h1 className="text-3xl font-bold font-syncopate tracking-tight text-white sm:text-4xl">
              Post your profile
            </h1>
          </div>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            Lay out your stats, extracurriculars, and dream school. Posts go up
            anonymously — peers will rate your chance and leave comments.
          </p>
        </header>

        <div className="rounded-2xl border border-amber-400/25 bg-amber-400/5 p-3 sm:p-4 flex items-start gap-3 mb-6">
          <ShieldAlert className="w-4 h-4 mt-0.5 text-amber-300 shrink-0" />
          <div className="text-[12px] sm:text-[13px] text-amber-100/95 leading-snug">
            <span className="font-semibold text-amber-200">Disclaimer.</span>{" "}
            {RYC_DISCLAIMER}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/[0.08] bg-[#11141d]/90 p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)] space-y-8"
        >
          <Section
            title="Target school"
            description="Where you’re aiming and what you’d study."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Dream school"
                required
                input={
                  <Input
                    value={dreamSchool}
                    onChange={(e) => setDreamSchool(e.target.value)}
                    placeholder="e.g. Stanford University"
                    className={fieldClass}
                    disabled={isSubmitting}
                    maxLength={120}
                  />
                }
              />
              <Field
                label="Intended major"
                input={
                  <Input
                    value={intendedMajor}
                    onChange={(e) => setIntendedMajor(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className={fieldClass}
                    disabled={isSubmitting}
                    maxLength={120}
                  />
                }
              />
            </div>
          </Section>

          <Section
            title="Where you’re from"
            required
            description="Pick the region you’re applying from. Regions help peers understand context (curriculum, admit pools, etc.)."
          >
            <div className="rounded-2xl border border-white/10 bg-[#0d1019] p-3">
              <WorldRegionMap
                selected={region || null}
                onSelect={(r) => setRegion(r ?? "")}
                className="max-w-3xl mx-auto"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 mt-3">
              {REGIONS.map((r) => {
                const active = region === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegion(r.id)}
                    disabled={isSubmitting}
                    className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                      active
                        ? "border-[#7CDCBD] bg-[#7CDCBD]/10"
                        : "border-white/10 bg-[#0A0D17]/60 hover:border-white/20 hover:bg-white/[0.03]"
                    }`}
                  >
                    <p
                      className={`text-sm font-medium ${
                        active ? "text-[#7CDCBD]" : "text-white"
                      }`}
                    >
                      {r.label}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">
                      {r.examples}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-5 md:grid-cols-2 mt-2">
              {region === "north-america" && (
                <Field
                  label="US state (optional)"
                  input={
                    <Select
                      value={usState}
                      onValueChange={setUsState}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className={fieldClass}>
                        <SelectValue placeholder="Select state (skip if outside US)" />
                      </SelectTrigger>
                      <SelectContent className={selectContentClass}>
                        {US_STATES.map((s) => (
                          <SelectItem
                            key={s.code}
                            value={s.code}
                            className="cursor-pointer focus:bg-white/10 focus:text-white"
                          >
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  }
                />
              )}
              <Field
                label="High school type"
                input={
                  <Select
                    value={schoolType}
                    onValueChange={setSchoolType}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className={fieldClass}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className={selectContentClass}>
                      {SCHOOL_TYPES.map((t) => (
                        <SelectItem
                          key={t}
                          value={t}
                          className="cursor-pointer focus:bg-white/10 focus:text-white"
                        >
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
              />
            </div>
          </Section>

          <Section
            title="Stats"
            description="Leave blank if you’d rather not share — peers can still rate."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="GPA (Unweighted, /4.0)"
                input={
                  <Input
                    inputMode="decimal"
                    value={gpaUnweighted}
                    onChange={(e) => setGpaUnweighted(e.target.value)}
                    placeholder="e.g. 3.95"
                    className={fieldClass}
                    disabled={isSubmitting}
                  />
                }
              />
              <Field
                label="GPA (Weighted)"
                input={
                  <Input
                    inputMode="decimal"
                    value={gpaWeighted}
                    onChange={(e) => setGpaWeighted(e.target.value)}
                    placeholder="e.g. 4.6"
                    className={fieldClass}
                    disabled={isSubmitting}
                  />
                }
              />
              <Field
                label="Class rank (optional)"
                input={
                  <Input
                    value={classRank}
                    onChange={(e) => setClassRank(e.target.value)}
                    placeholder="e.g. Top 5%, 12/430, or N/A"
                    className={fieldClass}
                    disabled={isSubmitting}
                    maxLength={60}
                  />
                }
              />
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="SAT (400–1600)"
                  input={
                    <Input
                      inputMode="numeric"
                      value={satScore}
                      onChange={(e) => setSatScore(e.target.value)}
                      placeholder="e.g. 1480"
                      className={fieldClass}
                      disabled={isSubmitting}
                    />
                  }
                />
                <Field
                  label="ACT (1–36)"
                  input={
                    <Input
                      inputMode="numeric"
                      value={actScore}
                      onChange={(e) => setActScore(e.target.value)}
                      placeholder="e.g. 33"
                      className={fieldClass}
                      disabled={isSubmitting}
                    />
                  }
                />
              </div>
            </div>
          </Section>

          <Section
            title="Course rigor"
            description="APs, IBs, dual enrollment, honors, etc."
          >
            <Textarea
              value={rigor}
              onChange={(e) => setRigor(e.target.value)}
              placeholder={`AP Calc BC (5)\nAP English Lang (4)\nIB HL Bio …`}
              className={`min-h-[120px] ${fieldClass} resize-y`}
              disabled={isSubmitting}
              maxLength={2000}
            />
          </Section>

          <Section
            title="Extracurriculars"
            required
            description="One per line. Include role, hours, years, and impact when possible."
          >
            <Textarea
              value={extracurriculars}
              onChange={(e) => setExtracurriculars(e.target.value)}
              placeholder={`Robotics Captain — 12 hrs/wk, 3 yrs — led team to state finals\nVarsity Cross Country — 10 hrs/wk, 4 yrs\nFounder, Local Tutoring Nonprofit — 8 hrs/wk, 2 yrs`}
              className={`min-h-[180px] ${fieldClass} resize-y`}
              disabled={isSubmitting}
              maxLength={4000}
            />
          </Section>

          <Section
            title="Awards & honors"
            description="National, state, local. Include level."
          >
            <Textarea
              value={awards}
              onChange={(e) => setAwards(e.target.value)}
              placeholder={`USACO Gold (national)\nState Science Fair, 2nd place\nNational Merit Semifinalist`}
              className={`min-h-[120px] ${fieldClass} resize-y`}
              disabled={isSubmitting}
              maxLength={2000}
            />
          </Section>

          <Section
            title="Spike / hook"
            description="What makes your profile distinctive in 1–3 sentences."
          >
            <Textarea
              value={spike}
              onChange={(e) => setSpike(e.target.value)}
              placeholder="e.g. Self-taught ML researcher publishing on accessible robotics, with 2 conference workshop papers."
              className={`min-h-[100px] ${fieldClass} resize-y`}
              disabled={isSubmitting}
              maxLength={1000}
            />
          </Section>

          <Section
            title="Essays summary"
            description="Themes / topics — don’t paste full essays."
          >
            <Textarea
              value={essaysSummary}
              onChange={(e) => setEssaysSummary(e.target.value)}
              placeholder="Personal statement: growing up between cultures and how it shaped my engineering perspective. Supplements focus on community impact and curiosity."
              className={`min-h-[120px] ${fieldClass} resize-y`}
              disabled={isSubmitting}
              maxLength={2000}
            />
          </Section>

          <Section
            title="Demographics & context (optional)"
            description="Only share what you’re comfortable with — first-gen, FGLI, recruited athlete, legacy, etc."
          >
            <Textarea
              value={demographics}
              onChange={(e) => setDemographics(e.target.value)}
              placeholder="First-gen, FGLI, recruited for cross country."
              className={`min-h-[80px] ${fieldClass} resize-y`}
              disabled={isSubmitting}
              maxLength={1000}
            />
          </Section>

          <Section
            title="Anything else"
            description="Major changes, recommenders, gap year, etc."
          >
            <Textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Senior year I switched majors from Bio to CS. My recs are from a CS teacher and a research mentor."
              className={`min-h-[100px] ${fieldClass} resize-y`}
              disabled={isSubmitting}
              maxLength={2000}
            />
          </Section>

          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="rounded-xl border-white/15 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="group inline-flex items-center justify-center rounded-xl bg-[#7CDCBD] px-6 font-semibold text-[#0A0D17] shadow-[0_0_24px_-8px_rgba(124,220,189,0.45)] transition hover:bg-[#5FBFAA] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting…
                </>
              ) : (
                "Post profile anonymously"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Section = ({
  title,
  description,
  required,
  children,
}: {
  title: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <div>
      <Label className="text-sm text-gray-200 font-medium">
        {title}
        {required && <span className="text-amber-300"> *</span>}
      </Label>
      {description && (
        <p className="text-[12px] text-gray-500 leading-snug mt-1">
          {description}
        </p>
      )}
    </div>
    {children}
  </div>
);

const Field = ({
  label,
  required,
  input,
}: {
  label: string;
  required?: boolean;
  input: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-[12px] uppercase tracking-wider text-gray-500">
      {label}
      {required && <span className="text-amber-300"> *</span>}
    </Label>
    {input}
  </div>
);

export default RateYourChanceNew;

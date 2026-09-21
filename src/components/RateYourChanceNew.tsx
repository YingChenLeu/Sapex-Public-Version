import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "sonner";

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
import { AppPage, PageHeader } from "@/components/ui/app-shell";
import WorldRegionMap from "@/components/ui/WorldRegionMap";
import { Disclaimer } from "@/components/ryc/marks";
import {
  REGIONS,
  RegionId,
  SCHOOL_TYPES,
  US_STATES,
  parseOptionalNumber,
} from "@/lib/rateYourChance";

const RateYourChanceNew = () => {
  const navigate = useNavigate();
  const submittingRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dreamSchool, setDreamSchool] = useState("");
  const [intendedMajor, setIntendedMajor] = useState("");
  const [region, setRegion] = useState<RegionId | "">("");
  const [usState, setUsState] = useState("");
  const [schoolType, setSchoolType] = useState("");
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submittingRef.current) return;

    if (!dreamSchool.trim()) {
      toast.error("Add a dream school.");
      return;
    }
    if (!region) {
      toast.error("Pick the region you’re applying from.");
      return;
    }
    if (!extracurriculars.trim()) {
      toast.error("Add a few extracurriculars so peers have something to read.");
      return;
    }

    const user = getAuth().currentUser;
    if (!user?.uid) {
      toast.error("Sign in to post a profile.");
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
      toast.error("Could not post profile. Try again.");
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <AppPage width="narrow">
      <Button
        type="button"
        variant="ghost"
        className="mb-6 -ml-2"
        onClick={() => navigate(-1)}
        disabled={isSubmitting}
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <PageHeader
        margin="new packet"
        title="Fill out the dossier"
        description="Stats, extracurriculars, and a dream school. Your name stays off the packet. Peers stamp a verdict and leave notes."
      />

      <Disclaimer className="mb-8" />

      <form onSubmit={handleSubmit} className="space-y-10">
        <PacketSection
          title="Target school"
          description="Where you’re aiming and what you’d study."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Dream school" required>
              <Input
                value={dreamSchool}
                onChange={(e) => setDreamSchool(e.target.value)}
                placeholder="Stanford University"
                disabled={isSubmitting}
                maxLength={120}
              />
            </Field>
            <Field label="Intended major">
              <Input
                value={intendedMajor}
                onChange={(e) => setIntendedMajor(e.target.value)}
                placeholder="Computer Science"
                disabled={isSubmitting}
                maxLength={120}
              />
            </Field>
          </div>
        </PacketSection>

        <PacketSection
          title="Where you’re applying from"
          required
          description="Region gives readers curriculum and pool context."
        >
          <WorldRegionMap
            selected={region || null}
            onSelect={(r) => setRegion(r ?? "")}
          />
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {REGIONS.map((r) => {
              const active = region === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRegion(r.id)}
                  disabled={isSubmitting}
                  className={`rounded-notice border px-3 py-2.5 text-left transition-colors ${
                    active
                      ? "border-brass bg-brass-wash"
                      : "border-rule bg-notice hover:border-rule-strong"
                  }`}
                >
                  <p className={`text-sm font-medium ${active ? "text-brass" : "text-chalk"}`}>
                    {r.label}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-snug text-chalk-3">
                    {r.examples}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            {region === "north-america" && (
              <Field label="US state (optional)">
                <Select
                  value={usState}
                  onValueChange={setUsState}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Skip if outside the US" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((s) => (
                      <SelectItem key={s.code} value={s.code}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
            <Field label="High school type">
              <Select
                value={schoolType}
                onValueChange={setSchoolType}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {SCHOOL_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </PacketSection>

        <PacketSection
          title="On paper"
          description="Leave a field blank if you’d rather not share it."
        >
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="GPA, unweighted /4.0">
              <Input
                inputMode="decimal"
                value={gpaUnweighted}
                onChange={(e) => setGpaUnweighted(e.target.value)}
                placeholder="3.95"
                disabled={isSubmitting}
              />
            </Field>
            <Field label="GPA, weighted">
              <Input
                inputMode="decimal"
                value={gpaWeighted}
                onChange={(e) => setGpaWeighted(e.target.value)}
                placeholder="4.6"
                disabled={isSubmitting}
              />
            </Field>
            <Field label="Class rank">
              <Input
                value={classRank}
                onChange={(e) => setClassRank(e.target.value)}
                placeholder="Top 5%, 12/430, or N/A"
                disabled={isSubmitting}
                maxLength={60}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="SAT">
                <Input
                  inputMode="numeric"
                  value={satScore}
                  onChange={(e) => setSatScore(e.target.value)}
                  placeholder="1480"
                  disabled={isSubmitting}
                />
              </Field>
              <Field label="ACT">
                <Input
                  inputMode="numeric"
                  value={actScore}
                  onChange={(e) => setActScore(e.target.value)}
                  placeholder="33"
                  disabled={isSubmitting}
                />
              </Field>
            </div>
          </div>
        </PacketSection>

        <PacketSection
          title="Course rigor"
          description="APs, IBs, dual enrollment, honors."
        >
          <Textarea
            value={rigor}
            onChange={(e) => setRigor(e.target.value)}
            placeholder={"AP Calc BC (5)\nIB HL Bio"}
            className="min-h-[120px] resize-y"
            disabled={isSubmitting}
            maxLength={2000}
          />
        </PacketSection>

        <PacketSection
          title="Extracurriculars"
          required
          description="One per line. Role, hours, years, impact."
        >
          <Textarea
            value={extracurriculars}
            onChange={(e) => setExtracurriculars(e.target.value)}
            placeholder="Robotics captain — 12 hrs/wk, 3 yrs — state finals"
            className="min-h-[180px] resize-y"
            disabled={isSubmitting}
            maxLength={4000}
          />
        </PacketSection>

        <PacketSection title="Awards" description="National, state, local. Include level.">
          <Textarea
            value={awards}
            onChange={(e) => setAwards(e.target.value)}
            placeholder="USACO Gold"
            className="min-h-[120px] resize-y"
            disabled={isSubmitting}
            maxLength={2000}
          />
        </PacketSection>

        <PacketSection
          title="The hook"
          description="What makes this profile distinctive, in a few sentences."
        >
          <Textarea
            value={spike}
            onChange={(e) => setSpike(e.target.value)}
            className="min-h-[100px] resize-y"
            disabled={isSubmitting}
            maxLength={1000}
          />
        </PacketSection>

        <PacketSection
          title="Essays"
          description="Themes only. Don’t paste the essay."
        >
          <Textarea
            value={essaysSummary}
            onChange={(e) => setEssaysSummary(e.target.value)}
            className="min-h-[120px] resize-y"
            disabled={isSubmitting}
            maxLength={2000}
          />
        </PacketSection>

        <PacketSection
          title="Context"
          description="First-gen, FGLI, recruited athlete, legacy — only what you’re comfortable sharing."
        >
          <Textarea
            value={demographics}
            onChange={(e) => setDemographics(e.target.value)}
            className="min-h-[80px] resize-y"
            disabled={isSubmitting}
            maxLength={1000}
          />
        </PacketSection>

        <PacketSection title="Anything else">
          <Textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            className="min-h-[100px] resize-y"
            disabled={isSubmitting}
            maxLength={2000}
          />
        </PacketSection>

        <div className="flex flex-col-reverse gap-3 border-t border-rule pt-6 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Post anonymously
          </Button>
        </div>
      </form>
    </AppPage>
  );
};

function PacketSection({
  title,
  description,
  required,
  children,
}: {
  title: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mb-4 border-b border-rule pb-3">
        <h2 className="text-[13px] font-semibold text-chalk">
          {title}
          {required ? <span className="ml-1 text-brass">*</span> : null}
        </h2>
        {description && (
          <p className="mt-1 text-[13px] leading-relaxed text-chalk-2">
            {description}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required ? <span className="ml-1 text-brass">*</span> : null}
      </Label>
      {children}
    </div>
  );
}

export default RateYourChanceNew;

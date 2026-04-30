import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  MessageCircleMore,
  MessagesSquare,
  School,
  Shield,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import Logo from "@/assets/sapexlogo.png";
import FloatingLines from "./ui/FloatingLines";
import SoftAurora from "./ui/SoftAurora";
import BorderGlow from "./ui/BorderGlow";
import {
  AcademicHubDemo,
  RateYourChanceDemo,
  WellnessDemo,
  StudyRoomsDemo,
} from "./ui/FeatureShowcase";

const PRODUCT_PILLARS = [
  {
    title: "Academic Help",
    copy: "Questions, answers, live discussion.",
    Icon: MessagesSquare,
  },
  {
    title: "Wellness Support",
    copy: "Peer support chats that feel human.",
    Icon: HeartPulse,
  },
  {
    title: "Study Rooms",
    copy: "Focused sessions with your classmates.",
    Icon: Users,
  },
] as const;

const QUICK_STEPS = [
  { title: "Sign in", copy: "Use your Google account.", Icon: School },
  { title: "Choose a space", copy: "Academic, wellness, or rooms.", Icon: Sparkles },
  { title: "Start now", copy: "Get support in minutes.", Icon: ArrowRight },
] as const;

const PREVIEWS = [
  {
    title: "Academic Center",
    copy: "Post fast. Get answers fast.",
    Demo: AcademicHubDemo,
    accent: "#7CDCBD",
  },
  {
    title: "Rate Your Chance",
    copy: "Anonymous profile reviews and peer ratings.",
    Demo: RateYourChanceDemo,
    accent: "#7CDCBD",
  },
  {
    title: "Wellness Chat",
    copy: "Support chats, whenever needed.",
    Demo: WellnessDemo,
    accent: "#A78BFA",
  },
  {
    title: "Study Rooms",
    copy: "Jump in and focus together.",
    Demo: StudyRoomsDemo,
    accent: "#60A5FA",
  },
] as const;

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-[#D8DEDE] flex flex-col">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Sapex Connect",
            applicationCategory: "EducationApplication",
            url: "https://www.sapexconnect.com",
          }),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 sm:px-6 md:px-8 pt-24 sm:pt-32 pb-16 md:pb-20 border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-35 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),rgba(0,0,0,0.3),transparent)]">
          <FloatingLines
            linesGradient={["#45f56e", "#A8D3CC", "#2D4F53"]}
            interactive={false}
            bendStrength={-12}
            parallax={false}
            mixBlendMode="screen"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#D8DEDE]/85"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8D3CC]" />
            Public student app, free to use
          </motion.div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <img src={Logo} alt="Sapex Logo" className="w-11 h-11 sm:w-14 sm:h-14" />
                <span className="text-2xl sm:text-3xl font-syncopate font-bold text-white">
                  SAPEX
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-white">
                Free public app for student support.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-[#D8DEDE]/80 max-w-xl">
                Ask for help. Offer help. Stay connected.
              </p>
              <p className="mt-2 text-sm text-[#D8DEDE]/65 max-w-xl">
                Need a private version for your school community? Message us.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="bg-[#A8D3CC] text-[#2D4F53] hover:bg-[#D8DEDE] hover:text-[#2D4F53]"
                >
                  <Link to="/login" className="flex items-center gap-2">
                    Open Sapex
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#A8D3CC]/50 text-[#D8DEDE] hover:bg-[#A8D3CC]/10"
                >
                  <Link to="/features">Explore features</Link>
                </Button>
                <a
                  href="mailto:sapex@aisct.org?subject=Sapex%20inquiry"
                  className="text-sm text-[#A8D3CC] hover:text-[#D8DEDE] transition-colors"
                >
                  Contact us
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {["Public app", "Free to use", "Private school version available"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#D8DEDE]/80"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <BorderGlow
                borderRadius={24}
                backgroundColor="#0C111C"
                glowColor="170 211 204"
                glowIntensity={0.75}
                edgeSensitivity={24}
                colors={["#A8D3CC", "#45f56e", "#2D4F53"]}
                fillOpacity={0.22}
              >
                <div className="p-4 sm:p-5">
                  <RateYourChanceDemo />
                </div>
              </BorderGlow>

              <motion.div
                className="mt-4 grid grid-cols-2 gap-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
              >
                {[
                  { label: "Live chats", value: "Always on", Icon: MessageCircleMore },
                  { label: "Trusted access", value: "Google sign-in", Icon: Shield },
                ].map(({ label, value, Icon }) => (
                  <motion.div
                    key={label}
                    className="rounded-xl border border-white/10 bg-[#0C111C]/85 px-3 py-2"
                    animate={{ y: [0, -2, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="flex items-center gap-1.5 text-[#A8D3CC] text-xs">
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </div>
                    <div className="text-sm text-white mt-1">{value}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Motion tag rail */}
      <section className="border-b border-white/5 py-4 overflow-hidden">
        <motion.div
          className="whitespace-nowrap flex items-center gap-10 text-sm text-[#D8DEDE]/70"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[...Array(2)].map((_, loop) => (
            <div key={loop} className="flex items-center gap-10 pl-6">
              {[
                "learn",
                "study",
                "support",
                "chat",
                "focus",
                "connect",
                "grow",
                "learn",
                "study",
                "support",
                "chat",
              ].map((word, i) => (
                <span key={`${word}-${i}`} className="flex items-center gap-2">
                  <span className="text-[#A8D3CC]/90">●</span>
                  {word}
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* App Pillars */}
      <section className="py-14 md:py-18 border-b border-white/5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-4 sm:gap-5">
            {PRODUCT_PILLARS.map(({ title, copy, Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-[#0C111C] p-5"
              >
                <div className="w-10 h-10 rounded-lg bg-[#A8D3CC]/15 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#A8D3CC]" />
                </div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <p className="mt-1 text-sm text-[#D8DEDE]/75">{copy}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Grid */}
      <section className="relative overflow-hidden py-16 md:py-20 border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40 [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_100%)]">
          <SoftAurora
            color1="#A8D3CC"
            color2="#2D4F53"
            brightness={0.7}
            speed={0.45}
            scale={1.35}
            enableMouseInteraction={false}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              App preview
            </h2>
          </motion.div>

          <div className="space-y-8">
            {PREVIEWS.map(({ title, copy, Demo, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-5 rounded-2xl border border-white/10 bg-[#0C111C]/85 p-4 ${
                  i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="flex flex-col justify-center px-2 py-1">
                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[#D8DEDE]/85 mb-3">
                    <span className="w-2 h-2 rounded-full" style={{ background: accent }} />
                    Live module
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white">{title}</h3>
                  <p className="text-base text-[#D8DEDE]/78 mt-2">{copy}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#A8D3CC]">
                    <CheckCircle2 className="w-4 h-4" />
                    Built right into Sapex
                  </div>
                </div>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Demo />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick flow */}
      <section className="py-14 md:py-18 border-b border-white/5">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Made for schools</h2>
            <p className="text-sm sm:text-base text-[#D8DEDE]/75 mt-2">
              Public by default. Private school version on request.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {QUICK_STEPS.map(({ title, copy, Icon }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 bg-[#0C111C] p-5"
              >
                <Icon className="w-4 h-4 text-[#A8D3CC] mb-2" />
                <div className="text-white font-semibold">{title}</div>
                <div className="text-sm text-[#D8DEDE]/75 mt-1">{copy}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <footer className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#A8D3CC]/25 bg-[#0C111C] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-semibold text-white">Launch Sapex now</h3>
              <p className="text-sm text-[#D8DEDE]/75 mt-1">
                Free public access. Need a private school version? Contact us.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                asChild
                className="bg-[#A8D3CC] text-[#2D4F53] hover:bg-[#D8DEDE] hover:text-[#2D4F53]"
              >
                <Link to="/login" className="flex items-center gap-2">
                  Open Sapex
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <a
                href="mailto:sapex@aisct.org?subject=Sapex%20for%20my%20school"
                className="text-sm text-[#A8D3CC] hover:text-[#D8DEDE] transition-colors"
              >
                Contact us
              </a>
              <Link
                to="/terms"
                className="text-sm text-[#A8D3CC] hover:text-[#D8DEDE] transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

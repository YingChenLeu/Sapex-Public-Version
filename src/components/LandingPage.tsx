import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Code2, Leaf, Instagram } from "lucide-react";
import Logo from "@/assets/sapexlogo.png";
import MetaBalls from "./ui/MetaBalls";
import FloatingLines from "./ui/FloatingLines";
import SoftAurora from "./ui/SoftAurora";
import BorderGlow from "./ui/BorderGlow";
import MemoriesBento from "./ui/MemoriesBento";
import CircularText from "./CircularText";
import {
  AcademicHubDemo,
  WellnessDemo,
  StudyRoomsDemo,
  OriginsLabDemo,
} from "./ui/FeatureShowcase";
import firebaseLogo from "@/assets/landingPageAssets/devLogos/firebase.png";
import fastAPILogo from "@/assets/landingPageAssets/devLogos/fastAPI.png";
import vercelLogo from "@/assets/landingPageAssets/devLogos/vercel.png";
import deapLearningLogo from "@/assets/landingPageAssets/devLogos/deapLearning.png";
import reactLogo from "@/assets/landingPageAssets/devLogos/react.png";

const BRIDGE_PILLARS = [
  {
    letter: "B",
    word: "BUILD",
    description: "Building a safe haven for the current youth.",
  },
  {
    letter: "R",
    word: "RECOGNIZE",
    description: "Recognize the strength found in connection.",
  },
  {
    letter: "I",
    word: "INNOVATION",
    description: "Innovate new ways for support.",
  },
  {
    letter: "D",
    word: "DEVELOP",
    description: "Develop character, resilience, and purpose.",
  },
  {
    letter: "G",
    word: "GUIDE",
    description: "Guide peers with patience, wisdom and care.",
  },
  {
    letter: "E",
    word: "EMBRACE",
    description: "Embrace diversity, individuality, and the future.",
  },
] as const;

// Simple inline SVG icons to avoid new deps
function IconShield() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path d="M12 2.25a.75.75 0 0 1 .3.064l7.5 3.214a.75.75 0 0 1 .45.686V12c0 4.788-3.37 8.725-7.95 9.682a.75.75 0 0 1-.3 0C7.42 20.725 4.05 16.788 4.05 12V6.214a.75.75 0 0 1 .45-.686l7.5-3.214A.75.75 0 0 1 12 2.25Z" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path d="M7.5 3.75h9a3.75 3.75 0 0 1 3.75 3.75v5.25A3.75 3.75 0 0 1 16.5 16.5H9.62l-3.37 2.527A1 1 0 0 1 5 18.166V7.5A3.75 3.75 0 0 1 8.75 3.75h-1.25Z" />
    </svg>
  );
}
function IconSparkles() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path d="M11.48 3.5a.75.75 0 0 1 1.04 0l1.676 1.676a.75.75 0 0 0 .53.22h2.37a.75.75 0 0 1 .53 1.28l-1.676 1.676a.75.75 0 0 0-.22.53v2.37a.75.75 0 0 1-1.28.53l-1.676-1.676a.75.75 0 0 0-.53-.22h-2.37a.75.75 0 0 1-.53-1.28l1.676-1.676a.75.75 0 0 0 .22-.53v-2.37Z" />
      <path d="M5.25 12.75a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75v-1.5Zm8.25 6a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75H14.25a.75.75 0 0 1-.75-.75v-1.5Z" />
    </svg>
  );
}
function IconGlobe() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
    >
      <path d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm0 1.5c1.657 0 3 3.358 3 8.25s-1.343 8.25-3 8.25-3-3.358-3-8.25 1.343-8.25 3-8.25Zm7.938 8.25a8.466 8.466 0 0 1-2.38 5.25H6.442a8.466 8.466 0 0 1-2.38-5.25h15.876Z" />
    </svg>
  );
}

const springCard = { type: "spring" as const, stiffness: 180, damping: 22 };

function TechCard({
  title,
  description,
  logoEl,
  enterFrom,
}: {
  title: string;
  description: string;
  icon: string;
  logoEl: React.ReactNode;
  enterFrom: { x?: number; y?: number; opacity: number };
  order: number;
}) {
  return (
    <motion.div
      className="h-full"
      variants={{
        hidden: enterFrom,
        visible: {
          x: 0,
          y: 0,
          opacity: 1,
          transition: springCard,
        },
      }}
      whileHover={{
        scale: 1.02,
        y: -4,
        transition: { type: "spring", stiffness: 400, damping: 25 },
      }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      <BorderGlow
        className="h-full"
        borderRadius={20}
        backgroundColor="#0C111C"
        glowColor="170 35 75"
        glowIntensity={0.9}
        edgeSensitivity={28}
        colors={["#A8D3CC", "#45f56e", "#2D4F53"]}
        fillOpacity={0.25}
      >
        <div className="p-5 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-center shrink-0 min-h-[72px] sm:min-h-[80px]">
            {logoEl}
          </div>
          <div className="min-w-0 flex-1">
            <motion.h3
              className="font-semibold text-[#D8DEDE] mb-2 text-base sm:text-lg"
              initial={false}
              whileHover={{ color: "#A8D3CC" }}
              transition={{ duration: 0.2 }}
            >
              {title}
            </motion.h3>
            <p className="text-sm text-[#D8DEDE]/80 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </BorderGlow>
    </motion.div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-[#D8DEDE] flex flex-col">
      {/* Top half: hero + spinning “Sapex builds communities” + trust bar */}
      <motion.section
        className="relative w-full overflow-hidden pt-24 sm:pt-32 pb-10 sm:pb-12 px-4 sm:px-6 md:px-8"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
          },
          hidden: {},
        }}
        style={{
          background:
            "linear-gradient(180deg, #111a16 0%, #0f1614 25%, #0d1218 55%, #0A0D17 85%, #0A0D17 100%)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 z-0 opacity-35 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.85),rgba(0,0,0,0.35),transparent)]">
          <FloatingLines
            linesGradient={["#45f56e", "#A8D3CC", "#2D4F53"]}
            interactive={false}
            bendStrength={-15}
            parallax={false}
            mixBlendMode="screen"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl">
          {/* Row 1: Hero copy (left) | Metaballs + circular text (right) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative z-10 flex flex-col items-start text-left order-2 lg:order-1">
              <motion.div
                className="flex items-center justify-start gap-4 mb-6"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={Logo}
                  alt="Sapex Logo"
                  className="w-16 h-16 sm:w-24 sm:h-24 opacity-95 shrink-0"
                />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#D8DEDE] to-[#A8D3CC] bg-clip-text text-transparent font-syncopate">
                  Sapex
                </h1>
              </motion.div>
              <motion.h2
                className="text-2xl sm:text-4xl md:text-5xl font-bold text-[#D8DEDE] mb-5 sm:mb-6 leading-tight"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                Connect People, Build{" "}
                <span className="text-[#A8D3CC] font-semibold">
                  Communities
                </span>
              </motion.h2>
              <motion.p
                className="text-base sm:text-lg md:text-xl text-[#D8DEDE]/90 max-w-xl leading-relaxed"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                Multi-use Support Platform for Teenagers and Young Adults
              </motion.p>
            </div>

            <motion.div
              className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none lg:mx-0 h-[240px] sm:h-[320px] lg:h-[340px] order-1 lg:order-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="absolute inset-0 z-0 rounded-2xl overflow-hidden">
                <MetaBalls
                  color="#2D4F53"
                  cursorBallColor="#abd7dc"
                  cursorBallSize={2}
                  ballCount={19}
                  animationSize={30}
                  enableMouseInteraction={false}
                  enableTransparency={true}
                  hoverSmoothness={0.05}
                  clumpFactor={1}
                  speed={0.9}
                />
              </div>
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="scale-[0.82] sm:scale-100 origin-center">
                  <CircularText
                    text="SAPEX BUILDS COMMUNITIES "
                    onHover="goBonkers"
                    spinDuration={30}
                    className="custom-class"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Row 2: Trust / affiliation */}
          <motion.div
            className="relative z-10 mt-10 sm:mt-12 flex max-w-4xl flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.5 },
              },
              hidden: {},
            }}
          >
            <motion.div
              className="text-sm text-[#D8DEDE]/85 sm:text-base"
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            >
              <span className="font-semibold text-[#D8DEDE]">Funded by</span>{" "}
              <span className="font-semibold text-[#A8D3CC]">AISCT</span>
            </motion.div>
            <motion.div
              aria-hidden
              className="hidden h-1.5 w-1.5 rounded-full bg-white/20 sm:block"
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            />
            <motion.div
              className="text-sm text-[#D8DEDE]/85 sm:text-base"
              variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            >
              <span className="font-semibold text-[#D8DEDE]">Used by</span>{" "}
              <span className="font-semibold text-[#A8D3CC]">
                AISCT&apos;s Social Science Department
              </span>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Purpose & Organization */}
      <section
        id="about"
        className="relative overflow-hidden py-16 md:py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-white/5"
      >
        <MemoriesBento className="z-0" />
        <motion.div
          className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Purpose</h2>
          <p className="text-lg text-[#D8DEDE]/90 leading-relaxed mb-6">
            Sapex is run by young people for young people. We wanted a place
            where students can get help with schoolwork and look out for each
            other, without it feeling stiff or corporate. So we built one.
          </p>
          <p className="text-base text-[#D8DEDE]/80 leading-relaxed max-w-3xl mx-auto">
            Schools and teachers who care about their students use Sapex so kids
            can ask questions, share what they know, and feel like they belong.
            You work with people from your own school, so it stays real and
            safe.
          </p>
        </motion.div>
      </section>

      {/* Key Technologies - quadrant layout, central title + View Code */}
      <section
        id="tech"
        className="py-16 md:py-24 border-t border-white/5 bg-gradient-to-b from-white/5 to-transparent overflow-hidden"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* 3x3 grid: corners = cards, center = title + CTA */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 items-stretch"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px", amount: 0.2 }}
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.1,
                },
              },
              hidden: {},
            }}
          >
            {/* Top-left: React */}
            <TechCard
              title="React front-end"
              description="A student-first interface built with React—familiar, calm, and accessible so students can seek academic or wellness support without feeling overwhelmed."
              icon="react"
              logoEl={
                <img
                  src={reactLogo}
                  alt="React"
                  className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                />
              }
              enterFrom={{ x: -40, opacity: 0 }}
              order={0}
            />
            {/* Top-center: Key Technologies + View Code */}
            <motion.div
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-[#A8D3CC]/20 bg-[#0C111C]/90 p-6 sm:p-8 md:min-h-[200px] order-first md:order-none col-span-1 md:col-span-1"
              variants={{
                hidden: { scale: 0.92, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 24,
                    delay: 0.2,
                  },
                },
              }}
            >
              <motion.div
                className="mb-3"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ delay: 0.35 }}
              >
                <Leaf className="w-5 h-5 text-[#A8D3CC]/90" aria-hidden />
              </motion.div>
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-[#D8DEDE] via-[#A8D3CC] to-[#D8DEDE] bg-clip-text text-transparent mb-2"
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{
                  delay: 0.4,
                  type: "spring",
                  stiffness: 180,
                  damping: 22,
                }}
              >
                Key Technologies
              </motion.h2>
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ delay: 0.5 }}
                className="rounded-lg inline-block mt-3"
              >
                <motion.span
                  className="block rounded-lg"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(168,211,204,0.12)",
                      "0 0 32px rgba(168,211,204,0.22)",
                      "0 0 20px rgba(168,211,204,0.12)",
                    ],
                  }}
                  transition={{
                    boxShadow: {
                      repeat: Infinity,
                      duration: 2.5,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <Button
                    asChild
                    className="bg-[#A8D3CC] text-[#2D4F53] hover:bg-[#D8DEDE] hover:text-[#2D4F53] shadow-lg shadow-[#A8D3CC]/20"
                  >
                    <Link to="/development" className="flex items-center gap-2">
                      <Code2 size={18} />
                      View Code
                    </Link>
                  </Button>
                </motion.span>
              </motion.div>
            </motion.div>
            {/* Top-right: DEAP */}
            <TechCard
              title="DEAP genetic algorithm"
              description="Adaptive matching pairs students for peer support using psychology-informed traits and past outcomes. DEAP evolves weights that optimize peer-to-peer matching over time."
              icon="deap"
              logoEl={
                <img
                  src={deapLearningLogo}
                  alt=""
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                />
              }
              enterFrom={{ x: 40, opacity: 0 }}
              order={1}
            />
            {/* Bottom-left: FastAPI */}
            <TechCard
              title="FastAPI"
              description="ML matching API for wellness support. Real-time endpoints for match, coldstart_match, and GA weight evolution—deployed for secure, low-latency peer matching."
              icon="fastapi"
              logoEl={
                <img
                  src={fastAPILogo}
                  alt=""
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                />
              }
              enterFrom={{ x: -40, opacity: 0 }}
              order={2}
            />
            {/* Bottom-center: Firebase */}
            <TechCard
              title="Firebase"
              description="Authentication, real-time storage, and synced messages and user data. Enables timely responses, dynamic prioritization, and supportive conversations."
              icon="firebase"
              logoEl={
                <img
                  src={firebaseLogo}
                  alt=""
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                />
              }
              enterFrom={{ y: 20, opacity: 0 }}
              order={3}
            />
            {/* Bottom-right: Vercel */}
            <TechCard
              title="Vercel hosting"
              description="Deployed with automatic HTTPS, DDoS protection, encrypted data handling, and global edge routing for secure, reliable access."
              icon="vercel"
              logoEl={
                <img
                  src={vercelLogo}
                  alt=""
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain invert opacity-90"
                />
              }
              enterFrom={{ x: 40, opacity: 0 }}
              order={4}
            />
          </motion.div>
        </div>
      </section>

      {/* BRIDGE Framework - animated */}
      <section
        id="bridge"
        className="relative overflow-hidden border-t border-white/5 py-16 md:py-24"
      >
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40 [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]">
          <SoftAurora
            color1="#A8D3CC"
            color2="#2D4F53"
            brightness={0.7}
            speed={0.45}
            scale={1.35}
            enableMouseInteraction={false}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Our framework
            </h2>
            <p className="text-lg text-[#D8DEDE]/80 max-w-2xl mx-auto">
              The values that guide everything we do at Sapex
            </p>
          </motion.div>

          <motion.div
            className="rounded-3xl border-2 border-[#A8D3CC]/30 bg-[#0C111C]/80 p-6 md:p-8 shadow-xl shadow-[#A8D3CC]/5"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.2 },
                },
                hidden: {},
              }}
            >
              {["B", "R", "I", "D", "G", "E"].map((letter) => (
                <motion.span
                  key={letter}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-4xl md:text-5xl font-bold font-syncopate bg-gradient-to-b from-[#D8DEDE] to-[#A8D3CC] bg-clip-text text-transparent"
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BRIDGE_PILLARS.map((pillar, i) => (
                <motion.div
                  key={pillar.word}
                  className="rounded-xl border border-white/10 bg-[#0A0D17] p-4 md:p-5 hover:border-[#A8D3CC]/40 transition-colors"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 rounded-lg bg-[#A8D3CC]/20 flex items-center justify-center text-lg font-bold text-[#A8D3CC] font-syncopate">
                      {pillar.letter}
                    </span>
                    <span className="font-semibold text-white">
                      {pillar.word}
                    </span>
                  </div>
                  <p className="text-sm text-[#D8DEDE]/80 leading-relaxed mt-1">
                    {pillar.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="py-16 md:py-24 border-t border-white/5 bg-gradient-to-b from-transparent to-white/5"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why students love Sapex
            </h2>
            <p className="text-lg text-[#D8DEDE]/80 max-w-3xl mx-auto">
              A comprehensive platform that addresses both academic excellence
              and personal well-being, all within a secure, school-verified
              environment.
            </p>
          </motion.div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.1, delayChildren: 0.15 },
              },
              hidden: {},
            }}
          >
            {[
              {
                title: "Safe & Moderated",
                desc: "School-verified Google authentication ensures only verified students can access your community. Built-in moderation tools and respectful community guidelines maintain a positive, constructive environment for everyone.",
                Icon: IconShield,
              },
              {
                title: "Academic Center",
                desc: "Post questions across Mathematics, Science, English, Social Sciences, and Foreign Languages. Get detailed explanations from peers, share study resources, and collaborate on problem-solving in real-time chat sessions.",
                Icon: IconChat,
              },
              {
                title: "Wellness Support",
                desc: "Connect with trained Sapex Helpers for peer support on friendship building, stress management, burnout recovery, study habits, and more. Personality-matched connections ensure meaningful, empathetic conversations.",
                Icon: IconSparkles,
              },
              {
                title: "Custom Study Session Rooms",
                desc: "Create or join dedicated study rooms by subject, project, or topic. Collaborate with peers in real time, share screens and notes, and stay focused in structured sessions—all within your school's secure environment.",
                Icon: IconGlobe,
              },
            ].map(({ title, desc, Icon }) => (
              <motion.div
                key={title}
                className="rounded-2xl border border-white/10 bg-[#0C111C] p-6 hover:border-[#A8D3CC]/30 transition-colors"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -4 }}
              >
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center mb-4">
                  <Icon />
                </div>
                <h3 className="font-semibold mb-3 text-lg">{title}</h3>
                <p className="text-sm text-[#D8DEDE]/80 leading-relaxed">
                  {desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature showcase — looping non-interactive UI demos */}
      <section
        id="showcase"
        className="relative overflow-hidden border-t border-white/5 py-16 md:py-24"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 60% 40% at 12% 30%, rgba(124, 220, 189, 0.10), transparent 60%),
              radial-gradient(ellipse 60% 40% at 88% 65%, rgba(167, 139, 250, 0.10), transparent 60%)
            `,
          }}
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[#A8D3CC] font-medium tracking-wider text-xs sm:text-sm uppercase mb-3">
              See Sapex in action
            </p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Four places students show up for each other
            </h2>
            <p className="text-base sm:text-lg text-[#D8DEDE]/80 max-w-2xl mx-auto">
              Looping previews of the real Sapex flows — Academic Center,
              Wellness Support, Study Rooms, and Origins Lab.
            </p>
          </motion.div>

          <div className="space-y-16 md:space-y-24">
            {[
              {
                eyebrow: "Academic Center",
                title: "Ask anything. Get help from your school in minutes.",
                copy: "Post a question on the Academic Center board, and verified peers from your community jump in. Threads support math notation, mentions, and reactions — so the learning sticks.",
                bullets: [
                  "Cards triaged by subject and urgency",
                  "Real-time chat with mentions and math input",
                  "Live presence shows who's around to help",
                ],
                Demo: AcademicHubDemo,
                reverse: false,
              },
              {
                eyebrow: "Wellness Support",
                title: "Personality-matched peers when life gets heavy.",
                copy: "Pick what you're working through. Our model finds a Sapex Helper whose temperament fits — calm, empathetic, and ready to listen — and opens a private chat that actually sounds like your friends.",
                bullets: [
                  "Match scores from a DEAP-trained model",
                  "Private 1:1 conversations, anonymous by default",
                  "Topics from burnout to new-student guidance",
                ],
                Demo: WellnessDemo,
                reverse: true,
              },
              {
                eyebrow: "Study Rooms",
                title: "Drop into a study room and grind together.",
                copy: "Spin up a focused video room around a subject or project. Share screens, raise hands, and stay accountable with classmates from your school.",
                bullets: [
                  "One-click rooms by subject or topic",
                  "Hand-raise, mute, and live audio cues",
                  "Stays inside your school's community",
                ],
                Demo: StudyRoomsDemo,
                reverse: false,
              },
              {
                eyebrow: "Origins Lab",
                title: "Showcase your projects and brainstorm new ones.",
                copy: "Pick a field — robotics, design, music, service — and Sapex hands you prompts plus a board to capture ideas. Post your extracurriculars so the rest of your school can see what you're building.",
                bullets: [
                  "14 fields from Fine Arts to Engineering",
                  "Guided prompts for fresh project ideas",
                  "Public showcase of what your peers are making",
                ],
                Demo: OriginsLabDemo,
                reverse: true,
              },
            ].map(({ eyebrow, title, copy, bullets, Demo, reverse }) => (
              <motion.div
                key={eyebrow}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 items-center ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="max-w-xl">
                  <div className="text-[#A8D3CC] font-medium tracking-wider text-xs uppercase mb-3">
                    {eyebrow}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {title}
                  </h3>
                  <p className="text-base sm:text-lg text-[#D8DEDE]/85 leading-relaxed mb-6">
                    {copy}
                  </p>
                  <ul className="space-y-2.5">
                    {bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-sm sm:text-base text-[#D8DEDE]/80"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#A8D3CC] shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                  <Demo />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-16 md:py-24 border-t border-white/5"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How Sapex works
            </h2>
            <p className="text-lg text-[#D8DEDE]/80 max-w-2xl mx-auto">
              Getting started is simple. Join your school's community and start
              connecting with peers in minutes.
            </p>
          </motion.div>
          <motion.ol
            className="grid md:grid-cols-3 gap-6 list-decimal list-inside mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.12, delayChildren: 0.1 },
              },
              hidden: {},
            }}
          >
            {[
              {
                step: 1,
                title: "Join with school email",
                text: "Sign in using your school's Google account. Our verification system ensures only verified students from your institution can access your community, maintaining security and trust.",
              },
              {
                step: 2,
                title: "Explore or contribute",
                text: "Browse the Academic Center for study help across all subjects, access Wellness Support for peer guidance, or become a Sapex Helper to support others. Post questions anonymously or with your profile.",
              },
              {
                step: 3,
                title: "Connect and grow",
                text: "Receive timely responses from peers and Sapex Helpers. Engage in real-time chat discussions, share resources, and build lasting connections within your school community.",
              },
            ].map(({ step, title, text }) => (
              <motion.li
                key={title}
                className="rounded-2xl border border-white/10 bg-[#0C111C] p-6 hover:border-[#A8D3CC]/30 transition-colors"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.4 }}
                whileHover={{ y: -2 }}
              >
                <div className="text-xs tracking-wider text-[#A8D3CC] font-semibold">
                  STEP {step}
                </div>
                <div className="mt-2 font-semibold text-lg mb-2">{title}</div>
                <p className="mt-1 text-sm text-[#D8DEDE]/80 leading-relaxed">
                  {text}
                </p>
              </motion.li>
            ))}
          </motion.ol>
          <motion.div
            className="mt-10 flex justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Button
              asChild
              className="bg-[#A8D3CC] text-[#2D4F53] hover:bg-[#D8DEDE] hover:text-[#2D4F53]"
            >
              <Link to="/stillindevelopment">See supported schools</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Social media */}
      <section
        id="social"
        className="py-16 md:py-24 border-t border-white/5 bg-white/5"
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Social media
            </h2>
            <p className="text-lg text-[#D8DEDE]/80 mb-10">
              Follow us for updates and community highlights
            </p>
            <a
              href="https://www.instagram.com/sapexglobal_initiative/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0C111C] border border-white/10 text-[#D8DEDE] hover:border-[#A8D3CC]/40 hover:text-[#A8D3CC] transition-colors"
              aria-label="Sapex on Instagram"
            >
              <Instagram className="w-7 h-7" strokeWidth={1.5} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer / CTA */}
      <motion.footer
        className="border-t border-white/5"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Sapex footer logo" className="w-6 h-6" />
            <span className="text-sm text-[#D8DEDE]/80">
              © {new Date().getFullYear()} Sapex
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-[#A8D3CC] text-[#D8DEDE] hover:bg-[#A8D3CC] hover:text-[#2D4F53]"
            >
              <Link to="/stillindevelopment">Browse schools</Link>
            </Button>
            <a
              href={`mailto:shiroiyuzuru@gmail.com?subject=Bring Sapex to My Community&body=Name:%0D%0ASchool Name:%0D%0ACity:%0D%0ACountry:%0D%0AEmail Address:%0D%0AYour School Email Domain:%0D%0ADoes Your School use Google Sign In?:`}
            >
              <Button className="bg-[#A8D3CC] text-[#2D4F53] hover:bg-[#D8DEDE] hover:text-[#2D4F53]">
                Get Sapex
              </Button>
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default LandingPage;

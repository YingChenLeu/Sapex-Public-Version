import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Instagram } from "lucide-react";
import MetaBalls from "./ui/MetaBalls";
import FloatingLines from "./ui/FloatingLines";
import SoftAurora from "./ui/SoftAurora";
import MemoriesBento from "./ui/MemoriesBento";
import CircularText from "./CircularText";
import {
  AcademicHubDemo,
  WellnessDemo,
  StudyRoomsDemo,
  OriginsLabDemo,
  RateYourChanceDemo,
} from "./ui/FeatureShowcase";
import firebaseLogo from "@/assets/landingPageAssets/devLogos/firebase.png";
import fastAPILogo from "@/assets/landingPageAssets/devLogos/fastAPI.png";
import vercelLogo from "@/assets/landingPageAssets/devLogos/vercel.png";
import deapLearningLogo from "@/assets/landingPageAssets/devLogos/deapLearning.png";
import reactLogo from "@/assets/landingPageAssets/devLogos/react.png";

const BRIDGE_PILLARS = [
  { letter: "B", word: "Build", description: "A safe haven for the current youth." },
  { letter: "R", word: "Recognize", description: "The strength found in connection." },
  { letter: "I", word: "Innovation", description: "New ways for support." },
  { letter: "D", word: "Develop", description: "Character, resilience, and purpose." },
  { letter: "G", word: "Guide", description: "Peers with patience and care." },
  { letter: "E", word: "Embrace", description: "Diversity, individuality, and the future." },
] as const;

const INDEX = [
  {
    name: "Rate Your Chance",
    does: "Share an application anonymously and get honest reads.",
  },
  {
    name: "Academic Center",
    does: "Post a question and people in your year pick it up.",
  },
  {
    name: "Wellness Support",
    does: "Get matched with a student helper, privately.",
  },
  {
    name: "Study Rooms",
    does: "Open a room for a subject and work alongside people.",
  },
  {
    name: "Origins Lab",
    does: "Put up what you're building so the school can see it.",
  },
] as const;

const SHOWCASES = [
  {
    margin: "rate your chance",
    title: "An honest read on your dream school.",
    copy: "Share your application snapshot anonymously and get a crowd verdict plus respectful feedback.",
    Demo: RateYourChanceDemo,
    note: "Open to everyone, not just your school.",
  },
  {
    margin: "academic center",
    title: "Ask anything. Get help in minutes.",
    copy: "Post a question and verified peers jump in — math notation, mentions, and all.",
    Demo: AcademicHubDemo,
    note: null,
  },
  {
    margin: "wellness support",
    title: "A matched peer when it gets heavy.",
    copy: "Pick what you’re working through. We find a Sapex Helper whose temperament fits, and open a private chat.",
    Demo: WellnessDemo,
    note: null,
  },
  {
    margin: "study rooms",
    title: "Drop in. Grind together.",
    copy: "Spin up a focused room around a subject or project. Share screens and stay accountable.",
    Demo: StudyRoomsDemo,
    note: null,
  },
  {
    margin: "origins lab",
    title: "Show what you’re building.",
    copy: "Pick a field, grab a prompt, and post what you’re making so the rest of the school can see it.",
    Demo: OriginsLabDemo,
    note: null,
  },
] as const;

const TECH = [
  { name: "React", src: reactLogo, invert: false },
  { name: "DEAP", src: deapLearningLogo, invert: false },
  { name: "FastAPI", src: fastAPILogo, invert: false },
  { name: "Firebase", src: firebaseLogo, invert: false },
  { name: "Vercel", src: vercelLogo, invert: true },
];

const FOOTER_LINKS = [
  {
    heading: "Inside Sapex",
    links: [
      { label: "Features", to: "/features" },
      { label: "Rate Your Chance", to: "/rate-your-chance" },
      { label: "Safety", to: "/safety" },
      { label: "For schools", to: "/schools" },
    ],
  },
  {
    heading: "The initiative",
    links: [
      { label: "Why we started", to: "/initiative" },
      { label: "The team", to: "/developer" },
      { label: "Communities", to: "/community" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "FAQ", to: "/faq" },
      { label: "Terms", to: "/terms" },
      { label: "Contact", to: "/contact" },
    ],
  },
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

function LandingPage() {
  return (
    <div className="landing flex min-h-screen flex-col bg-transparent text-chalk">
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

      <motion.section
        className="relative isolate overflow-hidden px-5 pb-24 pt-28 sm:px-8 sm:pt-36"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.1, delayChildren: 0.08 },
          },
          hidden: {},
        }}
      >
        <div
          className="absolute inset-0 -z-20"
          style={{
            background:
              "radial-gradient(ellipse 90% 60% at 30% -10%, rgba(168,211,204,0.14), transparent 62%)",
          }}
        />
        <div className="grain absolute inset-0 -z-10" />
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.7),rgba(0,0,0,0.2),transparent)]">
          <FloatingLines
            linesGradient={["#9effb8", "#E8F8F4", "#A8D3CC"]}
            interactive={false}
            bendStrength={-15}
            parallax={false}
            mixBlendMode="screen"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="ruled">
            <motion.div className="ruled-margin" variants={fadeUp}>
              Sapex Connect
              <br />
              public student app
            </motion.div>

            <div className="ruled-body">
              <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-20">
                <div>
                  <motion.h1
                    className="display-1 measure text-chalk"
                    variants={fadeUp}
                    transition={{ duration: 0.55 }}
                  >
                    Peers will tell you the truth about your shot.
                  </motion.h1>

                  <motion.p
                    className="measure mt-8 text-[17px] leading-relaxed text-chalk-2"
                    variants={fadeUp}
                  >
                    Post a college profile anonymously and get an honest read.
                    Then stay for the homework help, the late-night rooms, and
                    the days when it isn’t the schoolwork that’s hard.
                  </motion.p>

                  <motion.div
                    className="mt-10 flex flex-wrap items-center gap-5"
                    variants={fadeUp}
                  >
                    <Button asChild size="lg">
                      <Link to="/login">Sign in</Link>
                    </Button>
                    <Button asChild variant="link" size="lg" className="px-0">
                      <a href="#product">See how it works</a>
                    </Button>
                  </motion.div>

                  <motion.p
                    className="measure mt-12 border-t border-rule pt-5 text-[13px] leading-relaxed text-chalk-3"
                    variants={fadeUp}
                  >
                    Free to use. If your school wants a private community,
                    write to us.
                  </motion.p>
                </div>

                <motion.div
                  className="relative mx-auto aspect-square w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[360px]"
                  initial={{ opacity: 0, scale: 0.94, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: 0.18,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                >
                  <div
                    className="pointer-events-none absolute -inset-6 rounded-full blur-3xl"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(168,211,204,0.20), rgba(45,79,83,0.10) 45%, transparent 70%)",
                    }}
                  />
                  <div className="absolute inset-[4%] rounded-full border border-rule" />
                  <div className="absolute inset-[8%] overflow-hidden rounded-full border border-rule-strong bg-board/45">
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
                  <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                    <div className="origin-center scale-[0.72] sm:scale-[0.85] lg:scale-95">
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
            </div>
          </div>
        </div>
      </motion.section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="ruled">
            <div className="ruled-margin">what’s inside</div>
            <div className="ruled-body">
              <ul>
                {INDEX.map(({ name, does }, i) => (
                  <li
                    key={name}
                    className={`flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-8 ${
                      i === 0 ? "" : "border-t border-rule"
                    }`}
                  >
                    <span className="font-display text-[17px] leading-snug text-chalk sm:w-52 sm:shrink-0">
                      {name}
                    </span>
                    <span className="measure text-sm leading-relaxed text-chalk-2">
                      {does}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="relative flex min-h-[58vh] items-center overflow-hidden border-t border-rule py-24"
      >
        <MemoriesBento tone="vignette" className="z-0" />
        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8">
          <motion.div
            className="ruled max-w-3xl bg-board/75 py-10 pr-6 backdrop-blur-md"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="ruled-margin">why</div>
            <div className="ruled-body">
              <h2 className="display-2 measure text-chalk">
                Run by students who are still in school themselves.
              </h2>
              <p className="measure mt-6 text-[15px] leading-relaxed text-chalk-2">
                We wanted somewhere to get help with the work, get an honest
                read on a dream school, and look out for each other — without
                it feeling like an institution. The public app is open. A
                private school version exists if you need one.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="product"
        className="relative overflow-hidden border-t border-rule py-24 md:py-28"
      >
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="ruled mb-20">
            <div className="ruled-margin">the product</div>
            <div className="ruled-body">
              <h2 className="display-2 measure text-chalk">
                Everything here is already running.
              </h2>
              <p className="measure mt-6 text-[15px] leading-relaxed text-chalk-2">
                The screens below are the real ones, not mockups of a roadmap.
              </p>
            </div>
          </div>

          <div className="space-y-16 md:space-y-20">
            {SHOWCASES.map(({ margin, title, copy, Demo, note }) => (
              <motion.div
                key={margin}
                className="ruled border-t border-rule pt-12"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="ruled-margin">{margin}</div>
                <div className="ruled-body">
                  <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14">
                    <div className="lg:pt-6">
                      <h3 className="display-2 measure-tight text-chalk">
                        {title}
                      </h3>
                      <p className="measure mt-6 text-[15px] leading-relaxed text-chalk-2">
                        {copy}
                      </p>
                      {note && (
                        <p className="mt-5 text-[13px] text-brass">{note}</p>
                      )}
                    </div>
                    <div className="flex justify-center lg:justify-end">
                      <Demo />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="bridge"
        className="relative overflow-hidden border-t border-rule py-24"
      >
        <div className="pointer-events-none absolute inset-0 z-0 opacity-50 [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_100%)]">
          <SoftAurora
            color1="#A8D3CC"
            color2="#2D4F53"
            brightness={0.85}
            speed={0.45}
            scale={1.35}
            enableMouseInteraction={false}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">
          <div className="ruled">
            <div className="ruled-margin">bridge</div>
            <div className="ruled-body">
              <h2 className="display-2 measure text-chalk">
                Six things we hold ourselves to.
              </h2>
              <dl className="mt-10">
                {BRIDGE_PILLARS.map((pillar, i) => (
                  <motion.div
                    key={pillar.word}
                    className={`flex items-baseline gap-5 py-3.5 sm:gap-8 ${
                      i === 0 ? "" : "border-t border-rule"
                    }`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                  >
                    <span
                      aria-hidden="true"
                      className="font-display text-2xl leading-none text-sage"
                    >
                      {pillar.letter}
                    </span>
                    <dt className="w-28 shrink-0 text-sm font-semibold text-chalk sm:w-36">
                      {pillar.word}
                    </dt>
                    <dd className="measure text-sm leading-relaxed text-chalk-2">
                      {pillar.description}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section id="tech" className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <div className="ruled">
            <div className="ruled-margin">built with</div>
            <div className="ruled-body">
              <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
                {TECH.map((item) => (
                  <div key={item.name} className="flex items-center gap-2.5">
                    <img
                      src={item.src}
                      alt=""
                      className={`h-7 w-7 object-contain ${
                        item.invert ? "opacity-90 invert" : ""
                      }`}
                    />
                    <span className="text-sm text-chalk-2">{item.name}</span>
                  </div>
                ))}
              </div>
              <p className="mt-8">
                <Link
                  to="/development"
                  className="text-sm text-sage underline decoration-sage/35 decoration-1 underline-offset-4 hover:decoration-sage"
                >
                  Read how it was built
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <div className="ruled">
            <div className="ruled-margin">for schools</div>
            <div className="ruled-body">
              <h2 className="display-2 measure text-chalk">
                Public by default. Private if you need it.
              </h2>
              <p className="measure mt-6 text-[15px] leading-relaxed text-chalk-2">
                Students can open Sapex today. If you want a closed community
                for your campus, we’ll set one up with you.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-5">
                <Button asChild size="lg" variant="brass">
                  <a href="mailto:sapex@aisct.org?subject=Bring%20Sapex%20to%20our%20school">
                    Email us about your school
                  </a>
                </Button>
                <Button asChild variant="link" size="lg" className="px-0">
                  <Link to="/schools">How schools use Sapex</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="social" className="border-t border-rule">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <span className="font-logo text-[13px] font-semibold tracking-wide text-chalk">
                SAPEX
              </span>
              <p className="mt-4 max-w-[34ch] text-[13px] leading-relaxed text-chalk-3">
                A student platform for honest admissions reads, academic help,
                wellness support, and school community.
              </p>
              <a
                href="https://www.instagram.com/sapexglobal_initiative/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sapex on Instagram"
                className="mt-5 inline-flex size-8 items-center justify-center rounded-control border border-rule text-chalk-2 transition-colors hover:border-chalk-3 hover:text-chalk"
              >
                <Instagram className="size-4" strokeWidth={1.6} />
              </a>
            </div>

            {FOOTER_LINKS.map(({ heading, links }) => (
              <div key={heading}>
                <p className="marginalia">{heading}</p>
                <ul className="mt-4 space-y-2.5">
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="text-[13px] text-chalk-2 transition-colors hover:text-chalk"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-12 border-t border-rule pt-6 text-[12px] text-chalk-3">
            © {new Date().getFullYear()} Sapex Global Initiative. Free public
            app.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

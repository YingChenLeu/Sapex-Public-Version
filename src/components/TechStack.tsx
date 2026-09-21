import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import oneDark from "react-syntax-highlighter/dist/esm/styles/prism/one-dark";
import firebaseLogo from "@/assets/landingPageAssets/devLogos/firebase.png";
import fastAPILogo from "@/assets/landingPageAssets/devLogos/fastAPI.png";
import renderLogo from "@/assets/landingPageAssets/devLogos/render.png";
import vercelLogo from "@/assets/landingPageAssets/devLogos/vercel.png";
import deepLearningLogo from "@/assets/landingPageAssets/devLogos/deapLearning.png";
import apiDocumentationImg from "@/assets/landingPageAssets/devLogos/apiDocumentation.png";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const codeBlockStyle = {
  margin: 0,
  padding: "1rem 1.25rem",
  borderRadius: "0.75rem",
  border: "1px solid rgba(255,255,255,0.1)",
  background: "#171C24",
  fontSize: "0.8125rem",
  lineHeight: 1.6,
  minHeight: "100%",
};

const CodeBlock = ({
  children,
  language,
}: {
  children: string;
  language: string;
}) => (
  <div className="rounded-xl overflow-hidden border border-white/10 bg-[#171C24] [&>pre]:!m-0 [&>pre]:!rounded-xl [&>pre]:!p-4 [&>pre]:!sm:p-5 [&>pre]:!text-left [&>pre]:!min-h-0">
    <SyntaxHighlighter
      language={language}
      style={oneDark}
      customStyle={codeBlockStyle}
      codeTagProps={{ style: { fontSize: "inherit", fontFamily: "inherit" } }}
      showLineNumbers={false}
      PreTag="pre"
      useInlineStyles={true}
    >
      {children.trim()}
    </SyntaxHighlighter>
  </div>
);

const techSections = [
  {
    id: "firebase",
    logo: firebaseLogo,
    name: "Firebase",
    language: "typescript",
    tagline: "Auth, Firestore & real-time data",
    snippet: `// Frontend — lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

// Backend (predictor.py) — Firebase Admin for ML API
certificate = json.loads(base64.b64decode(os.environ["FIREBASE_CERTIFICATE"]))
if not firebase_admin._apps:
    cred = credentials.Certificate(certificate)
    firebase_admin.initialize_app(cred)
db = firestore.client()
# get_user_ocean(uid) / get_all_helpers(uid) read users & bigFivePersonality`,
  },
  {
    id: "fastapi",
    logo: fastAPILogo,
    name: "FastAPI",
    language: "python",
    tagline: "ML matching API for wellness support",
    snippet: `# predictor.py — FastAPI app & /match endpoint
from fastapi import FastAPI, Query
from firebase_admin import firestore
app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], ...)
db = firestore.client()

@app.get("/match")
def match(uid: str = Query(...), problem_type: str = Query(None)):
    seeker_traits = get_user_ocean(uid)
    helpers = get_all_helpers(uid)
    best_score, selected_uid = -1, None
    for helper_uid, traits in helpers:
        curr_score = predict_match(seeker_traits, traits)
        if curr_score > best_score:
            best_score, selected_uid = curr_score, helper_uid
    return {"helper_uid": selected_uid, "predicted_score": best_score, "problem_type": problem_type}

@app.get("/coldstart_match")
def coldstart_match(uid: str = Query(...), problem_type: str = Query("default")):
    weights = get_problem_weights(problem_type)
    # score_match(seeker, helper_traits, weights) → weighted compatibility`,
  },
  {
    id: "render",
    logo: renderLogo,
    name: "Render",
    language: "python",
    tagline: "Hosting the ML backend & weekly training",
    snippet: `# predictor.py — runs on Render (sapex-ml.onrender.com)
from apscheduler.schedulers.background import BackgroundScheduler
scheduler = BackgroundScheduler()

def weekly_train_job():
    for ptype in ["default", "friendship", "loneliness", "heartbreak",
                  "burnout", "stress", "guidance", "study"]:
        train_ga_weights(ptype)

# Every Saturday 3:00 AM — evolve weights from esupport feedback
scheduler.add_job(weekly_train_job, trigger='cron', day_of_week='sat', hour=3, minute=0)
scheduler.start()`,
  },
  {
    id: "vercel",
    logo: vercelLogo,
    name: "Vercel",
    language: "tsx",
    tagline: "Frontend deployment",
    snippet: `// App.tsx — React Router & auth flow
<Routes>
  <Route path="/" element={<><Navbar /><LandingPage /></>} />
  <Route path="/development" element={<><Navbar /><TechStack /></>} />
  <Route path="/main" element={<><SideBar /><Main /></>} />
  <Route path="/chat/:id" element={
    <ProtectedRoute><><SideBar /><ChatPage /></></ProtectedRoute>
  } />
</Routes>`,
  },
  {
    id: "deep-learning",
    logo: deepLearningLogo,
    name: "Deep Learning",
    language: "python",
    tagline: "DEAP genetic algorithm & problem-type weights",
    snippet: `# predictor.py — DEAP GA for compatibility weights
from deap import base, creator, tools

# Cold-start: default weights per problem [seeker_5, helper_5]
DEFAULT_WEIGHTS_BY_PROBLEM = {
    "friendship": [0.3, 0.4, 0.0, 0.1, 0.1,  0.5, 0.4, 0.0, 0.1, 0.1],
    "burnout":    [0.0, 0.1, 0.3, -0.2, 0.1, 0.0, 0.3, 0.6, -0.4, 0.1],
    "stress":     [0.0, 0.2, 0.2, -0.3, 0.1, 0.0, 0.6, 0.2, -0.5, 0.3],
    "default":    [0.2, 0.2, 0.2, 0.2, 0.2,  0.2, 0.2, 0.2, 0.2, 0.2],
}

def score_match(seeker_traits, helper_traits, weights):
    seeker_weights, helper_weights = weights[:5], weights[5:]
    return round(sum(sw*s + hw*h for s,h,sw,hw in zip(
        seeker_traits, helper_traits, seeker_weights, helper_weights)), 2)

# GA: evolve 10 weights from esupport feedback (actual scores)
creator.create("FitnessMax", base.Fitness, weights=(1.0,))
creator.create("Individual", list, fitness=creator.FitnessMax)
toolbox.register("evaluate", fitness_function)  # minimize |predicted - actual|
toolbox.register("mate", tools.cxBlend, alpha=0.5)
toolbox.register("mutate", tools.mutGaussian, mu=0, sigma=0.2, indpb=0.3)
for gen in range(generations):
    offspring = toolbox.select(pop, len(pop)-1)
    # mate, mutate, evaluate...
best = tools.selBest(pop, 1)[0]
evolved_weights_by_problem[problem_type] = list(best)
save_weights()  # Firestore model_meta/evolved_weights`,
  },
];

export default function TechStack() {
  return (
    <div className="min-h-screen bg-transparent text-[#F0F2F2] pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.header
          className="text-center mb-16 sm:mb-20"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
            hidden: {},
          }}
        >
          <motion.p
            variants={fadeIn}
            transition={{ duration: 0.4 }}
            className="text-[#A8D3CC] font-medium tracking-wider text-sm uppercase mb-3"
          >
            Tech Stack
          </motion.p>
          <motion.h1
            variants={fadeIn}
            transition={{ duration: 0.4 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#F0F2F2] to-[#A8D3CC] bg-clip-text text-transparent mb-4"
          >
            How Sapex is built
          </motion.h1>
          <motion.p
            variants={fadeIn}
            transition={{ duration: 0.4 }}
            className="text-lg text-[#F0F2F2]/80 max-w-2xl mx-auto"
          >
            Real code from the repo—auth, ML matching, and deployment—wired
            for security and scale.
          </motion.p>
        </motion.header>

        {/* Tech cards */}
        <div className="space-y-12 sm:space-y-16">
          {techSections.map((section) => (
            <motion.section
              key={section.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.05 },
                },
                hidden: {},
              }}
              className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#1E2430]/80 overflow-hidden shadow-xl shadow-black/20"
            >
              <div className="flex flex-col lg:flex-row lg:items-stretch">
                {/* Logo + title block — no box, larger logo */}
                <div className="flex flex-col items-center justify-center p-8 sm:p-10 lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 bg-white/[0.02]">
                  <motion.div
                    variants={fadeIn}
                    transition={{ duration: 0.35 }}
                    className="flex items-center justify-center mb-4 min-h-[100px] sm:min-h-[120px]"
                  >
                    <img
                      src={section.logo}
                      alt={section.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
                    />
                  </motion.div>
                  <motion.h2
                    variants={fadeIn}
                    transition={{ duration: 0.35 }}
                    className="text-xl font-semibold text-[#F0F2F2] mb-1"
                  >
                    {section.name}
                  </motion.h2>
                  <motion.p
                    variants={fadeIn}
                    transition={{ duration: 0.35 }}
                    className="text-sm text-[#F0F2F2]/70 text-center"
                  >
                    {section.tagline}
                  </motion.p>
                </div>
                {/* Code */}
                <div className="flex-1 p-6 sm:p-8 min-w-0">
                  <motion.div variants={fadeIn} transition={{ duration: 0.35 }}>
                    <CodeBlock language={section.language}>{section.snippet}</CodeBlock>
                  </motion.div>
                </div>
              </div>
            </motion.section>
          ))}
        </div>

        {/* API documentation screenshot */}
        <motion.section
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
        >
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#1E2430]/80 overflow-hidden shadow-xl shadow-black/20 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[#F0F2F2] mb-2">
              API documentation
            </h3>
            <p className="text-sm text-[#F0F2F2]/70 mb-4">
              FastAPI Swagger UI — match, coldstart_match, evolve_weights, train_ga_weights
            </p>
            <div className="rounded-xl overflow-hidden border border-white/10 bg-[#171C24]">
              <img
                src={apiDocumentationImg}
                alt="FastAPI OpenAPI documentation showing GET /match, GET /coldstart_match, GET /evolve_weights, POST /train_ga_weights"
                className="w-full h-auto object-contain object-top"
              />
            </div>
          </div>
        </motion.section>

        {/* Footer CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm text-[#F0F2F2]/60">
            Frontend on Vercel · ML API on Render · Data & auth on Firebase
          </p>
        </motion.div>
      </div>
    </div>
  );
}

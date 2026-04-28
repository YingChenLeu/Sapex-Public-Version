import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Lock, ShieldCheck, UserCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const SAFETY_ITEMS = [
  {
    title: "Public access",
    copy: "Anyone can join the app with supported sign-in.",
    Icon: UserCheck,
  },
  {
    title: "Moderation ready",
    copy: "Reporting and review flows support safer spaces.",
    Icon: ShieldCheck,
  },
  {
    title: "Privacy-first controls",
    copy: "We aim to protect chats and account data using available safeguards.",
    Icon: Lock,
  },
] as const;

export default function SafetyPage() {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-[#D8DEDE] pt-28 pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#A8D3CC] text-sm font-medium tracking-wider uppercase">Safety</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3">
            Safety for a public app
          </h1>
          <p className="text-[#D8DEDE]/78 mt-3 max-w-2xl">
            Open and free to use, with clear controls and ongoing protection efforts.
          </p>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-4">
          {SAFETY_ITEMS.map(({ title, copy, Icon }, i) => (
            <motion.div
              key={title}
              className="rounded-2xl border border-white/10 bg-[#0C111C] p-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#A8D3CC]/15 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#A8D3CC]" />
              </div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-sm text-[#D8DEDE]/75 mt-1">{copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-10">
        <motion.div
          className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#0C111C]/90 p-6"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-2 text-[#A8D3CC] text-sm">
            <Users className="w-4 h-4" />
            Safety workflow
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-4 text-sm">
            {["Sign in", "Report concerns quickly", "Resolve with oversight"].map(
              (step) => (
                <motion.div
                  key={step}
                  className="rounded-lg border border-white/10 bg-[#0A0D17] px-3 py-2 text-[#D8DEDE]/85"
                  animate={{ y: [0, -2, 0] }}
                  transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  {step}
                </motion.div>
              ),
            )}
          </div>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div
          className="mx-auto max-w-5xl rounded-2xl border border-[#A8D3CC]/25 bg-[#0C111C] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">Need safety details?</h3>
            <p className="text-sm text-[#D8DEDE]/75 mt-1">
              Want a private version for your school community? Contact us.
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
              href="mailto:sapex@aisct.org?subject=Sapex%20safety%20question"
              className="text-sm text-[#A8D3CC] hover:text-[#D8DEDE] transition-colors"
            >
              Contact us
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

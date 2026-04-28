import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, HeartPulse, MessagesSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AcademicHubDemo,
  StudyRoomsDemo,
  WellnessDemo,
} from "./ui/FeatureShowcase";

const FEATURES = [
  {
    title: "Academic Center",
    copy: "Ask questions and solve together in real time.",
    Icon: MessagesSquare,
    Demo: AcademicHubDemo,
  },
  {
    title: "Wellness Chat",
    copy: "Private peer support with calm conversation flows.",
    Icon: HeartPulse,
    Demo: WellnessDemo,
  },
  {
    title: "Study Rooms",
    copy: "Join focused sessions with your classmates.",
    Icon: Users,
    Demo: StudyRoomsDemo,
  },
] as const;

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-[#D8DEDE] pt-28 pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#A8D3CC] text-sm font-medium tracking-wider uppercase">
            Features
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3">
            Everything inside the Sapex app
          </h1>
          <p className="text-[#D8DEDE]/78 mt-3 max-w-2xl">
            Free public access for students. Need a private school version? Message us.
          </p>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mx-auto max-w-6xl space-y-8">
          {FEATURES.map(({ title, copy, Icon, Demo }, i) => (
            <motion.div
              key={title}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-5 rounded-2xl border border-white/10 bg-[#0C111C]/90 p-4 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="flex flex-col justify-center px-2">
                <div className="w-10 h-10 rounded-lg bg-[#A8D3CC]/15 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-[#A8D3CC]" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
                <p className="text-[#D8DEDE]/78 mt-2">{copy}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-[#A8D3CC]">
                  <CheckCircle2 className="w-4 h-4" />
                  Free in the public app
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Demo />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div
          className="mx-auto max-w-6xl rounded-2xl border border-[#A8D3CC]/25 bg-[#0C111C] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white">Ready to launch?</h3>
            <p className="text-sm text-[#D8DEDE]/75 mt-1">
              Free public use. Private school version available on request.
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
              href="mailto:sapex@aisct.org?subject=Sapex%20features%20question"
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

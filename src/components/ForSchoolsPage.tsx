import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, GraduationCap, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    title: "Use the public app now",
    copy: "Students can start right away for free.",
    Icon: Building2,
  },
  {
    title: "Request private version",
    copy: "Message us for a dedicated school community setup.",
    Icon: GraduationCap,
  },
  {
    title: "Scale support",
    copy: "Grow academic and wellness support channels.",
    Icon: Rocket,
  },
] as const;

export default function ForSchoolsPage() {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-[#D8DEDE] pt-28 pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-5xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#A8D3CC] text-sm font-medium tracking-wider uppercase">
            For schools
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3">
            Bring Sapex to your school
          </h1>
          <p className="text-[#D8DEDE]/78 mt-3 max-w-2xl">
            Sapex is a free public app. If you want a private version for your school community,
            message us.
          </p>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mx-auto max-w-5xl grid md:grid-cols-3 gap-4">
          {STEPS.map(({ title, copy, Icon }, i) => (
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
          className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#0C111C]/90 p-6 sm:p-7"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-center gap-2 text-[#A8D3CC] text-sm mb-3">
            <ShieldCheck className="w-4 h-4" />
            What you get
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              "Free public access",
              "Private school version on request",
              "Live academic and wellness channels",
              "In-app support workflows",
              "Ongoing rollout guidance",
            ].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-white/10 bg-[#0A0D17] px-3 py-2 text-[#D8DEDE]/85"
              >
                {item}
              </div>
            ))}
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
            <h3 className="text-xl sm:text-2xl font-semibold text-white">Need a private version?</h3>
            <p className="text-sm text-[#D8DEDE]/75 mt-1">
              Message us to set up a private school community.
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
              href="mailto:sapex@aisct.org?subject=Bring%20Sapex%20to%20our%20school"
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

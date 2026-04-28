import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";

const FAQS = [
  {
    q: "Who can join Sapex?",
    a: "Sapex is a public app and free to use.",
  },
  {
    q: "Can my school get a private version?",
    a: "Yes. Message us if you'd like a private version for your school community.",
  },
  {
    q: "Is Sapex free?",
    a: "Yes. The public app is free to use.",
  },
  {
    q: "What does the app include?",
    a: "Academic Center, Wellness Chat, and Study Rooms.",
  },
  {
    q: "Is privacy guaranteed?",
    a: "No. Absolute privacy cannot be guaranteed, but we actively try to keep user information protected.",
  },
  {
    q: "Where is data stored?",
    a: "Information is stored on Google infrastructure. Breaches are unlikely, but no system is risk-free.",
  },
] as const;

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-[#D8DEDE] pt-28 pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#A8D3CC] text-sm font-medium tracking-wider uppercase">FAQ</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3">
            Common questions
          </h1>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mx-auto max-w-4xl space-y-3">
          {FAQS.map((item, i) => (
            <motion.details
              key={item.q}
              className="group rounded-xl border border-white/10 bg-[#0C111C] px-4 py-3"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <summary className="cursor-pointer list-none font-medium text-white flex items-center justify-between">
                {item.q}
                <span className="text-[#A8D3CC] group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-2 text-sm text-[#D8DEDE]/78">{item.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-12">
        <motion.div
          className="mx-auto max-w-4xl rounded-2xl border border-[#A8D3CC]/25 bg-[#0C111C] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white">Need more help?</h2>
            <p className="text-sm text-[#D8DEDE]/75 mt-1">See terms or contact us by email.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/terms"
              className="inline-flex items-center gap-2 rounded-lg border border-[#A8D3CC]/40 px-4 py-2 text-sm text-[#A8D3CC] hover:text-[#D8DEDE] hover:border-[#D8DEDE]/40 transition-colors"
            >
              Terms
            </Link>
            <a
              href="mailto:sapex@aisct.org?subject=Sapex%20FAQ%20question"
              className="inline-flex items-center gap-2 rounded-lg border border-[#A8D3CC]/40 px-4 py-2 text-sm text-[#A8D3CC] hover:text-[#D8DEDE] hover:border-[#D8DEDE]/40 transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contact us
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

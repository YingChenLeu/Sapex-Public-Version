import { motion } from "framer-motion";
import { Mail, ShieldAlert } from "lucide-react";

const TERMS = [
  {
    title: "Public and free use",
    text: "Sapex is offered as a public app and is free to use.",
  },
  {
    title: "Private school version",
    text: "If you want a private version for your school community, contact us at sapex@aisct.org.",
  },
  {
    title: "Privacy notice",
    text: "Privacy is not guaranteed. We attempt to keep information protected with reasonable safeguards.",
  },
  {
    title: "Data storage",
    text: "Information is stored on Google infrastructure. Data theft is unlikely, but no system can be guaranteed risk-free.",
  },
] as const;

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-[#D8DEDE] pt-28 pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#A8D3CC] text-sm font-medium tracking-wider uppercase">
            Terms and conditions
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3">Sapex terms</h1>
          <p className="text-[#D8DEDE]/78 mt-3">
            Please review these terms before using the app.
          </p>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mx-auto max-w-4xl space-y-3">
          {TERMS.map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-xl border border-white/10 bg-[#0C111C] px-4 py-3"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
            >
              <h2 className="text-white font-semibold">{item.title}</h2>
              <p className="text-sm text-[#D8DEDE]/78 mt-1">{item.text}</p>
            </motion.div>
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
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 text-[#A8D3CC] mt-0.5" />
            <p className="text-sm text-[#D8DEDE]/78 max-w-2xl">
              By continuing to use Sapex, you acknowledge these terms, including that privacy
              cannot be absolutely guaranteed.
            </p>
          </div>
          <a
            href="mailto:sapex@aisct.org?subject=Sapex%20terms%20question"
            className="inline-flex items-center gap-2 rounded-lg border border-[#A8D3CC]/40 px-4 py-2 text-sm text-[#A8D3CC] hover:text-[#D8DEDE] hover:border-[#D8DEDE]/40 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact us
          </a>
        </motion.div>
      </section>
    </div>
  );
}

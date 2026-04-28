import { motion } from "framer-motion";
import { Mail, MessageSquare, School } from "lucide-react";

const CONTACT_OPTIONS = [
  {
    title: "General inquiries",
    description: "Questions about the free public app.",
    subject: "Sapex%20general%20inquiry",
    Icon: MessageSquare,
  },
  {
    title: "Private school version",
    description: "Request a private version for your school community.",
    subject: "Bring%20Sapex%20to%20our%20school",
    Icon: School,
  },
  {
    title: "Support",
    description: "Need help with setup or access.",
    subject: "Sapex%20support",
    Icon: Mail,
  },
] as const;

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-[#D8DEDE] pt-28 pb-16">
      <section className="px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#A8D3CC] text-sm font-medium tracking-wider uppercase">Contact</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mt-3">
            Talk to the Sapex team
          </h1>
          <p className="text-[#D8DEDE]/78 mt-3">
            Sapex is free and public. Message us for a private school version.
          </p>
        </motion.div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="mx-auto max-w-4xl grid sm:grid-cols-3 gap-4">
          {CONTACT_OPTIONS.map(({ title, description, subject, Icon }, i) => (
            <motion.a
              key={title}
              href={`mailto:sapex@aisct.org?subject=${subject}`}
              className="rounded-2xl border border-white/10 bg-[#0C111C] p-5 hover:border-[#A8D3CC]/35 transition-colors"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#A8D3CC]/15 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#A8D3CC]" />
              </div>
              <h2 className="text-lg font-semibold text-white">{title}</h2>
              <p className="text-sm text-[#D8DEDE]/75 mt-1">{description}</p>
            </motion.a>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 mt-10">
        <motion.div
          className="mx-auto max-w-4xl rounded-2xl border border-[#A8D3CC]/25 bg-[#0C111C] p-6 sm:p-8"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <div className="text-white text-lg font-semibold">sapex@aisct.org</div>
          <p className="text-sm text-[#D8DEDE]/75 mt-1">Best channel for all requests.</p>
          <a
            href="mailto:sapex@aisct.org?subject=Sapex%20contact"
            className="inline-flex items-center gap-2 mt-4 rounded-lg border border-[#A8D3CC]/40 px-4 py-2 text-sm text-[#A8D3CC] hover:text-[#D8DEDE] hover:border-[#D8DEDE]/40 transition-colors"
          >
            <Mail className="w-4 h-4" />
            Contact us
          </a>
        </motion.div>
      </section>
    </div>
  );
}

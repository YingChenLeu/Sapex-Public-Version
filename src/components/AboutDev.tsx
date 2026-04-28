import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
  hidden: {},
};

const AboutDev = () => {
  return (
    <div className="min-h-screen bg-[#0A0D17] text-[#D8DEDE] overflow-hidden">
      {/* Hero */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168, 211, 204, 0.15), transparent),
              radial-gradient(ellipse 60% 40% at 80% 50%, rgba(168, 211, 204, 0.06), transparent)
            `,
          }}
        />
        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#A8D3CC]/20 mb-6"
            variants={fadeInUp}
            transition={{ duration: 0.45 }}
          >
            <Sparkles className="w-7 h-7 text-[#A8D3CC]" />
          </motion.div>
          <motion.h1
            className="text-4xl sm:text-5xl font-bold font-syncopate bg-gradient-to-r from-[#D8DEDE] to-[#A8D3CC] bg-clip-text text-transparent mb-4"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            About Sapex
          </motion.h1>
          <motion.p
            className="text-lg text-[#D8DEDE]/80 max-w-2xl mx-auto leading-relaxed"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            A safe, supportive platform for students to learn, connect, and
            grow.
          </motion.p>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="rounded-2xl border border-white/10 bg-[#0C111C]/80 p-8 md:p-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            whileHover={{ borderColor: "rgba(168, 211, 204, 0.25)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[#A8D3CC]" />
              <span className="text-sm font-medium uppercase tracking-wider text-[#A8D3CC]">
                Our mission
              </span>
            </div>
            <p className="text-[#D8DEDE]/90 leading-relaxed text-lg">
              Sapex exists to give every student access to peer-led academic
              help and wellness support within their own school community. We
              believe in connection over isolation—and that young people, when
              supported, can achieve more together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          className="max-w-2xl mx-auto text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-[#D8DEDE]/70 mb-6">
            Want to bring Sapex to your school?
          </p>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              asChild
              className="bg-[#A8D3CC] text-[#2D4F53] hover:bg-[#D8DEDE] hover:text-[#2D4F53]"
            >
              <Link to="/">Back to home</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutDev;

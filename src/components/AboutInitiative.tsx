import { motion } from "framer-motion";
import { Earth, BookOpen, Heart, Users } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.14, delayChildren: 0.08 } },
  hidden: {},
};

function AboutInitiative() {
  return (
    <div className="min-h-screen bg-transparent text-[#F0F2F2] relative overflow-hidden pt-[100px]">
      {/* Background: subtle gradient orbs instead of busy icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#2D4F53]/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-[#A8D3CC]/08 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#A8D3CC]/06 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10 pb-24">
        <motion.div
          className="max-w-3xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger}
        >
          {/* Hero */}
          <motion.section
            className="pt-12 pb-16 md:pt-16 md:pb-20 text-center"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#2D4F53]/60 border border-[#A8D3CC]/25 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <Earth className="w-10 h-10 md:w-12 md:h-12 text-[#A8D3CC]" />
            </motion.div>
            <p className="text-sm font-medium tracking-wider uppercase text-[#A8D3CC]/90 mb-3">
              Our story
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#F0F2F2] via-[#F0F2F2] to-[#A8D3CC] bg-clip-text text-transparent tracking-tight">
              Why We Started
            </h1>
            <p className="text-lg md:text-xl text-[#F0F2F2]/85 leading-relaxed max-w-2xl mx-auto">
              We started Sapex because two things kept coming up: kids feeling
              alone or stressed, and students not really helping each other
              across classes and grades.
            </p>
            <p className="mt-5 text-base text-[#F0F2F2]/75 leading-relaxed max-w-2xl mx-auto">
              A lot of young people don’t have a safe place to talk, whether
              that’s at school or online. And when everyone stays in their own
              bubble, it’s harder to learn together. So we made a space where
              you can get help with school, get support when you’re struggling,
              and do it with people from your own community. You can also chat
              anonymously when you need to, so no one has to be afraid to ask.
            </p>
          </motion.section>

          {/* Mission — quote-style block */}
          <motion.section
            className="relative rounded-2xl overflow-hidden"
            variants={fadeInUp}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="relative bg-[#1E2430]/90 border border-white/10 rounded-2xl p-8 md:p-10 pl-10 md:pl-12 hover:border-[#A8D3CC]/20 transition-colors"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b from-[#A8D3CC] to-[#2D4F53]" />
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-[#A8D3CC]/15 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#A8D3CC]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
                    The Mission
                  </h2>
                  <p className="text-[#F0F2F2]/90 leading-relaxed text-base md:text-lg">
                    We want a place where talking to real people comes first.
                    So instead of dealing with stress or feeling alone, you can
                    turn to peers who get it. Students help each other with
                    school and with life stuff. When you have a question or
                    a rough patch, someone’s there to figure it out with you.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Two pillars */}
          <section className="mt-16 md:mt-20">
            <motion.p
              className="text-center text-sm font-medium tracking-wider uppercase text-[#A8D3CC]/80 mb-8"
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              What we stand for
            </motion.p>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                className="group relative rounded-2xl border border-white/10 bg-[#1E2430]/80 p-8 md:p-8 overflow-hidden"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#A8D3CC]/05 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-[#A8D3CC]/15 flex items-center justify-center mb-5">
                    <Heart className="w-7 h-7 text-[#A8D3CC]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Someone to talk to
                  </h3>
                  <p className="text-[#F0F2F2]/85 leading-relaxed text-sm md:text-base">
                    Feeling alone or stressed is rough. We give you a way to
                    talk to other students about wellness and everyday stuff,
                    so you’re not on your own. You can stay anonymous if you
                    want, so it’s safe for everyone.
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="group relative rounded-2xl border border-white/10 bg-[#1E2430]/80 p-8 md:p-8 overflow-hidden"
                variants={fadeInUp}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#A8D3CC]/05 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-[#A8D3CC]/15 flex items-center justify-center mb-5">
                    <Users className="w-7 h-7 text-[#A8D3CC]" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Learning together
                  </h3>
                  <p className="text-[#F0F2F2]/85 leading-relaxed text-sm md:text-base">
                    We get everyone in the same place so you can share what
                    you know and get help when you’re stuck. You ask questions,
                    others answer, and over time the whole community gets
                    better at learning and helping each other.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}

export default AboutInitiative;

import { motion } from "framer-motion";
import { MapPin, Users, Sparkles } from "lucide-react";
import AISCT from "@/assets/aisctlogo.jpg";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Community = () => {
  return (
    <div className="min-h-screen bg-transparent text-[#F0F2F2] overflow-hidden">
      {/* Hero / header */}
      <section className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 70% 40% at 50% -10%, rgba(168, 211, 204, 0.12), transparent),
              radial-gradient(ellipse 50% 30% at 80% 30%, rgba(168, 211, 204, 0.06), transparent)
            `,
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#A8D3CC]/20 mb-4">
            <Users className="w-6 h-6 text-[#A8D3CC]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-syncopate bg-gradient-to-r from-[#F0F2F2] to-[#A8D3CC] bg-clip-text text-transparent mb-3">
            Sapex Communities
          </h1>
          <p className="text-[#F0F2F2]/70 max-w-xl mx-auto">
            Schools and communities where Sapex is live.
          </p>
        </div>
      </section>

      {/* Single community card - AISCT */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            className="relative rounded-3xl border-2 border-[#A8D3CC]/30 bg-[#1E2430] overflow-hidden group hover:border-[#A8D3CC]/50 transition-colors duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top accent bar */}
            <div className="h-1.5 bg-gradient-to-r from-[#A8D3CC] via-[#7CDCBD] to-[#A8D3CC]" />

            <div className="p-8 md:p-10">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#A8D3CC]/30 bg-[#161A24] shrink-0 shadow-lg">
                  <img
                    src={AISCT}
                    alt="AISCT"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#A8D3CC] shrink-0" />
                    <span className="text-xs font-medium uppercase tracking-wider text-[#A8D3CC]">
                      Live community
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    American International School of Cape Town
                  </h2>
                  <p className="text-[#F0F2F2]/70 flex items-center justify-center sm:justify-start gap-1.5 text-sm">
                    <MapPin className="w-4 h-4 text-[#A8D3CC]/80 shrink-0" />
                    Cape Town, South Africa
                  </p>
                </div>
              </div>

              <p className="mt-6 text-[#F0F2F2]/80 leading-relaxed text-sm md:text-base">
                AISCT students can sign in with their school Google account to
                access the Academic Hub, Wellness Support, Origins Lab, and
                connect with peers in a safe, moderated space.
              </p>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <Button
                  asChild
                  className="bg-[#A8D3CC] text-[#2D4F53] hover:bg-[#F0F2F2] hover:text-[#2D4F53]"
                >
                  <Link to="/login">Sign in to Sapex</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-[#A8D3CC]/50 text-[#F0F2F2] hover:bg-[#A8D3CC]/10"
                >
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </div>
          </motion.div>

          <p className="text-center text-sm text-[#F0F2F2]/50 mt-8">
            More communities coming soon.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Community;

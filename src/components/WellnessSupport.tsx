import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppPage, PageHeader } from "@/components/ui/app-shell";
import {
  Handshake,
  HeartCrack,
  Flame,
  Siren,
  UserRoundPlus,
  SquareLibrary,
  Users,
  Info,
  Loader2,
} from "lucide-react";
import { FloatingDock } from "./ui/dock";
import Threads from "./ui/threadAnimation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { incrementUsage } from "@/lib/stats";
import { Card, CardContent } from "./ui/card";

const iconClass = "size-5 text-neutral-300";

const SUPPORT_OPTIONS = [
  {
    title: "Build New Friendships",
    icon: <Handshake className={iconClass} />,
    type: "friendship",
  },
  {
    title: "Dealing with Loneliness",
    icon: <Users className={iconClass} />,
    type: "loneliness",
  },
  {
    title: "Healing from Heartbreak",
    icon: <HeartCrack className={iconClass} />,
    type: "heartbreak",
  },
  {
    title: "Burnout Recovery",
    icon: <Flame className={iconClass} />,
    type: "burnout",
  },
  {
    title: "Anxiety and Stress Support",
    icon: <Siren className={iconClass} />,
    type: "stress",
  },
  {
    title: "New Student Guidance",
    icon: <UserRoundPlus className={iconClass} />,
    type: "guidance",
  },
  {
    title: "Study Habit Advice",
    icon: <SquareLibrary className={iconClass} />,
    type: "study",
  },
] as const;

const WellnessSupport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleSupportClick = async (type: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const uid = localStorage.getItem("uid");
    if (!uid) {
      window.location.href = "/user-profile";
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "esupport"), {
        seeker_uid: uid,
        helper_uid: null,
        predicted: null,
        actual: null,
        type: type,
      });
      await addDoc(collection(db, "esupport", docRef.id, "messages"), {
        from: "system",
        text: "Conversation started.",
        timestamp: new Date(),
      });
      await incrementUsage(db, "wellnessSupportUsed");
      window.location.href = `/finding-match?docId=${docRef.id}`;
    } catch (err) {
      console.error("Failed to create support doc:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <AppPage width="narrow">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Threads amplitude={2} distance={0} enableMouseInteraction={false} />
      </div>

      <div className="relative z-10 flex flex-col items-start gap-10">
        <PageHeader
          margin="wellness"
          title="Wellness Support"
          description="Choose a topic and we’ll match you with someone who can listen."
          className="mb-0 w-full"
        />

        {/* Notice card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.4, 0, 0.2, 1] }}
        >
          <Card className="w-full border-brass/30 bg-brass-wash">
            <CardContent className="flex items-start gap-3 p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-brass" />
              <div className="text-sm text-chalk-2">
                <span className="font-medium text-chalk">Before you start:</span>{" "}
                Complete the{" "}
                <a
                  href="/user-profile"
                  className="font-medium text-sage underline underline-offset-2 hover:text-chalk"
                >
                  personality test on your profile
                </a>{" "}
                so we can match you with the right peer.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dock section */}
        <motion.section
          className="w-full flex flex-col items-start gap-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="text-sm font-medium text-chalk-2">Choose a topic</p>
          <motion.div
            className="flex w-full justify-start border border-rule bg-notice/70 px-6 py-5 backdrop-blur-md"
            whileHover={{ borderColor: "rgba(255,255,255,0.15)" }}
            transition={{ duration: 0.2 }}
          >
            <FloatingDock
              items={SUPPORT_OPTIONS.map(({ title, icon, type }) => ({
                title,
                icon,
                onClick: () => handleSupportClick(type),
              }))}
              desktopClassName="max-w-full"
            />
          </motion.div>
          <AnimatePresence mode="wait">
            {isSubmitting && (
              <motion.div
                className="flex items-center gap-2 text-sm text-chalk-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Loader2 className="size-4 animate-spin shrink-0" />
                <span>Finding your match…</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Data disclaimer */}
        <motion.footer
          className="w-full border-t border-rule pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.24, ease: [0.4, 0, 0.2, 1] }}
        >
          <button
            type="button"
            onClick={() => setShowDisclaimer(!showDisclaimer)}
            className="text-sm text-chalk-3 underline underline-offset-2 transition-colors hover:text-chalk-2"
          >
            Data & privacy disclaimer
          </button>
          <AnimatePresence>
            {showDisclaimer && (
              <motion.p
                className="mt-2 text-sm text-chalk-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                All data is stored and can be accessed.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.footer>
      </div>
    </AppPage>
  );
};

export default WellnessSupport;

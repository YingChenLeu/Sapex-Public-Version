import { useState, useEffect, useMemo, useRef } from "react";
import { getAuth } from "firebase/auth";
import {
  ArrowLeft,
  ChevronRight,
  LifeBuoy,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

const typeLabels: Record<string, string> = {
  friendship: "Be a New Friend",
  loneliness: "Help Someone Feeling Lonely",
  heartbreak: "Help Someone with Heartbreak",
  burnout: "Support Someone Facing Burnout",
  stress: "Ease Someone's Anxiety",
  guidance: "Guide a New Student",
  study: "Offer Study Advice",
};

const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const [activeView, setActiveView] = useState<"menu" | "seeker" | "supporter">("menu");
  const [seekerItems, setSeekerItems] = useState<{ docId: string, label: string }[]>([]);
  const [supporterItems, setSupporterItems] = useState<{ docId: string, label: string }[]>([]);
  const [pendingCount, setPendingCount] = useState(0);

  const supporterLabel = useMemo(() => {
    if (pendingCount <= 0) return "Supporter Dashboard";
    return `Supporter Dashboard`;
  }, [pendingCount]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setActiveView("menu");
      }
    };
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const el = rootRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setOpen(false);
        setActiveView("menu");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);
  // Listen for supporter-specific matches to show pending support requests count
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "esupport"),
      where("helper_uid", "==", currentUser.uid),
      where("actual", "==", null)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingCount(snapshot.docs.length);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || activeView === "menu") return;

    const roleKey = activeView === "seeker" ? "seeker_uid" : "helper_uid";
    const q = query(
      collection(db, "esupport"),
      where(roleKey, "==", currentUser.uid),
      where("actual", "==", null)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => {
        const raw = doc.data().type;
        const label = typeLabels[raw] || raw;
        return {
          docId: doc.id,
          label
        };
      });
      if (activeView === "seeker") setSeekerItems(data);
      else setSupporterItems(data);
    });

    return () => unsubscribe();
  }, [activeView, currentUser]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => {
          setOpen((v) => !v);
          if (open) setActiveView("menu");
        }}
        className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8D3CC]/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0D17]"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="relative">
          <img
            src={currentUser?.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="w-11 h-11 mr-3 rounded-full border border-white/15 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
          />
          {pendingCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border border-[#0A0D17] shadow-lg">
              {pendingCount}
            </div>
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-[320px] z-50 overflow-hidden rounded-2xl border border-white/10 bg-[#0C111C]/95 backdrop-blur-xl shadow-[0_24px_70px_-36px_rgba(0,0,0,0.95)]"
          >
            <div className="px-4 pt-3 pb-2 border-b border-white/10">
              <div className="text-xs text-[#D8DEDE]/55">Menu</div>
              <div className="text-sm font-semibold text-white">Quick actions</div>
            </div>
            {activeView === "menu" && (
              <div className="p-2">
                <button
                  onClick={() => setActiveView("seeker")}
                  className="group w-full rounded-xl px-3 py-2.5 text-left hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8D3CC]/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#A8D3CC]/15 border border-white/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-[#A8D3CC]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium leading-tight">My Requests</div>
                      <div className="text-xs text-[#D8DEDE]/60">Your open support chats</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-white/35 group-hover:text-white/55 transition-colors" />
                  </div>
                </button>

                <button
                  onClick={() => setActiveView("supporter")}
                  className="group w-full rounded-xl px-3 py-2.5 text-left hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A8D3CC]/60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#A8D3CC]/15 border border-white/10 flex items-center justify-center">
                      <LifeBuoy className="w-4 h-4 text-[#A8D3CC]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-white font-medium leading-tight">{supporterLabel}</div>
                      <div className="text-xs text-[#D8DEDE]/60">Requests you can help with</div>
                    </div>
                    {pendingCount > 0 && (
                      <span className="text-[11px] font-semibold rounded-full bg-rose-500/20 text-rose-200 border border-rose-500/25 px-2 py-0.5">
                        {pendingCount}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-white/35 group-hover:text-white/55 transition-colors" />
                  </div>
                </button>
              </div>
            )}
            {activeView !== "menu" && (
              <div>
                <button
                  onClick={() => setActiveView("menu")}
                  className="flex items-center gap-2 px-4 py-3 text-white/85 hover:text-white transition-colors border-b border-white/10 w-full"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="px-3 py-2">
                  <div className="text-xs text-[#D8DEDE]/55 px-1.5 mb-2">
                    {activeView === "seeker" ? "My Requests" : "Supporter Dashboard"}
                  </div>
                  <ul className="space-y-2 max-h-[240px] overflow-y-auto pr-2 text-white text-sm scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {(activeView === "seeker" ? seekerItems : supporterItems).map((item, index) => (
                      <li
                        key={index}
                        className="group rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#A8D3CC]/25 transition-colors px-3 py-2 cursor-pointer"
                        onClick={() => {
                          setOpen(false);
                          setActiveView("menu");
                          navigate(`/chat/${item.docId}`);
                        }}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-white/90 group-hover:text-white transition-colors line-clamp-2">
                            {item.label}
                          </span>
                          <ChevronRight className="w-4 h-4 text-white/35 group-hover:text-white/55 transition-colors shrink-0" />
                        </div>
                      </li>
                    ))}
                  </ul>
                  {(activeView === "seeker" ? seekerItems : supporterItems).length === 0 && (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-[#D8DEDE]/65">
                      No active chats yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;

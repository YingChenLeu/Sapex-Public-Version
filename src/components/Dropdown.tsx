import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import {
  User,
  LifeBuoy,
  ArrowLeft,
  ChevronRight,
  Inbox,
  HeartHandshake,
  Frown,
  HeartCrack,
  BatteryLow,
  Wind,
  Sparkles,
  BookOpen,
  Users as UsersIcon,
  type LucideIcon,
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

const typeIcons: Record<string, LucideIcon> = {
  friendship: HeartHandshake,
  loneliness: Frown,
  heartbreak: HeartCrack,
  burnout: BatteryLow,
  stress: Wind,
  guidance: Sparkles,
  study: BookOpen,
};

type RequestItem = {
  docId: string;
  label: string;
  iconKey: string;
};

const Dropdown = () => {
  const [open, setOpen] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeView, setActiveView] = useState<
    "menu" | "seeker" | "supporter"
  >("menu");
  const [seekerItems, setSeekerItems] = useState<RequestItem[]>([]);
  const [supporterItems, setSupporterItems] = useState<RequestItem[]>([]);
  const [supporterCount, setSupporterCount] = useState(0);
  const [seekerCount, setSeekerCount] = useState(0);

  // Pending support requests where the user is the helper
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "esupport"),
      where("helper_uid", "==", currentUser.uid),
      where("actual", "==", null)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSupporterCount(snapshot.docs.length);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Pending support requests where the user is the seeker
  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "esupport"),
      where("seeker_uid", "==", currentUser.uid),
      where("actual", "==", null)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSeekerCount(snapshot.docs.length);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // Hydrate the active list when entering a sub-view
  useEffect(() => {
    if (!currentUser || activeView === "menu") return;

    const roleKey = activeView === "seeker" ? "seeker_uid" : "helper_uid";
    const q = query(
      collection(db, "esupport"),
      where(roleKey, "==", currentUser.uid),
      where("actual", "==", null)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const raw = (doc.data().type as string) ?? "";
        const label = typeLabels[raw] || raw || "Support request";
        return {
          docId: doc.id,
          label,
          iconKey: raw,
        };
      });
      if (activeView === "seeker") setSeekerItems(data);
      else setSupporterItems(data);
    });

    return () => unsubscribe();
  }, [activeView, currentUser]);

  // Close on outside click + escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Reset to main menu whenever the dropdown closes
  useEffect(() => {
    if (!open) setActiveView("menu");
  }, [open]);

  const totalCount = supporterCount + seekerCount;

  const items = activeView === "seeker" ? seekerItems : supporterItems;
  const subtitle =
    activeView === "seeker"
      ? "Conversations you've started"
      : "People asking for your help";
  const title = activeView === "seeker" ? "My Requests" : "Supporter Dashboard";
  const HeaderIcon = activeView === "seeker" ? User : LifeBuoy;

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="group relative outline-none"
      >
        <div className="relative">
          <img
            src={currentUser?.photoURL || "/default-avatar.png"}
            alt="Profile"
            className={`w-11 h-11 mr-3 rounded-full border transition-colors ${
              open
                ? "border-[#A8D3CC]"
                : "border-white/15 group-hover:border-[#A8D3CC]/60"
            }`}
          />
          {totalCount > 0 && (
            <span
              aria-label={`${totalCount} pending`}
              className="absolute -top-1 -right-2 min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-[#A8D3CC] text-[#161A24] text-[11px] font-semibold border-2 border-[#161A24] shadow-[0_0_12px_rgba(168,211,204,0.55)]"
            >
              {totalCount > 99 ? "99+" : totalCount}
            </span>
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-[#1E2430]/95 backdrop-blur-md shadow-2xl shadow-black/40 z-50 overflow-hidden"
          >
            {/* Brand glow strip */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#A8D3CC]/70 to-transparent" />

            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                {activeView === "menu" ? (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.18 }}
                    className="p-3"
                  >
                    <div className="px-2 pt-1 pb-3 text-[11px] font-semibold tracking-wider text-[#F0F2F2]/50 uppercase">
                      Wellness
                    </div>

                    <MenuButton
                      Icon={User}
                      label="My Requests"
                      hint="Conversations you've started"
                      count={seekerCount}
                      onClick={() => setActiveView("seeker")}
                    />
                    <MenuButton
                      Icon={LifeBuoy}
                      label="Supporter Dashboard"
                      hint="People asking for your help"
                      count={supporterCount}
                      onClick={() => setActiveView("supporter")}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeView}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ duration: 0.2 }}
                    className="p-3"
                  >
                    {/* Sub-view header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <button
                        onClick={() => setActiveView("menu")}
                        className="flex items-center gap-1.5 text-xs font-medium text-[#F0F2F2]/70 hover:text-[#A8D3CC] px-2 py-1 rounded-md hover:bg-white/5 transition-colors"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>
                      <div className="flex items-center gap-1.5">
                        <HeaderIcon className="w-3.5 h-3.5 text-[#A8D3CC]" />
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[#A8D3CC]">
                          {items.length}{" "}
                          {items.length === 1 ? "request" : "requests"}
                        </span>
                      </div>
                    </div>

                    <div className="px-1 pb-3 border-b border-white/5">
                      <h3 className="text-base font-semibold text-[#F0F2F2]">
                        {title}
                      </h3>
                      <p className="text-xs text-[#F0F2F2]/55 mt-0.5">
                        {subtitle}
                      </p>
                    </div>

                    {/* Items */}
                    <ul className="mt-3 space-y-1.5 max-h-[260px] overflow-y-auto pr-1 custom-scrollbar">
                      {items.length === 0 ? (
                        <li>
                          <EmptyState
                            isSeeker={activeView === "seeker"}
                            onAction={() => {
                              setOpen(false);
                              navigate(
                                activeView === "seeker"
                                  ? "/wellness-support"
                                  : "/user-profile"
                              );
                            }}
                          />
                        </li>
                      ) : (
                        items.map((item) => {
                          const Icon = typeIcons[item.iconKey] ?? UsersIcon;
                          return (
                            <li key={item.docId}>
                              <button
                                onClick={() => {
                                  setOpen(false);
                                  navigate(`/chat/${item.docId}`);
                                }}
                                className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/5 bg-[#161A24]/60 hover:border-[#A8D3CC]/40 hover:bg-[#A8D3CC]/[0.06] transition-all"
                              >
                                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#A8D3CC]/10 text-[#A8D3CC] group-hover:bg-[#A8D3CC]/20 transition-colors shrink-0">
                                  <Icon className="w-4 h-4" />
                                </span>
                                <span className="flex-1 text-sm text-left text-[#F0F2F2] truncate">
                                  {item.label}
                                </span>
                                <ChevronRight className="w-4 h-4 text-[#F0F2F2]/40 group-hover:text-[#A8D3CC] group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            </li>
                          );
                        })
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function MenuButton({
  Icon,
  label,
  hint,
  count,
  onClick,
}: {
  Icon: LucideIcon;
  label: string;
  hint: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-white/[0.04] transition-colors"
    >
      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#A8D3CC]/10 text-[#A8D3CC] group-hover:bg-[#A8D3CC]/20 transition-colors shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#F0F2F2]">{label}</span>
          {count > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#A8D3CC] text-[#161A24] text-[10px] font-semibold">
              {count > 99 ? "99+" : count}
            </span>
          )}
        </span>
        <span className="block text-xs text-[#F0F2F2]/55 truncate">{hint}</span>
      </span>
      <ChevronRight className="w-4 h-4 text-[#F0F2F2]/40 group-hover:text-[#A8D3CC] group-hover:translate-x-0.5 transition-transform" />
    </button>
  );
}

function EmptyState({
  isSeeker,
  onAction,
}: {
  isSeeker: boolean;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-8 rounded-xl border border-dashed border-white/10 bg-[#161A24]/40">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#A8D3CC]/10 text-[#A8D3CC] mb-3">
        <Inbox className="w-5 h-5" />
      </div>
      <p className="text-sm font-medium text-[#F0F2F2]">
        {isSeeker ? "No active requests" : "Inbox is clear"}
      </p>
      <p className="text-xs text-[#F0F2F2]/55 mt-1 max-w-[220px]">
        {isSeeker
          ? "When you reach out for support, your conversations will show up here."
          : "When peers reach out for support, you'll see their requests here."}
      </p>
      <button
        onClick={onAction}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#161A24] bg-[#A8D3CC] hover:bg-[#F0F2F2] transition-colors px-3 py-1.5 rounded-lg"
      >
        {isSeeker ? "Find a supporter" : "Become a Sapex Helper"}
      </button>
    </div>
  );
}

export default Dropdown;

import { createContext, useContext, useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleUserRound,
  Video,
  Clock,
  Eclipse,
  LogOut,
  Hexagon,
  Codesandbox,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

const SidebarContext = createContext<{
  collapsed: boolean;
  toggleCollapsed: () => void;
  isSmallScreen: boolean;
} | null>(null);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateScreenSize = () => setIsSmallScreen(mediaQuery.matches);

    updateScreenSize();
    mediaQuery.addEventListener("change", updateScreenSize);
    return () => mediaQuery.removeEventListener("change", updateScreenSize);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      setCollapsed(true);
    }
  }, [isSmallScreen]);

  // Single source of truth for the content gutter. Pages read this through the
  // `.app-gutter` utility instead of hardcoding their own pixel offsets.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--app-gutter",
      collapsed
        ? "var(--sidebar-w-collapsed)"
        : "var(--sidebar-w)",
    );
  }, [collapsed]);

  const toggleCollapsed = () => {
    if (isSmallScreen) return;
    setCollapsed((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{ collapsed, toggleCollapsed, isSmallScreen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
};

const navItems = [
  { to: "/user-profile", icon: CircleUserRound, label: "Profile" },
  { to: "/contributions", icon: Clock, label: "Contributions" },
  { to: "/helpboard", icon: BookOpenText, label: "Academic Hub" },
  { to: "/rate-your-chance", icon: GraduationCap, label: "Rate Your Chance" },
  { to: "/wellness-support", icon: Eclipse, label: "Wellness" },
  { to: "/origins-lab", icon: Codesandbox, label: "Origins Lab" },
  { to: "/study-rooms", icon: Video, label: "Study Rooms" },
];

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggleCollapsed, isSmallScreen } = useSidebar();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const isMain = location.pathname === "/main";

  useEffect(() => {
    const fetchAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().isAdmin === true);
      }
    };
    fetchAdminStatus();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-[100] h-screen flex flex-col border-r border-rule
          ${isMain ? "bg-transparent" : "bg-notice/85 backdrop-blur-xl"}`}
        style={{
          width: collapsed
            ? "var(--sidebar-w-collapsed)"
            : "var(--sidebar-w)",
          transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {isMain && (
          <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-notice/75 backdrop-blur-[2px]" />
          </div>
        )}

        {/* Logo */}
        <Link
          to="/main"
          className={`flex h-14 items-center shrink-0 border-b border-rule transition-colors duration-200 ease-out hover:bg-notice ${
            collapsed ? "justify-center px-0" : "gap-2.5 px-4"
          }`}
        >
          <img
            src="/simple-logo.png"
            alt="Sapex"
            className="h-8 w-8 shrink-0 object-contain"
          />
          <AnimatePresence initial={false} mode="wait">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{
                  duration: 0.35,
                  ease: [0.4, 0, 0.2, 1],
                }}
                className="font-logo font-semibold text-chalk text-[13px] tracking-wide whitespace-nowrap overflow-hidden"
              >
                SAPEX
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Nav */}
        <nav className="custom-scrollbar flex-1 overflow-y-auto py-3 px-2 min-h-0">
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="px-2 pb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-chalk-3"
              >
                Workspace
              </motion.p>
            )}
          </AnimatePresence>
          <ul className="space-y-0.5">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive =
                to === "/rate-your-chance"
                  ? location.pathname.startsWith("/rate-your-chance")
                  : location.pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    aria-current={isActive ? "page" : undefined}
                    className={`group relative flex h-9 items-center gap-2.5 rounded-control text-[13px] font-medium transition-colors duration-200 ease-out
                      ${collapsed ? "justify-center px-0" : "px-2.5"}
                      ${
                        isActive
                          ? "bg-sage-wash text-sage"
                          : "text-chalk-2 hover:bg-notice hover:text-chalk"
                      }`}
                    title={collapsed ? label : undefined}
                  >
                    {/* Active rail marker reads at any width, including collapsed. */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-r-full bg-sage" />
                    )}
                    <Icon className="shrink-0" size={18} strokeWidth={1.8} />
                    <AnimatePresence initial={false} mode="wait">
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1],
                          }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          {label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Collapse toggle */}
        {!isSmallScreen && (
          <div
            className={`shrink-0 border-t border-rule flex items-center ${
              collapsed ? "justify-center py-2.5" : "justify-end pr-2 py-2.5"
            }`}
          >
            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex items-center justify-center size-8 rounded-control text-chalk-3 hover:text-chalk hover:bg-notice transition-colors duration-200 ease-out"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="size-4" strokeWidth={2} />
              ) : (
                <ChevronLeft className="size-4" strokeWidth={2} />
              )}
            </button>
          </div>
        )}

        {/* Bottom: Admin + Logout */}
        <div className="shrink-0 border-t border-rule py-2.5 px-2 space-y-0.5">
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className={`flex h-9 items-center gap-2.5 w-full rounded-control text-[13px] font-medium transition-colors duration-200 ease-out
                bg-sage-wash text-sage hover:bg-sage/15
                ${collapsed ? "justify-center px-0" : "px-2.5"}`}
              title={collapsed ? "Admin" : undefined}
            >
              <Hexagon className="shrink-0 size-[18px]" strokeWidth={1.8} />
              <AnimatePresence initial={false} mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    Admin
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className={`flex h-9 items-center gap-2.5 w-full rounded-control text-[13px] font-medium transition-colors duration-200 ease-out
              text-chalk-2 hover:bg-clay-wash hover:text-clay
              ${collapsed ? "justify-center px-0" : "px-2.5"}`}
            title={collapsed ? "Log out" : undefined}
          >
            <LogOut className="shrink-0 size-[18px]" strokeWidth={1.8} />
            <AnimatePresence initial={false} mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </aside>

      {/* Logout confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              className="bg-overlay border border-rule-strong rounded-overlay shadow-[0_24px_64px_-16px_rgba(0,0,0,0.8)] w-full max-w-sm overflow-hidden"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-title"
            >
              <div className="p-6">
                <p
                  id="logout-title"
                  className="text-[15px] font-semibold text-chalk text-center"
                >
                  Log out of Sapex?
                </p>
                <p className="text-chalk-2 text-sm text-center mt-1.5">
                  You can sign back in anytime.
                </p>
              </div>
              <div className="flex gap-2 px-5 pb-5">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SideBar;

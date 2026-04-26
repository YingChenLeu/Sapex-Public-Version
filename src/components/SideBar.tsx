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
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const SidebarContext = createContext<{
  collapsed: boolean;
  toggleCollapsed: () => void;
} | null>(null);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => setCollapsed((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ collapsed, toggleCollapsed }}>
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
  { to: "/wellness-support", icon: Eclipse, label: "Wellness" },
  { to: "/origins-lab", icon: Codesandbox, label: "Origins Lab" },
  { to: "/study-rooms", icon: Video, label: "Study Rooms" },
];

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggleCollapsed } = useSidebar();
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
        className={`fixed top-0 left-0 z-[100] h-screen flex flex-col
          ${isMain ? "bg-transparent" : "bg-[#0D1117]"} border-r border-white/[0.06]
          ${collapsed ? "w-[80px]" : "w-[240px]"}`}
        style={{
          transition: "width 400ms cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {isMain && (
          <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-[#0D1117]/70 backdrop-blur-[2px]" />
          </div>
        )}

        {/* Logo */}
        <Link
          to="/main"
          className={`flex items-center shrink-0 border-b border-white/[0.06] transition-colors duration-300 ease-out hover:bg-white/[0.03] ${
            collapsed ? "justify-center py-4 px-0" : "gap-3 py-4 px-4"
          }`}
        >
          <img
            src="/simple-logo.png"
            alt="Sapex"
            className="h-9 w-9 shrink-0 object-contain"
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
                className="font-syncopate font-semibold text-white text-sm whitespace-nowrap overflow-hidden"
              >
                SAPEX
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 min-h-0">
          <ul className="space-y-0.5">
            {navItems.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to;
              return (
                <li key={to}>
                  <Link
                    to={to}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-300 ease-out
                      ${collapsed ? "justify-center px-0" : ""}
                      ${
                        isActive
                          ? "bg-[#7CDCBD]/10 text-[#7CDCBD]"
                          : "text-gray-400 hover:bg-white/[0.05] hover:text-gray-200"
                      }`}
                    title={collapsed ? label : undefined}
                  >
                    <Icon
                      className={`shrink-0 ${isActive ? "text-[#7CDCBD]" : ""}`}
                      size={20}
                      strokeWidth={1.8}
                    />
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
        <div
          className={`shrink-0 border-t border-white/[0.06] flex items-center ${
            collapsed ? "justify-center py-3" : "justify-end pr-2 py-3"
          }`}
        >
          <button
            type="button"
            onClick={toggleCollapsed}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.06] transition-colors duration-300 ease-out"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" strokeWidth={2} />
            ) : (
              <ChevronLeft className="w-4 h-4" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Bottom: Admin + Logout */}
        <div className="shrink-0 border-t border-white/[0.06] py-3 px-2 space-y-0.5">
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/admin")}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-300 ease-out
                bg-[#7CDCBD]/10 text-[#7CDCBD] hover:bg-[#7CDCBD]/15
                ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? "Admin" : undefined}
            >
              <Hexagon className="shrink-0 w-5 h-5" strokeWidth={1.8} />
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
            className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-300 ease-out
              text-gray-400 hover:bg-red-500/10 hover:text-red-400
              ${collapsed ? "justify-center px-0" : ""}`}
            title={collapsed ? "Log out" : undefined}
          >
            <LogOut className="shrink-0 w-5 h-5" strokeWidth={1.8} />
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
              className="bg-[#12162A] border border-white/10 rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <p className="text-white font-medium text-center">
                  Log out of Sapex?
                </p>
                <p className="text-gray-400 text-sm text-center mt-1">
                  You can sign back in anytime.
                </p>
              </div>
              <div className="flex gap-2 p-4 pt-0">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/5 border border-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600/90 hover:bg-red-600 transition-colors"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default SideBar;

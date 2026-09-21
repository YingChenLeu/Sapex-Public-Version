import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/safety", label: "Safety" },
  { to: "/schools", label: "Schools" },
  { to: "/faq", label: "FAQ" },
  { to: "/initiative", label: "Initiative" },
] as const;

const Navbar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // The bar starts flush with the hero and only takes on a rule and backdrop
  // once content is scrolling underneath it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-colors duration-300 ease-app ${
          scrolled || menuOpen
            ? "border-b border-rule bg-board/85 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-75"
          >
            <img src="/simple-logo.png" alt="" className="h-7 w-auto" />
            <span className="font-logo text-[15px] font-semibold tracking-wide text-chalk">
              SAPEX
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  aria-current={isActive ? "page" : undefined}
                  className={`text-[13px] transition-colors duration-150 ease-app ${
                    isActive
                      ? "text-chalk underline decoration-sage decoration-1 underline-offset-[6px]"
                      : "text-chalk-2 hover:text-chalk"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" asChild>
              <Link to={isLoggedIn ? "/main" : "/login"}>
                {isLoggedIn ? "Open Sapex" : "Sign in"}
              </Link>
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex size-9 items-center justify-center rounded-control text-chalk-2 transition-colors hover:bg-notice hover:text-chalk lg:hidden"
            >
              {menuOpen ? (
                <X className="size-5" strokeWidth={1.8} />
              ) : (
                <Menu className="size-5" strokeWidth={1.8} />
              )}
            </button>
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden lg:hidden"
            >
              <div className="flex flex-col px-5 pb-4 sm:px-8">
                {navLinks.map(({ to, label }, i) => {
                  const isActive = location.pathname === to;
                  return (
                    <Link
                      key={to}
                      to={to}
                      className={`py-3 text-sm transition-colors ${
                        i === 0 ? "" : "border-t border-rule"
                      } ${isActive ? "text-sage" : "text-chalk-2 hover:text-chalk"}`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Navbar;

import { useEffect, useState } from "react";
import {
  LogIn,
  ShieldCheck,
  Sparkles,
  Building2,
  CircleHelp,
  Mail,
  FileText,
} from "lucide-react";
import { Button } from "./ui/button";
import { Link, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const navLinks = [
  { to: "/features", label: "Features", icon: Sparkles },
  { to: "/safety", label: "Safety", icon: ShieldCheck },
  { to: "/schools", label: "For Schools", icon: Building2 },
  { to: "/faq", label: "FAQ", icon: CircleHelp },
  { to: "/terms", label: "Terms", icon: FileText },
  { to: "/contact", label: "Contact", icon: Mail },
] as const;

const Navbar = () => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-5xl z-50 rounded-2xl border border-white/10 bg-[#0C111C]/90 backdrop-blur-md shadow-lg shadow-black/20 py-2.5 px-4 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity"
        >
          <img src="/simple-logo.png" alt="Sapex" className="h-8 w-auto" />
          <span className="text-xl font-syncopate font-semibold text-white">
            SAPEX
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[#A8D3CC] bg-[#A8D3CC]/10"
                    : "text-[#D8DEDE]/80 hover:text-[#A8D3CC] hover:bg-white/5"
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>

        {isLoggedIn ? (
          <Button
            size="sm"
            asChild
            className="shrink-0 bg-[#A8D3CC] text-[#2D4F53] hover:bg-[#D8DEDE] hover:text-[#2D4F53]"
          >
            <Link to="/helpboard" className="flex items-center gap-2">
              <Sparkles size={18} />
              <span className="hidden sm:inline">Open Sapex</span>
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="shrink-0 border-[#A8D3CC]/50 text-[#D8DEDE] hover:bg-[#A8D3CC] hover:text-[#2D4F53] hover:border-[#A8D3CC]"
          >
            <Link to="/login" className="flex items-center gap-2">
              <LogIn size={18} />
              <span className="hidden sm:inline">Sign into Sapex</span>
            </Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

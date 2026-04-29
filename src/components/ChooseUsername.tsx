import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ShieldAlert, UserRound } from "lucide-react";
import { toast } from "sonner";
import { resolveUserAvatarUrl } from "@/lib/profileVisuals";

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

const ChooseUsername = () => {
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [authReady, setAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (data.usernameLocked === true && (data.username || "").trim()) {
            navigate("/helpboard", { replace: true });
            return;
          }
        }
      } catch (err) {
        console.error("ChooseUsername precheck failed:", err);
      } finally {
        setAuthReady(true);
      }
    });
    return () => unsub();
  }, [navigate]);

  const validation = useMemo(() => {
    const value = username.trim();
    if (!value) return { ok: false, message: "" };
    if (!USERNAME_REGEX.test(value)) {
      return {
        ok: false,
        message:
          "3–20 characters. Letters, numbers, underscores, or hyphens only.",
      };
    }
    return { ok: true, message: "" };
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const value = username.trim();
    if (!USERNAME_REGEX.test(value)) {
      setError(
        "Pick a username with 3–20 characters using letters, numbers, underscores, or hyphens.",
      );
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    setSubmitting(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        username: value,
        usernameLocked: true,
      });
      try {
        await updateProfile(user, { displayName: value });
      } catch (err) {
        console.warn("updateProfile displayName failed:", err);
      }

      localStorage.setItem("uid", user.uid);
      localStorage.setItem("name", value);
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        const data = snap.exists() ? snap.data() : null;
        localStorage.setItem(
          "photo",
          resolveUserAvatarUrl(data) || "/default-avatar.png",
        );
      } catch {
        localStorage.setItem("photo", "/default-avatar.png");
      }

      toast.success("Username locked in. Welcome!");
      navigate("/helpboard", { replace: true });
    } catch (err) {
      console.error("Failed to set username:", err);
      setError("Could not save your username. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#0A0D17] flex items-center justify-center">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0D17] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="border-white/10 bg-[#101320]/90 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserRound className="w-7 h-7 text-[#7CDCBD]" />
              <CardTitle className="text-2xl text-white font-syncopate">
                Pick your username
              </CardTitle>
            </div>
            <CardDescription className="text-slate-300">
              This is how others will see you on Sapex.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 mb-5 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 mt-0.5 text-amber-300 shrink-0" />
              <p className="text-[13px] text-amber-100 leading-snug">
                <span className="font-semibold">This cannot be changed.</span>{" "}
                Choose carefully — once set, your username is permanent.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-300">
                  Username
                </Label>
                <Input
                  id="username"
                  autoFocus
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. zoro_swordsman"
                  className="bg-[#181c27] border-[#1b1f30] text-white placeholder:text-slate-500 focus-visible:ring-[#7CDCBD]"
                />
                <p className="text-[12px] text-slate-400 leading-snug">
                  3–20 characters. Letters, numbers, underscores, or hyphens.
                </p>
                {validation.message && (
                  <p className="text-[12px] text-amber-300/90 leading-snug">
                    {validation.message}
                  </p>
                )}
                {error && (
                  <p className="text-[12px] text-red-400 leading-snug">
                    {error}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-[#7CDCBD] text-[#0A0D17] hover:bg-[#5FBFAA] font-semibold"
                disabled={submitting || !validation.ok}
              >
                {submitting ? "Saving..." : "Set username permanently"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChooseUsername;

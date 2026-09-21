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
      <div className="flex min-h-screen items-center justify-center bg-board">
        <p className="text-sm text-chalk-3">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-board p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserRound className="size-5 text-sage" strokeWidth={1.7} />
              <CardTitle>Pick your username</CardTitle>
            </div>
            <CardDescription>
              This is how others will see you on Sapex.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-5 flex items-start gap-2 border border-brass/25 bg-brass-wash p-3">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-brass" />
              <p className="text-[13px] leading-snug text-chalk-2">
                This cannot be changed. Choose carefully — once set, your
                username is permanent.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  autoFocus
                  autoComplete="off"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="zoro_swordsman"
                />
                <p className="text-[12px] leading-snug text-chalk-3">
                  3–20 characters. Letters, numbers, underscores, or hyphens.
                </p>
                {validation.message && (
                  <p className="text-[12px] leading-snug text-brass">
                    {validation.message}
                  </p>
                )}
                {error && (
                  <p className="text-[12px] leading-snug text-clay">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !validation.ok}
                loading={submitting}
              >
                Set username permanently
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ChooseUsername;

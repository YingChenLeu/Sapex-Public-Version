import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LogIn } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useEffect, useState } from "react";
import { auth, db, provider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  type DocumentData,
  type UpdateData,
} from "firebase/firestore";

const COC_ACK_KEY = "sapex:coc_ack_v1";

const Auth = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConductModal, setShowConductModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    try {
      if (import.meta.env.DEV) {
        setShowConductModal(true);
        return;
      }
      const ack = window.localStorage.getItem(COC_ACK_KEY);
      if (ack !== "1") setShowConductModal(true);
    } catch {
      setShowConductModal(true);
    }
  }, []);

  const acknowledgeConduct = () => {
    try {
      window.localStorage.setItem(COC_ACK_KEY, "1");
    } catch {
      // ignore storage failures
    }
    setShowConductModal(false);
  };

  // Build a fresh user doc with NO name/surname stored. Username is intentionally
  // left empty so the user is forced to pick one in /choose-username.
  const createInitialUserDoc = async (
    uid: string,
    emailValue: string | null,
    googlePhotoUrl: string | null,
  ) => {
    const normalizedEmail = (emailValue ?? "").trim().toLowerCase();
    await setDoc(doc(db, "users", uid), {
      uid,
      username: "",
      usernameLocked: false,
      email: normalizedEmail || null,
      bio: "",
      isAdmin: false,
      profilePicture: googlePhotoUrl || "/default-avatar.png",
      contributions: {
        English: 0,
        "Social Sciences": 0,
        "Foreign Languages": 0,
        Mathematics: 0,
        Science: 0,
        Arts: 0,
      },
      bigFivePersonality: {
        Openness: 0,
        Conscientiousness: 0,
        Extraversion: 0,
        Agreeableness: 0,
        Neuroticism: 0,
      },
      online: true,
      busy: false,
      helper: false,
    });
  };

  // Decide where to send the user after a successful sign-in / sign-up.
  // If they don't have a locked username yet, force them through the
  // username chooser; otherwise drop them on the help board.
  const routeAfterAuth = async (
    uid: string,
    latestGooglePhoto?: string | null,
  ) => {
    localStorage.setItem("uid", uid);
    try {
      const snap = await getDoc(doc(db, "users", uid));
      const data = snap.exists() ? snap.data() : null;
      const locked = data?.usernameLocked === true;
      const username = (data?.username || "").trim();

      if (!locked || !username) {
        navigate("/choose-username", { replace: true });
        return;
      }

      localStorage.setItem("name", username);
      localStorage.setItem(
        "photo",
        data?.profilePicture || latestGooglePhoto || "/default-avatar.png",
      );
      try {
        await updateDoc(doc(db, "users", uid), { online: true });
      } catch {
        // non-fatal
      }
      navigate("/helpboard", { replace: true });
    } catch (err) {
      console.error("routeAfterAuth failed:", err);
      navigate("/choose-username", { replace: true });
    }
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      setError("");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const googlePhotoUrl = user.photoURL || null;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await createInitialUserDoc(user.uid, user.email, googlePhotoUrl);
      } else {
        const current = userSnap.data();
        const updates: UpdateData<DocumentData> = {};
        const normalizedEmail = (user.email ?? "").trim().toLowerCase() || null;
        if ((current.email ?? null) !== normalizedEmail) {
          updates.email = normalizedEmail;
        }
        if (
          (current.profilePicture ?? null) !==
          (googlePhotoUrl ?? "/default-avatar.png")
        ) {
          updates.profilePicture = googlePhotoUrl || "/default-avatar.png";
        }
        if (Object.keys(updates).length > 0) {
          await updateDoc(userRef, updates);
        }
      }

      await routeAfterAuth(user.uid, googlePhotoUrl);
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      const code = (error?.code as string | undefined) ?? "";
      if (code === "auth/operation-not-allowed") {
        setError(
          "Google sign-in is disabled in Firebase Auth for this project.",
        );
      } else if (code === "auth/unauthorized-domain") {
        setError(
          "This domain is not authorized for OAuth sign-in in Firebase Auth.",
        );
      } else if (code === "auth/popup-blocked") {
        setError(
          "Popup was blocked by the browser. Please allow popups and try again.",
        );
      } else if (
        code === "auth/cancelled-popup-request" ||
        code === "auth/popup-closed-by-user"
      ) {
        setError("Sign-in popup was closed. Please try again.");
      } else if (code === "auth/invalid-api-key") {
        setError("Firebase API key is invalid for this project configuration.");
      } else {
        setError(
          code
            ? `Authentication failed (${code}).`
            : "Authentication failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D17] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <Dialog
        open={showConductModal}
        onOpenChange={(open) => {
          if (open) return setShowConductModal(true);
          try {
            const ack = window.localStorage.getItem(COC_ACK_KEY);
            if (ack === "1") setShowConductModal(false);
            else setShowConductModal(true);
          } catch {
            setShowConductModal(true);
          }
        }}
      >
        <DialogContent className="bg-[#101320] border border-[#1b1f30] text-slate-100 max-w-xl [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-white">
              Community guidelines
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              To keep Sapex safe and supportive, you must follow these rules.
              Breaking them can lead to suspension or a permanent ban.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[13px] text-slate-200/90 leading-relaxed">
            <ul className="space-y-2">
              <li>
                <span className="font-semibold text-slate-100">
                  No bullying or harassment.
                </span>{" "}
                No hate speech, threats, doxxing, or targeted abuse.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Keep it appropriate.
                </span>{" "}
                No sexual content, exploitation, or graphic violence.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Protect privacy.
                </span>{" "}
                Don’t share personal info (yours or others’) without consent.
              </li>
              <li>
                <span className="font-semibold text-slate-100">
                  Be honest and respectful.
                </span>{" "}
                Don’t impersonate others or spam/scam users.
              </li>
            </ul>
          </div>

          <DialogFooter className="sm:justify-between gap-2">
            <div className="text-[12px] text-slate-400 leading-snug">
              By continuing, you agree to follow these rules while using Sapex.
            </div>
            <Button
              className="bg-[#7CDCBD] text-[#0A0D17] hover:bg-[#5FBFAA] font-semibold"
              onClick={acknowledgeConduct}
              type="button"
            >
              I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="w-full max-w-xl bg-[#101320]/90 border border-[#1b1f30] rounded-2xl shadow-2xl p-8 sm:p-10 backdrop-blur-sm">
        <div className="text-slate-100 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#7CDCBD]/15 border border-[#7CDCBD]/25 mb-5">
            <LogIn className="w-7 h-7 text-[#7CDCBD]" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Continue with Google
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Sapex uses your Google account for sign-in and profile photo sync.
          </p>
          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          <Button
            className="mt-7 w-full bg-white text-[#0A0D17] hover:bg-slate-200 font-semibold gap-2"
            onClick={handleClick}
            disabled={loading}
            type="button"
          >
            <FcGoogle size={18} />
            {loading ? "Connecting..." : "Continue with Google"}
          </Button>
          <p className="text-[12px] text-slate-500 mt-4">
            Email/password login is not available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

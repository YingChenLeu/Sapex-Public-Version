import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserRound } from "lucide-react";
import { useState } from "react";
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
import { FcGoogle } from "react-icons/fc";
import { auth, db, provider } from "../lib/firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      setError("");
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user.email) {
        const uid = user.uid;
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: uid,
            username: user.displayName?.trim() || "Anonymous",
            email: user.email,
            bio: "",
            isAdmin: false,
            profilePicture: user.photoURL || "/default-avatar.png",
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
        } else {
          const currentData = userSnap.data();
          const updates: any = {};
          if (!currentData.username || currentData.username.trim() === "") {
            updates.username = user.displayName?.trim() || "Anonymous";
          }
          if (
            !currentData.profilePicture ||
            currentData.profilePicture.trim() === ""
          ) {
            updates.profilePicture = user.photoURL || "/default-avatar.png";
          }
          if (Object.keys(updates).length > 0) {
            await updateDoc(userRef, updates);
          }
        }

        localStorage.setItem("uid", uid);
        localStorage.setItem("name", user.displayName || "Anonymous");
        localStorage.setItem("photo", user.photoURL || "/default-avatar.png");
        navigate("/helpboard");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      const code = (error?.code as string | undefined) ?? "";
      if (code === "auth/operation-not-allowed") {
        setError("Google sign-in is disabled in Firebase Auth for this project.");
      } else if (code === "auth/unauthorized-domain") {
        setError("This domain is not authorized for OAuth sign-in in Firebase Auth.");
      } else if (code === "auth/popup-blocked") {
        setError("Popup was blocked by the browser. Please allow popups and try again.");
      } else if (code === "auth/cancelled-popup-request" || code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
      } else if (code === "auth/invalid-api-key") {
        setError("Firebase API key is invalid for this project configuration.");
      } else {
        setError(code ? `Authentication failed (${code}).` : "Authentication failed. Please try again.");
      }
    }
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError("Invalid email format.");
      return;
    }

    setLoading(true);
    try {
      setError("");
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );

      localStorage.setItem("uid", result.user.uid);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        localStorage.setItem("name", data.username || "Anonymous");
        localStorage.setItem(
          "photo",
          data.profilePicture || "/default-avatar.png",
        );
      }
      await updateDoc(doc(db, "users", result.user.uid), { online: true });
      navigate("/helpboard");
    } catch (error: any) {
      console.error("Email login error:", error);
      if (error.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (error.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (error.code === "auth/operation-not-allowed") {
        setError("Email/password sign-in is disabled in Firebase Auth for this project.");
      } else {
        setError(error?.code ? `Authentication failed (${error.code}).` : "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      setError("Invalid email format.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const username = email.trim().split("@")[0] || "Anonymous";
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      await updateProfile(result.user, {
        displayName: username,
      });
      const uid = result.user.uid;
      localStorage.setItem("uid", uid);
      localStorage.setItem("name", username);
      localStorage.setItem("photo", "/default-avatar.png");

      await setDoc(doc(db, "users", uid), {
        uid: uid,
        username,
        email: email.trim().toLowerCase(),
        bio: "",
        isAdmin: false,
        profilePicture: result.user.photoURL || "/default-avatar.png",
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

      navigate("/helpboard");
    } catch (error: any) {
      console.error("Email sign-up error:", error);
      if (error.code === "auth/email-already-in-use") {
        setError("An account with this email already exists.");
      } else if (error.code === "auth/operation-not-allowed") {
        setError("Email/password sign-up is disabled in Firebase Auth for this project.");
      } else {
        setError(error?.code ? `Sign-up failed (${error.code}).` : "Sign-up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D17] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl relative bg-[#101320]/80 border border-[#1b1f30] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
        <div
          className="absolute top-0 left-0 w-1/2 h-full z-10 transition-[transform,border-radius] duration-700 ease-in-out"
          style={{
            transform: isLogin ? "translateX(0)" : "translateX(100%)",
            background:
              "linear-gradient(135deg, #11141d 0%, #181c27 50%, #0d1019 100%)",
            borderRadius: isLogin ? "0px 0px 250px 0px" : "200px 0px 0px 0px",
          }}
        />

        <div className="relative min-h-[500px]">
          {/* Login Form */}
          <div
            className={`absolute top-0 left-0 w-full px-8 transition-all duration-700 ease-in-out transform ${
              isLogin
                ? "translate-x-0 z-20 opacity-100"
                : "-translate-x-full z-10 opacity-0"
            }`}
          >
            <div className="text-slate-100 max-w-sm mx-auto pt-16">
              <div className="flex items-center gap-2 mb-8">
                <LogIn className="w-8 h-8 text-[#7CDCBD]" />
                <h2 className="text-3xl font-bold text-white">Login</h2>
              </div>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-[#181c27] border-[#1b1f30] text-white placeholder:text-slate-500 focus-visible:ring-[#7CDCBD]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login" className="text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="password-login"
                    type="password"
                    placeholder="••••••••"
                    className="bg-[#181c27] border-[#1b1f30] text-white placeholder:text-slate-500 focus-visible:ring-[#7CDCBD]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  className="w-full bg-[#7CDCBD] text-[#0A0D17] hover:bg-[#5FBFAA] font-semibold"
                  onClick={handleEmailLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-slate-500">
                    Or continue with
                  </span>
                  <button
                    onClick={handleClick}
                    type="button"
                    className="rounded-full border border-[#7CDCBD]/50 bg-[#181c27] text-white hover:bg-[#7CDCBD]/10 flex items-center justify-center transition p-2.5"
                    aria-label="Sign in with Google"
                  >
                    <FcGoogle size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Up Form */}
          <div
            className={`absolute top-0 left-0 w-full px-8 transition-all duration-700 ease-in-out transform ${
              isLogin
                ? "translate-x-full z-10 opacity-0"
                : "translate-x-0 z-20 opacity-100"
            }`}
          >
            <div className="text-slate-100 max-w-sm mx-auto pt-16">
              <div className="flex items-center gap-2 mb-8">
                <UserRound className="w-8 h-8 text-[#7CDCBD]" />
                <h2 className="text-3xl font-bold text-white">Sign Up</h2>
              </div>
              {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signup" className="text-slate-300">
                    Email
                  </Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-[#181c27] border-[#1b1f30] text-white placeholder:text-slate-500 focus-visible:ring-[#7CDCBD]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup" className="text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="••••••••"
                    className="bg-[#181c27] border-[#1b1f30] text-white placeholder:text-slate-500 focus-visible:ring-[#7CDCBD]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  className="w-full bg-[#7CDCBD] text-[#0A0D17] hover:bg-[#5FBFAA] font-semibold"
                  onClick={handleEmailSignup}
                  disabled={loading}
                >
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Button */}
        <button
          onClick={toggleForm}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-slate-300 hover:text-[#7CDCBD] transition-colors z-30 text-sm font-medium"
        >
          {isLogin
            ? "Need an account? Sign Up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
};

export default Auth;

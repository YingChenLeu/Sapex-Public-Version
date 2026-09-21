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
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
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
      setError("Authentication failed. Please try again.");
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
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async () => {
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill out all fields.");
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
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      await updateProfile(result.user, {
        displayName: name.trim(),
      });
      const uid = result.user.uid;
      localStorage.setItem("uid", uid);
      localStorage.setItem("name", name.trim() || "Anonymous");
      localStorage.setItem("photo", "/default-avatar.png");

      await setDoc(doc(db, "users", uid), {
        uid: uid,
        username: name.trim() || "Anonymous",
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
      } else {
        setError("Sign-up failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-transparent p-4">
      <div className="relative w-full max-w-md overflow-hidden rounded-overlay border border-rule bg-notice/80 shadow-e3 backdrop-blur-sm md:max-w-4xl">
        <div
          className="absolute top-0 left-0 z-10 hidden h-full w-1/2 transition-[transform,border-radius] duration-700 ease-in-out md:block"
          style={{
            transform: isLogin ? "translateX(0)" : "translateX(100%)",
            background:
              "linear-gradient(135deg, var(--overlay) 0%, var(--notice) 50%, var(--recess) 100%)",
            borderRadius: isLogin ? "0px 0px 250px 0px" : "200px 0px 0px 0px",
          }}
        />

        <div className="relative md:min-h-[500px]">
          {/* Login Form */}
          <div
            className={`w-full px-6 pb-4 pt-10 transition-all duration-700 ease-in-out md:absolute md:top-0 md:left-0 md:px-8 md:pt-16 ${
              isLogin
                ? "relative z-20 translate-x-0 opacity-100"
                : "hidden -translate-x-full opacity-0 md:block"
            }`}
          >
            <div className="mx-auto max-w-sm pt-16 text-chalk">
              <div className="mb-8 flex items-center gap-2">
                <LogIn className="h-7 w-7 text-sage" />
                <h2 className="display-3 text-chalk">Login</h2>
              </div>
              {error && (
                <p className="mb-4 text-sm text-clay" role="alert">
                  {error}
                </p>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-login">Email</Label>
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-login">Password</Label>
                  <Input
                    id="password-login"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleEmailLogin}
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? "Logging in…" : "Login"}
                </Button>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-xs text-chalk-3">Or continue with</span>
                  <button
                    onClick={handleClick}
                    type="button"
                    className="flex items-center justify-center rounded-full border border-sage/40 bg-recess p-2.5 text-chalk transition hover:bg-sage-wash"
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
            className={`w-full px-6 pb-4 pt-10 transition-all duration-700 ease-in-out md:absolute md:top-0 md:left-0 md:px-8 md:pt-16 ${
              isLogin
                ? "hidden translate-x-full opacity-0 md:block"
                : "relative z-20 translate-x-0 opacity-100"
            }`}
          >
            <div className="mx-auto max-w-sm pt-16 text-chalk">
              <div className="mb-8 flex items-center gap-2">
                <UserRound className="h-7 w-7 text-sage" />
                <h2 className="display-3 text-chalk">Sign up</h2>
              </div>
              {error && (
                <p className="mb-4 text-sm text-clay" role="alert">
                  {error}
                </p>
              )}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleEmailSignup}
                  disabled={loading}
                  loading={loading}
                >
                  {loading ? "Signing up…" : "Sign up"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Switch Button */}
        <button
          onClick={toggleForm}
          className="relative z-30 mx-auto mb-8 block text-center text-sm font-medium text-chalk-2 transition-colors hover:text-sage md:absolute md:bottom-8 md:left-1/2 md:mb-0 md:-translate-x-1/2"
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

import { JSX, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import AdminManagement from "./components/AdminManagement";
import { Navigate } from "react-router-dom";
import AboutDev from "./components/AboutDev";
import AboutInitiative from "./components/AboutInitiative";
import TechStack from "./components/TechStack";
import Community from "./components/Community";
import LandingPage from "./components/LandingPage";
import Navbar from "./components/NavBar";
import { Routes, Route } from "react-router-dom";
import SideBar, { SidebarProvider } from "./components/SideBar";
import FloatingLines from "./components/ui/FloatingLines";
import Auth from "./components/Auth";
import HelpBoard from "./components/HelpBoard";
import StudyRooms from "./components/StudyRooms";
import PostProblem from "./components/PostProblem";
import Contributions from "./components/Contribution";
import ProtectedRoute from "./components/ProtectedRoute";
import StillInDevelopment from "./components/StillInDevelopment";
import Profile from "./components/Profile";
import WellnessSupport from "./components/WellnessSupport";
import PersonalityQuiz from "./components/Big5Personality";
import Matching from "./components/Loading";
import ChatPage from "./components/Chat";
import NotificationListener from "./components/NotificationListener";
import Main from "./components/Main";
import { Toaster } from "sonner";
import { OriginsLab } from "./components/OriginsLab";
import { useLocation } from "react-router-dom";

const APP_NAME = "Sapex";

const getPageTitle = (pathname: string) => {
  if (pathname === "/") return "Landing";
  if (pathname === "/main") return "Control Center";
  if (pathname === "/helpboard") return "Academic Center";
  if (pathname === "/post-problem") return "Post a Problem";
  if (pathname === "/study-rooms") return "Study Rooms";
  if (pathname === "/origins-lab") return "Origins Lab";
  if (pathname === "/wellness-support") return "Wellness Support";
  if (pathname === "/contributions") return "Contributions";
  if (pathname === "/personality-quiz") return "Personality Quiz";
  if (pathname === "/finding-match") return "Finding Match";
  if (pathname === "/chat/:id" || pathname.startsWith("/chat/")) return "Chat";
  if (pathname === "/user-profile") return "User Profile";
  if (pathname === "/admin") return "Admin";
  if (pathname === "/initiative") return "About Initiative";
  if (pathname === "/development") return "Tech Stack";
  if (pathname === "/developer") return "About Developer";
  if (pathname === "/community") return "Community";
  if (pathname === "/stillindevelopment") return "Still In Development";
  if (pathname === "/login") return "Login";
  return APP_NAME;
};

const DocumentTitleManager = () => {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = getPageTitle(location.pathname);
    document.title = pageTitle === APP_NAME ? APP_NAME : `${pageTitle} | ${APP_NAME}`;
  }, [location.pathname]);

  return null;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(docRef);
        setIsAdmin(userSnap.exists() && userSnap.data().isAdmin === true);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return <div className="text-white p-4">Checking admin access...</div>;
  return isAdmin ? children : <Navigate to="/" />;
};

function App() {
  const [uid, setUid] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUid(user.uid);
      } else {
        setUid("");
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!uid) return;

    const userRef = doc(db, "users", uid);

    const handleVisibilityChange = async () => {
      try {
        if (document.visibilityState === "visible") {
          await updateDoc(userRef, {
            online: true,
            lastActive: serverTimestamp(),
          });
        } else {
          await updateDoc(userRef, {
            online: false,
            lastActive: serverTimestamp(),
          });
        }
      } catch (err) {
        console.error("Failed to update visibility status", err);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [uid]);

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    const userRef = doc(db, "users", uid);

    const setOnline = async () => {
      try {
        await updateDoc(userRef, {
          online: true,
          lastActive: serverTimestamp(),
        });
      } catch (err) {
        console.error("Failed to set user online", err);
      }
    };

    const setOffline = async () => {
      try {
        await updateDoc(userRef, {
          online: false,
          lastActive: serverTimestamp(),
        });
      } catch (err) {
        console.error("Failed to set user offline", err);
      }
    };

    setOnline();

    window.addEventListener("beforeunload", setOffline);
    return () => {
      window.removeEventListener("beforeunload", setOffline);
      setOffline();
    };
  }, []);
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <SidebarProvider>
        <NotificationListener uid={uid} />
        <DocumentTitleManager />
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Navbar /> <LandingPage />
              </div>
            }
          />
          <Route
            path="/post-problem"
            element={
              <div>
                <PostProblem />
              </div>
            }
          />
          <Route
            path="/main"
            element={
              <div className="relative min-h-screen overflow-hidden bg-[#0A0D17]">
                <div className="pointer-events-none absolute inset-0 z-0 opacity-35 [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.9),rgba(0,0,0,0.4),transparent)]">
                  <FloatingLines
                    linesGradient={["#45f56e", "#A8D3CC", "#2D4F53"]}
                    interactive={false}
                    bendStrength={-15}
                    parallax={false}
                    mixBlendMode="screen"
                  />
                </div>
                <SideBar />
                <Main />
              </div>
            }
          />
          <Route
            path="/initiative"
            element={
              <div>
                <AboutInitiative />
                <Navbar />
              </div>
            }
          />
          <Route
            path="/development"
            element={
              <div>
                <Navbar />
                <TechStack />
              </div>
            }
          />
          <Route
            path="/study-rooms"
            element={
              <ProtectedRoute>
                <div>
                  <StudyRooms />
                  <SideBar />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer"
            element={
              <div>
                <AboutDev />
                <Navbar />
              </div>
            }
          />
          <Route
            path="/login"
            element={
              <div>
                <Auth />
              </div>
            }
          />
          <Route
            path="/contributions"
            element={
              <div>
                <ProtectedRoute>
                  <div>
                    <Contributions />
                    <SideBar />
                  </div>
                </ProtectedRoute>
              </div>
            }
          />
          <Route
            path="/chat/:id"
            element={
              <ProtectedRoute>
                <div>
                  <ChatPage />
                  <SideBar />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/stillindevelopment"
            element={
              <div>
                <StillInDevelopment />
              </div>
            }
          />
          <Route
            path="/community"
            element={
              <div>
                <Community />
                <Navbar />
              </div>
            }
          />
          <Route
            path="/helpboard"
            element={
              <ProtectedRoute>
                <div>
                  <SideBar />
                  <HelpBoard />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/origins-lab"
            element={
              <ProtectedRoute>
                <div>
                  <SideBar />
                  <OriginsLab />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/personality-quiz"
            element={
              <ProtectedRoute>
                <div>
                  <SideBar />
                  <PersonalityQuiz />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wellness-support"
            element={
              <ProtectedRoute>
                <div>
                  <SideBar />
                  <WellnessSupport />
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/finding-match"
            element={
              <ProtectedRoute>
                <div>
                  <SideBar />
                  <Matching />
                </div>
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-profile"
            element={
              <ProtectedRoute>
                <div>
                  <Profile />
                  <SideBar />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>
                  <SideBar />
                  <AdminManagement />
                </div>
              </AdminRoute>
            }
          />
        </Routes>
      </SidebarProvider>
    </>
  );
}

export default App;

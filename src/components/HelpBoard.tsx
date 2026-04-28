import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "../components/SideBar";
import { ProblemChatDialog } from "./ProblemChatDialog";
import { HelpBoardCard } from "./HelpBoardCard";
import { Button } from "./ui/button";
import { Plus, GraduationCap, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import Dropdown from "./Dropdown";

type Problem = {
  id: string;
  title: string;
  description: string;
  category: string;
  course: string;
  urgency: "low" | "medium" | "high";
  image?: string | null;
  createdAt: Date | null;
  user: {
    name: string;
    avatar?: string;
    uid?: string;
  };
  responses: number;
  likes: number;
};

const categories = [
  "All",
  "Mathematics",
  "Science",
  "English",
  "Social Sciences",
  "Foreign Languages",
];

const HelpBoard = () => {
  const [, setProfilePhoto] = useState("");
  const [, setUserName] = useState("User");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [, setLoading] = useState(true);
  const openedProblemFromQuery = useRef(false);

  const { collapsed } = useSidebar();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchUserProfilePicture = async () => {
      try {
        const uid = localStorage.getItem("uid");
        if (!uid) return;

        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfilePhoto(data.profilePicture || "");
          setUserName(data.username || "User");
        }
      } catch (error) {
        console.error("Failed to fetch profile picture:", error);
      }
    };

    fetchUserProfilePicture();
  }, []);
  useEffect(() => {
    const problemsRef = collection(db, "problems");

    const unsubscribe = onSnapshot(
      problemsRef,
      (querySnapshot) => {
        const problemsData = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || "Untitled Problem",
            description: data.description || "No description provided.",
            category: data.category || "General",
            course: data.course || "Unknown Course",
            urgency: data.urgency || "low",
            image: data.image ?? null,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : null,
            user: {
              name: data.user?.name || "Anonymous",
              avatar: data.user?.avatar || "",
              uid: data.user?.uid || "",
            },
            responses: data.responses ?? 0,
            likes: data.likes ?? 0,
          };
        });
        setProblems(problemsData);
      },
      (error) => {
        console.error("Error listening to problems:", error);
      }
    );

    setLoading(false);

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pid = searchParams.get("problem");
    if (!pid) {
      openedProblemFromQuery.current = false;
      return;
    }
    if (problems.length === 0 || openedProblemFromQuery.current) return;
    const match = problems.find((p) => p.id === pid);
    if (match) {
      openedProblemFromQuery.current = true;
      setSelectedProblem(match);
      setIsDialogOpen(true);
    }
  }, [problems, searchParams]);

  const handleHelpClick = (problem: Problem) => {
    setSelectedProblem(problem);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProblem(null);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("problem");
      return next;
    });
  };

  const filteredProblems = problems.filter((problem) =>
    selectedCategory === "All"
      ? true
      : problem.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const ease = [0.4, 0, 0.2, 1] as const;

  return (
    <div
      className={`bg-[#0A0D17] pt-[30px] min-h-screen pb-16 ${
        collapsed ? "pl-[74px] sm:pl-[96px]" : "pl-[220px] xl:pl-[280px]"
      } transition-all duration-300`}
    >
      <div className="max-w-[1400px] px-4 sm:px-6 lg:pl-6 lg:pr-8">
        {/* Top bar: title + dropdown */}
        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="flex items-start justify-between gap-4"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#7CDCBD]/15 border border-[#7CDCBD]/20 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-[#7CDCBD]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl font-bold text-white font-syncopate tracking-tight">
                Academic Center
              </h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                Post your problems and help others solve theirs
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Dropdown />
          </div>
        </motion.header>

        {/* Action row: post button + result count */}
        <motion.div
          className="mt-8 flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => navigate("/post-problem")}
              className="group relative flex items-center gap-2.5 rounded-xl bg-[#7CDCBD] text-[#0A0D17] font-semibold shadow-[0_0_20px_-4px_rgba(124,220,189,0.4)] hover:bg-[#5FBFAA] hover:shadow-[0_0_24px_-2px_rgba(124,220,189,0.5)] transition-all duration-300 ease-out h-11 px-5 border-0"
            >
              <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#0A0D17]/10">
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </span>
              <span>Post a Problem</span>
            </Button>
          </motion.div>
          <span className="text-sm text-gray-400 tabular-nums">
            {filteredProblems.length}{" "}
            {filteredProblems.length === 1 ? "problem" : "problems"}
            {selectedCategory !== "All" && (
              <span className="text-gray-500"> in {selectedCategory}</span>
            )}
          </span>
        </motion.div>

        {/* Filter pills */}
        <motion.nav
          className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-[#101320]/60 p-2"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12, ease }}
          aria-label="Filter problems by category"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-sm rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#7CDCBD] text-[#0A0D17] font-semibold shadow-[0_0_18px_-6px_rgba(124,220,189,0.6)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.nav>

        {/* Problems grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.04,
                  ease,
                }}
              >
                <HelpBoardCard
                  problem={problem}
                  onHelpClick={handleHelpClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filteredProblems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease }}
            className="mt-8 flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-white/10 bg-[#101320]/40 px-6 py-16"
          >
            <div className="w-12 h-12 rounded-full bg-[#7CDCBD]/10 flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-[#7CDCBD]" />
            </div>
            <p className="text-base font-medium text-white">
              No problems{" "}
              {selectedCategory === "All" ? "yet" : `in ${selectedCategory}`}
            </p>
            <p className="text-sm text-gray-400 mt-1 max-w-sm">
              {selectedCategory === "All"
                ? "Be the first to post a problem and start the conversation."
                : "Try a different category, or post a problem in this one."}
            </p>
          </motion.div>
        )}
      </div>

      {selectedProblem && (
        <ProblemChatDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          problem={selectedProblem}
        />
      )}
    </div>
  );
};

export default HelpBoard;

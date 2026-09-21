import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProblemChatDialog } from "./ProblemChatDialog";
import { HelpBoardCard } from "./HelpBoardCard";
import { Button } from "./ui/button";
import { Plus, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";
import Dropdown from "./Dropdown";
import { AppPage, PageHeader } from "./ui/app-shell";
import { SegmentedControl } from "./ui/segmented-control";
import { EmptyState } from "./ui/states";

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
    <AppPage width="wide">
      <PageHeader
        margin="academic center"
        title="Academic Center"
        description="Post a question. People in your school pick it up."
        actions={<Dropdown />}
      />

      <div className="ruled">
        <div className="ruled-margin">
          <span className="numeric">
            {filteredProblems.length}
          </span>
          <br />
          {filteredProblems.length === 1 ? "post" : "posts"}
          {selectedCategory !== "All" && (
            <>
              <br />
              {selectedCategory}
            </>
          )}
        </div>
        <div className="ruled-body">
          <motion.div
            className="flex flex-wrap items-center justify-between gap-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={() => navigate("/post-problem")}>
                <Plus strokeWidth={2.25} />
                Post a problem
              </Button>
            </motion.div>
            <SegmentedControl
              aria-label="Filter problems by category"
              value={selectedCategory}
              onChange={setSelectedCategory}
              size="sm"
              options={categories.map((cat) => ({ value: cat, label: cat }))}
            />
          </motion.div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
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

          {filteredProblems.length === 0 && (
            <EmptyState
              className="mt-8"
              icon={Search}
              title={
                selectedCategory === "All"
                  ? "No problems yet"
                  : `Nothing in ${selectedCategory}`
              }
              description={
                selectedCategory === "All"
                  ? "Post the first one and start the conversation."
                  : "Try another subject, or post something in this one."
              }
              action={
                <Button onClick={() => navigate("/post-problem")}>
                  <Plus strokeWidth={2.25} />
                  Post a problem
                </Button>
              }
            />
          )}
        </div>
      </div>

      {selectedProblem && (
        <ProblemChatDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          problem={selectedProblem}
        />
      )}
    </AppPage>
  );
};

export default HelpBoard;

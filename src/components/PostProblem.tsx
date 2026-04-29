import { useRef, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { db, app } from "../lib/firebase";
import { getAuth } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { incrementUsage } from "@/lib/stats";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  courseGroups,
  type CourseCategory,
  type Course,
} from "@/components/ui/courseData";
import { resolveUserAvatarUrl } from "@/lib/profileVisuals";

const fieldClass =
  "bg-[#0d1019] border-white/10 text-white placeholder:text-gray-500 rounded-xl focus-visible:ring-2 focus-visible:ring-[#7cdcbd]/35 focus-visible:border-[#7cdcbd]/25";

const selectContentClass =
  "bg-[#11141d] text-white border border-white/10 rounded-xl shadow-xl z-50";

const PostProblem = () => {
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CourseCategory | "">(
    "",
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | "">("");
  const [urgency, setUrgency] = useState<string>("low");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as CourseCategory);
    setSelectedCourse("");
  };

  const handleCourseChange = (value: string) => {
    setSelectedCourse(value as Course);
  };

  const handlePostProblem = async () => {
    if (submittingRef.current) return;

    const auth = getAuth();
    const user = auth.currentUser;

    if (!title || !description || !selectedCategory || !selectedCourse) {
      alert("Please fill in all required fields.");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    let avatar = "";
    if (user?.uid) {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        avatar = resolveUserAvatarUrl(data) || "";
      }
    }

    try {
      await addDoc(collection(db, "problems"), {
        title,
        description,
        category: selectedCategory,
        course: selectedCourse,
        urgency,
        image: selectedImage || null,
        createdAt: serverTimestamp(),
        user: {
          name: user?.displayName || "Anonymous",
          avatar,
          uid: user?.uid || "",
        },
        responses: 0,
      });
      await incrementUsage(db, "helpBoardUsed");
      navigate("/helpboard");
    } catch (error) {
      console.error("Error posting problem:", error);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0D17] text-white pb-20">
      <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6 sm:pt-10">
        <Button
          type="button"
          variant="ghost"
          className="mb-8 -ml-2 gap-2 text-gray-400 hover:text-white hover:bg-white/5"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          <ArrowLeft size={18} />
          Back
        </Button>

        <header className="mb-8">
          <h1 className="text-3xl font-bold font-syncopate tracking-tight text-white sm:text-4xl">
            Post a Problem
          </h1>
          <p className="mt-2 text-muted-foreground text-sm sm:text-base max-w-lg">
            Share what you’re stuck on — peers in Academic Center can jump in
            and help.
          </p>
        </header>

        <div className="rounded-2xl border border-white/[0.08] bg-[#11141d]/90 p-6 sm:p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.55)]">
          <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm text-gray-300">
              Title
            </Label>
            <Input
              id="title"
              placeholder="What's your problem about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
              className={fieldClass}
            />
          </div>

          {/* Category and Course */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm text-gray-300">
                Category
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                disabled={isSubmitting}
              >
                <SelectTrigger id="category" className={fieldClass}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {Object.keys(courseGroups).map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="cursor-pointer focus:bg-white/10 focus:text-white"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course" className="text-sm text-gray-300">
                Course
              </Label>
              <Select
                value={selectedCourse}
                onValueChange={handleCourseChange}
                disabled={!selectedCategory || isSubmitting}
              >
                <SelectTrigger id="course" className={fieldClass}>
                  <SelectValue
                    placeholder={
                      selectedCategory
                        ? "Select course"
                        : "Select a category first"
                    }
                  />
                </SelectTrigger>
                <SelectContent className={selectContentClass}>
                  {selectedCategory &&
                    courseGroups[selectedCategory].map((course) => (
                      <SelectItem
                        key={course}
                        value={course}
                        className="cursor-pointer focus:bg-white/10 focus:text-white"
                      >
                        {course}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-2">
            <Label htmlFor="urgency" className="text-sm text-gray-300">
              Urgency
            </Label>
            <Select
              value={urgency}
              onValueChange={setUrgency}
              disabled={isSubmitting}
            >
              <SelectTrigger id="urgency" className={fieldClass}>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem
                  value="low"
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  Low
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="high"
                  className="cursor-pointer focus:bg-white/10 focus:text-white"
                >
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your problem in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className={`min-h-[200px] ${fieldClass} resize-y`}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-sm text-gray-300">Image (optional)</Label>
            <div className="rounded-xl border border-dashed border-white/15 bg-[#0d1019]/80 overflow-hidden">
            <FileUpload
              onChange={async (files) => {
                if (!files?.length) return;
                const file = files[0];
                const isImage = file.type.startsWith("image/");
                if (!isImage) {
                  setUploadError(
                    "Please upload an image file (e.g. JPEG, PNG).",
                  );
                  return;
                }
                setUploadError(null);
                setIsUploading(true);
                try {
                  const storage = getStorage(app);
                  const currentUser = getAuth().currentUser;
                  const path = `problemImages/${
                    currentUser?.uid ?? "anon"
                  }/${Date.now()}-${file.name}`;
                  const storageRef = ref(storage, path);
                  await uploadBytes(storageRef, file);
                  const downloadURL = await getDownloadURL(storageRef);
                  setSelectedImage(downloadURL);
                } catch (err) {
                  console.error("Upload failed:", err);
                  setUploadError(
                    err instanceof Error
                      ? err.message
                      : "Upload failed. Try again.",
                  );
                  setSelectedImage(null);
                } finally {
                  setIsUploading(false);
                }
              }}
            />
            </div>
            {isUploading && (
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading image…
              </p>
            )}
            {uploadError && (
              <p className="text-sm text-red-400/95">{uploadError}</p>
            )}
            {selectedImage && (
              <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-xl border border-white/10">
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/[0.06] pt-6 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
              className="rounded-xl border-white/15 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePostProblem}
              disabled={isSubmitting || isUploading}
              className="group inline-flex items-center justify-center rounded-xl bg-[#7CDCBD] px-6 font-semibold text-[#0A0D17] shadow-[0_0_24px_-8px_rgba(124,220,189,0.45)] transition hover:bg-[#5FBFAA] disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting…
                </>
              ) : (
                "Post problem"
              )}
            </Button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostProblem;

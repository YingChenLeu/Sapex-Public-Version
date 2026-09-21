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
import { AppPage, PageHeader } from "@/components/ui/app-shell";
import { InlineError } from "@/components/ui/states";

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
        avatar = userDoc.data().profilePicture || "";
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
    <AppPage width="narrow">
      <Button
        type="button"
        variant="ghost"
        className="mb-6 -ml-2"
        onClick={() => navigate(-1)}
        disabled={isSubmitting}
      >
        <ArrowLeft size={18} />
        Back
      </Button>

      <PageHeader
        margin="academic center"
        title="Post a problem"
        description="Share what you’re stuck on. People in your school can jump in."
        className="mb-8"
      />

      <div className="border border-rule bg-notice p-6 sm:p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="What's your problem about?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Category and Course */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                disabled={isSubmitting}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(courseGroups).map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="cursor-pointer"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <Select
                value={selectedCourse}
                onValueChange={handleCourseChange}
                disabled={!selectedCategory || isSubmitting}
              >
                <SelectTrigger id="course">
                  <SelectValue
                    placeholder={
                      selectedCategory
                        ? "Select course"
                        : "Select a category first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory &&
                    courseGroups[selectedCategory].map((course) => (
                      <SelectItem
                        key={course}
                        value={course}
                        className="cursor-pointer"
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
            <Label htmlFor="urgency">Urgency</Label>
            <Select
              value={urgency}
              onValueChange={setUrgency}
              disabled={isSubmitting}
            >
              <SelectTrigger id="urgency">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="low"
                  className="cursor-pointer"
                >
                  Low
                </SelectItem>
                <SelectItem
                  value="medium"
                  className="cursor-pointer"
                >
                  Medium
                </SelectItem>
                <SelectItem
                  value="high"
                  className="cursor-pointer"
                >
                  High
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your problem in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isSubmitting}
              className="min-h-[200px]"
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Image (optional)</Label>
            <div className="overflow-hidden border border-dashed border-rule-strong bg-recess">
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
              <p className="flex items-center gap-2 text-sm text-chalk-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading image…
              </p>
            )}
            {uploadError && <InlineError>{uploadError}</InlineError>}
            {selectedImage && (
              <div className="relative mt-3 aspect-video w-full overflow-hidden border border-rule">
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse gap-3 border-t border-rule pt-6 sm:flex-row sm:justify-end sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handlePostProblem}
              disabled={isSubmitting || isUploading}
              loading={isSubmitting}
            >
              {isSubmitting ? "Posting…" : "Post problem"}
            </Button>
          </div>
        </div>
      </div>
    </AppPage>
  );
};

export default PostProblem;

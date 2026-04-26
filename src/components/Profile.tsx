import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db, app } from "@/lib/firebase";
import { useSidebar } from "../components/SideBar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Save,
  User,
  Brain,
  Camera,
  Mail,
  Hash,
  MessageCircle,
  Shield,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    userId: "",
    email: "",
    bio: "",
    profilePicture: "",
    theme: "system",
    helped: 0,
    posted: 0,
    joined: "",
    reputation: 0,
    helper: false,
    bigFivePersonality: {
      Extraversion: 0,
      Agreeableness: 0,
      Conscientiousness: 0,
      Neuroticism: 0,
      Openness: 0,
    },
  });

  const [showHelperDialog, setShowHelperDialog] = useState(false);
  const [activatingHelper, setActivatingHelper] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setProfile({
            name: userData.username || "",
            userId: user.uid,
            email: user.email || "",
            bio: userData.bio || "",
            profilePicture: userData.profilePicture || "",
            theme: userData.theme || "system",
            helped: userData.helped || 0,
            posted: userData.posted || 0,
            joined: userData.joined || "",
            reputation: userData.reputation || 0,
            helper: userData.helper || false,
            bigFivePersonality: userData.bigFivePersonality || {
              Extraversion: 0,
              Agreeableness: 0,
              Conscientiousness: 0,
              Neuroticism: 0,
              Openness: 0,
            },
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
          username: profile.name,
          bio: profile.bio,
          profilePicture: profile.profilePicture,
          theme: profile.theme,
        });
        await updateProfile(user, {
          displayName: profile.name,
          photoURL: profile.profilePicture,
        });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPEG, PNG, etc.).");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    setUploadingPhoto(true);
    try {
      const storage = getStorage(app);
      const path = `profilePictures/${user.uid}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { profilePicture: downloadURL });
      await updateProfile(user, { photoURL: downloadURL });
      setProfile((prev) => ({ ...prev, profilePicture: downloadURL }));
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error("Profile picture upload failed:", err);
      toast.error("Failed to update photo. Try again.");
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const { collapsed } = useSidebar();
  const navigate = useNavigate();

  const handlePersonalityQuiz = () => {
    navigate("/personality-quiz");
  };

  const handleBecomeHelper = async () => {
    try {
      setActivatingHelper(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        helper: true,
        helperActivatedAt: serverTimestamp(),
      });

      setProfile((prev) => ({ ...prev, helper: true }));
      toast.success("You are now a Sapex Helper.");
    } catch (error) {
      console.error("Error activating helper:", error);
      toast.error("Failed to activate Sapex Helper.");
    } finally {
      setActivatingHelper(false);
      setShowHelperDialog(false);
    }
  };

  const handleDeactivateHelper = async () => {
    try {
      setActivatingHelper(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { helper: false });

      setProfile((prev) => ({ ...prev, helper: false }));
      toast.success("Sapex Helper deactivated.");
    } catch (error) {
      console.error("Error deactivating helper:", error);
      toast.error("Failed to deactivate Sapex Helper.");
    } finally {
      setActivatingHelper(false);
      setShowDeactivateDialog(false);
    }
  };

  const hasPersonalityData =
    profile.bigFivePersonality &&
    Object.values(profile.bigFivePersonality).some((score) => score > 0);

  return (
    <div
      className={`bg-[#0A0D17] min-h-screen transition-all duration-300 ${
        collapsed ? "pl-[74px] sm:pl-[92px]" : "pl-[220px] xl:pl-[280px]"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        {/* Hero / header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white font-syncopate tracking-tight">
            Profile
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Profile card: avatar + info */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-white/10 bg-[#12162A]/90 overflow-hidden">
            <form onSubmit={handleSubmit}>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                  {/* Avatar with edit overlay */}
                  <div className="relative group shrink-0">
                    <Avatar className="h-28 w-28 rounded-2xl border-2 border-white/10 ring-2 ring-[#7CDCBD]/20">
                      {profile.profilePicture &&
                      profile.profilePicture.startsWith("http") ? (
                        <AvatarImage
                          src={profile.profilePicture}
                          alt={profile.name}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="rounded-2xl bg-[#1e2433] text-[#7CDCBD] text-3xl">
                          <User className="w-12 h-12" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-wait"
                      aria-label="Change profile picture"
                    >
                      {uploadingPhoto ? (
                        <span className="text-xs text-white font-medium">
                          Uploading…
                        </span>
                      ) : (
                        <Camera className="w-8 h-8 text-white" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <CardTitle className="text-xl text-white font-syncopate">
                        {profile.name || "Your name"}
                      </CardTitle>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white hover:border-[#7CDCBD]/40"
                      >
                        <Edit className="h-3.5 w-3.5 mr-1.5" />
                        Edit profile
                      </Button>
                    </div>
                    <CardDescription className="text-gray-400 text-sm">
                      Update your display name and bio below.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-gray-400 font-medium text-sm"
                    >
                      Display name
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      disabled={!isEditing}
                      className="bg-[#0A0D17] border-white/15 text-white placeholder:text-gray-500 focus-visible:ring-[#7CDCBD]/50 focus-visible:border-[#7CDCBD]/50 disabled:opacity-80"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="userId"
                      className="text-gray-400 font-medium text-sm flex items-center gap-1.5"
                    >
                      <Hash className="w-3.5 h-3.5" />
                      User ID
                    </Label>
                    <Input
                      id="userId"
                      value={profile.userId}
                      disabled
                      className="bg-[#0A0D17]/50 border-white/10 text-gray-400 text-sm font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-400 font-medium text-sm flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-[#0A0D17]/50 border-white/10 text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-gray-400 font-medium text-sm"
                  >
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    placeholder="A short bio about you..."
                    className="bg-[#0A0D17] border-white/15 text-white placeholder:text-gray-500 focus-visible:ring-[#7CDCBD]/50 focus-visible:border-[#7CDCBD]/50 resize-none"
                  />
                </div>
              </CardContent>

              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <CardFooter className="flex justify-end gap-2 pt-0">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="text-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#7CDCBD] hover:bg-[#5FBFAA] text-[#0A0D17] font-medium"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save changes
                      </Button>
                    </CardFooter>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Card>
        </motion.div>

        <div className="grid gap-6 mt-8 lg:grid-cols-2">
          {/* Personality */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-white/10 bg-[#12162A]/90 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg text-white font-syncopate flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#7CDCBD]" />
                  Personality
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your Big Five traits from the quiz
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {hasPersonalityData ? (
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="75%"
                        data={Object.entries(profile.bigFivePersonality).map(
                          ([trait, score]) => ({
                            trait: trait.slice(0),
                            value: Math.min(score * 120, 100),
                          })
                        )}
                      >
                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                        <PolarAngleAxis
                          dataKey="trait"
                          tick={{ fill: "#9ca3af", fontSize: 11 }}
                        />
                        <Radar
                          name="You"
                          dataKey="value"
                          stroke="#7CDCBD"
                          fill="#7CDCBD"
                          fillOpacity={0.35}
                          strokeWidth={1.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    You haven’t taken the personality quiz yet.
                  </p>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handlePersonalityQuiz}
                  className="w-full bg-[#12162A] border border-[#7CDCBD]/40 text-[#7CDCBD] hover:bg-[#7CDCBD]/10 font-medium"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  {hasPersonalityData ? "Retake quiz" : "Take personality quiz"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-white/10 bg-[#12162A]/90 h-full">
              <CardHeader>
                <CardTitle className="text-lg text-white font-syncopate flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#7CDCBD]" />
                  Activity
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your help board activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-0">
                <div className="flex items-center justify-between py-4 border-b border-white/10">
                  <span className="text-gray-400">Problems helped</span>
                  <span className="text-xl font-semibold text-white tabular-nums">
                    {profile.helped}
                  </span>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-white/10">
                  <span className="text-gray-400">Problems posted</span>
                  <span className="text-xl font-semibold text-white tabular-nums">
                    {profile.posted}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sapex Helper */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={profile.helper ? "active" : "inactive"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex flex-wrap items-center gap-3"
            >
              {profile.helper ? (
                <Button
                  onClick={() => setShowDeactivateDialog(true)}
                  className="bg-[#7CDCBD]/20 text-[#7CDCBD] hover:bg-[#7CDCBD]/30 border border-[#7CDCBD]/40 rounded-full px-6 py-2.5"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Sapex Helper · Active
                </Button>
              ) : (
                <Button
                  onClick={() => setShowHelperDialog(true)}
                  className="bg-[#7CDCBD] hover:bg-[#5FBFAA] text-[#0A0D17] font-medium rounded-full px-6 py-2.5"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Become a Sapex Helper
                </Button>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="text-xs text-gray-500 max-w-md">
            Sapex Helpers support others with respect and empathy. This is a
            space for guidance and learning, not social media.
          </p>
        </motion.div>
      </div>

      {/* Dialogs */}
      <Dialog open={showHelperDialog} onOpenChange={setShowHelperDialog}>
        <DialogContent className="border-white/10 bg-[#12162A] text-white">
          <DialogHeader>
            <DialogTitle className="font-syncopate">
              Become a Sapex Helper
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              You’ll support students respectfully and help them through tough
              times. Be helpful and kind to the best of your ability.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowHelperDialog(false)}
              className="border-white/20 text-gray-300 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleBecomeHelper}
              disabled={activatingHelper}
              className="bg-[#7CDCBD] hover:bg-[#5FBFAA] text-[#0A0D17]"
            >
              {activatingHelper ? "Activating…" : "I agree"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDeactivateDialog}
        onOpenChange={setShowDeactivateDialog}
      >
        <DialogContent className="border-white/10 bg-[#12162A] text-white">
          <DialogHeader>
            <DialogTitle className="font-syncopate">
              Deactivate Sapex Helper
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              You’ll no longer appear as a Helper. You can turn it back on
              anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDeactivateDialog(false)}
              className="border-white/20 text-gray-300 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeactivateHelper}
              disabled={activatingHelper}
              variant="destructive"
              className="bg-red-600/90 hover:bg-red-600 text-white"
            >
              {activatingHelper ? "Deactivating…" : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;

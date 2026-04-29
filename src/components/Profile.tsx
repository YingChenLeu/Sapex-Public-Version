import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useSidebar } from "../components/SideBar";
import {
  Award,
  BarChart3,
  Brain,
  Calendar,
  Hash,
  Lock,
  Mail,
  MessageCircle,
  Shield,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { courseGroups } from "@/components/ui/courseData";
import { resolveUserAvatarUrl } from "../lib/profileVisuals";

const DEFAULT_PERSONALITY = {
  Extraversion: 0,
  Agreeableness: 0,
  Conscientiousness: 0,
  Neuroticism: 0,
  Openness: 0,
};

const Profile = () => {
  const { collapsed } = useSidebar();

  const [profile, setProfile] = useState({
    username: "",
    userId: "",
    email: "",
    helper: false,
    bigFivePersonality: { ...DEFAULT_PERSONALITY },
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [monthlyCategoryCounts, setMonthlyCategoryCounts] = useState<
    Record<string, Record<string, number>>
  >({});
  const [totalContributions, setTotalContributions] = useState(0);
  const [monthlyContributions, setMonthlyContributions] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const googlePhoto = user.photoURL || null;
          const resolvedAvatar = googlePhoto || resolveUserAvatarUrl(userData);
          setProfile({
            username: userData.username || "",
            userId: user.uid,
            email: user.email || "",
            helper: userData.helper === true,
            bigFivePersonality: {
              ...DEFAULT_PERSONALITY,
              ...(userData.bigFivePersonality || {}),
            },
          });
          setAvatarUrl(resolvedAvatar);

          if (
            googlePhoto &&
            (userData.profilePicture ?? null) !== googlePhoto
          ) {
            try {
              await updateDoc(userDocRef, { profilePicture: googlePhoto });
            } catch (err) {
              console.warn("Failed syncing Google profile picture:", err);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      }

      try {
        const contributionsRef = collection(
          db,
          "users",
          user.uid,
          "contributions",
        );
        const snapshot = await getDocs(contributionsRef);

        const monthlyCounts: Record<string, Record<string, number>> = {};
        let total = 0;
        let monthlyTotal = 0;
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        snapshot.forEach((d) => {
          const data = d.data();
          const category = data.category;
          const timestamp = data.timestamp?.toDate?.();
          if (category && timestamp) {
            const month = `${timestamp.getFullYear()}-${String(
              timestamp.getMonth() + 1,
            ).padStart(2, "0")}`;
            if (!monthlyCounts[month]) monthlyCounts[month] = {};
            monthlyCounts[month][category] =
              (monthlyCounts[month][category] || 0) + 1;
            total += 1;
            if (timestamp >= thirtyDaysAgo) monthlyTotal += 1;
          }
        });

        setMonthlyCategoryCounts(monthlyCounts);
        setTotalContributions(total);
        setMonthlyContributions(monthlyTotal);
      } catch (err) {
        console.error("Failed to load contributions:", err);
      }
    });

    return () => unsubscribe();
  }, []);

  const hasPersonalityData = Object.values(profile.bigFivePersonality).some(
    (score) => score > 0,
  );

  const chartData = Object.entries(monthlyCategoryCounts)
    .map(([month, categories]) => ({
      name: month,
      contributions: Object.values(categories).reduce((a, b) => a + b, 0),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const categorySums: Record<string, number> = {};
  Object.values(monthlyCategoryCounts).forEach((categories) => {
    for (const [cat, count] of Object.entries(categories)) {
      categorySums[cat] = (categorySums[cat] || 0) + count;
    }
  });
  const sortedCategories = Object.entries(categorySums).sort(
    (a, b) => b[1] - a[1],
  );
  const mostActiveLabel =
    sortedCategories.length > 0
      ? `${sortedCategories[0][0]} (${sortedCategories[0][1]})`
      : "No contributions yet";

  const maxCategoryCount = Math.max(
    1,
    ...Object.keys(courseGroups).map((cat) =>
      Object.values(monthlyCategoryCounts).reduce(
        (sum, monthData) => sum + (monthData[cat] || 0),
        0,
      ),
    ),
  );

  return (
    <div
      className={`bg-[#0A0D17] min-h-screen transition-all duration-300 ${
        collapsed ? "pl-[74px] sm:pl-[92px]" : "pl-[220px] xl:pl-[280px]"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:pl-6 lg:pr-8 pt-8 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white font-syncopate tracking-tight">
            Profile
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Your account, personality, and contribution history.
          </p>
        </motion.div>

        {/* Identity card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card className="border-white/10 bg-[#12162A]/90 overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <Avatar className="h-24 w-24 rounded-2xl border-2 border-white/10 ring-2 ring-[#7CDCBD]/20 shrink-0 overflow-hidden">
                  {avatarUrl ? (
                    <AvatarImage
                      src={avatarUrl}
                      alt={profile.username || "User"}
                    />
                  ) : (
                    <AvatarFallback className="rounded-2xl text-white text-3xl">
                      <User className="w-10 h-10" />
                    </AvatarFallback>
                  )}
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <CardTitle className="text-2xl text-white font-syncopate">
                      {profile.username || "Unnamed"}
                    </CardTitle>
                    {profile.helper && (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7CDCBD]/40 bg-[#7CDCBD]/15 px-2.5 py-0.5 text-[12px] font-medium text-[#7CDCBD]">
                        <Shield className="w-3 h-3" />
                        Sapex Helper
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    Profile photo syncs with your Google icon. Uploaded icons
                    are not supported.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-[#0A0D17]/60 px-4 py-3">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" />
                  Username
                </div>
                <p className="text-white font-medium mt-1 truncate">
                  {profile.username || "—"}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#0A0D17]/60 px-4 py-3">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider">
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </div>
                <p className="text-white font-medium mt-1 truncate">
                  {profile.email || "—"}
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-[#0A0D17]/60 px-4 py-3 sm:col-span-2">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-wider">
                  <Hash className="w-3.5 h-3.5" />
                  User ID
                </div>
                <p className="text-gray-400 font-mono text-sm mt-1 truncate">
                  {profile.userId || "—"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {[
            {
              icon: MessageCircle,
              label: "Total helped",
              hint: "All-time contributions",
              value: totalContributions,
              delay: 0.05,
            },
            {
              icon: Calendar,
              label: "This month",
              hint: "Last 30 days",
              value: monthlyContributions,
              delay: 0.1,
            },
            {
              icon: Award,
              label: "Most active",
              hint: "Your top category",
              value: mostActiveLabel,
              delay: 0.15,
              isText: true,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: stat.delay }}
              >
                <Card className="relative border-white/10 bg-[#12162A]/90 overflow-hidden h-full hover:border-[#7CDCBD]/30 transition-colors">
                  <div
                    aria-hidden
                    className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#7CDCBD]/5 blur-2xl"
                  />
                  <CardHeader className="pb-2 relative">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-gray-300 font-syncopate uppercase tracking-wider">
                        {stat.label}
                      </CardTitle>
                      <div className="w-9 h-9 rounded-lg bg-[#7CDCBD]/10 flex items-center justify-center text-[#7CDCBD]">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <CardDescription className="text-gray-500 text-xs mt-1">
                      {stat.hint}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    {stat.isText ? (
                      <p className="text-lg font-semibold text-white truncate">
                        {stat.value}
                      </p>
                    ) : (
                      <p className="text-3xl font-bold text-white tabular-nums">
                        {stat.value}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Personality */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="border-white/10 bg-[#12162A]/90 h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 text-[#7CDCBD]">
                  <Brain className="w-5 h-5" />
                  <CardTitle className="text-lg text-white font-syncopate">
                    Personality
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Your Big Five traits
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {hasPersonalityData ? (
                  <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="75%"
                        data={Object.entries(profile.bigFivePersonality).map(
                          ([trait, score]) => ({
                            trait,
                            value: Math.min(score * 120, 100),
                          }),
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
                  <div className="flex-1 flex flex-col items-center justify-center gap-3 py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#7CDCBD]/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-[#7CDCBD]" />
                    </div>
                    <p className="text-sm text-gray-300">
                      You haven’t taken the personality test yet.
                    </p>
                    <p className="text-xs text-gray-500 max-w-[220px]">
                      Answer 44 quick questions to unlock your Big Five chart.
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <p className="text-[12px] text-gray-500 leading-snug">
                    {hasPersonalityData
                      ? "Want a more accurate read? You can retake the test anytime."
                      : "About 5 minutes."}
                  </p>
                  <Link
                    to="/personality-quiz"
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-[#7CDCBD] hover:bg-[#5FBFAA] text-[#0A0D17] text-xs font-semibold px-3 py-2 transition-colors"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    {hasPersonalityData ? "Retake test" : "Take the test"}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contribution history */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2"
          >
            <Card className="border-white/10 bg-[#12162A]/90 h-full flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 text-[#7CDCBD]">
                  <TrendingUp className="w-5 h-5" />
                  <CardTitle className="text-lg text-white font-syncopate">
                    Contribution history
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Problems helped over time
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 min-h-[280px]">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="contribGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#7CDCBD"
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor="#7CDCBD"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.06)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "#9ca3af", fontSize: 11 }}
                        axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
                        tickLine={{ stroke: "rgba(255,255,255,0.06)" }}
                      />
                      <YAxis
                        tick={{ fill: "#9ca3af", fontSize: 11 }}
                        axisLine={false}
                        tickLine={{ stroke: "rgba(255,255,255,0.06)" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#12162A",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                        labelStyle={{ color: "#e5e7eb" }}
                        formatter={(value: number) => [value, "Contributions"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="contributions"
                        stroke="#7CDCBD"
                        strokeWidth={2}
                        fill="url(#contribGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[280px] flex items-center justify-center text-gray-500 text-sm">
                    No contribution data yet. Help someone on the help board to
                    see your history here.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* By category */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Card className="border-white/10 bg-[#12162A]/90">
            <CardHeader>
              <div className="flex items-center gap-2 text-[#7CDCBD]">
                <BarChart3 className="w-5 h-5" />
                <CardTitle className="text-lg text-white font-syncopate">
                  By category
                </CardTitle>
              </div>
              <CardDescription className="text-gray-400">
                Where you’ve helped the most
              </CardDescription>
            </CardHeader>
            <CardContent>
              {totalContributions === 0 ? (
                <div className="min-h-[160px] flex items-center justify-center text-center text-gray-500 text-sm rounded-xl border border-dashed border-white/10">
                  No category data yet.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
                  {Object.keys(courseGroups)
                    .map((category) => {
                      const count = Object.values(monthlyCategoryCounts).reduce(
                        (sum, monthData) => sum + (monthData[category] || 0),
                        0,
                      );
                      return { category, count };
                    })
                    .sort((a, b) => b.count - a.count)
                    .map(({ category, count }) => {
                      const pct =
                        maxCategoryCount > 0
                          ? (count / maxCategoryCount) * 100
                          : 0;
                      const isTop = count > 0 && count === maxCategoryCount;

                      return (
                        <div key={category} className="space-y-1.5">
                          <div className="flex items-center justify-between gap-3">
                            <span
                              className={`text-sm truncate ${
                                isTop
                                  ? "text-white font-medium"
                                  : "text-gray-300"
                              }`}
                            >
                              {category}
                            </span>
                            <span
                              className={`text-sm tabular-nums shrink-0 ${
                                isTop
                                  ? "text-[#7CDCBD] font-semibold"
                                  : "text-gray-400"
                              }`}
                            >
                              {count}
                            </span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${
                                isTop ? "bg-[#7CDCBD]" : "bg-[#7CDCBD]/50"
                              }`}
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.6,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;

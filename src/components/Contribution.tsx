import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { courseGroups } from "@/components/ui/courseData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSidebar } from "../components/SideBar";
import {
  MessageCircle,
  Calendar,
  Award,
  TrendingUp,
  BarChart3,
} from "lucide-react";

const Contributions = () => {
  const [monthlyCategoryCounts, setMonthlyCategoryCounts] = useState<
    Record<string, Record<string, number>>
  >({});
  const [totalContributions, setTotalContributions] = useState(0);
  const [monthlyContributions, setMonthlyContributions] = useState(0);

  useEffect(() => {
    const fetchContributions = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const contributionsRef = collection(
        db,
        "users",
        user.uid,
        "contributions"
      );
      const snapshot = await getDocs(contributionsRef);

      const monthlyCounts: Record<string, Record<string, number>> = {};
      let total = 0;
      let monthlyTotal = 0;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      snapshot.forEach((doc) => {
        const data = doc.data();
        const category = data.category;
        const timestamp = data.timestamp?.toDate?.();
        if (category && timestamp) {
          const month = `${timestamp.getFullYear()}-${String(
            timestamp.getMonth() + 1
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
    };

    fetchContributions();
  }, []);

  const { collapsed } = useSidebar();

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
  const mostActive = Object.entries(categorySums).sort((a, b) => b[1] - a[1]);
  const mostActiveLabel =
    mostActive.length > 0
      ? `${mostActive[0][0]} (${mostActive[0][1]})`
      : "No contributions yet";

  const maxCategoryCount = Math.max(
    1,
    ...Object.keys(courseGroups).map((cat) =>
      Object.values(monthlyCategoryCounts).reduce(
        (sum, monthData) => sum + (monthData[cat] || 0),
        0
      )
    )
  );

  return (
    <div
      className={`bg-[#0A0D17] min-h-screen transition-all duration-300 ${
        collapsed ? "pl-[74px] sm:pl-[92px]" : "pl-[220px] xl:pl-[280px]"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white font-syncopate tracking-tight">
            Contributions
          </h1>
          <p className="text-gray-400 mt-1 text-sm">
            Your impact helping others on the help board
          </p>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="border-white/10 bg-[#12162A]/90 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-[#7CDCBD]">
                  <MessageCircle className="w-5 h-5" />
                  <CardTitle className="text-base font-medium text-white font-syncopate">
                    Total helped
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400 text-sm">
                  All-time contributions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white tabular-nums">
                  {totalContributions}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-white/10 bg-[#12162A]/90 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-[#7CDCBD]">
                  <Calendar className="w-5 h-5" />
                  <CardTitle className="text-base font-medium text-white font-syncopate">
                    This month
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400 text-sm">
                  Last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-white tabular-nums">
                  {monthlyContributions}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="border-white/10 bg-[#12162A]/90 overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-[#7CDCBD]">
                  <Award className="w-5 h-5" />
                  <CardTitle className="text-base font-medium text-white font-syncopate">
                    Most active
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400 text-sm">
                  Top category this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-white truncate">
                  {mostActiveLabel}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
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

          {/* By category */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-white/10 bg-[#12162A]/90 h-full">
              <CardHeader>
                <div className="flex items-center gap-2 text-[#7CDCBD]">
                  <BarChart3 className="w-5 h-5" />
                  <CardTitle className="text-lg text-white font-syncopate">
                    By category
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Where you've helped the most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.keys(courseGroups).map((category) => {
                    const count = Object.values(monthlyCategoryCounts).reduce(
                      (sum, monthData) => sum + (monthData[category] || 0),
                      0
                    );
                    const pct =
                      maxCategoryCount > 0
                        ? (count / maxCategoryCount) * 100
                        : 0;

                    return (
                      <div key={category} className="flex items-center gap-3">
                        <span className="text-sm text-gray-300 w-28 shrink-0 truncate">
                          {category}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-[#7CDCBD]"
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{
                                duration: 0.6,
                                ease: "easeOut",
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-white tabular-nums w-8 text-right">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contributions;

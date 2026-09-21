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
import { AppPage, PageHeader } from "@/components/ui/app-shell";
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
    <AppPage width="wide">
      <PageHeader
        margin="contributions"
        title="Contributions"
        description="How often you’ve helped on the Academic Center."
      />

        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                <Card className="relative h-full overflow-hidden" interactive>
                  <div
                    aria-hidden
                    className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-[#7CDCBD]/5 blur-2xl"
                  />
                  <CardHeader className="pb-2 relative">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-chalk-2">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="flex h-full flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 text-[#7CDCBD]">
                  <TrendingUp className="w-5 h-5" />
                  <CardTitle className="text-lg">
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
                          backgroundColor: "#1C2140",
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
            <Card className="flex h-full flex-col">
              <CardHeader>
                <div className="flex items-center gap-2 text-[#7CDCBD]">
                  <BarChart3 className="w-5 h-5" />
                  <CardTitle className="text-lg">
                    By category
                  </CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  Where you've helped the most
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                {totalContributions === 0 ? (
                  <div className="h-full min-h-[200px] flex items-center justify-center text-center text-gray-500 text-sm rounded-xl border border-dashed border-white/10">
                    No category data yet.
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {Object.keys(courseGroups)
                      .map((category) => {
                        const count = Object.values(
                          monthlyCategoryCounts
                        ).reduce(
                          (sum, monthData) => sum + (monthData[category] || 0),
                          0
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
                                  isTop
                                    ? "bg-[#7CDCBD]"
                                    : "bg-[#7CDCBD]/50"
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
    </AppPage>
  );
};

export default Contributions;

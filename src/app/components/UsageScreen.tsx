import { useState } from "react";
import { ArrowDown, TrendingDown, Zap } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const dailyData = [
  { name: "Mon", kwh: 12 },
  { name: "Tue", kwh: 15 },
  { name: "Wed", kwh: 10 },
  { name: "Thu", kwh: 18 },
  { name: "Fri", kwh: 14 },
  { name: "Sat", kwh: 22 },
  { name: "Sun", kwh: 20 },
];

const weeklyData = [
  { name: "Week 1", kwh: 85 },
  { name: "Week 2", kwh: 92 },
  { name: "Week 3", kwh: 78 },
  { name: "Week 4", kwh: 95 },
];

const monthlyData = [
  { name: "Jan", kwh: 340 },
  { name: "Feb", kwh: 320 },
  { name: "Mar", kwh: 380 },
  { name: "Apr", kwh: 295 },
];

export default function UsageScreen() {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  const data = period === "daily" ? dailyData : period === "weekly" ? weeklyData : monthlyData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Electricity Usage</h1>
          <p className="text-muted-foreground">Track your consumption patterns</p>
        </div>

        <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-3xl p-6 shadow-[0_0_40px_rgba(255,165,0,0.3)]">
          <p className="text-sm text-white/80 mb-1">This Month</p>
          <div className="flex items-end gap-3 mb-4">
            <h2 className="text-4xl">295 kWh</h2>
            <div className="flex items-center gap-1 text-white/90 mb-2">
              <TrendingDown className="w-4 h-4" />
              <span className="text-sm">12% less</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Daily Avg</p>
              <p className="text-lg">9.8 kWh</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Peak Day</p>
              <p className="text-lg">22 kWh</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <p className="text-xs text-white/80 mb-1">Cost</p>
              <p className="text-lg">R 738</p>
            </div>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-3xl p-6 border border-border/50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg">Usage Chart</h3>
            <div className="flex bg-muted rounded-xl p-1">
              <button
                onClick={() => setPeriod("daily")}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  period === "daily"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setPeriod("weekly")}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  period === "weekly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setPeriod("monthly")}
                className={`px-3 py-1 rounded-lg text-sm transition-all ${
                  period === "monthly"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Monthly
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data} key={period}>
              <defs>
                <linearGradient id={`colorKwh-${period}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFA500" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFA500" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "12px",
                  color: "#f8fafc",
                }}
              />
              <Area
                type="monotone"
                dataKey="kwh"
                stroke="#FFA500"
                strokeWidth={3}
                fillOpacity={1}
                fill={`url(#colorKwh-${period})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="text-lg mb-4">Insights</h3>
          <div className="space-y-3">
            <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="mb-1">Great job!</p>
                <p className="text-sm text-muted-foreground">
                  You used 12% less electricity this week compared to last week.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="mb-1">Peak hours tip</p>
                <p className="text-sm text-muted-foreground">
                  Your highest usage is between 18:00-20:00. Consider shifting some activities to off-peak hours.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#FF6B00]/20 to-[#FFA500]/20 border border-primary/30 rounded-2xl p-4 flex gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                <ArrowDown className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="mb-1">Weekend usage</p>
                <p className="text-sm text-muted-foreground">
                  Your weekend usage is 35% higher than weekdays. This is normal for households.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

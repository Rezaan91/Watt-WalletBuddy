import { useNavigate } from "react-router";
import {
  Zap,
  TrendingUp,
  CreditCard,
  Lightbulb,
  MessageCircle,
  Wifi,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";
import wattcoinLogo from "../../imports/wattcoin-logo.png";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { t } = useTranslation();

  const transactions = [
    { id: 1, type: "purchase", amount: -350, description: "Electricity Purchase", date: "Today, 14:30", status: "success" },
    { id: 2, type: "reward", amount: 25, description: "WattCoins Earned", date: "Today, 10:15", status: "success" },
    { id: 3, type: "advance", amount: 500, description: "Advance Approved", date: "Yesterday", status: "success" },
    { id: 4, type: "purchase", amount: -200, description: "Electricity Purchase", date: "2 days ago", status: "success" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 space-y-6 max-w-md mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">{t("greeting")},</p>
            <h1 className="text-2xl">{user?.name || "User"}</h1>
          </div>
          <button
            onClick={() => navigate("/assistant")}
            className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,165,0,0.4)] hover:shadow-[0_0_30px_rgba(255,165,0,0.6)] transition-shadow"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-3xl p-6 shadow-[0_0_40px_rgba(255,165,0,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

          <div className="relative z-10">
            <p className="text-sm text-white/80 mb-1">Total Balance</p>
            <h2 className="text-4xl mb-4">R 2,450.00</h2>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
              <Zap className="w-4 h-4" />
              <span className="text-sm">~245 kWh available</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Wifi className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Smart Meter</p>
            <p className="text-lg">Live</p>
            <p className="text-xs text-muted-foreground mt-1">Last sync: 2 min ago</p>
          </div>

          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
            <img src={wattcoinLogo} alt="WattCoins" className="w-8 h-8 mb-2" />
            <p className="text-sm text-muted-foreground">WattCoins</p>
            <p className="text-lg">1,250 WC</p>
            <button
              onClick={() => navigate("/rewards")}
              className="text-xs text-primary mt-1 hover:underline"
            >
              View rewards
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-2xl p-4 shadow-[0_0_20px_rgba(255,165,0,0.3)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-white" />
              <span className="text-white">Active Advance</span>
            </div>
            <span className="text-green-400 text-sm font-semibold">R 500</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mb-2">
            <div className="bg-green-400 h-2 rounded-full w-[60%]" />
          </div>
          <p className="text-xs text-white/80">R 300 remaining · Due May 15</p>
        </div>

        <div>
          <h3 className="text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate("/buy")}
              className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-2xl p-4 text-left shadow-[0_0_20px_rgba(255,165,0,0.2)] hover:shadow-[0_0_30px_rgba(255,165,0,0.4)] transition-shadow"
            >
              <Zap className="w-8 h-8 mb-2" />
              <p>Buy Electricity</p>
            </button>

            <button
              onClick={() => navigate("/advance")}
              className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-2xl p-4 text-left hover:bg-card/70 transition-colors"
            >
              <CreditCard className="w-8 h-8 mb-2 text-primary" />
              <p>Request Advance</p>
            </button>

            <button
              onClick={() => navigate("/loadshedding")}
              className="bg-card/50 backdrop-blur-lg border border-border/50 rounded-2xl p-4 text-left hover:bg-card/70 transition-colors"
            >
              <Lightbulb className="w-8 h-8 mb-2 text-primary" />
              <p>Load Shedding</p>
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg">Recent Activity</h3>
            <button
              onClick={() => navigate("/transactions")}
              className="text-sm text-primary hover:underline"
            >
              View all
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "purchase"
                      ? "bg-red-500/20"
                      : transaction.type === "reward"
                      ? "bg-green-500/20"
                      : "bg-blue-500/20"
                  }`}
                >
                  {transaction.type === "purchase" ? (
                    <ArrowUpRight className="w-5 h-5 text-red-400" />
                  ) : transaction.type === "reward" ? (
                    <ArrowDownRight className="w-5 h-5 text-green-400" />
                  ) : (
                    <Clock className="w-5 h-5 text-blue-400" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-sm">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>

                <div
                  className={`${
                    transaction.amount > 0 ? "text-green-400" : "text-foreground"
                  }`}
                >
                  {transaction.amount > 0 ? "+" : ""}R {Math.abs(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

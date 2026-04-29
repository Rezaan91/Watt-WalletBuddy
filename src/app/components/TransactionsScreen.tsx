import { useState } from "react";
import { Filter, Zap, Gift, CreditCard, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from "lucide-react";

const allTransactions = [
  { id: 1, type: "purchase", category: "Electricity", amount: -350, date: "Apr 27, 2026", time: "14:30", status: "success" },
  { id: 2, type: "reward", category: "WattCoins", amount: 25, date: "Apr 27, 2026", time: "10:15", status: "success" },
  { id: 3, type: "advance", category: "Advance Disbursement", amount: 500, date: "Apr 26, 2026", time: "16:45", status: "success" },
  { id: 4, type: "purchase", category: "Electricity", amount: -200, date: "Apr 25, 2026", time: "09:20", status: "success" },
  { id: 5, type: "repayment", category: "Advance Repayment", amount: -100, date: "Apr 24, 2026", time: "12:00", status: "success" },
  { id: 6, type: "purchase", category: "Electricity", amount: -450, date: "Apr 23, 2026", time: "18:30", status: "success" },
  { id: 7, type: "reward", category: "WattCoins", amount: 15, date: "Apr 22, 2026", time: "08:45", status: "success" },
  { id: 8, type: "purchase", category: "Electricity", amount: -300, date: "Apr 21, 2026", time: "15:10", status: "pending" },
  { id: 9, type: "purchase", category: "Electricity", amount: -175, date: "Apr 20, 2026", time: "11:25", status: "success" },
  { id: 10, type: "advance", category: "Advance Request", amount: 0, date: "Apr 19, 2026", time: "14:00", status: "failed" },
];

export default function TransactionsScreen() {
  const [filter, setFilter] = useState<"all" | "purchases" | "advances" | "rewards">("all");

  const filteredTransactions = allTransactions.filter((transaction) => {
    if (filter === "all") return true;
    if (filter === "purchases") return transaction.type === "purchase";
    if (filter === "advances") return transaction.type === "advance" || transaction.type === "repayment";
    if (filter === "rewards") return transaction.type === "reward";
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "purchase":
        return Zap;
      case "reward":
        return Gift;
      case "advance":
      case "repayment":
        return CreditCard;
      default:
        return Zap;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return CheckCircle;
      case "pending":
        return Clock;
      case "failed":
        return XCircle;
      default:
        return CheckCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl mb-2">Transactions</h1>
          <p className="text-muted-foreground">View your activity history</p>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter by type</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`py-2 px-3 rounded-xl text-sm transition-all ${
                filter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("purchases")}
              className={`py-2 px-3 rounded-xl text-sm transition-all ${
                filter === "purchases"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Purchases
            </button>
            <button
              onClick={() => setFilter("advances")}
              className={`py-2 px-3 rounded-xl text-sm transition-all ${
                filter === "advances"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Advances
            </button>
            <button
              onClick={() => setFilter("rewards")}
              className={`py-2 px-3 rounded-xl text-sm transition-all ${
                filter === "rewards"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              Rewards
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTransactions.map((transaction) => {
            const Icon = getIcon(transaction.type);
            const StatusIcon = getStatusIcon(transaction.status);

            return (
              <div
                key={transaction.id}
                className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 hover:bg-card/70 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      transaction.type === "purchase" || transaction.type === "repayment"
                        ? "bg-red-500/20"
                        : transaction.type === "reward"
                        ? "bg-green-500/20"
                        : "bg-blue-500/20"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        transaction.type === "purchase" || transaction.type === "repayment"
                          ? "text-red-400"
                          : transaction.type === "reward"
                          ? "text-green-400"
                          : "text-blue-400"
                      }`}
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <p>{transaction.category}</p>
                        <p className="text-xs text-muted-foreground">
                          {transaction.date} · {transaction.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`${
                            transaction.amount > 0
                              ? "text-green-400"
                              : transaction.amount < 0
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {transaction.amount !== 0 && (transaction.amount > 0 ? "+" : "")}
                          {transaction.amount !== 0 ? `R ${Math.abs(transaction.amount)}` : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <StatusIcon
                        className={`w-4 h-4 ${
                          transaction.status === "success"
                            ? "text-green-400"
                            : transaction.status === "pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          transaction.status === "success"
                            ? "text-green-400"
                            : transaction.status === "pending"
                            ? "text-yellow-400"
                            : "text-red-400"
                        } capitalize`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}

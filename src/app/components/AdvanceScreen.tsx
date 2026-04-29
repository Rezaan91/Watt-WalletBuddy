import { useState } from "react";
import { ArrowLeft, CreditCard, Info, Check, Clock } from "lucide-react";
import { useNavigate } from "react-router";

export default function AdvanceScreen() {
  const [amount, setAmount] = useState("500");
  const [status, setStatus] = useState<"request" | "approved" | "active">("active");
  const navigate = useNavigate();

  const serviceFee = (parseFloat(amount) * 0.05).toFixed(2);
  const vat = (parseFloat(serviceFee) * 0.15).toFixed(2);
  const totalRepayment = (parseFloat(amount) + parseFloat(serviceFee) + parseFloat(vat)).toFixed(2);

  if (status === "active") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
        <div className="p-6 max-w-md mx-auto space-y-6">
          <div>
            <h1 className="text-3xl mb-2">Electricity Advance</h1>
            <p className="text-muted-foreground">Buy now, pay later for electricity</p>
          </div>

          <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-3xl p-6 shadow-[0_0_40px_rgba(255,165,0,0.3)]">
            <p className="text-sm text-white/80 mb-1">Active Advance</p>
            <h2 className="text-4xl mb-4">R 500</h2>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/80">Repayment Progress</span>
                  <span>R 200 / R 575</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className="bg-white h-3 rounded-full w-[35%]" />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Due Date</span>
                <span>May 15, 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Remaining</span>
                <span>R 375</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {}}
              className="w-full bg-card/50 backdrop-blur-lg border border-border/50 rounded-2xl p-4 text-left hover:bg-card/70 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p>Make a Payment</p>
                  <p className="text-sm text-muted-foreground">Pay off your advance early</p>
                </div>
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
            </button>

            <button
              onClick={() => setStatus("request")}
              className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
            >
              Request New Advance
            </button>
          </div>

          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
            <h3 className="mb-3">Repayment History</h3>
            <div className="space-y-3">
              {[
                { date: "Apr 20, 2026", amount: 100, status: "paid" },
                { date: "Apr 13, 2026", amount: 100, status: "paid" },
                { date: "May 6, 2026", amount: 100, status: "upcoming" },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        payment.status === "paid" ? "bg-green-400" : "bg-yellow-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm">{payment.date}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.status === "paid" ? "Paid" : "Upcoming"}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm">R {payment.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
        <div className="p-6 max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,165,0,0.4)]">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl mb-2 text-center">Advance Approved!</h1>
            <p className="text-muted-foreground text-center mb-8">
              Your electricity advance has been approved
            </p>

            <div className="w-full bg-card/50 backdrop-blur-lg rounded-3xl p-6 border border-border/50 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Advance Amount</span>
                  <span>R {amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Fee (5%)</span>
                  <span>R {serviceFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">VAT (15%)</span>
                  <span>R {vat}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span>Total Repayment</span>
                  <span className="text-primary">R {totalRepayment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Due Date</span>
                  <span>May 15, 2026</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div>
          <h1 className="text-3xl mb-2">Request Advance</h1>
          <p className="text-muted-foreground">Get electricity now, pay later</p>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-100">
            An advance allows you to purchase electricity immediately and repay over 4 weeks with a small service fee.
          </p>
        </div>

        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Advance Amount (ZAR)</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-muted-foreground">
              R
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-card/50 border-2 border-border rounded-3xl py-6 pl-16 pr-6 text-4xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              min="0"
              step="100"
            />
          </div>

          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-3">Quick amounts</p>
            <div className="grid grid-cols-3 gap-3">
              {["300", "500", "800"].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    amount === quickAmount
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card/50 hover:bg-card/70"
                  }`}
                >
                  R {quickAmount}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50">
          <h3 className="mb-4">Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Advance Amount</span>
              <span>R {amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Fee (5%)</span>
              <span>R {serviceFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (15%)</span>
              <span>R {vat}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span>Total Repayment</span>
              <span className="text-primary">R {totalRepayment}</span>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">Repayment Schedule</span>
              </div>
              <p className="text-xs text-muted-foreground">
                4 weekly payments of R {(parseFloat(totalRepayment) / 4).toFixed(2)} starting May 1, 2026
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setStatus("approved")}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Request Advance
        </button>
      </div>
    </div>
  );
}

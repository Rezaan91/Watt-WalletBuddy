import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Zap, CreditCard, Check, Copy } from "lucide-react";

export default function BuyElectricityScreen() {
  const [step, setStep] = useState<"amount" | "payment" | "success">("amount");
  const [amount, setAmount] = useState("500");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const navigate = useNavigate();

  const kwhEstimate = (parseFloat(amount) / 2.5).toFixed(1);
  const token = "1234-5678-9012-3456-7890";

  const handlePurchase = () => {
    setStep("success");
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
        <div className="p-6 max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(255,165,0,0.4)]">
              <Check className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl mb-2 text-center">Purchase Successful!</h1>
            <p className="text-muted-foreground text-center mb-8">
              Your electricity has been purchased
            </p>

            <div className="w-full bg-card/50 backdrop-blur-lg rounded-3xl p-6 border border-border/50 mb-6">
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Amount</span>
                <span>R {amount}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="text-muted-foreground">Estimated kWh</span>
                <span>{kwhEstimate} kWh</span>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-sm text-muted-foreground mb-2">Your Token</p>
                <div className="flex items-center gap-2 bg-muted rounded-xl p-3">
                  <code className="flex-1 text-primary break-all">{token}</code>
                  <button
                    onClick={copyToken}
                    className="p-2 hover:bg-card rounded-lg transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 w-full">
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
              >
                Back to Home
              </button>
              <button
                onClick={() => setStep("amount")}
                className="w-full bg-card/50 border border-border text-foreground py-4 rounded-2xl hover:bg-card/70 transition-colors"
              >
                Buy More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
        <div className="p-6 max-w-md mx-auto">
          <button
            onClick={() => setStep("amount")}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <h1 className="text-3xl mb-2">Payment Method</h1>
          <p className="text-muted-foreground mb-6">Choose how you want to pay</p>

          <div className="space-y-3 mb-8">
            <button
              onClick={() => setPaymentMethod("wallet")}
              className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                paymentMethod === "wallet"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50"
              }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <p>WattWallet Balance</p>
                <p className="text-sm text-muted-foreground">R 2,450.00 available</p>
              </div>
              {paymentMethod === "wallet" && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>

            <button
              onClick={() => setPaymentMethod("card")}
              className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                paymentMethod === "card"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card/50"
              }`}
            >
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 text-left">
                <p>Credit/Debit Card</p>
                <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
              </div>
              {paymentMethod === "card" && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          </div>

          <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50 mb-6">
            <h3 className="mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>R {amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee</span>
                <span>R 0.00</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span>Total</span>
                <span className="text-primary">R {amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">You'll receive</span>
                <span className="text-primary">~{kwhEstimate} kWh</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePurchase}
            className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
          >
            Confirm Purchase
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl mb-2">Buy Electricity</h1>
        <p className="text-muted-foreground mb-8">How much would you like to purchase?</p>

        <div className="mb-8">
          <label className="text-sm text-muted-foreground mb-2 block">Amount (ZAR)</label>
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
              step="50"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 bg-gradient-to-r from-[#FF6B00]/20 to-[#FFA500]/20 border border-primary/30 rounded-2xl p-4">
            <Zap className="w-6 h-6 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated kWh</p>
              <p className="text-xl text-primary">~{kwhEstimate} kWh</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-3">Quick amounts</p>
          <div className="grid grid-cols-3 gap-3">
            {["200", "500", "1000"].map((quickAmount) => (
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

        <button
          onClick={() => setStep("payment")}
          disabled={!amount || parseFloat(amount) <= 0}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

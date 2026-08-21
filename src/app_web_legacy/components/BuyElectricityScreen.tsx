import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Zap, CreditCard, Check, Copy, AlertCircle, Gift, X } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function BuyElectricityScreen() {
  const { user, isPrimary } = useUser();
  const [step, setStep] = useState<"amount" | "payment" | "success">("amount");
  const [amount, setAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [amountError, setAmountError] = useState("");
  const [showFreeElectricity, setShowFreeElectricity] = useState(false);
  const [meterNumber, setMeterNumber] = useState("");
  const [meterError, setMeterError] = useState("");
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [freeKwhAmount, setFreeKwhAmount] = useState(0);
  const navigate = useNavigate();

  const isSecondaryUser = !isPrimary();

  useEffect(() => {
    if (user?.meterNumber) {
      setMeterNumber(user.meterNumber);
    }
  }, [user]);

  const kwhEstimate = (parseFloat(amount) / 2.5).toFixed(1);
  const token = "1234-5678-9012-3456-7890";

  const validateAmount = (value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setAmountError("Please enter a valid amount");
      return false;
    }
    if (numValue < 10) {
      setAmountError("Minimum amount is R 10");
      return false;
    }
    if (numValue > 1000) {
      setAmountError("Maximum amount is R 1000");
      return false;
    }
    setAmountError("");
    return true;
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (value) {
      validateAmount(value);
    } else {
      setAmountError("");
    }
  };

  const handlePurchase = () => {
    if (isSecondaryUser) {
      // SECONDARY users create a request instead of purchasing directly
      const requests = JSON.parse(localStorage.getItem("electricityRequests") || "[]");
      requests.push({
        id: Date.now().toString(),
        userId: user?.email,
        userName: user?.name,
        amount: parseFloat(amount),
        kwhEstimate,
        status: "pending",
        requestedAt: new Date().toISOString(),
        householdId: user?.householdId
      });
      localStorage.setItem("electricityRequests", JSON.stringify(requests));
    }
    setStep("success");
  };

  const copyToken = () => {
    navigator.clipboard.writeText(token);
  };

  const checkEligibility = () => {
    if (!meterNumber || meterNumber.length < 10) {
      setMeterError("Please enter a valid meter number (minimum 10 digits)");
      return;
    }

    setMeterError("");
    setEligibilityChecked(true);

    // Simulate eligibility check - in reality, this would call an API
    // For demo purposes, Juries Family meter (04178522931) is eligible
    const eligible = meterNumber === "04178522931" || meterNumber.startsWith("04");
    setIsEligible(eligible);

    if (eligible) {
      // Free Basic Electricity - typically 50 kWh per month in SA
      setFreeKwhAmount(50);
    }
  };

  const claimFreeElectricity = () => {
    // Simulate claiming free electricity
    setAmount("0");
    setShowFreeElectricity(false);
    setStep("success");
  };

  if (step === "success") {
    const isFree = parseFloat(amount) === 0;
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
        <div className="p-6 max-w-md mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[80vh]">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${
              isFree
                ? "bg-gradient-to-br from-green-500 to-green-600 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
                : "bg-gradient-to-br from-[#FF6B00] to-[#FFA500] shadow-[0_0_40px_rgba(255,165,0,0.4)]"
            }`}>
              {isFree ? <Gift className="w-10 h-10 text-white" /> : <Check className="w-10 h-10 text-white" />}
            </div>

            <h1 className="text-3xl mb-2 text-center">
              {isFree ? "Free Electricity Claimed!" : isSecondaryUser ? "Request Sent!" : "Purchase Successful!"}
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              {isFree ? "Your free basic electricity has been allocated" : isSecondaryUser ? "Your electricity request is pending approval from the primary account holder" : "Your electricity has been purchased"}
            </p>

            <div className="w-full bg-card/50 backdrop-blur-lg rounded-3xl p-6 border border-border/50 mb-6">
              {isSecondaryUser && !isFree ? (
                <>
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Requested Amount</span>
                    <span>R {amount}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Estimated kWh</span>
                    <span>{kwhEstimate} kWh</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-yellow-400">Pending Approval</span>
                  </div>
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 mt-4">
                    <p className="text-xs text-muted-foreground">
                      <span className="text-blue-400">Note:</span> The primary account holder will review and approve your request.
                    </p>
                  </div>
                </>
              ) : isFree ? (
                <>
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Program</span>
                    <span className="text-green-400">Free Basic Electricity</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="text-green-400">FREE</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-muted-foreground">Allocated kWh</span>
                    <span>{freeKwhAmount} kWh</span>
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
                </>
              ) : (
                <>
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
                </>
              )}
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

        <h1 className="text-3xl mb-2">{isSecondaryUser ? "Request Electricity" : "Buy Electricity"}</h1>
        <p className="text-muted-foreground mb-6">{isSecondaryUser ? "How much would you like to request?" : "How much would you like to purchase?"}</p>

        {isSecondaryUser && (
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="text-blue-400">Info:</span> As a secondary user, your electricity requests need to be approved by the primary account holder before purchase.
            </p>
          </div>
        )}

        <button
          onClick={() => setShowFreeElectricity(true)}
          className="w-full mb-6 bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
        >
          <span>Check Free Basic Electricity Eligibility</span>
        </button>

        <div className="mb-8">
          <label className="text-sm text-muted-foreground mb-2 block">Enter Custom Amount (R10 - R1000)</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-muted-foreground">
              R
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className={`w-full bg-card/50 border-2 rounded-3xl py-6 pl-16 pr-6 text-4xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                amountError ? "border-red-500" : "border-border"
              }`}
              min="10"
              max="1000"
              step="10"
            />
          </div>

          {amountError && (
            <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              <p>{amountError}</p>
            </div>
          )}

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
          <div className="grid grid-cols-2 gap-3">
            {["50", "100", "200", "1000"].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => {
                  setAmount(quickAmount);
                  setAmountError("");
                }}
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
          onClick={() => {
            if (validateAmount(amount)) {
              if (isSecondaryUser) {
                handlePurchase();
              } else {
                setStep("payment");
              }
            }
          }}
          disabled={!amount || parseFloat(amount) <= 0 || !!amountError}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSecondaryUser ? "Send Request" : "Continue"}
        </button>

        {showFreeElectricity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-card rounded-3xl p-6 max-w-md w-full border border-border max-h-[75vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl">Free Basic Electricity</h3>
                <button
                  onClick={() => {
                    setShowFreeElectricity(false);
                    setEligibilityChecked(false);
                    setMeterNumber("");
                    setMeterError("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!eligibilityChecked ? (
                <div className="space-y-4">
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-400 mb-2">About Free Basic Electricity</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Government subsidy for qualifying households</li>
                          <li>• Receive 50 kWh of free electricity per month</li>
                          <li>• Based on meter number and household income</li>
                          <li>• Valid for registered indigent customers</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      Enter Your Meter Number
                    </label>
                    <input
                      type="text"
                      value={meterNumber}
                      onChange={(e) => setMeterNumber(e.target.value)}
                      placeholder="e.g., 04123456789012"
                      className={`w-full bg-input border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                        meterError ? "border-red-500" : "border-border"
                      }`}
                    />
                    {meterError && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
                        <AlertCircle className="w-4 h-4" />
                        <p>{meterError}</p>
                      </div>
                    )}
                    {!user?.meterNumber && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        💡 Save your meter number in{" "}
                        <button
                          onClick={() => {
                            setShowFreeElectricity(false);
                            navigate("/settings/profile");
                          }}
                          className="text-primary hover:underline"
                        >
                          Profile Settings
                        </button>{" "}
                        for faster access
                      </p>
                    )}
                  </div>

                  <button
                    onClick={checkEligibility}
                    className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
                  >
                    Check Eligibility
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {isEligible ? (
                    <>
                      <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="w-5 h-5 text-green-400" />
                          <p className="text-green-400">You are eligible!</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Your household qualifies for the Free Basic Electricity program.
                        </p>
                      </div>

                      <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
                        <div className="flex justify-between mb-3">
                          <span className="text-muted-foreground">Meter Number</span>
                          <span className="font-mono text-sm">{meterNumber}</span>
                        </div>
                        <div className="flex justify-between mb-3">
                          <span className="text-muted-foreground">Monthly Allocation</span>
                          <span className="text-green-400 font-semibold">{freeKwhAmount} kWh</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Cost</span>
                          <span className="text-green-400 font-semibold">FREE</span>
                        </div>
                      </div>

                      <button
                        onClick={claimFreeElectricity}
                        className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
                      >
                        Claim Free Electricity
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <X className="w-5 h-5 text-red-400" />
                          <p className="text-red-400">Not eligible</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Unfortunately, your meter number does not qualify for the Free Basic Electricity program at this time.
                        </p>
                      </div>

                      <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
                        <p className="text-sm text-blue-400 mb-2">How to qualify:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Register as an indigent customer with your municipality</li>
                          <li>• Household income must be below the threshold</li>
                          <li>• Contact your municipality for more information</li>
                        </ul>
                      </div>

                      <button
                        onClick={() => {
                          setEligibilityChecked(false);
                          setMeterNumber("");
                        }}
                        className="w-full bg-card/50 border border-border text-foreground py-4 rounded-2xl hover:bg-card/70 transition-colors"
                      >
                        Try Different Meter Number
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

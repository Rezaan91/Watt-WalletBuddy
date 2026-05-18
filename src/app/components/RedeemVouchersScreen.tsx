import { useState } from "react";
import { ArrowLeft, ShoppingBag, Zap, Check, Copy, Sparkles, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router";
import wattcoinLogo from "../../imports/WC.png";

const voucherOptions = [
  { id: 1, type: "electricity", title: "R 50 Electricity Credit", value: 50, cost: 1000, icon: Zap },
  { id: 2, type: "electricity", title: "R 100 Electricity Credit", value: 100, cost: 1900, icon: Zap, badge: "Best Value" },
  { id: 3, type: "electricity", title: "R 200 Electricity Credit", value: 200, cost: 3600, icon: Zap },
  { id: 4, type: "grocery", title: "Pick n Pay R 50", value: 50, cost: 1000, icon: ShoppingBag, store: "Pick n Pay" },
  { id: 5, type: "grocery", title: "Shoprite R 100", value: 100, cost: 1900, icon: ShoppingBag, badge: "Popular", store: "Shoprite" },
  { id: 6, type: "grocery", title: "Checkers R 200", value: 200, cost: 3600, icon: ShoppingBag, store: "Checkers" },
];

export default function RedeemVouchersScreen() {
  const [currentCoins, setCurrentCoins] = useState(2450);
  const [selectedVoucher, setSelectedVoucher] = useState<typeof voucherOptions[0] | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [customAmountError, setCustomAmountError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const navigate = useNavigate();

  const handleVoucherSelect = (voucher: typeof voucherOptions[0]) => {
    setSelectedVoucher(voucher);
    setCustomAmount("");
    setCustomAmountError("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedVoucher(null);
    setCustomAmountError("");

    if (value) {
      const amount = parseFloat(value);
      const wattCoinCost = amount * 20; // 1 WC = R0.05, so R1 = 20 WC
      if (isNaN(amount)) {
        setCustomAmountError("Please enter a valid amount");
      } else if (amount < 30) {
        setCustomAmountError("Minimum amount is R 30");
      } else if (amount > 500) {
        setCustomAmountError("Maximum amount is R 500");
      } else if (wattCoinCost > currentCoins) {
        setCustomAmountError(`You need ${wattCoinCost - currentCoins} more WattCoins`);
      } else {
        // Create custom voucher
        const customVoucher = {
          id: 999,
          type: "electricity" as const,
          title: `R ${amount} Electricity Credit`,
          value: amount,
          cost: wattCoinCost,
          icon: Zap,
        };
        setSelectedVoucher(customVoucher);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedVoucher && currentCoins >= selectedVoucher.cost) {
      setCurrentCoins(currentCoins - selectedVoucher.cost);
      const code = `WW${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setVoucherCode(code);
      setShowConfirmation(false);
      setShowSuccess(true);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(voucherCode);
  };

  const remainingBalance = selectedVoucher ? currentCoins - selectedVoucher.cost : currentCoins;

  if (showSuccess && selectedVoucher) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
        <div className="p-6 max-w-md mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/rewards")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl">Redemption Successful</h1>
            </div>
          </div>

          <div className="text-center py-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl mb-2">Voucher Ready! 🎉</h2>
            <p className="text-muted-foreground">Your voucher is ready to use</p>
          </div>

          <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-3xl p-6 shadow-[0_0_40px_rgba(255,165,0,0.3)]">
            <div className="text-center">
              <p className="text-sm text-white/80 mb-1">
                {selectedVoucher.type === "grocery" ? selectedVoucher.store : "Electricity Credit"}
              </p>
              <h3 className="text-4xl mb-6">R {selectedVoucher.value}</h3>

              <div className="bg-white rounded-2xl p-4">
                <p className="text-xs text-gray-600 mb-2">Voucher Code</p>
                <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider mb-3">{voucherCode}</p>
                <button
                  onClick={handleCopyCode}
                  className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-sm">Copy Code</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              How to use:
            </h4>
            {selectedVoucher.type === "electricity" ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Your electricity has been credited to your meter</li>
                <li>• Use the code above for your records</li>
                <li>• Check your meter to confirm the units</li>
              </ul>
            ) : (
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Visit any {selectedVoucher.store} store</li>
                <li>• Shop for groceries up to R {selectedVoucher.value}</li>
                <li>• Show this code at checkout</li>
              </ul>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/rewards")}
              className="flex-1 bg-card/50 border border-border text-foreground py-4 rounded-2xl hover:bg-card/70 transition-colors"
            >
              Back to Rewards
            </button>
            <button
              onClick={() => {
                setShowSuccess(false);
                setSelectedVoucher(null);
                setVoucherCode("");
              }}
              className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
            >
              Redeem Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirmation && selectedVoucher) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
        <div className="p-6 max-w-md mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowConfirmation(false)} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl">Confirm Redemption</h1>
              <p className="text-sm text-muted-foreground">Review your selection</p>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-lg rounded-3xl p-6 border border-border/50">
            <h3 className="text-sm text-muted-foreground mb-4">Redemption Summary</h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Voucher</span>
                <span className="font-semibold">{selectedVoucher.title}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Value</span>
                <span className="font-semibold">R {selectedVoucher.value}</span>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-muted-foreground">WattCoins Cost</span>
                  <span className="text-primary font-semibold">{selectedVoucher.cost} WC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Remaining Balance</span>
                  <span className="font-semibold">{remainingBalance} WC</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 flex gap-3">
            <Check className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Secure redemption • Your voucher will be ready instantly
            </p>
          </div>

          <button
            onClick={handleConfirm}
            disabled={currentCoins < selectedVoucher.cost}
            className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Redemption
          </button>

          <button
            onClick={() => setShowConfirmation(false)}
            className="w-full bg-card/50 border border-border text-foreground py-4 rounded-2xl hover:bg-card/70 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/rewards")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Redeem WattCoins</h1>
            <p className="text-sm text-muted-foreground">Turn your electricity savings into groceries</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-3xl p-6 shadow-[0_0_40px_rgba(255,165,0,0.3)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/80 mb-1">WattCoins Balance</p>
              <h2 className="text-4xl">{currentCoins} WC</h2>
            </div>
            <img src={wattcoinLogo} alt="WattCoins" className="w-20 h-20 object-contain drop-shadow-lg" />
          </div>
          <p className="text-xs text-white/80 mt-4">
            Earn more by paying on time and saving electricity
          </p>
        </div>

        <div>
          <h3 className="text-lg mb-4">Available Vouchers</h3>
          <div className="space-y-3">
            {voucherOptions.map((voucher) => {
              const Icon = voucher.icon;
              const isSelected = selectedVoucher?.id === voucher.id;
              const isAvailable = currentCoins >= voucher.cost;

              return (
                <button
                  key={voucher.id}
                  onClick={() => handleVoucherSelect(voucher)}
                  disabled={!isAvailable}
                  className={`w-full rounded-2xl p-4 border flex items-center justify-between transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary"
                      : isAvailable
                      ? "bg-card/50 backdrop-blur-lg border-border/50 hover:bg-card/70"
                      : "bg-muted/20 border-muted/30 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected ? "bg-primary/20" : isAvailable ? "bg-muted" : "bg-muted/40"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isSelected ? "text-primary" : isAvailable ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className={isAvailable ? "" : "text-muted-foreground"}>{voucher.title}</p>
                        {voucher.badge && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                            {voucher.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{voucher.cost} WC</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {!isAvailable && !isSelected && (
                    <span className="text-xs text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
                      Need {voucher.cost - currentCoins} more
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
          <label className="text-sm text-muted-foreground mb-2 block">Custom Amount (R 30 - R 500)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">R</span>
            <input
              type="number"
              value={customAmount}
              onChange={(e) => handleCustomAmountChange(e.target.value)}
              placeholder="Enter amount"
              min="30"
              max="500"
              className={`w-full bg-input border rounded-xl py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
                customAmountError ? "border-red-500 focus:ring-red-500" : "border-border focus:ring-primary"
              }`}
            />
          </div>
          {customAmountError ? (
            <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {customAmountError}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-2">
              Enter any amount between R 30 and R 500
            </p>
          )}
        </div>

        {selectedVoucher && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-400 mb-1">Ready to redeem?</p>
              <p className="text-muted-foreground">
                You'll receive your {selectedVoucher.type === "electricity" ? "electricity credit" : "grocery voucher"} instantly
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowConfirmation(true)}
          disabled={!selectedVoucher || (selectedVoucher && currentCoins < selectedVoucher.cost) || !!customAmountError}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Redeem Now
        </button>
      </div>
    </div>
  );
}

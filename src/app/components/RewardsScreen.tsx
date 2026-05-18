import { useState } from "react";
import { Gift, TrendingUp, Zap, Award, ChevronRight, Check, X, MessageCircle, Mail, Copy, Target, Calendar, ShoppingBag, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import wattcoinLogo from "../../imports/WC.png";

const earnWays = [
  { icon: Zap, title: "Smart Usage", description: "Reduce usage by 10%", reward: 50, category: "energy" },
  { icon: TrendingUp, title: "Weekly Goal", description: "Stay under budget", reward: 25, category: "goal" },
  { icon: Gift, title: "Referral Bonus", description: "Invite a friend", reward: 100, category: "referral" },
];

const redeemOptionsData = [
  { title: "R 50 Electricity Credit", cost: 1000 },
  { title: "R 100 Electricity Credit", cost: 1900 },
  { title: "R 200 Electricity Credit", cost: 3600 },
  { title: "Free Smart Meter Upgrade", cost: 5000 },
];

const achievements = [
  { icon: "🌟", title: "First Purchase", unlocked: true },
  { icon: "⚡", title: "Energy Saver", unlocked: true },
  { icon: "🔥", title: "30 Day Streak", unlocked: true },
  { icon: "💎", title: "Premium User", unlocked: false },
  { icon: "🏆", title: "Top 10%", unlocked: false },
  { icon: "🎯", title: "Goal Master", unlocked: false },
];

export default function RewardsScreen() {
  const [currentCoins, setCurrentCoins] = useState(2450);
  const [showMessage, setShowMessage] = useState("");
  const [showSmartUsage, setShowSmartUsage] = useState(false);
  const [showWeeklyGoal, setShowWeeklyGoal] = useState(false);
  const [showReferral, setShowReferral] = useState(false);
  const earnedThisMonth = 450;
  const nextMilestone = 3000;
  const progress = (currentCoins / nextMilestone) * 100;
  const navigate = useNavigate();

  // Safety: prevent undefined variable errors (grocery vouchers handled in /rewards/redeem route)
  const showGroceryVouchers = false;

  const referralLink = "https://wattwallet.app/ref/WW123456";

  const handleEarnCoins = (way: typeof earnWays[0]) => {
    if (way.category === "energy") {
      setShowSmartUsage(true);
    } else if (way.category === "goal") {
      setShowWeeklyGoal(true);
    } else if (way.category === "referral") {
      setShowReferral(true);
    }
  };

  const handleClaimReward = (reward: number, message: string) => {
    setCurrentCoins(currentCoins + reward);
    setShowMessage(message);
    setShowSmartUsage(false);
    setShowWeeklyGoal(false);
    setTimeout(() => setShowMessage(""), 3000);
  };

  const handleRedeemReward = (option: typeof redeemOptionsData[0]) => {
    if (currentCoins >= option.cost) {
      setCurrentCoins(currentCoins - option.cost);
      setShowMessage(`Successfully redeemed ${option.title}!`);
      setTimeout(() => setShowMessage(""), 3000);
    } else {
      setShowMessage(`You need ${option.cost - currentCoins} more WattCoins to redeem this reward.`);
      setTimeout(() => setShowMessage(""), 3000);
    }
  };

  const handleShareReferral = (method: string) => {
    if (method === "copy") {
      navigator.clipboard.writeText(referralLink);
      setShowMessage("Referral link copied to clipboard!");
      setTimeout(() => setShowMessage(""), 3000);
    } else if (method === "whatsapp") {
      const message = `Join me on WattWallet and get rewarded for smart energy usage! Use my referral link: ${referralLink}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
    } else if (method === "email") {
      const subject = "Join WattWallet - Get Rewarded!";
      const body = `Hi!\n\nI've been using WattWallet to manage my electricity and earn rewards. You should try it too!\n\nUse my referral link to sign up: ${referralLink}\n\nBest regards`;
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl mb-2">WattCoins Rewards</h1>
          <p className="text-muted-foreground">Earn rewards for smart energy usage</p>
        </div>

        {showMessage && (
          <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-400">{showMessage}</p>
          </div>
        )}

        <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-3xl p-6 shadow-[0_0_40px_rgba(255,165,0,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16" />

          <div className="relative z-10">
            <img src={wattcoinLogo} alt="WattCoins" className="w-20 h-20 mb-4 object-contain drop-shadow-lg" />
            <p className="text-sm text-white/80 mb-1">Your Balance</p>
            <h2 className="text-5xl mb-6">{currentCoins.toLocaleString()} WC</h2>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Next milestone</span>
                <span>{nextMilestone} WC</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-white/80 mt-2">
                {nextMilestone - currentCoins} WC to unlock exclusive rewards
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg mb-4">Earn WattCoins</h3>
          <div className="space-y-3">
            {earnWays.map((way, index) => {
              const Icon = way.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleEarnCoins(way)}
                  className="w-full bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50 flex items-center gap-4 hover:bg-card/70 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p>{way.title}</p>
                    <p className="text-sm text-muted-foreground">{way.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-primary">+{way.reward} WC</p>
                    <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto mt-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg mb-4">Redeem Rewards</h3>
          <div className="space-y-3">
            {redeemOptionsData.map((option, index) => {
              const isAvailable = currentCoins >= option.cost;
              return (
                <button
                  key={index}
                  onClick={() => handleRedeemReward(option)}
                  disabled={!isAvailable}
                  className={`w-full rounded-2xl p-4 border flex items-center justify-between ${
                    isAvailable
                      ? "bg-card/50 backdrop-blur-lg border-border/50 hover:bg-card/70 cursor-pointer"
                      : "bg-muted/20 border-muted/30 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isAvailable ? "bg-primary/20" : "bg-muted/40"
                      }`}
                    >
                      <Gift
                        className={`w-5 h-5 ${isAvailable ? "text-primary" : "text-muted-foreground"}`}
                      />
                    </div>
                    <div className="text-left">
                      <p className={isAvailable ? "" : "text-muted-foreground"}>
                        {option.title}
                      </p>
                      <p className="text-sm text-muted-foreground">{option.cost} WC</p>
                    </div>
                  </div>
                  {isAvailable ? (
                    <span className="text-sm text-primary font-semibold">Claim</span>
                  ) : (
                    <span className="text-xs text-muted-foreground bg-muted/40 px-3 py-1 rounded-full">
                      Locked
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag className="w-6 h-6 text-green-400" />
            <div>
              <h3 className="text-lg">Grocery Vouchers</h3>
              <p className="text-sm text-muted-foreground">Turn your electricity savings into groceries</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/rewards/redeem")}
            className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-3 rounded-xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Redeem WattCoins</span>
          </button>
        </div>

        <div>
          <h3 className="text-lg mb-4">Achievements</h3>
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`rounded-2xl p-4 border text-center ${
                  achievement.unlocked
                    ? "bg-gradient-to-br from-[#FF6B00]/20 to-[#FFA500]/20 border-primary/30"
                    : "bg-muted/20 border-muted/30 opacity-60"
                }`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <p className="text-xs">{achievement.title}</p>
                {achievement.unlocked && (
                  <div className="mt-2">
                    <Award className="w-4 h-4 text-primary mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-4">
          <h4 className="mb-2 flex items-center gap-2">
            <Gift className="w-5 h-5 text-blue-400" />
            <span>How WattCoins Work</span>
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Earn coins by reducing electricity usage and meeting goals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Redeem coins for electricity credits and exclusive perks</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-1">•</span>
              <span>Complete achievements to unlock bonus rewards</span>
            </li>
          </ul>
        </div>
      </div>

      {showSmartUsage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-card rounded-3xl p-6 max-w-md w-full border border-border max-h-[75vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Smart Usage Reward</h3>
              <button onClick={() => setShowSmartUsage(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-2xl p-4">
                <p className="text-sm text-white/80 mb-1">Total Usage This Week</p>
                <h2 className="text-4xl mb-2">89 kWh</h2>
                <p className="text-sm text-white/90">Target: 98 kWh (10% reduction)</p>
              </div>

              <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <p className="text-green-400">Goal Achieved!</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  You've reduced your electricity usage by 10% compared to last week. Great job!
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last week:</span>
                  <span>99 kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This week:</span>
                  <span>89 kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reduction:</span>
                  <span className="text-green-400">-10 kWh (10%)</span>
                </div>
              </div>

              <button
                onClick={() => handleClaimReward(50, "You earned 50 WattCoins from Smart Usage!")}
                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
              >
                Claim 50 WattCoins
              </button>
            </div>
          </div>
        </div>
      )}

      {showWeeklyGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-card rounded-3xl p-6 max-w-md w-full border border-border max-h-[75vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Weekly Budget Goal</h3>
              <button onClick={() => setShowWeeklyGoal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-2xl p-4">
                <p className="text-sm text-white/80 mb-1">Weekly Budget</p>
                <h2 className="text-4xl mb-2">R 450</h2>
                <p className="text-sm text-white/90">Spent: R 380 | Remaining: R 70</p>
                <div className="w-full bg-white/20 rounded-full h-2 mt-3">
                  <div className="bg-white h-2 rounded-full" style={{ width: "84%" }} />
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  <h4>Budget Plan</h4>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="mb-1">Monday - Wednesday</p>
                      <p className="text-muted-foreground">Peak hours: Limit geyser to 30min/day, use stove instead of oven</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="mb-1">Thursday - Friday</p>
                      <p className="text-muted-foreground">Mid-week check: Stay under R 300. Adjust if needed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="mb-1">Weekend</p>
                      <p className="text-muted-foreground">Use off-peak hours for laundry, keep remaining budget for essentials</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="w-5 h-5 text-green-400" />
                  <p className="text-green-400">On Track!</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  You're staying under budget. Keep it up to earn your reward!
                </p>
              </div>

              <button
                onClick={() => handleClaimReward(25, "You earned 25 WattCoins from Weekly Goal!")}
                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
              >
                Claim 25 WattCoins
              </button>
            </div>
          </div>
        </div>
      )}

      {showReferral && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-card rounded-3xl p-6 max-w-md w-full border border-border max-h-[75vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl">Referral Bonus</h3>
              <button onClick={() => setShowReferral(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-2xl p-4 text-center">
                <Gift className="w-12 h-12 text-white mx-auto mb-2" />
                <h2 className="text-3xl mb-2">100 WC</h2>
                <p className="text-sm text-white/90">Earn 100 WattCoins for each friend you refer!</p>
              </div>

              <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
                <p className="text-sm text-foreground dark:text-gray-900 mb-2">How it works:</p>
                <ul className="space-y-1 text-xs text-foreground dark:text-gray-900">
                  <li>• Share your unique referral link</li>
                  <li>• Your friend signs up and makes their first purchase</li>
                  <li>• You both get 100 WattCoins!</li>
                </ul>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Your Referral Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 bg-input border border-border rounded-xl py-3 px-4 text-foreground text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => handleShareReferral("copy")}
                    className="bg-primary text-white px-4 rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Share via:</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleShareReferral("whatsapp")}
                    className="bg-green-500/20 border border-green-500/30 text-green-400 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-500/30 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleShareReferral("email")}
                    className="bg-blue-500/20 border border-blue-500/30 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500/30 transition-colors"
                  >
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-foreground dark:text-gray-900">Email</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

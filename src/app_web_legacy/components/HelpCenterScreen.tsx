import { useState } from "react";
import { ArrowLeft, Search, ChevronRight, Sparkles, Send } from "lucide-react";
import { useNavigate } from "react-router";

const categories = [
  {
    title: "Getting Started",
    articles: ["How to buy electricity", "Setting up your account", "Adding payment methods"],
  },
  {
    title: "Electricity Advances",
    articles: ["Requesting an advance", "Repayment terms", "Advance eligibility"],
  },
  {
    title: "WattCoins Rewards",
    articles: ["Earning WattCoins", "Redeeming rewards", "Achievement badges"],
  },
  {
    title: "Smart Meter",
    articles: ["Connecting your meter", "Reading usage data", "Troubleshooting connection"],
  },
  {
    title: "Load Shedding",
    articles: ["Viewing your schedule", "Setting up alerts", "Understanding stages"],
  },
];

const helpResponses: Record<string, string> = {
  "How to buy electricity": "To buy electricity, go to the Buy tab in the bottom navigation, enter the amount you'd like to purchase (minimum R10, maximum R1000), select your payment method, and confirm. You'll receive your token instantly! You can also check if you qualify for Free Basic Electricity by adding your meter number in your profile settings.",
  "Setting up your account": "Setting up your WattWallet account is easy! You can sign up with your email and password, or use Google, Microsoft, or Apple sign-in. You'll need to provide your SA ID number and cellphone number. After signing up, verify your account via SMS or email code, then you're ready to start!",
  "Adding payment methods": "You can add payment methods in Settings > Payment Methods. We accept credit cards, debit cards, and EFT. Your payment information is securely stored and encrypted for safe transactions.",
  "Requesting an advance": "To request an electricity advance, tap the 'Request Advance' button on the home screen or go to the Advance section. Choose the amount you need (R300-R800), review the service fee (5%) and VAT (15%), then confirm. You'll receive instant approval and the electricity will be credited to your meter immediately!",
  "Repayment terms": "Advances are repaid over 4 weeks with automatic weekly deductions from your account. There's a 5% service fee plus 15% VAT on the fee. You can make early payments anytime to reduce your balance. Check the Advance section to see your repayment schedule and progress.",
  "Advance eligibility": "To qualify for an advance, you need an active WattWallet account, a verified smart meter, and a good repayment history. First-time users can request up to R500. Your advance limit increases as you successfully repay advances.",
  "Earning WattCoins": "Earn WattCoins by: reducing your electricity usage (Smart Usage reward), staying within your weekly budget (Weekly Goal), referring friends (100 WC each), and completing achievements. WattCoins can be redeemed for electricity credits and exclusive perks!",
  "Redeeming rewards": "To redeem your WattCoins, go to the Rewards section and browse available rewards under 'Redeem Rewards'. Tap 'Claim' on any reward you can afford. Common redemptions include R10, R25, R50, and R100 electricity credits. Your balance is updated instantly!",
  "Achievement badges": "Achievement badges are unlocked by reaching milestones like 'Week Saver' (save for 7 days), 'Energy Star' (reduce usage by 20%), and 'Referral Pro' (refer 5 friends). Check your Achievements section to see your progress and unlock bonus WattCoins!",
  "Connecting your meter": "To connect your smart meter, go to Settings > Profile and add your meter number (usually 11-14 digits). The system will automatically sync with your meter to track real-time usage. Meters starting with '04' may qualify for Free Basic Electricity!",
  "Reading usage data": "View your electricity usage in the Usage tab. You can see daily, weekly, or monthly consumption patterns with interactive charts. The insights section provides tips on reducing usage and identifies your peak consumption times.",
  "Troubleshooting connection": "If your meter isn't connecting: 1) Verify your meter number is correct in Settings > Profile, 2) Check that your meter is a smart meter with connectivity, 3) Ensure you have internet connection, 4) Try logging out and back in. Contact support if issues persist.",
  "Viewing your schedule": "To view your load shedding schedule, tap the 'Load Shedding' button on the home screen. You'll see your current stage and today's schedule with times for completed, active, and upcoming outages. The schedule is based on your location (Area 12, Johannesburg).",
  "Setting up alerts": "Enable load shedding alerts in the Load Shedding section by toggling 'Push Notifications'. You'll receive alerts before scheduled outages so you can prepare. Make sure notifications are enabled in your device settings for WattWallet.",
  "Understanding stages": "Load shedding stages indicate severity: Stage 1 = minimal outages, Stage 8 = maximum outages. Each stage increases frequency and duration. Your area's schedule changes based on the current stage. Check the Load Shedding section to see which stage is currently active.",
};

export default function HelpCenterScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm here to help answer your questions about WattWallet. What would you like to know?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const navigate = useNavigate();

  const handleArticleClick = (article: string) => {
    setShowAI(true);

    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: article,
    };

    setMessages([...messages, userMessage]);

    setTimeout(() => {
      const response = helpResponses[article] || "I can help you with that! Please contact our support team for detailed assistance with this topic.";
      const assistantResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantResponse]);
    }, 800);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");

    setTimeout(() => {
      const response = Object.keys(helpResponses).find(key =>
        inputValue.toLowerCase().includes(key.toLowerCase())
      );

      const assistantResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: response ? helpResponses[response] : "I'd be happy to help! For specific questions about your account, electricity purchases, advances, rewards, or load shedding, please browse our help articles or contact our support team for personalized assistance.",
      };
      setMessages((prev) => [...prev, assistantResponse]);
    }, 1000);
  };

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      articles: category.articles.filter((article) =>
        article.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.articles.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/settings")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Help Center</h1>
            <p className="text-sm text-muted-foreground">Get help and support</p>
          </div>
        </div>

        <button
          onClick={() => setShowAI(!showAI)}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
        >
          <Sparkles className="w-5 h-5" />
          <span>{showAI ? "Browse Articles" : "Ask AI Assistant"}</span>
        </button>

        {!showAI ? (
          <>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help articles..."
                className="w-full bg-card/50 border border-border rounded-2xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-6">
              {(searchQuery ? filteredCategories : categories).map((category, index) => (
                <div key={index}>
                  <h3 className="text-sm text-muted-foreground mb-3 px-2">{category.title}</h3>
                  <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border/50 overflow-hidden">
                    {category.articles.map((article, articleIndex) => (
                      <button
                        key={articleIndex}
                        onClick={() => handleArticleClick(article)}
                        className={`w-full p-4 flex items-center justify-between hover:bg-card/70 transition-colors ${
                          articleIndex !== category.articles.length - 1 ? "border-b border-border/50" : ""
                        }`}
                      >
                        <span className="text-left">{article}</span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {searchQuery && filteredCategories.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No articles found</p>
                  <button
                    onClick={() => setShowAI(true)}
                    className="text-primary hover:underline"
                  >
                    Ask our AI assistant instead
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border/50 p-4 max-h-96 overflow-y-auto space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-[#FF6B00] to-[#FFA500] text-white"
                        : "bg-muted"
                    } rounded-2xl p-3`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 bg-card/50 border border-border rounded-2xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

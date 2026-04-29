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
      const assistantResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: "To buy electricity, go to the Buy tab in the bottom navigation, enter the amount you'd like to purchase, select your payment method, and confirm. You'll receive your token instantly!",
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

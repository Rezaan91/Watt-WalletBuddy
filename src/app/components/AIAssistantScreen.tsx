import { useState } from "react";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content: "Hi Thabo! 👋 I'm your WattWallet AI assistant. I can help you with electricity tips, budget advice, and answer questions about your usage. How can I help you today?",
    timestamp: "14:30",
  },
];

const suggestedQuestions = [
  "How can I reduce my electricity usage?",
  "What's my spending trend this month?",
  "When is the next load shedding?",
  "How do I earn more WattCoins?",
];

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");

    setTimeout(() => {
      const assistantResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: "Based on your usage patterns, I recommend shifting high-energy activities like laundry to off-peak hours (21:00-06:00). This could save you up to 15% on electricity costs! Would you like me to create a personalized energy-saving plan?",
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      };
      setMessages((prev) => [...prev, assistantResponse]);
    }, 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground flex flex-col">
      <div className="p-6 border-b border-border/50 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2>AI Assistant</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full" />
              Online
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-md mx-auto w-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] ${
                message.role === "user"
                  ? "bg-gradient-to-br from-[#FF6B00] to-[#FFA500] text-white"
                  : "bg-card/50 backdrop-blur-lg border border-border/50"
              } rounded-2xl p-4`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.role === "user" ? "text-white/70" : "text-muted-foreground"
                }`}
              >
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="space-y-3 mt-6">
            <p className="text-sm text-muted-foreground text-center mb-4">Suggested questions:</p>
            {suggestedQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(question)}
                className="w-full bg-card/50 backdrop-blur-lg border border-border/50 rounded-2xl p-4 text-left text-sm hover:bg-card/70 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border/50 max-w-md mx-auto w-full">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything..."
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

        <div className="flex flex-wrap gap-2 mt-3">
          {["Energy tips", "Budget help", "Usage insights"].map((chip, index) => (
            <button
              key={index}
              onClick={() => handleSuggestedQuestion(chip)}
              className="px-4 py-2 bg-muted rounded-full text-xs text-muted-foreground hover:bg-muted/70 transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUser } from "../context/UserContext";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
}

type AssistantGender = "female" | "male" | "neutral";

const assistantNames = {
  en: { female: "Maya", male: "Ethan", neutral: "Alex" },
  af: { female: "Anna", male: "Pieter", neutral: "Sam" },
  xh: { female: "Mandisa", male: "Khanya", neutral: "Nala" }
};

export default function AIAssistantWidget() {
  const { i18n } = useTranslation();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [position, setPosition] = useState(() => {
    // Position in bottom-right, accounting for navigation bar
    const x = Math.max(20, window.innerWidth - 90);
    const y = Math.max(20, window.innerHeight - 150);
    return { x, y };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [assistantGender, setAssistantGender] = useState<AssistantGender>(() => {
    // Use user's profile gender preference if available, otherwise use localStorage or default to "female"
    if (user?.gender) {
      return user.gender as AssistantGender;
    }
    const saved = localStorage.getItem("assistantGender");
    return (saved as AssistantGender) || "female";
  });
  const [inputMessage, setInputMessage] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current language from i18n
  const currentLanguage = i18n.language.split('-')[0] as 'en' | 'af' | 'xh';
  const languageKey = currentLanguage === 'en' || currentLanguage === 'af' || currentLanguage === 'xh'
    ? currentLanguage
    : 'en';
  const assistantName = assistantNames[languageKey][assistantGender];

  const [messages, setMessages] = useState<Message[]>(() => {
    const greetings = {
      female: {
        en: `Hi! I'm ${assistantNames.en.female}, your WattWallet AI Assistant. How can I help you manage your electricity today?`,
        af: `Hallo! Ek is ${assistantNames.af.female}, jou WattWallet AI-assistent. Hoe kan ek jou help om jou elektrisiteit vandag te bestuur?`,
        xh: `Molo! Ndingu${assistantNames.xh.female}, umncedisi wakho we-AI ye-WattWallet. Ndingakunceda njani ukulawula umbane wakho namhlanje?`
      },
      male: {
        en: `Hi! I'm ${assistantNames.en.male}, your WattWallet AI Assistant. How can I help you manage your electricity today?`,
        af: `Hallo! Ek is ${assistantNames.af.male}, jou WattWallet AI-assistent. Hoe kan ek jou help om jou elektrisiteit vandag te bestuur?`,
        xh: `Molo! Ndingu${assistantNames.xh.male}, umncedisi wakho we-AI ye-WattWallet. Ndingakunceda njani ukulawula umbane wakho namhlanje?`
      },
      neutral: {
        en: `Hi! I'm ${assistantNames.en.neutral}, your WattWallet AI Assistant. How can I help you manage your electricity today?`,
        af: `Hallo! Ek is ${assistantNames.af.neutral}, jou WattWallet AI-assistent. Hoe kan ek jou help om jou elektrisiteit vandag te bestuur?`,
        xh: `Molo! Ndingu${assistantNames.xh.neutral}, umncedisi wakho we-AI ye-WattWallet. Ndingakunceda njani ukulawula umbane wakho namhlanje?`
      }
    };

    return [{
      id: 1,
      text: greetings[assistantGender][languageKey],
      sender: "ai",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
  });

  // Handle gender change
  const handleGenderChange = (gender: AssistantGender) => {
    setAssistantGender(gender);
    localStorage.setItem("assistantGender", gender);

    // Update greeting message
    const greetings = {
      female: {
        en: `Hi! I'm ${assistantNames.en.female}, your WattWallet AI Assistant. How can I help you manage your electricity today?`,
        af: `Hallo! Ek is ${assistantNames.af.female}, jou WattWallet AI-assistent. Hoe kan ek jou help om jou elektrisiteit vandag te bestuur?`,
        xh: `Molo! Ndingu${assistantNames.xh.female}, umncedisi wakho we-AI ye-WattWallet. Ndingakunceda njani ukulawula umbane wakho namhlanje?`
      },
      male: {
        en: `Hi! I'm ${assistantNames.en.male}, your WattWallet AI Assistant. How can I help you manage your electricity today?`,
        af: `Hallo! Ek is ${assistantNames.af.male}, jou WattWallet AI-assistent. Hoe kan ek jou help om jou elektrisiteit vandag te bestuur?`,
        xh: `Molo! Ndingu${assistantNames.xh.male}, umncedisi wakho we-AI ye-WattWallet. Ndingakunceda njani ukulawula umbane wakho namhlanje?`
      },
      neutral: {
        en: `Hi! I'm ${assistantNames.en.neutral}, your WattWallet AI Assistant. How can I help you manage your electricity today?`,
        af: `Hallo! Ek is ${assistantNames.af.neutral}, jou WattWallet AI-assistent. Hoe kan ek jou help om jou elektrisiteit vandag te bestuur?`,
        xh: `Molo! Ndingu${assistantNames.xh.neutral}, umncedisi wakho we-AI ye-WattWallet. Ndingakunceda njani ukulawula umbane wakho namhlanje?`
      }
    };

    setMessages([{
      id: 1,
      text: greetings[gender][languageKey],
      sender: "ai",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setShowSettings(false);
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Sync assistant gender with user profile gender
  useEffect(() => {
    if (user?.gender && user.gender !== assistantGender) {
      setAssistantGender(user.gender as AssistantGender);
      localStorage.setItem("assistantGender", user.gender);
    }
  }, [user?.gender]);

  // Update greeting when language or gender changes
  useEffect(() => {
    const greetings = {
      female: {
        en: `Hi! I'm ${assistantNames.en.female}, your WattWallet AI Assistant. How can I help you manage your electricity today?`,
        af: `Hallo! Ek is ${assistantNames.af.female}, jou WattWallet AI-assistent. Hoe kan ek jou help om jou elektrisiteit vandag te bestuur?`,
        xh: `Molo! Ndingu${assistantNames.xh.female}, umncedisi wakho we-AI ye-WattWallet. Ndingakunceda njani ukulawula umbane wakho namhlanje?`
      },
      male: {
        en: `Hi! I'm ${assistantNames.en.male}, your WattWallet AI Assistant. How can I help you manage your electricity today?`,
        af: `Hallo! Ek is ${assistantNames.af.male}, jou WattWallet AI-assistent. Hoe kan ek jou help om jou elektrisiteit vandag te bestuur?`,
        xh: `Molo! Ndingu${assistantNames.xh.male}, umncedisi wakho we-AI ye-WattWallet. Ndingakunceda njani ukulawula umbane wakho namhlanje?`
      },
      neutral: {
        en: `Hi! I'm ${assistantNames.en.neutral}, your WattWallet AI Assistant. How can I help you manage your electricity today?`,
        af: `Hallo! Ek is ${assistantNames.af.neutral}, jou WattWallet AI-assistent. Hoe kan ek jou help om jou elektrisiteit vandag te bestuur?`,
        xh: `Molo! Ndingu${assistantNames.xh.neutral}, umncedisi wakho we-AI ye-WattWallet. Ndingakunceda njani ukulawula umbane wakho namhlanje?`
      }
    };

    if (messages.length === 1 && messages[0].id === 1) {
      setMessages([{
        id: 1,
        text: greetings[assistantGender][languageKey],
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  }, [i18n.language, assistantGender]);

  // Handle dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 400));
        const newY = Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - (isOpen ? 600 : 80)));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: messages.length + 2,
          text: getAIResponse(inputMessage),
          sender: "ai",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("usage") || lowerMessage.includes("consumption")) {
      return "Your current usage is 38.2 kWh remaining. You're doing great! You've reduced consumption by 12% this month compared to last month.";
    } else if (lowerMessage.includes("save") || lowerMessage.includes("reduce")) {
      return "Here are some tips to save electricity: 1) Use energy-efficient LED bulbs 2) Unplug devices when not in use 3) Set geyser timer to heat only when needed 4) Use natural light during the day";
    } else if (lowerMessage.includes("buy") || lowerMessage.includes("purchase") || lowerMessage.includes("top up")) {
      return "Would you like to buy electricity? Your current balance is R 245.60. I can help you with a quick purchase - just let me know how much you need!";
    } else if (lowerMessage.includes("wattcoin") || lowerMessage.includes("reward")) {
      return "You have 2,450 WattCoins! You can redeem them for electricity credits or grocery vouchers. Each WattCoin is worth R0.05. Keep saving energy to earn more!";
    } else if (lowerMessage.includes("load shedding") || lowerMessage.includes("loadshedding")) {
      return "Currently, your area is at Stage 2 load shedding. Your next scheduled outage is in 3 hours. I recommend topping up your electricity before then!";
    } else {
      return "I'm here to help with electricity management, usage insights, WattCoins, and more. What would you like to know?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    // Floating button
    return (
      <div
        ref={widgetRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        className="drag-handle"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,165,0,0.6)] hover:shadow-[0_0_40px_rgba(255,165,0,0.8)] transition-all hover:scale-110 animate-pulse"
        >
          <MessageCircle className="w-8 h-8 text-white" />
          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </button>
      </div>
    );
  }

  // Chat window
  return (
    <div
      ref={widgetRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        zIndex: 9999,
        width: isMinimized ? '350px' : '400px',
        height: isMinimized ? '60px' : '600px'
      }}
      className="bg-card/95 backdrop-blur-lg rounded-2xl border border-border shadow-[0_0_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col"
    >
      {/* Header - Draggable */}
      <div
        className="drag-handle bg-gradient-to-r from-[#FF6B00] to-[#FFA500] p-4 flex items-center justify-between cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{assistantName}</h3>
            <p className="text-xs text-white/80">AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(!showSettings);
            }}
            className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {!isMinimized && showSettings && (
        <div className="bg-muted/95 backdrop-blur-lg p-4 border-b border-border">
          <h4 className="text-sm font-semibold mb-3 text-foreground">Assistant Preferences</h4>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-2">Choose your assistant:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleGenderChange("female")}
                className={`py-2 px-2 rounded-xl text-sm transition-all ${
                  assistantGender === "female"
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white"
                    : "bg-card text-foreground border border-border hover:border-primary"
                }`}
              >
                {assistantNames[languageKey].female}
                <span className="block text-xs opacity-70">Female</span>
              </button>
              <button
                onClick={() => handleGenderChange("male")}
                className={`py-2 px-2 rounded-xl text-sm transition-all ${
                  assistantGender === "male"
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white"
                    : "bg-card text-foreground border border-border hover:border-primary"
                }`}
              >
                {assistantNames[languageKey].male}
                <span className="block text-xs opacity-70">Male</span>
              </button>
              <button
                onClick={() => handleGenderChange("neutral")}
                className={`py-2 px-2 rounded-xl text-sm transition-all ${
                  assistantGender === "neutral"
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white"
                    : "bg-card text-foreground border border-border hover:border-primary"
                }`}
              >
                {assistantNames[languageKey].neutral}
                <span className="block text-xs opacity-70">Rather Not Say</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {!isMinimized && !showSettings && (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-muted-foreground'}`}>
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 bg-input border border-border rounded-xl py-2 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white p-2 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

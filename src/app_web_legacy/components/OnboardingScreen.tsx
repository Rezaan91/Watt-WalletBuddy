import { useState } from "react";
import { useNavigate } from "react-router";
import { Zap, Wallet, Gift, ChevronRight } from "lucide-react";
import wattwalletIcon from "../../imports/wattwallet-icon-1.png";
import welcomeLogo from "../../imports/welcomet-logo.png";

const slides = [
  {
    icon: Zap,
    title: "Buy Prepaid Electricity",
    description: "Purchase electricity tokens instantly and track your usage with smart meter integration.",
    gradient: "from-[#FF6B00] to-[#FFA500]",
  },
  {
    icon: Wallet,
    title: "Electricity Advances",
    description: "Need power now? Get electricity advances and pay later with flexible terms.",
    gradient: "from-[#FFA500] to-[#FFD700]",
  },
  {
    icon: Gift,
    title: "Earn WattCoins",
    description: "Get rewarded for smart energy usage and unlock exclusive benefits.",
    gradient: "from-[#FF8C42] to-[#FF7F50]",
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/auth");
    }
  };

  const handleSkip = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] flex flex-col items-center justify-between p-6 text-foreground">
      <div className="w-full flex justify-between items-center pt-4">
        <img src={wattwalletIcon} alt="WattWallet" className="h-10 w-10" />
        <button onClick={handleSkip} className="text-muted-foreground text-sm">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md">
        {currentSlide === 0 ? (
          <img
            src={welcomeLogo}
            alt="Welcome to WattWallet"
            className="w-64 h-64 mb-8 object-contain"
          />
        ) : (
          <div
            className={`w-32 h-32 rounded-full bg-gradient-to-br ${slides[currentSlide].gradient} flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(255,165,0,0.4)]`}
          >
            {(() => {
              const Icon = slides[currentSlide].icon;
              return <Icon className="w-16 h-16 text-white" />;
            })()}
          </div>
        )}

        <h1 className="text-3xl mb-4 text-center">{slides[currentSlide].title}</h1>
        <p className="text-lg text-muted-foreground text-center leading-relaxed">
          {slides[currentSlide].description}
        </p>
      </div>

      <div className="w-full max-w-md">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
        >
          <span>{currentSlide === slides.length - 1 ? "Get Started" : "Next"}</span>
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

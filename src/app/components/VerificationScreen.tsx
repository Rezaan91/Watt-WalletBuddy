import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Shield, Mail, Smartphone, Check, ArrowLeft } from "lucide-react";

export default function VerificationScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, phone } = location.state || { email: "", phone: "" };

  const [method, setMethod] = useState<"sms" | "email">(() => {
    const saved = localStorage.getItem("twoFactorMethod");
    return (saved as "sms" | "email") || "sms";
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendCode = () => {
    setCodeSent(true);
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      setIsVerifying(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    }
  };

  const handleResend = () => {
    setVerificationCode("");
    setCodeSent(false);
    setTimeout(() => {
      setCodeSent(true);
    }, 100);
  };

  const maskedPhone = phone ? `+27 ${phone.slice(0, 2)} ••• ${phone.slice(-4)}` : "+27 82 ••• 4567";
  const maskedEmail = email ? `${email.slice(0, 3)}•••@${email.split('@')[1]}` : "user•••@example.com";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/auth")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Sign Up</span>
        </button>

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(255,165,0,0.4)]">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl mb-2">Verify Your Account</h1>
          <p className="text-muted-foreground text-center">
            Choose how you'd like to receive your verification code
          </p>
        </div>

        {!codeSent ? (
          <div className="space-y-4">
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border/50 overflow-hidden">
              <button
                onClick={() => setMethod("sms")}
                className={`w-full p-4 flex items-center gap-4 transition-all ${
                  method === "sms"
                    ? "bg-primary/10 border-2 border-primary"
                    : "border-2 border-transparent hover:bg-card/70"
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p>SMS Text Message</p>
                  <p className="text-sm text-muted-foreground">{maskedPhone}</p>
                </div>
                {method === "sms" && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>

              <div className="border-t border-border/50" />

              <button
                onClick={() => setMethod("email")}
                className={`w-full p-4 flex items-center gap-4 transition-all ${
                  method === "email"
                    ? "bg-primary/10 border-2 border-primary"
                    : "border-2 border-transparent hover:bg-card/70"
                }`}
              >
                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 text-left">
                  <p>Email</p>
                  <p className="text-sm text-muted-foreground">{maskedEmail}</p>
                </div>
                {method === "email" && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            </div>

            <button
              onClick={handleSendCode}
              className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
            >
              Send Verification Code
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4">
                {method === "sms" ? (
                  <Smartphone className="w-8 h-8 text-white" />
                ) : (
                  <Mail className="w-8 h-8 text-white" />
                )}
              </div>
              <h3 className="mb-2">Enter Verification Code</h3>
              <p className="text-sm text-muted-foreground mb-6">
                We've sent a 6-digit code to {method === "sms" ? maskedPhone : maskedEmail}
              </p>

              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-input border border-border rounded-xl py-4 px-4 text-foreground text-center text-2xl tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              />

              <button
                onClick={handleResend}
                className="text-sm text-primary hover:underline"
              >
                Didn't receive the code? Resend
              </button>
            </div>

            <button
              onClick={handleVerify}
              disabled={verificationCode.length !== 6 || isVerifying}
              className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              onClick={() => setCodeSent(false)}
              className="w-full bg-card/50 border border-border text-foreground py-4 rounded-2xl hover:bg-card/70 transition-colors"
            >
              Change Verification Method
            </button>
          </div>
        )}

        <div className="mt-6 bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4">
          <p className="text-sm text-muted-foreground text-center">
            <span className="text-blue-400">Tip:</span> Check your spam folder if you don't receive the email within a few minutes
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ArrowLeft, Shield, Smartphone, Mail, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";

export default function TwoFactorScreen() {
  const [isEnabled, setIsEnabled] = useState(() => {
    const saved = localStorage.getItem("twoFactorEnabled");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [method, setMethod] = useState<"sms" | "email">(() => {
    const saved = localStorage.getItem("twoFactorMethod");
    return (saved as "sms" | "email") || "sms";
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const { user } = useUser();

  const navigate = useNavigate();

  const handleEnable = () => {
    setShowVerification(true);
  };

  const handleVerify = () => {
    if (verificationCode.length === 6) {
      setIsEnabled(true);
      localStorage.setItem("twoFactorEnabled", JSON.stringify(true));
      localStorage.setItem("twoFactorMethod", method);
      setShowVerification(false);
      setVerificationCode("");
    }
  };

  const handleDisable = () => {
    setIsEnabled(false);
    localStorage.setItem("twoFactorEnabled", JSON.stringify(false));
  };

  const handleMethodChange = (newMethod: "sms" | "email") => {
    setMethod(newMethod);
    if (isEnabled) {
      localStorage.setItem("twoFactorMethod", newMethod);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/settings")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Two-Factor Authentication</h1>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
        </div>

        <div className={`${isEnabled ? "bg-green-500/20 border-green-500/30" : "bg-blue-500/20 border-blue-500/30"} border rounded-2xl p-4 flex gap-3`}>
          <Shield className={`w-5 h-5 ${isEnabled ? "text-green-400" : "text-blue-400"} flex-shrink-0 mt-0.5`} />
          <div>
            <p className={`mb-2 ${isEnabled ? "text-gray-900 dark:text-gray-100" : "text-foreground dark:text-gray-900"}`}>
              {isEnabled ? "Two-factor authentication is enabled" : "Two-factor authentication adds an extra security layer"}
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-100">
              {isEnabled
                ? "Your account is protected with two-factor authentication"
                : "You'll need to enter a code from your phone in addition to your password"}
            </p>
          </div>
        </div>

        {!isEnabled && !showVerification && (
          <>
            <div>
              <h3 className="text-sm text-muted-foreground mb-3 px-2">Choose Verification Method</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleMethodChange("sms")}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                    method === "sms"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/50"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p>SMS Text Message</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.phone ? user.phone.replace(/(\d{3})(\d{2}).*(\d{4})/, '$1 $2 ••• $3') : '+27 71 ••• 5678'}
                    </p>
                  </div>
                  {method === "sms" && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => handleMethodChange("email")}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                    method === "email"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/50"
                  }`}
                >
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p>Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email ? user.email.replace(/(.{6}).*(@.*)/, '$1••••$2') : 'zhaida••••@wattwallet.co.za'}
                    </p>
                  </div>
                  {method === "email" && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleEnable}
              className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
            >
              Enable Two-Factor Authentication
            </button>
          </>
        )}

        {showVerification && (
          <div className="space-y-4">
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-2">Enter Verification Code</h3>
              <p className="text-sm text-muted-foreground mb-6">
                We've sent a 6-digit code to your {method === "sms" ? "phone" : "email"}
              </p>

              <input
                type="text"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full bg-input border border-border rounded-xl py-4 px-4 text-foreground text-center text-2xl tracking-widest placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              />

              <button className="text-sm text-primary hover:underline">
                Didn't receive the code? Resend
              </button>
            </div>

            <button
              onClick={handleVerify}
              disabled={verificationCode.length !== 6}
              className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify & Enable
            </button>

            <button
              onClick={() => setShowVerification(false)}
              className="w-full bg-card/50 border border-border text-foreground py-4 rounded-2xl hover:bg-card/70 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {isEnabled && (
          <>
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl p-4 border border-border/50">
              <h3 className="text-sm text-muted-foreground mb-3 px-2">Current Settings</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleMethodChange("sms")}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                    method === "sms"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/50"
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p>SMS Text Message</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.phone ? user.phone.replace(/(\d{3})(\d{2}).*(\d{4})/, '$1 $2 ••• $3') : '+27 71 ••• 5678'}
                    </p>
                  </div>
                  {method === "sms" && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>

                <button
                  onClick={() => handleMethodChange("email")}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                    method === "email"
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/50"
                  }`}
                >
                  <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 text-left">
                    <p>Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.email ? user.email.replace(/(.{6}).*(@.*)/, '$1••••$2') : 'zhaida••••@wattwallet.co.za'}
                    </p>
                  </div>
                  {method === "email" && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={handleDisable}
              className="w-full bg-red-500/20 border border-red-500/30 text-red-400 py-4 rounded-2xl hover:bg-red-500/30 transition-colors"
            >
              Disable Two-Factor Authentication
            </button>
          </>
        )}
      </div>
    </div>
  );
}

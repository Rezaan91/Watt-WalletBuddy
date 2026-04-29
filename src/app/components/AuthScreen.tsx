import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, Lock, User, CreditCard, Phone, Eye, EyeOff, AlertCircle } from "lucide-react";
import wattwalletIcon from "../../imports/wattwallet-icon.png";
import { useUser } from "../context/UserContext";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();

  const validatePassword = (pwd: string) => {
    const hasCapital = /[A-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const isValidLength = pwd.length >= 8 && pwd.length <= 13;

    if (!isValidLength) {
      return "Password must be 8-13 characters long";
    }
    if (!hasCapital) {
      return "Password must contain at least one capital letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecial) {
      return "Password must contain at least one special character";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      navigate("/dashboard");
    } else {
      const pwdError = validatePassword(password);
      if (pwdError) {
        setPasswordError(pwdError);
        return;
      }
      if (password !== confirmPassword) {
        setPasswordError("Passwords do not match");
        return;
      }
      setPasswordError("");
      setUser({ name, email, phone, idNumber });
      navigate("/verify", { state: { email, phone } });
    }
  };

  const handleGoogleSignIn = () => {
    const googleEmail = "john.doe@gmail.com";
    const userName = "John Doe";
    setUser({ name: userName, email: googleEmail, phone: "", idNumber: "" });
    navigate("/verify", { state: { email: googleEmail, phone: "" } });
  };

  const handleMicrosoftSignIn = () => {
    const msEmail = "jane.smith@outlook.com";
    const userName = "Jane Smith";
    setUser({ name: userName, email: msEmail, phone: "", idNumber: "" });
    navigate("/verify", { state: { email: msEmail, phone: "" } });
  };

  const handleAppleSignIn = () => {
    const appleEmail = "alex.johnson@icloud.com";
    const userName = "Alex Johnson";
    setUser({ name: userName, email: appleEmail, phone: "", idNumber: "" });
    navigate("/verify", { state: { email: appleEmail, phone: "" } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={wattwalletIcon} alt="WattWallet" className="w-20 h-20 mb-4" />
          <h1 className="text-3xl text-white mb-2">
            {isLogin ? "Welcome Back" : "Get Started"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to your account" : "Create your WattWallet account"}
          </p>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-3xl p-6 border border-border/50 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="flex bg-muted rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setPasswordError("");
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                isLogin
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setPasswordError("");
              }}
              className={`flex-1 py-2 rounded-lg transition-all ${
                !isLogin
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="SA ID Number"
                    maxLength={13}
                    pattern="[0-9]{13}"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="Cellphone Number"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-input border border-border rounded-xl py-3 pl-12 pr-12 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            {!isLogin && (
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1">Password must contain:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>8-13 characters</li>
                    <li>At least one capital letter</li>
                    <li>At least one number</li>
                    <li>At least one special character (!@#$%^&*)</li>
                  </ul>
                </div>
              </div>
            )}

            {passwordError && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3 flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{passwordError}</p>
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-3 rounded-xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleGoogleSignIn}
              className="w-full bg-white text-gray-900 py-3 rounded-xl flex items-center justify-center gap-3 border border-border hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button
              onClick={handleMicrosoftSignIn}
              className="w-full bg-white text-gray-900 py-3 rounded-xl flex items-center justify-center gap-3 border border-border hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#F25022" d="M11.4 11.4H0V0h11.4v11.4z"/>
                <path fill="#00A4EF" d="M24 11.4H12.6V0H24v11.4z"/>
                <path fill="#7FBA00" d="M11.4 24H0V12.6h11.4V24z"/>
                <path fill="#FFB900" d="M24 24H12.6V12.6H24V24z"/>
              </svg>
              <span>Microsoft</span>
            </button>

            <button
              onClick={handleAppleSignIn}
              className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-3 border border-border hover:bg-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span>Apple</span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}

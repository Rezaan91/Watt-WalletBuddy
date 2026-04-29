import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { useNavigate } from "react-router";

export default function ChangePasswordScreen() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const navigate = useNavigate();

  const handleSave = () => {
    if (formData.newPassword === formData.confirmPassword && formData.currentPassword) {
      navigate("/settings");
    }
  };

  const passwordStrength = (password: string) => {
    if (password.length < 6) return { strength: "Weak", color: "text-red-400" };
    if (password.length < 10) return { strength: "Medium", color: "text-yellow-400" };
    return { strength: "Strong", color: "text-green-400" };
  };

  const strength = passwordStrength(formData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/settings")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Change Password</h1>
            <p className="text-sm text-muted-foreground">Update your account password</p>
          </div>
        </div>

        <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-4 flex gap-3">
          <Lock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-100">
            Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="w-full bg-card/50 border border-border rounded-xl py-3 pl-4 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">New Password</label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="w-full bg-card/50 border border-border rounded-xl py-3 pl-4 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.newPassword && (
              <p className={`text-xs mt-2 ${strength.color}`}>
                Password strength: {strength.strength}
              </p>
            )}
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full bg-card/50 border border-border rounded-xl py-3 pl-4 pr-12 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="text-xs mt-2 text-red-400">Passwords do not match</p>
            )}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={
            !formData.currentPassword ||
            !formData.newPassword ||
            formData.newPassword !== formData.confirmPassword
          }
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}

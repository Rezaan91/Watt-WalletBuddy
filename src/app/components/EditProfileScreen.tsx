import { useState, useEffect } from "react";
import { ArrowLeft, Camera, Save, Zap } from "lucide-react";
import { useNavigate } from "react-router";
import { useUser, UserGender } from "../context/UserContext";

export default function EditProfileScreen() {
  const { user, setUser } = useUser();
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    idNumber: user?.idNumber || "",
    meterNumber: user?.meterNumber || "",
    address: user?.address || "",
    gender: (user?.gender || "female") as UserGender,
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        idNumber: user.idNumber,
        meterNumber: user.meterNumber || "",
        address: user.address || "",
        gender: (user.gender || "female") as UserGender,
      });
    }
  }, [user]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    setUser({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      idNumber: formData.idNumber,
      meterNumber: formData.meterNumber,
      address: formData.address,
      gender: formData.gender,
      householdId: user?.householdId,
      role: user?.role,
    });
    navigate("/settings");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/settings")} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl">Edit Profile</h1>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-full flex items-center justify-center text-3xl">
              {formData.fullName ? getInitials(formData.fullName) : "U"}
            </div>
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-background">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">Tap to change photo</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">ID Number</label>
            <input
              type="text"
              value={formData.idNumber}
              onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
              className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
              Meter Number
              <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3" />
                Free Electricity
              </span>
            </label>
            <input
              type="text"
              value={formData.meterNumber}
              onChange={(e) => setFormData({ ...formData, meterNumber: e.target.value })}
              placeholder="e.g., 04123456789012"
              className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Add your meter number to check Free Basic Electricity eligibility
            </p>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={6}
              placeholder="Street Address&#10;Suburb&#10;City&#10;Province&#10;Postal Code&#10;Country"
              className="w-full bg-card/50 border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Gender Preference</label>
            <p className="text-xs text-muted-foreground mb-3">This affects your AI Assistant's name and voice</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: "female" })}
                className={`py-3 px-4 rounded-xl text-sm transition-all ${
                  formData.gender === "female"
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white"
                    : "bg-card/50 text-foreground border border-border hover:border-primary"
                }`}
              >
                Female
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: "male" })}
                className={`py-3 px-4 rounded-xl text-sm transition-all ${
                  formData.gender === "male"
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white"
                    : "bg-card/50 text-foreground border border-border hover:border-primary"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: "neutral" })}
                className={`py-3 px-4 rounded-xl text-sm transition-all ${
                  formData.gender === "neutral"
                    ? "bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white"
                    : "bg-card/50 text-foreground border border-border hover:border-primary"
                }`}
              >
                Rather Not Say
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
        >
          <Save className="w-5 h-5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  User,
  Bell,
  Moon,
  Sun,
  Globe,
  Lock,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Shield,
  Users,
  MessageCircle,
} from "lucide-react";
import { useUser } from "../context/UserContext";
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const [notifications, setNotifications] = useState(true);
  const [twoFactorEnabled] = useState(() => {
    const saved = localStorage.getItem("twoFactorEnabled");
    return saved !== null ? JSON.parse(saved) : false;
  });
  const navigate = useNavigate();
  const { user, clearUser, isPrimary } = useUser();
  const { t, i18n } = useTranslation();

  const getLanguageName = () => {
    const languageNames: Record<string, string> = {
      en: "English",
      af: "Afrikaans",
      xh: "isiXhosa",
    };
    return languageNames[i18n.language] || "English";
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleDarkModeToggle = (value: boolean) => {
    setDarkMode(value);
    localStorage.setItem("darkMode", JSON.stringify(value));
    if (value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  const getProfileSubtitle = () => {
    return user?.name || "User";
  };

  const accountItems = [
    { icon: User, label: t("settings.profile"), subtitle: getProfileSubtitle(), action: () => navigate("/settings/profile") },
    { icon: Users, label: t("settings.familySharing"), subtitle: t("settings.familySharingSubtitle"), action: () => navigate("/settings/family") },
    { icon: CreditCard, label: t("settings.paymentMethods"), subtitle: t("settings.paymentMethodsSubtitle"), action: () => navigate("/settings/payment") },
  ];

  // Add "Manage Users" option for PRIMARY users only
  if (isPrimary()) {
    accountItems.splice(2, 0, {
      icon: Users,
      label: "Manage Users",
      subtitle: `Family Code: ${user?.householdId || "N/A"}`,
      action: () => navigate("/settings/users")
    });
  }

  const settingsSections = [
    {
      title: t("settings.account"),
      items: accountItems,
    },
    {
      title: t("settings.preferences"),
      items: [
        {
          icon: Bell,
          label: t("settings.notifications"),
          subtitle: notifications ? t("settings.enabled") : t("settings.disabled"),
          toggle: true,
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: Moon,
          label: t("settings.appearance"),
          subtitle: darkMode ? t("settings.dark") : t("settings.light"),
          toggle: true,
          value: darkMode,
          onChange: handleDarkModeToggle,
        },
        { icon: Globe, label: t("settings.language"), subtitle: getLanguageName(), action: () => navigate("/settings/language") },
      ],
    },
    {
      title: t("settings.security"),
      items: [
        { icon: Lock, label: t("settings.changePassword"), action: () => navigate("/settings/password") },
        {
          icon: Shield,
          label: t("settings.twoFactor"),
          subtitle: twoFactorEnabled ? "Enabled" : "Disabled",
          action: () => navigate("/settings/twofactor")
        },
      ],
    },
    {
      title: t("settings.support"),
      items: [
        { icon: HelpCircle, label: t("settings.helpCenter"), action: () => navigate("/settings/help") },
        { icon: MessageCircle, label: t("settings.contactSupport"), action: () => navigate("/settings/contact") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-[#0f172a] dark:to-[#1e293b] text-foreground">
      <div className="p-6 max-w-md mx-auto space-y-6">
        <div>
          <h1 className="text-3xl mb-2">{t("settings.title")}</h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
        </div>

        <div className="bg-gradient-to-br from-[#FF6B00] to-[#FFA500] rounded-3xl p-6 shadow-[0_0_40px_rgba(255,165,0,0.3)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl">
              {user?.name ? getInitials(user.name) : "U"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl">{user?.name || "User"}</h3>
                {user?.role && (
                  <span className="bg-white/20 text-white text-xs px-2 py-1 rounded">
                    {user.role === "PRIMARY" ? "Primary" : "Secondary"}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/80">{user?.email || "user@example.com"}</p>
              <p className="text-xs text-white/70 mt-1">{t("settings.memberSince", { date: "April 2026" })}</p>
            </div>
          </div>
        </div>

        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h3 className="text-sm text-muted-foreground mb-3 px-2">{section.title}</h3>
            <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border/50 overflow-hidden">
              {section.items.map((item, itemIndex) => {
                let Icon = item.icon;
                if (item.label === "Appearance") {
                  Icon = darkMode ? Moon : Sun;
                }
                const WrapperElement = item.toggle ? "div" : "button";
                return (
                  <WrapperElement
                    key={itemIndex}
                    onClick={item.toggle ? undefined : item.action}
                    className={`w-full p-4 flex items-center gap-4 hover:bg-card/70 transition-colors ${
                      itemIndex !== section.items.length - 1 ? "border-b border-border/50" : ""
                    }`}
                  >
                    <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                      <p>{item.label}</p>
                      {item.subtitle && (
                        <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                      )}
                    </div>
                    {item.toggle ? (
                      <button
                        onClick={() => item.onChange?.(!item.value)}
                        className={`w-12 h-7 rounded-full transition-colors relative ${
                          item.value ? "bg-primary" : "bg-muted"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${
                            item.value ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </WrapperElement>
                );
              })}
            </div>
          </div>
        ))}

        <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border/50 overflow-hidden">
          <button
            onClick={handleLogout}
            className="w-full p-4 flex items-center gap-4 hover:bg-card/70 transition-colors"
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <LogOut className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-red-400">{t("settings.logOut")}</p>
            </div>
          </button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          <p>WattWallet v1.0.0</p>
          <p className="mt-1">© 2026 WattWallet. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, TrendingUp, Zap, Award, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import BackgroundLogo from "./BackgroundLogo";
import { useTranslation } from "react-i18next";
import AIAssistantWidget from "./AIAssistantWidget";
import { useUser } from "../context/UserContext";

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNav, setShowNav] = useState(true);
  const { t } = useTranslation();
  const { user } = useUser();

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    const isDark = saved !== null ? JSON.parse(saved) : false;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const hideNavRoutes = ["/", "/auth", "/verify"];
    const isSettingsSubPage = location.pathname.startsWith("/settings/");
    setShowNav(!hideNavRoutes.includes(location.pathname) && !isSettingsSubPage);
  }, [location]);

  const navItems = [
    { path: "/dashboard", icon: Home, label: t("nav.home") },
    { path: "/usage", icon: TrendingUp, label: t("nav.usage") },
    { path: "/buy", icon: Zap, label: t("nav.buy") },
    { path: "/rewards", icon: Award, label: t("nav.rewards") },
    { path: "/settings", icon: Menu, label: t("nav.menu") },
  ];

  return (
    <div className="flex flex-col h-screen bg-background relative">
      <BackgroundLogo />
      <main className="flex-1 overflow-y-auto pb-20 relative z-10">
        <Outlet />
      </main>

      {/* Floating AI Assistant Widget - Only show when user is logged in */}
      {user && <AIAssistantWidget />}

      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-3 safe-area-bottom z-40">
          <div className="flex justify-around items-center max-w-md mx-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === "/settings"
                ? location.pathname.startsWith("/settings")
                : location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? "fill-primary" : ""}`} />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

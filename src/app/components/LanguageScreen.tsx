import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "xh", name: "isiXhosa", nativeName: "isiXhosa" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans" },
];

export default function LanguageScreen() {
  const { i18n, t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const navigate = useNavigate();

  const handleSave = () => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem("language", selectedLanguage);
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
            <h1 className="text-2xl">Language</h1>
            <p className="text-sm text-muted-foreground">Choose your preferred language</p>
          </div>
        </div>

        <div className="bg-card/50 backdrop-blur-lg rounded-2xl border border-border/50 overflow-hidden">
          {languages.map((language, index) => (
            <button
              key={language.code}
              onClick={() => setSelectedLanguage(language.code)}
              className={`w-full p-4 flex items-center justify-between hover:bg-card/70 transition-colors ${
                index !== languages.length - 1 ? "border-b border-border/50" : ""
              }`}
            >
              <div className="text-left">
                <p>{language.name}</p>
                <p className="text-sm text-muted-foreground">{language.nativeName}</p>
              </div>
              {selectedLanguage === language.code && (
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

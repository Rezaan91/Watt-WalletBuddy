import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance, View, useColorScheme as useSystemColorScheme } from "react-native";
import { colorScheme as nativewindColorScheme, vars } from "nativewind";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { SchemeColors, type ColorScheme } from "@/constants/theme";

export type ThemePreference = "light" | "dark" | "system";

type ThemeContextValue = {
  colorScheme: ColorScheme;
  preference: ThemePreference;
  setColorScheme: (scheme: ColorScheme) => void;
  setThemePreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_KEY = "wattwallet.theme.preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme() ?? "light";
  const [preference, setPreference] = useState<ThemePreference>("system");
  const resolvedScheme: ColorScheme = preference === "system" ? systemScheme : preference;

  const applyScheme = useCallback((scheme: ColorScheme) => {
    nativewindColorScheme.set(scheme);
    Appearance.setColorScheme?.(scheme);
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.dataset.theme = scheme;
      root.classList.toggle("dark", scheme === "dark");
      Object.entries(SchemeColors[scheme]).forEach(([token, value]) => {
        root.style.setProperty(`--color-${token}`, value);
      });
    }
  }, []);

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    setPreference(nextPreference);
    void AsyncStorage.setItem(THEME_KEY, nextPreference);
  }, []);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setThemePreference(scheme);
  }, [setThemePreference]);

  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (!active || !stored) return;
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreference(stored);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    applyScheme(resolvedScheme);
  }, [applyScheme, resolvedScheme]);

  const themeVariables = useMemo(
    () =>
      vars({
        "color-primary": SchemeColors[resolvedScheme].primary,
        "color-secondary": SchemeColors[resolvedScheme].secondary,
        "color-gold": SchemeColors[resolvedScheme].gold,
        "color-background": SchemeColors[resolvedScheme].background,
        "color-surface": SchemeColors[resolvedScheme].surface,
        "color-surfaceMuted": SchemeColors[resolvedScheme].surfaceMuted,
        "color-foreground": SchemeColors[resolvedScheme].foreground,
        "color-muted": SchemeColors[resolvedScheme].muted,
        "color-border": SchemeColors[resolvedScheme].border,
        "color-success": SchemeColors[resolvedScheme].success,
        "color-warning": SchemeColors[resolvedScheme].warning,
        "color-error": SchemeColors[resolvedScheme].error,
      }),
    [resolvedScheme],
  );

  const value = useMemo(
    () => ({
      colorScheme: resolvedScheme,
      preference,
      setColorScheme,
      setThemePreference,
    }),
    [preference, resolvedScheme, setColorScheme, setThemePreference],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={[{ flex: 1 }, themeVariables]}>{children}</View>
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return ctx;
}

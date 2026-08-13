import themeConfig from "../../theme.config";

export type ColorScheme = "light" | "dark";

export type ThemeColorPalette = {
  primary: string;
  secondary: string;
  gold: string;
  background: string;
  surface: string;
  surfaceMuted: string;
  foreground: string;
  muted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  tint: string;
  icon: string;
  text: string;
};

const themeColors = themeConfig.themeColors as Record<keyof ThemeColorPalette, Record<ColorScheme, string>>;

const makePalette = (scheme: ColorScheme): ThemeColorPalette => {
  const palette = Object.fromEntries(
    Object.entries(themeColors).map(([key, value]) => [key, value[scheme]]),
  ) as Omit<ThemeColorPalette, "tint" | "icon" | "text">;
  return {
    ...palette,
    tint: palette.primary,
    icon: palette.muted,
    text: palette.foreground,
  };
};

export const SchemeColors: Record<ColorScheme, ThemeColorPalette> = {
  light: makePalette("light"),
  dark: makePalette("dark"),
};

export const Colors = SchemeColors;

export type ThemeColors = typeof Colors;

export const Fonts = {
  sans: "System",
  rounded: "System",
  mono: "Menlo",
};

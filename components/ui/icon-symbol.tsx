import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconName = ComponentProps<typeof MaterialIcons>["name"];

const MAPPING: Record<string, IconName> = {
  "house.fill": "home",
  "bolt.fill": "bolt",
  "clock.arrow.circlepath": "history",
  "trophy.fill": "toll",
  "person.crop.circle": "person-outline",
  "bell.fill": "notifications-none",
  "arrow.forward": "arrow-forward",
  "arrow.left": "arrow-back",
  "creditcard.fill": "credit-card",
  "doc.text": "receipt-long",
  "gearshape.fill": "settings",
  "chevron.right": "chevron-right",
  "plus": "add",
};

export function IconSymbol({ name, size = 24, color, style }: { name: keyof typeof MAPPING | string; size?: number; color: string | OpaqueColorValue; style?: StyleProp<TextStyle>; weight?: string }) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name] ?? "circle"} style={style} />;
}

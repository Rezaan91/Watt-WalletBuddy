import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/use-colors";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 10);
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: [styles.tabBar, { height: 62 + bottom, paddingBottom: bottom, backgroundColor: colors.surface, borderTopColor: colors.border }],
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, React.ComponentProps<typeof MaterialIcons>["name"]> = {
            index: "home",
            buy: "bolt",
            history: "receipt-long",
            rewards: "toll",
            profile: "person-outline",
          };
          return <MaterialIcons name={icons[route.name] ?? "circle"} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="buy" options={{ title: "Buy" }} />
      <Tabs.Screen name="history" options={{ title: "History" }} />
      <Tabs.Screen name="rewards" options={{ title: "Rewards" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: { position: "absolute", borderTopWidth: 1, paddingTop: 8, elevation: 0 },
  label: { fontSize: 11, fontWeight: "700" },
});

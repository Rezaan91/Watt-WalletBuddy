import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

import { useColors } from "@/hooks/use-colors";
import { useWattWallet } from "@/lib/wattwallet/store";

export function WattAssistWidget() {
  const colors = useColors();
  const { workspace } = useWattWallet();
  const assistantName = workspace?.preferences.assistantName || "WattAssist";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(1) }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Pressable
        onPress={() => router.push("/wattassist")}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.primary, shadowColor: colors.primary },
          pressed && styles.pressed
        ]}
      >
        <MaterialIcons name="chat-bubble" size={24} color="#FFFFFF" />
        <View style={[styles.badge, { backgroundColor: colors.gold }]}>
          <Text style={styles.badgeText}>1</Text>
        </View>
      </Pressable>
      <View style={[styles.labelContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.foreground }]}>{assistantName}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    right: 20,
    alignItems: "center",
    zIndex: 1000,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
  labelContainer: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.95 }],
  },
});

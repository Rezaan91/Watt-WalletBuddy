import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/lib/_core/nativewind-pressable";
import { ThemeProvider } from "@/lib/theme-provider";
import { WattWalletProvider } from "@/lib/wattwallet/store";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <WattWalletProvider>
          <SafeAreaProvider>
            <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="auth" options={{ animation: "fade" }} />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="buy" options={{ presentation: "modal" }} />
              <Stack.Screen name="advance" options={{ presentation: "modal" }} />
              <Stack.Screen name="meters" options={{ presentation: "modal" }} />
              <Stack.Screen name="notifications" options={{ presentation: "modal" }} />
              <Stack.Screen name="wattassist" options={{ presentation: "modal" }} />
              <Stack.Screen name="purchase/[id]" options={{ presentation: "modal" }} />
              <Stack.Screen name="oauth/callback" />
            </Stack>
            <StatusBar style="auto" />
          </SafeAreaProvider>
        </WattWalletProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

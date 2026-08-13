import { Redirect } from "expo-router";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { WattWalletMark } from "@/components/wattwallet-ui";
import { useColors } from "@/hooks/use-colors";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function IndexRoute() {
  const colors = useColors();
  const { hydrated, profile } = useWattWallet();
  if (!hydrated) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <WattWalletMark size={78} />
        <Text style={[styles.loadingTitle, { color: colors.foreground }]}>WattWallet</Text>
        <ActivityIndicator color={colors.primary} style={styles.spinner} />
      </View>
    );
  }
  return profile ? <Redirect href="/(tabs)" /> : <Redirect href="/auth/login" />;
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingTitle: { fontSize: 23, fontWeight: "800", marginTop: 12 },
  spinner: { marginTop: 22 },
});

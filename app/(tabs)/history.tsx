import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { AppHeader, EmptyState, SectionTitle, StatusPill } from "@/components/wattwallet-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { formatCurrency, formatDate } from "@/lib/wattwallet/types";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function HistoryScreen() {
  const colors = useColors();
  const { profile, workspace, unreadCount } = useWattWallet();
  const purchases = workspace?.purchases ?? [];
  if (!profile || !workspace) return null;

  return (
    <ScreenContainer className="px-5 pt-4">
      <AppHeader title="History" subtitle="Every purchase, in one place." profile={profile} notificationCount={unreadCount} onNotifications={() => router.push("/notifications")} onProfile={() => router.push("/(tabs)/profile")} />
      <View style={styles.summaryRow}><View><Text style={[styles.summaryLabel, { color: colors.muted }]}>Total purchases</Text><Text style={[styles.summaryValue, { color: colors.foreground }]}>{purchases.length}</Text></View><View style={styles.summaryDivider} /><View><Text style={[styles.summaryLabel, { color: colors.muted }]}>Total powered</Text><Text style={[styles.summaryValue, { color: colors.foreground }]}>{formatCurrency(purchases.filter((item) => item.status === "success").reduce((sum, item) => sum + item.amount, 0))}</Text></View></View>
      <SectionTitle title="Transactions" />
      {purchases.length === 0 ? <EmptyState icon="receipt-long" title="No transactions yet" body="Your electricity purchases and receipts will be saved here." action="Buy electricity" onAction={() => router.push("/(tabs)/buy")} /> : <FlatList data={purchases} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => <Pressable onPress={() => router.push({ pathname: "/purchase/[id]" as never, params: { id: item.id } })} style={({ pressed }) => [styles.row, { borderBottomColor: colors.border }, pressed && styles.pressed]}><View style={[styles.iconCircle, { backgroundColor: item.status === "success" ? `${colors.success}18` : `${colors.error}18` }]}><MaterialIcons name={item.status === "success" ? "bolt" : "error-outline"} size={20} color={item.status === "success" ? colors.success : colors.error} /></View><View style={styles.copy}><Text style={[styles.meterName, { color: colors.foreground }]}>{item.meterNickname}</Text><Text style={[styles.meta, { color: colors.muted }]}>{formatDate(item.createdAt)} · {item.wattCoins} WattCoins</Text></View><View style={styles.trailing}><Text style={[styles.amount, { color: colors.foreground }]}>{formatCurrency(item.amount)}</Text><StatusPill label={item.status === "success" ? "Successful" : "Failed"} tone={item.status === "success" ? "success" : "error"} /></View></Pressable>} />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  summaryRow: { flexDirection: "row", alignItems: "center", paddingVertical: 15, marginBottom: 22 },
  summaryLabel: { fontSize: 12, fontWeight: "600" },
  summaryValue: { fontSize: 21, fontWeight: "900", marginTop: 5 },
  summaryDivider: { width: 1, height: 32, backgroundColor: "#DDE9E2", marginHorizontal: 25 },
  list: { paddingBottom: 120 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1 },
  iconCircle: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  copy: { flex: 1, marginLeft: 11 },
  meterName: { fontSize: 14, fontWeight: "800" },
  meta: { fontSize: 11, lineHeight: 16, marginTop: 4 },
  trailing: { alignItems: "flex-end", gap: 5 },
  amount: { fontSize: 14, fontWeight: "900" },
  pressed: { opacity: 0.68 },
});

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";

import { AppHeader, PrimaryButton, SectionTitle, StatusPill, Surface, WattCoinArtwork } from "@/components/wattwallet-ui";
import { ScreenContainer } from "@/components/screen-container";
import { WattAssistWidget } from "@/components/wattassist-widget";
import { useColors } from "@/hooks/use-colors";
import { formatCurrency, formatDate, maskMeter } from "@/lib/wattwallet/types";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function HomeScreen() {
  const colors = useColors();
  const { profile, workspace, unreadCount } = useWattWallet();
  const meter = workspace?.meters.find((item) => item.isDefault) ?? workspace?.meters[0];
  const recent = workspace?.purchases.slice(0, 3) ?? [];

  if (!profile || !workspace) return null;

  return (
    <ScreenContainer className="px-5 pt-4" containerClassName="bg-background">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader title={`Hi, ${profile.firstName}`} subtitle="Your power, your wallet." profile={profile} notificationCount={unreadCount} onNotifications={() => router.push("/notifications")} onProfile={() => router.push("/(tabs)/profile")} />

        <Surface style={[styles.walletCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}>
          <View style={styles.walletCardTop}><View><Text style={styles.walletEyebrow}>ACTIVE METER</Text><Text style={styles.walletMeter}>{meter?.nickname ?? "No meter selected"}</Text><Text style={styles.walletNumber}>{meter ? maskMeter(meter.meterNumber) : "Add a meter to get started"}</Text></View><View style={styles.walletIcon}><MaterialIcons name="bolt" size={25} color={colors.primary} /></View></View>
          <View style={styles.walletDivider} />
          <View style={styles.walletBottom}><View><Text style={styles.walletLabel}>Status</Text><View style={styles.walletStatus}><View style={styles.liveDot} /><Text style={styles.walletStatusText}>Ready to buy</Text></View></View><PrimaryButton title="Buy electricity" onPress={() => router.push("/(tabs)/buy")} icon="arrow-forward" style={styles.walletButton} /></View>
        </Surface>

        <View style={styles.coinRow}>
          <Surface style={styles.coinCard}>
            <View style={styles.coinHeader}>
              <View>
                <Text style={[styles.cardEyebrow, { color: colors.primary }]}>WATTCOINS</Text>
                <Text style={[styles.coinBalance, { color: colors.foreground }]}>{workspace.wattCoins.toLocaleString()}</Text>
                <Text style={[styles.coinCaption, { color: colors.muted }]}>Available to redeem later</Text>
              </View>
              <WattCoinArtwork size={63} />
            </View>
            <Pressable onPress={() => router.push("/(tabs)/rewards")} style={styles.textAction}>
              <Text style={[styles.textActionLabel, { color: colors.primary }]}>View rewards</Text>
              <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
            </Pressable>
          </Surface>
        </View>

        {workspace.advances.some(a => a.status === 'active') && (
          <View style={styles.advanceRow}>
            <Surface style={[styles.advanceCard, { borderColor: colors.primary }]}>
              <View style={styles.advanceHeader}>
                <View>
                  <Text style={[styles.cardEyebrow, { color: colors.primary }]}>ACTIVE ADVANCE</Text>
                  <Text style={[styles.advanceAmount, { color: colors.foreground }]}>
                    {formatCurrency(workspace.advances.find(a => a.status === 'active')?.outstandingAmount || 0)}
                  </Text>
                </View>
                <View style={[styles.advanceIcon, { backgroundColor: colors.primary + '18' }]}>
                  <MaterialIcons name="bolt" size={24} color={colors.primary} />
                </View>
              </View>
              <Pressable onPress={() => router.push("/advance")} style={styles.textAction}>
                <Text style={[styles.textActionLabel, { color: colors.primary }]}>Manage advance</Text>
                <MaterialIcons name="arrow-forward" size={16} color={colors.primary} />
              </Pressable>
            </Surface>
          </View>
        )}

        <View style={styles.quickSection}><SectionTitle title="Quick actions" /><View style={styles.quickGrid}>{[
          { label: "Buy electricity", icon: "bolt", onPress: () => router.push("/(tabs)/buy"), tint: colors.primary },
          { label: "Manage meters", icon: "speed", onPress: () => router.push("/meters"), tint: colors.secondary },
          { label: "Electricity Advance", icon: "request-quote", onPress: () => router.push("/advance"), tint: colors.gold },
          { label: "History", icon: "receipt-long", onPress: () => router.push("/(tabs)/history"), tint: colors.primary },
        ].map((item) => <Pressable key={item.label} onPress={item.onPress} style={({ pressed }) => [styles.quickAction, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && styles.pressed]}><View style={[styles.quickIcon, { backgroundColor: `${item.tint}18` }]}><MaterialIcons name={item.icon as React.ComponentProps<typeof MaterialIcons>["name"]} size={20} color={item.tint} /></View><Text style={[styles.quickLabel, { color: colors.foreground }]}>{item.label}</Text></Pressable>)}</View></View>

        <SectionTitle title="Recent activity" action="See all" onAction={() => router.push("/(tabs)/history")} />
        {recent.length === 0 ? <Surface muted style={styles.emptyRecent}><MaterialIcons name="auto-graph" size={22} color={colors.primary} /><Text style={[styles.emptyRecentTitle, { color: colors.foreground }]}>Your activity will appear here</Text><Text style={[styles.emptyRecentBody, { color: colors.muted }]}>Make your first simulated purchase to start your wallet history.</Text></Surface> : recent.map((purchase) => <Pressable key={purchase.id} onPress={() => router.push({ pathname: "/purchase/[id]" as never, params: { id: purchase.id } })} style={({ pressed }) => [styles.activityRow, { borderBottomColor: colors.border }, pressed && styles.pressed]}><View style={[styles.activityIcon, { backgroundColor: purchase.status === "success" ? `${colors.success}18` : `${colors.error}18` }]}><MaterialIcons name={purchase.status === "success" ? "bolt" : "error-outline"} size={19} color={purchase.status === "success" ? colors.success : colors.error} /></View><View style={styles.activityCopy}><Text style={[styles.activityTitle, { color: colors.foreground }]}>{purchase.meterNickname}</Text><Text style={[styles.activityMeta, { color: colors.muted }]}>{formatDate(purchase.createdAt)}</Text></View><View style={styles.activityAmount}><Text style={[styles.amount, { color: colors.foreground }]}>{formatCurrency(purchase.amount)}</Text><StatusPill label={purchase.status === "success" ? "Successful" : "Failed"} tone={purchase.status === "success" ? "success" : "error"} /></View></Pressable>)}
      </ScrollView>
      <WattAssistWidget />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  walletCard: { padding: 20, borderRadius: 24, marginBottom: 15 },
  walletCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  walletEyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: "900", color: "#BCECD8" },
  walletMeter: { fontSize: 23, fontWeight: "900", color: "#FFFFFF", marginTop: 7 },
  walletNumber: { fontSize: 12, color: "#CFEDE0", marginTop: 5 },
  walletIcon: { width: 46, height: 46, borderRadius: 15, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  walletDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginVertical: 18 },
  walletBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  walletLabel: { fontSize: 11, color: "#BCECD8", marginBottom: 5 },
  walletStatus: { flexDirection: "row", alignItems: "center", gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#B6F1D7" },
  walletStatusText: { fontSize: 13, color: "#FFFFFF", fontWeight: "700" },
  walletButton: { minHeight: 44, paddingHorizontal: 13, backgroundColor: "#FFFFFF", borderColor: "#FFFFFF" },
  coinRow: { marginBottom: 24 },
  coinCard: { padding: 17 },
  coinHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardEyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: "900" },
  coinBalance: { fontSize: 30, fontWeight: "900", letterSpacing: -0.7, marginTop: 5 },
  coinCaption: { fontSize: 12, marginTop: 3 },
  advanceRow: { marginBottom: 24 },
  advanceCard: { padding: 17, borderLeftWidth: 4 },
  advanceHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  advanceAmount: { fontSize: 24, fontWeight: "900", marginTop: 5 },
  advanceIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  textAction: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 13 },
  textActionLabel: { fontSize: 13, fontWeight: "800" },
  quickSection: { marginBottom: 25 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  quickAction: { width: "48%", minHeight: 99, borderWidth: 1, borderRadius: 18, padding: 13, justifyContent: "space-between" },
  quickIcon: { width: 32, height: 32, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  quickLabel: { fontSize: 12, fontWeight: "800", maxWidth: 100 },
  pressed: { opacity: 0.68 },
  emptyRecent: { alignItems: "center", paddingVertical: 26 },
  emptyRecentTitle: { fontSize: 15, fontWeight: "800", marginTop: 9 },
  emptyRecentBody: { fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 5, maxWidth: 250 },
  activityRow: { flexDirection: "row", alignItems: "center", paddingVertical: 13, borderBottomWidth: 1 },
  activityIcon: { width: 40, height: 40, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  activityCopy: { flex: 1, marginLeft: 11 },
  activityTitle: { fontSize: 14, fontWeight: "800" },
  activityMeta: { fontSize: 11, marginTop: 4 },
  activityAmount: { alignItems: "flex-end", gap: 5 },
  amount: { fontSize: 14, fontWeight: "900" },
});

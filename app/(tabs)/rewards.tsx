import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AppHeader, PrimaryButton, SectionTitle, Surface, WattCoinArtwork } from "@/components/wattwallet-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { formatDate } from "@/lib/wattwallet/types";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function RewardsScreen() {
  const colors = useColors();
  const { profile, workspace, unreadCount } = useWattWallet();
  if (!profile || !workspace) return null;
  return (
    <ScreenContainer className="px-5 pt-4">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader title="Rewards" subtitle="Every purchase gives back." profile={profile} notificationCount={unreadCount} onNotifications={() => router.push("/notifications")} onProfile={() => router.push("/(tabs)/profile")} />
        <Surface style={[styles.balanceCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}><View><Text style={styles.balanceLabel}>YOUR WATTCOIN BALANCE</Text><Text style={styles.balance}>{workspace.wattCoins.toLocaleString()}</Text><Text style={styles.balanceCaption}>WattCoins earned locally</Text></View><WattCoinArtwork size={88} /></Surface>
        <Surface style={styles.explainCard}><View style={styles.explainIcon}><MaterialIcons name="lightbulb-outline" size={21} color={colors.gold} /></View><View style={styles.explainCopy}><Text style={[styles.explainTitle, { color: colors.foreground }]}>How WattCoins work</Text><Text style={[styles.explainBody, { color: colors.muted }]}>Earn 1 WattCoin for every R10 of prepaid electricity you buy. Your balance and reward history stay on this device in Launch Edition.</Text></View></Surface>
        <SectionTitle title="Rewards catalogue" />
        <Surface muted style={styles.rewardCard}><View style={styles.rewardIcon}><WattCoinArtwork size={44} /></View><View style={styles.rewardCopy}><Text style={[styles.rewardTitle, { color: colors.foreground }]}>Prepaid electricity card</Text><Text style={[styles.rewardBody, { color: colors.muted }]}>A future redemption option for your WattCoins.</Text><Text style={[styles.rewardProgress, { color: colors.primary }]}>Coming in a future release</Text></View><MaterialIcons name="lock-outline" size={20} color={colors.muted} /></Surface>
        <PrimaryButton title="Buy electricity to earn more" onPress={() => router.push("/(tabs)/buy")} icon="bolt" />
        <View style={styles.historyHeader}><SectionTitle title="Reward history" /></View>
        {workspace.rewardEntries.length === 0 ? <Surface muted style={styles.empty}><MaterialIcons name="toll" size={24} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>No WattCoins yet</Text><Text style={[styles.emptyBody, { color: colors.muted }]}>Your first successful purchase will appear here.</Text></Surface> : workspace.rewardEntries.slice(0, 6).map((entry) => <View key={entry.id} style={[styles.entry, { borderBottomColor: colors.border }]}><View style={[styles.entryIcon, { backgroundColor: `${colors.gold}18` }]}><WattCoinArtwork size={28} /></View><View style={styles.entryCopy}><Text style={[styles.entryTitle, { color: colors.foreground }]}>{entry.description}</Text><Text style={[styles.entryMeta, { color: colors.muted }]}>{formatDate(entry.createdAt)}</Text></View><Text style={[styles.entryAmount, { color: colors.success }]}>+{entry.amount}</Text></View>)}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  balanceCard: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 21, marginBottom: 15 },
  balanceLabel: { fontSize: 10, color: "#BCECD8", letterSpacing: 1.4, fontWeight: "900" },
  balance: { fontSize: 38, color: "#FFFFFF", fontWeight: "900", letterSpacing: -1, marginTop: 8 },
  balanceCaption: { color: "#CFEDE0", fontSize: 12, marginTop: 4 },
  explainCard: { flexDirection: "row", gap: 12, padding: 16, marginBottom: 25 },
  explainIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#E5A93D1A", justifyContent: "center", alignItems: "center" },
  explainCopy: { flex: 1 },
  explainTitle: { fontSize: 14, fontWeight: "900" },
  explainBody: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  rewardCard: { flexDirection: "row", alignItems: "center", padding: 14, marginBottom: 14 },
  rewardIcon: { width: 54, height: 54, borderRadius: 17, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center" },
  rewardCopy: { flex: 1, marginHorizontal: 12 },
  rewardTitle: { fontSize: 14, fontWeight: "900" },
  rewardBody: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  rewardProgress: { fontSize: 11, fontWeight: "800", marginTop: 6 },
  historyHeader: { marginTop: 26 },
  empty: { alignItems: "center", paddingVertical: 25 },
  emptyTitle: { fontWeight: "900", fontSize: 15, marginTop: 8 },
  emptyBody: { fontSize: 12, marginTop: 5 },
  entry: { flexDirection: "row", alignItems: "center", paddingVertical: 13, borderBottomWidth: 1 },
  entryIcon: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  entryCopy: { flex: 1, marginLeft: 11 },
  entryTitle: { fontSize: 13, fontWeight: "800" },
  entryMeta: { fontSize: 11, marginTop: 3 },
  entryAmount: { fontSize: 15, fontWeight: "900" },
});

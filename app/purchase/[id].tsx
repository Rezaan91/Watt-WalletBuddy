import * as Clipboard from "expo-clipboard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { useState } from "react";

import { PrimaryButton, StatusPill, Surface, WattCoinArtwork } from "@/components/wattwallet-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { formatCurrency, formatDate, maskMeter } from "@/lib/wattwallet/types";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function PurchaseDetailScreen() {
  const colors = useColors();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workspace } = useWattWallet();
  const purchase = workspace?.purchases.find((item) => item.id === id);
  const [copied, setCopied] = useState(false);
  if (!purchase) return <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right", "bottom"]}><Text style={[styles.notFound, { color: colors.foreground }]}>Receipt not found.</Text></ScreenContainer>;
  const copy = async () => { if (!purchase.token) return; await Clipboard.setStringAsync(purchase.token); setCopied(true); };
  const share = async () => { await Share.share({ message: `WattWallet receipt\n${formatCurrency(purchase.amount)} · ${purchase.meterNickname}\nToken: ${purchase.token ?? "No token issued"}\nReference: ${purchase.paymentReference}` }); };
  return <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right", "bottom"]}><View style={styles.header}><Pressable onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={22} color={colors.foreground} /></Pressable><View><Text style={[styles.title, { color: colors.foreground }]}>Receipt</Text><Text style={[styles.subtitle, { color: colors.muted }]}>WattWallet Launch Edition</Text></View></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.statusHeader}><View style={[styles.statusIcon, { backgroundColor: purchase.status === "success" ? `${colors.success}18` : `${colors.error}18` }]}><MaterialIcons name={purchase.status === "success" ? "check" : "error-outline"} size={28} color={purchase.status === "success" ? colors.success : colors.error} /></View><Text style={[styles.receiptTitle, { color: colors.foreground }]}>{purchase.status === "success" ? "Purchase successful" : "Purchase failed"}</Text><StatusPill label={purchase.status === "success" ? "Payment + vending complete" : purchase.failureReason ?? "Not completed"} tone={purchase.status === "success" ? "success" : "error"} /></View><Surface style={styles.card}><Row label="Electricity amount" value={formatCurrency(purchase.amount)} strong /><Row label="Meter" value={purchase.meterNickname} /><Row label="Meter number" value={maskMeter(purchase.meterNumber)} /><Row label="Payment reference" value={purchase.paymentReference} /><Row label="Vending reference" value={purchase.vendingReference ?? "Not issued"} /><Row label="Date and time" value={formatDate(purchase.createdAt)} />{purchase.status === "success" ? <Row label="WattCoins awarded" value={`+${purchase.wattCoins}`} coin /> : null}</Surface>{purchase.token ? <Surface style={[styles.tokenCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}><Text style={styles.tokenLabel}>FICTIONAL DEMO TOKEN</Text><Text style={styles.token}>{purchase.token}</Text><Text style={styles.tokenHint}>This token is for demonstration only and is not valid for electricity vending.</Text><View style={styles.actions}><Pressable onPress={() => void copy()} style={styles.action}><MaterialIcons name={copied ? "check" : "content-copy"} size={17} color="#FFFFFF" /><Text style={styles.actionText}>{copied ? "Copied" : "Copy"}</Text></Pressable><Pressable onPress={() => void share()} style={styles.action}><MaterialIcons name="share" size={17} color="#FFFFFF" /><Text style={styles.actionText}>Share</Text></Pressable></View></Surface> : null}<PrimaryButton title="Back to history" variant="secondary" onPress={() => router.replace("/(tabs)/history")} style={styles.backCta} /></ScrollView></ScreenContainer>;
}

function Row({ label, value, strong = false, coin = false }: { label: string; value: string; strong?: boolean; coin?: boolean }) { const colors = useColors(); return <View style={styles.row}><Text style={[styles.label, { color: colors.muted }]}>{label}</Text><View style={styles.valueRow}>{coin ? <WattCoinArtwork size={18} /> : null}<Text style={[styles.value, { color: coin ? colors.gold : colors.foreground }, strong && styles.strong]}>{value}</Text></View></View>; }

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 11, paddingBottom: 16 },
  back: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 23, fontWeight: "900" },
  subtitle: { fontSize: 11, marginTop: 3 },
  content: { paddingBottom: 25 },
  statusHeader: { alignItems: "center", paddingVertical: 13, marginBottom: 18 },
  statusIcon: { width: 62, height: 62, borderRadius: 22, justifyContent: "center", alignItems: "center" },
  receiptTitle: { fontSize: 21, fontWeight: "900", marginTop: 11, marginBottom: 7 },
  card: { padding: 13, marginBottom: 15 },
  row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12, paddingVertical: 11 },
  label: { fontSize: 12, flex: 1 },
  valueRow: { flexDirection: "row", alignItems: "center", gap: 5, maxWidth: "62%" },
  value: { fontSize: 12, fontWeight: "800", textAlign: "right" },
  strong: { fontSize: 18 },
  tokenCard: { padding: 18, marginBottom: 15 },
  tokenLabel: { color: "#BCECD8", fontSize: 10, letterSpacing: 1.4, fontWeight: "900" },
  token: { color: "#FFFFFF", fontSize: 22, fontWeight: "900", letterSpacing: 1.4, marginTop: 12 },
  tokenHint: { color: "#CFEDE0", fontSize: 11, lineHeight: 17, marginTop: 7 },
  actions: { flexDirection: "row", gap: 10, marginTop: 15 },
  action: { minHeight: 40, borderRadius: 13, paddingHorizontal: 13, backgroundColor: "rgba(255,255,255,0.16)", flexDirection: "row", alignItems: "center", gap: 6 },
  actionText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  backCta: { marginTop: 3 },
  notFound: { fontSize: 20, fontWeight: "900", marginTop: 30 },
});

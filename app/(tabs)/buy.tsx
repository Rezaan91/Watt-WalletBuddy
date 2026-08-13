import * as Clipboard from "expo-clipboard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from "react-native";
import { useMemo, useState } from "react";

import { PrimaryButton, SectionTitle, Surface, WattCoinArtwork } from "@/components/wattwallet-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { calculateWattCoins, formatCurrency, formatDate, maskMeter, validateAmount, type Purchase } from "@/lib/wattwallet/types";
import { useWattWallet } from "@/lib/wattwallet/store";

const amountOptions = [50, 100, 150, 200, 300, 500];

type Step = 1 | 2 | 3 | 4 | 5;

export default function BuyScreen() {
  const colors = useColors();
  const { workspace, makePurchase } = useWattWallet();
  const [step, setStep] = useState<Step>(1);
  const [meterId, setMeterId] = useState(workspace?.meters.find((item) => item.isDefault)?.id ?? workspace?.meters[0]?.id ?? "");
  const [amount, setAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [processing, setProcessing] = useState(false);
  const [failure, setFailure] = useState("");
  const [purchase, setPurchase] = useState<Purchase | null>(null);
  const [copied, setCopied] = useState(false);
  const meter = workspace?.meters.find((item) => item.id === meterId);
  const chosenAmount = amount ?? Number(customAmount);
  const coinEstimate = validateAmount(chosenAmount) ? calculateWattCoins(chosenAmount) : 0;

  const stepLabel = useMemo(() => ({ 1: "Select meter", 2: "Choose amount", 3: "Review purchase", 4: "Processing", 5: "Token ready" }[step]), [step]);

  const beginPurchase = async () => {
    if (!meter || !validateAmount(chosenAmount)) return;
    setProcessing(true);
    setFailure("");
    setStep(4);
    const result = await makePurchase({ amount: chosenAmount, meterId: meter.id });
    setProcessing(false);
    if (!result.ok) {
      setFailure(result.message);
      setStep(4);
      return;
    }
    setPurchase(result.purchase);
    setStep(5);
  };

  const copyToken = async () => {
    if (!purchase?.token) return;
    await Clipboard.setStringAsync(purchase.token);
    setCopied(true);
  };

  const shareReceipt = async () => {
    if (!purchase) return;
    await Share.share({ message: `WattWallet demo receipt\n${formatCurrency(purchase.amount)} electricity\nMeter: ${purchase.meterNickname}\nFictional token: ${purchase.token}\nPayment reference: ${purchase.paymentReference}` });
  };

  return (
    <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}><Pressable onPress={() => step === 1 ? router.back() : setStep((current) => (Math.max(1, current - 1) as Step))} style={styles.back}><MaterialIcons name="arrow-back" size={22} color={colors.foreground} /></Pressable><View style={styles.headerCopy}><Text style={[styles.title, { color: colors.foreground }]}>Buy electricity</Text><Text style={[styles.subtitle, { color: colors.muted }]}>{stepLabel}</Text></View><View style={[styles.stepBadge, { backgroundColor: colors.surfaceMuted }]}><Text style={[styles.stepText, { color: colors.primary }]}>{step}/5</Text></View></View>
      <View style={styles.progress}>{[1, 2, 3, 4, 5].map((item) => <View key={item} style={[styles.progressSegment, { backgroundColor: item <= step ? colors.primary : colors.border }]} />)}</View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 ? <><SectionTitle title="Which meter are you topping up?" /><Text style={[styles.helper, { color: colors.muted }]}>Choose one of your fictional Launch Edition meters.</Text>{workspace?.meters.map((item) => <Pressable key={item.id} onPress={() => setMeterId(item.id)} style={[styles.meterOption, { backgroundColor: colors.surface, borderColor: meterId === item.id ? colors.primary : colors.border }]}><View style={[styles.optionIcon, { backgroundColor: meterId === item.id ? `${colors.primary}18` : colors.surfaceMuted }]}><MaterialIcons name="speed" size={20} color={meterId === item.id ? colors.primary : colors.muted} /></View><View style={styles.optionCopy}><Text style={[styles.optionTitle, { color: colors.foreground }]}>{item.nickname}</Text><Text style={[styles.optionMeta, { color: colors.muted }]}>{maskMeter(item.meterNumber)} · {item.provider}</Text></View><MaterialIcons name={meterId === item.id ? "radio-button-checked" : "radio-button-unchecked"} size={21} color={meterId === item.id ? colors.primary : colors.muted} /></Pressable>)}<PrimaryButton title="Continue" onPress={() => setStep(2)} disabled={!meter} icon="arrow-forward" style={styles.bottomCta} /></> : null}
        {step === 2 ? <><SectionTitle title="How much would you like to buy?" /><Text style={[styles.helper, { color: colors.muted }]}>Choose a quick amount or enter a custom value from R50 to R5 000.</Text><View style={styles.amountGrid}>{amountOptions.map((option) => <Pressable key={option} onPress={() => { setAmount(option); setCustomAmount(""); }} style={[styles.amountOption, { backgroundColor: amount === option ? colors.primary : colors.surface, borderColor: amount === option ? colors.primary : colors.border }]}><Text style={[styles.amountText, { color: amount === option ? "#FFFFFF" : colors.foreground }]}>{formatCurrency(option)}</Text></Pressable>)}</View><Surface style={styles.customCard}><Text style={[styles.customLabel, { color: colors.foreground }]}>Custom amount</Text><View style={[styles.customInputWrap, { borderColor: amount === null && customAmount ? colors.primary : colors.border }]}><Text style={[styles.rand, { color: colors.muted }]}>R</Text><TextInput value={customAmount} onChangeText={(value) => { setCustomAmount(value.replace(/[^0-9]/g, "")); setAmount(null); }} keyboardType="number-pad" placeholder="Enter amount" placeholderTextColor={colors.muted} style={[styles.customInput, { color: colors.foreground }]} /></View></Surface>{customAmount && !validateAmount(Number(customAmount)) ? <Text style={[styles.validation, { color: colors.error }]}>Enter an amount between R50 and R5 000.</Text> : null}<PrimaryButton title="Review purchase" onPress={() => setStep(3)} disabled={!validateAmount(chosenAmount)} icon="arrow-forward" style={styles.bottomCta} /></> : null}
        {step === 3 ? <><SectionTitle title="Review your purchase" /><Surface style={styles.reviewCard}><ReviewRow label="Meter" value={meter?.nickname ?? "—"} /><ReviewRow label="Meter number" value={meter ? maskMeter(meter.meterNumber) : "—"} /><ReviewRow label="Electricity amount" value={formatCurrency(chosenAmount)} strong /><ReviewRow label="WattCoins to earn" value={`+${coinEstimate}`} coin /></Surface><View style={[styles.notice, { backgroundColor: `${colors.gold}15` }]}><MaterialIcons name="info-outline" size={18} color={colors.gold} /><Text style={[styles.noticeText, { color: colors.muted }]}>Launch Edition uses a mock payment service and issues a clearly fictional demonstration token. No card or bank details are collected.</Text></View><PrimaryButton title={`Pay ${formatCurrency(chosenAmount)} securely`} onPress={() => void beginPurchase()} icon="lock-outline" style={styles.bottomCta} /></> : null}
        {step === 4 ? <View style={styles.processing}><View style={[styles.processingIcon, { backgroundColor: failure ? `${colors.error}18` : `${colors.primary}18` }]}><MaterialIcons name={failure ? "error-outline" : "bolt"} size={34} color={failure ? colors.error : colors.primary} /></View><Text style={[styles.processingTitle, { color: colors.foreground }]}>{failure ? "Purchase could not complete" : processing ? "Processing your purchase" : "Checking status"}</Text><Text style={[styles.processingBody, { color: colors.muted }]}>{failure || "We are simulating payment approval, then requesting your fictional electricity token."}</Text>{processing ? <Text style={[styles.processingHint, { color: colors.primary }]}>Please keep this screen open…</Text> : <><PrimaryButton title="Try again" onPress={() => setStep(3)} style={styles.bottomCta} /><PrimaryButton title="Back to home" variant="secondary" onPress={() => router.replace("/(tabs)")} style={styles.secondaryCta} /></>}</View> : null}
        {step === 5 && purchase ? <><View style={styles.successHeader}><View style={[styles.successIcon, { backgroundColor: `${colors.success}18` }]}><MaterialIcons name="check" size={31} color={colors.success} /></View><Text style={[styles.successTitle, { color: colors.foreground }]}>Token generated</Text><Text style={[styles.successBody, { color: colors.muted }]}>Your fictional demonstration token is ready. Keep it handy for your records.</Text></View><Surface style={[styles.tokenCard, { backgroundColor: colors.primary, borderColor: colors.primary }]}><Text style={styles.tokenLabel}>DEMO ELECTRICITY TOKEN</Text><Text style={styles.token}>{purchase.token}</Text><Text style={styles.tokenHint}>Fictional Launch Edition token · not valid for vending</Text><View style={styles.tokenActions}><Pressable onPress={() => void copyToken()} style={styles.tokenAction}><MaterialIcons name={copied ? "check" : "content-copy"} size={18} color="#FFFFFF" /><Text style={styles.tokenActionText}>{copied ? "Copied" : "Copy token"}</Text></Pressable><Pressable onPress={() => void shareReceipt()} style={styles.tokenAction}><MaterialIcons name="share" size={18} color="#FFFFFF" /><Text style={styles.tokenActionText}>Share receipt</Text></Pressable></View></Surface><Surface style={styles.receiptCard}><ReviewRow label="Meter" value={purchase.meterNickname} /><ReviewRow label="Amount" value={formatCurrency(purchase.amount)} /><ReviewRow label="Payment reference" value={purchase.paymentReference} /><ReviewRow label="Vending reference" value={purchase.vendingReference ?? "—"} /><ReviewRow label="WattCoins awarded" value={`+${purchase.wattCoins}`} coin /><ReviewRow label="Completed" value={formatDate(purchase.createdAt)} /></Surface><PrimaryButton title="View in history" onPress={() => router.replace("/(tabs)/history")} icon="receipt-long" /><PrimaryButton title="Buy another token" variant="secondary" onPress={() => { setStep(1); setPurchase(null); setAmount(null); setCustomAmount(""); }} style={styles.secondaryCta} /></> : null}
      </ScrollView>
    </ScreenContainer>
  );
}

function ReviewRow({ label, value, strong = false, coin = false }: { label: string; value: string; strong?: boolean; coin?: boolean }) { const colors = useColors(); return <View style={styles.reviewRow}><Text style={[styles.reviewLabel, { color: colors.muted }]}>{label}</Text><View style={styles.reviewValueRow}>{coin ? <WattCoinArtwork size={19} /> : null}<Text style={[styles.reviewValue, { color: coin ? colors.gold : colors.foreground }, strong && styles.strong]}>{value}</Text></View></View>; }

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 11, paddingBottom: 13 },
  back: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  headerCopy: { flex: 1 },
  title: { fontSize: 23, fontWeight: "900" },
  subtitle: { fontSize: 12, marginTop: 3 },
  stepBadge: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10 },
  stepText: { fontSize: 12, fontWeight: "900" },
  progress: { flexDirection: "row", gap: 5, marginBottom: 24 },
  progressSegment: { height: 4, flex: 1, borderRadius: 2 },
  content: { paddingBottom: 30 },
  helper: { fontSize: 13, lineHeight: 20, marginTop: -5, marginBottom: 18 },
  meterOption: { borderWidth: 1.5, borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 11 },
  optionIcon: { width: 39, height: 39, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  optionCopy: { flex: 1, marginLeft: 11 },
  optionTitle: { fontSize: 14, fontWeight: "900" },
  optionMeta: { fontSize: 11, marginTop: 4 },
  bottomCta: { marginTop: 20 },
  amountGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 },
  amountOption: { width: "31.5%", minHeight: 56, borderWidth: 1, borderRadius: 15, justifyContent: "center", alignItems: "center" },
  amountText: { fontSize: 15, fontWeight: "900" },
  customCard: { padding: 15 },
  customLabel: { fontSize: 13, fontWeight: "800", marginBottom: 9 },
  customInputWrap: { minHeight: 50, borderWidth: 1, borderRadius: 14, flexDirection: "row", alignItems: "center", paddingHorizontal: 14 },
  rand: { fontSize: 17, fontWeight: "800" },
  customInput: { flex: 1, fontSize: 16, paddingLeft: 9 },
  validation: { fontSize: 12, marginTop: 7 },
  reviewCard: { padding: 16 },
  reviewRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 11, gap: 12 },
  reviewLabel: { fontSize: 12, flex: 1 },
  reviewValueRow: { flexDirection: "row", alignItems: "center", gap: 5, maxWidth: "60%" },
  reviewValue: { fontSize: 13, fontWeight: "800", textAlign: "right" },
  strong: { fontSize: 18 },
  notice: { flexDirection: "row", gap: 9, padding: 13, borderRadius: 15, marginTop: 15, alignItems: "flex-start" },
  noticeText: { flex: 1, fontSize: 11, lineHeight: 17 },
  processing: { alignItems: "center", paddingTop: 60 },
  processingIcon: { width: 76, height: 76, borderRadius: 26, justifyContent: "center", alignItems: "center" },
  processingTitle: { fontSize: 21, fontWeight: "900", marginTop: 20, textAlign: "center" },
  processingBody: { fontSize: 13, lineHeight: 20, textAlign: "center", marginTop: 9, maxWidth: 300 },
  processingHint: { fontSize: 12, fontWeight: "800", marginTop: 20 },
  secondaryCta: { marginTop: 10 },
  successHeader: { alignItems: "center", paddingTop: 12, marginBottom: 21 },
  successIcon: { width: 64, height: 64, borderRadius: 23, justifyContent: "center", alignItems: "center" },
  successTitle: { fontSize: 24, fontWeight: "900", marginTop: 13 },
  successBody: { fontSize: 13, textAlign: "center", lineHeight: 19, marginTop: 6, maxWidth: 300 },
  tokenCard: { padding: 19, marginBottom: 15 },
  tokenLabel: { fontSize: 10, letterSpacing: 1.5, fontWeight: "900", color: "#BCECD8" },
  token: { fontSize: 25, fontWeight: "900", letterSpacing: 1.5, color: "#FFFFFF", marginTop: 13 },
  tokenHint: { fontSize: 11, color: "#CFEDE0", lineHeight: 16, marginTop: 8 },
  tokenActions: { flexDirection: "row", gap: 10, marginTop: 17 },
  tokenAction: { minHeight: 41, borderRadius: 13, backgroundColor: "rgba(255,255,255,0.16)", paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 6 },
  tokenActionText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  receiptCard: { padding: 13, marginBottom: 15 },
});

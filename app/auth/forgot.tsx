import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { Field, PrimaryButton, Surface, WattWalletMark } from "@/components/wattwallet-ui";
import { useColors } from "@/hooks/use-colors";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const { forgotPassword } = useWattWallet();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setMessage("");
    setError("");
    const result = await forgotPassword(email);
    setLoading(false);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setMessage(result.message);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={styles.content}>
        <View style={styles.topRow}><Pressable onPress={() => router.back()} style={styles.backButton}><MaterialIcons name="arrow-back" size={22} color={colors.foreground} /></Pressable><WattWalletMark size={42} /><View style={{ width: 42 }} /></View>
        <View style={styles.hero}><Text style={[styles.kicker, { color: colors.primary }]}>ACCOUNT RECOVERY</Text><Text style={[styles.title, { color: colors.foreground }]}>Reset your access.</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Enter your email and we’ll prepare the next step for your Launch Edition account.</Text></View>
        <Surface style={styles.card}>
          <Text style={[styles.cardTitle, { color: colors.foreground }]}>Forgot password?</Text>
          <Text style={[styles.cardSubtitle, { color: colors.muted }]}>No real email is sent. This is a safe local simulation.</Text>
          <Field label="Email address" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" onSubmitEditing={submit} returnKeyType="done" />
          {error ? <Text style={[styles.message, { color: colors.error }]}>{error}</Text> : null}
          {message ? <View style={[styles.successBox, { backgroundColor: `${colors.success}16` }]}><MaterialIcons name="mark-email-read" size={22} color={colors.success} /><Text style={[styles.message, { color: colors.success }]}>{message}</Text></View> : null}
          <PrimaryButton title={loading ? "Preparing instructions…" : "Continue"} onPress={submit} disabled={loading} icon="arrow-forward" />
          {message ? <PrimaryButton title="Return to log in" variant="secondary" onPress={() => router.replace("/auth/login")} style={styles.secondaryButton} /> : null}
        </Surface>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: 24, paddingTop: 24 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  backButton: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  hero: { marginTop: 48, marginBottom: 28 },
  kicker: { fontSize: 11, letterSpacing: 1.8, fontWeight: "900", marginBottom: 10 },
  title: { fontSize: 33, fontWeight: "900", letterSpacing: -1 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 12, maxWidth: 330 },
  card: { padding: 20 },
  cardTitle: { fontSize: 21, fontWeight: "900" },
  cardSubtitle: { fontSize: 13, lineHeight: 19, marginTop: 5, marginBottom: 22 },
  message: { flex: 1, fontSize: 13, lineHeight: 19 },
  successBox: { flexDirection: "row", gap: 10, padding: 12, borderRadius: 14, marginBottom: 16, alignItems: "flex-start" },
  secondaryButton: { marginTop: 10 },
});

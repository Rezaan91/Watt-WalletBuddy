import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, Redirect, router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Field, PrimaryButton, Surface, WattWalletMark } from "@/components/wattwallet-ui";
import { useColors } from "@/hooks/use-colors";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function LoginScreen() {
  const { t } = useTranslation();
  const colors = useColors();
  const { profile, login, hydrated } = useWattWallet();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (hydrated && profile) return <Redirect href="/(tabs)" />;

  const submit = async () => {
    setLoading(true);
    setError("");
    const result = await login({ email, password });
    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? t("auth.loginError", "Could not sign you in."));
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.brandRow}><WattWalletMark size={48} /><View><Text style={[styles.brandName, { color: colors.foreground }]}>WattWallet</Text><Text style={[styles.brandTagline, { color: colors.muted }]}>{t("auth.tagline", "Power your everyday")}</Text></View></View>
        <View style={styles.heroCopy}><Text style={[styles.kicker, { color: colors.primary }]}>{t("auth.welcomeBack", "WELCOME BACK").toUpperCase()}</Text><Text style={[styles.title, { color: colors.foreground }]}>{t("auth.loginTitle", "Your power, in your hands.")}</Text><Text style={[styles.subtitle, { color: colors.muted }]}>{t("auth.loginSubtitle", "Buy prepaid electricity, stay on top of your spend, and earn as you go.")}</Text></View>
        <Surface style={styles.formCard}>
          <Text style={[styles.formTitle, { color: colors.foreground }]}>{t("auth.login", "Log in")}</Text>
          <Text style={[styles.formSubtitle, { color: colors.muted }]}>{t("auth.loginDetails", "Use your WattWallet account details.")}</Text>
          <View style={styles.formFields}>
            <Field label={t("auth.email", "Email address")} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" placeholder="you@example.com" />
            <View>
              <Field label={t("auth.password", "Password")} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" placeholder={t("auth.passwordPlaceholder", "Enter your password")} onSubmitEditing={submit} returnKeyType="done" />
              <Pressable accessibilityLabel={showPassword ? t("auth.hidePassword", "Hide password") : t("auth.showPassword", "Show password")} onPress={() => setShowPassword((value) => !value)} style={styles.passwordToggle}><MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={20} color={colors.muted} /></Pressable>
            </View>
          </View>
          {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
          <PrimaryButton title={loading ? t("auth.signingIn", "Signing in…") : t("auth.login", "Log in")} onPress={submit} disabled={loading} icon="arrow-forward" />
          <Pressable onPress={() => router.push("/auth/forgot")} style={styles.linkButton}><Text style={[styles.link, { color: colors.primary }]}>{t("auth.forgotPassword", "Forgot your password?")}</Text></Pressable>
        </Surface>
        <View style={styles.signupRow}><Text style={[styles.signupText, { color: colors.muted }]}>{t("auth.noAccount", "New to WattWallet?")}</Text><Link href="/auth/signup" asChild><Pressable><Text style={[styles.link, { color: colors.primary }]}>{t("auth.createAccount", "Create an account")}</Text></Pressable></Link></View>
        <Text style={[styles.disclaimer, { color: colors.muted }]}>{t("auth.disclaimer", "Launch Edition uses simulated payments and fictional electricity tokens.")}</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 46, paddingBottom: 36, flexGrow: 1 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  brandName: { fontSize: 19, fontWeight: "800" },
  brandTagline: { fontSize: 12, marginTop: 2 },
  heroCopy: { marginTop: 50, marginBottom: 26 },
  kicker: { fontSize: 11, letterSpacing: 1.9, fontWeight: "900", marginBottom: 10 },
  title: { fontSize: 34, fontWeight: "900", letterSpacing: -1.1, lineHeight: 39, maxWidth: 320 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 14, maxWidth: 330 },
  formCard: { padding: 20 },
  formTitle: { fontSize: 21, fontWeight: "900" },
  formSubtitle: { fontSize: 13, marginTop: 5, marginBottom: 22 },
  formFields: { gap: 0 },
  passwordToggle: { position: "absolute", right: 15, top: 37, padding: 6 },
  error: { fontSize: 13, marginTop: -2, marginBottom: 14, lineHeight: 19 },
  linkButton: { alignItems: "center", paddingTop: 17 },
  link: { fontSize: 13, fontWeight: "800" },
  signupRow: { flexDirection: "row", justifyContent: "center", gap: 5, marginTop: 26 },
  signupText: { fontSize: 13 },
  disclaimer: { fontSize: 11, textAlign: "center", lineHeight: 16, marginTop: "auto", paddingTop: 32 },
});

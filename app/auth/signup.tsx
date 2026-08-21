import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Field, PrimaryButton, Surface, WattWalletMark } from "@/components/wattwallet-ui";
import { useColors } from "@/hooks/use-colors";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function SignupScreen() {
  const colors = useColors();
  const { signUp } = useWattWallet();
  const [form, setForm] = useState({ firstName: "", lastName: "", idNumber: "", mobileNumber: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async () => {
    setLoading(true);
    setError("");
    const result = await signUp(form);
    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? "Could not create your account.");
      return;
    }
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.topRow}><Pressable onPress={() => router.back()} style={styles.backButton}><MaterialIcons name="arrow-back" size={22} color={colors.foreground} /></Pressable><WattWalletMark size={38} /><View style={{ width: 42 }} /></View>
        <View style={styles.heroCopy}><Text style={[styles.kicker, { color: colors.primary }]}>GET STARTED</Text><Text style={[styles.title, { color: colors.foreground }]}>A smarter way to stay powered.</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Create your local Launch Edition account to get your wallet moving.</Text></View>
        <Surface style={styles.formCard}>
          <Text style={[styles.formTitle, { color: colors.foreground }]}>Create account</Text>
          <Text style={[styles.formSubtitle, { color: colors.muted }]}>Your details stay isolated to this device.</Text>
          <View style={styles.nameRow}><View style={styles.nameField}><Field label="First name" value={form.firstName} onChangeText={(value) => update("firstName", value)} placeholder="John" autoCapitalize="words" /></View><View style={styles.nameField}><Field label="Last name" value={form.lastName} onChangeText={(value) => update("lastName", value)} placeholder="Doe" autoCapitalize="words" /></View></View>
          <Field label="SA ID Number" value={form.idNumber} onChangeText={(value) => update("idNumber", value)} keyboardType="number-pad" placeholder="8001015000080" />
          <Field label="Mobile number" value={form.mobileNumber} onChangeText={(value) => update("mobileNumber", value)} keyboardType="phone-pad" placeholder="082 123 4567" />
          <Field label="Email address" value={form.email} onChangeText={(value) => update("email", value)} keyboardType="email-address" autoCapitalize="none" placeholder="you@example.com" />
          <View><Field label="Password" value={form.password} onChangeText={(value) => update("password", value)} secureTextEntry={!showPassword} autoCapitalize="none" placeholder="At least 8 characters" /><Pressable accessibilityLabel={showPassword ? "Hide password" : "Show password"} onPress={() => setShowPassword((value) => !value)} style={styles.passwordToggle}><MaterialIcons name={showPassword ? "visibility-off" : "visibility"} size={20} color={colors.muted} /></Pressable></View>
          <Field label="Confirm password" value={form.confirmPassword} onChangeText={(value) => update("confirmPassword", value)} secureTextEntry={!showPassword} autoCapitalize="none" placeholder="Repeat your password" onSubmitEditing={submit} returnKeyType="done" />
          {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
          <PrimaryButton title={loading ? "Creating account…" : "Create account"} onPress={submit} disabled={loading} icon="arrow-forward" />
        </Surface>
        <View style={styles.signupRow}><Text style={[styles.signupText, { color: colors.muted }]}>Already have an account?</Text><Link href="/auth/login" asChild><Pressable><Text style={[styles.link, { color: colors.primary }]}>Log in</Text></Pressable></Link></View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, paddingTop: 24, paddingBottom: 34 },
  topRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backButton: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  heroCopy: { marginTop: 34, marginBottom: 24 },
  kicker: { fontSize: 11, letterSpacing: 1.8, fontWeight: "900", marginBottom: 10 },
  title: { fontSize: 31, fontWeight: "900", letterSpacing: -1, lineHeight: 37, maxWidth: 330 },
  subtitle: { fontSize: 14, lineHeight: 21, marginTop: 13, maxWidth: 330 },
  formCard: { padding: 20 },
  formTitle: { fontSize: 21, fontWeight: "900" },
  formSubtitle: { fontSize: 13, marginTop: 5, marginBottom: 20 },
  nameRow: { flexDirection: "row", gap: 10 },
  nameField: { flex: 1 },
  passwordToggle: { position: "absolute", right: 15, top: 37, padding: 6 },
  error: { fontSize: 13, lineHeight: 19, marginBottom: 14 },
  signupRow: { flexDirection: "row", justifyContent: "center", gap: 5, marginTop: 24 },
  signupText: { fontSize: 13 },
  link: { fontSize: 13, fontWeight: "800" },
});

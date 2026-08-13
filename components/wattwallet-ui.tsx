import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image, Pressable, StyleSheet, Text, View, type PressableProps, type TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { useColors } from "@/hooks/use-colors";
import { getInitials, type Profile } from "@/lib/wattwallet/types";

export function WattCoinArtwork({ size = 56 }: { size?: number }) {
  return <Image source={require("@/assets/images/wattcoin.png")} style={[styles.coinArtwork, { width: size, height: size }]} resizeMode="contain" />;
}

export function WattWalletMark({ size = 42 }: { size?: number }) {
  return <Image source={require("@/assets/images/icon.png")} style={{ width: size, height: size }} resizeMode="contain" />;
}

export function AppHeader({
  title,
  subtitle,
  profile,
  onProfile,
  onNotifications,
  notificationCount = 0,
}: {
  title: string;
  subtitle?: string;
  profile?: Profile | null;
  onProfile?: () => void;
  onNotifications?: () => void;
  notificationCount?: number;
}) {
  const colors = useColors();
  return (
    <View style={styles.header}>
      <View style={styles.headerCopy}>
        <Text style={[styles.eyebrow, { color: colors.primary }]}>WATTWALLET</Text>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? <Text style={[styles.headerSubtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      <View style={styles.headerActions}>
        {onNotifications ? (
          <Pressable accessibilityLabel="Notifications" onPress={onNotifications} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.surfaceMuted }, pressed && styles.pressed]}>
            <MaterialIcons name="notifications-none" size={22} color={colors.foreground} />
            {notificationCount > 0 ? <View style={[styles.notificationDot, { backgroundColor: colors.gold }]} /> : null}
          </Pressable>
        ) : null}
        {onProfile && profile ? (
          <Pressable accessibilityLabel="Profile" onPress={onProfile} style={({ pressed }) => [styles.avatar, { backgroundColor: colors.primary }, pressed && styles.pressed]}>
            <Text style={styles.avatarText}>{getInitials(profile.firstName, profile.lastName)}</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export function Surface({ children, style, muted = false }: { children: React.ReactNode; style?: object; muted?: boolean }) {
  const colors = useColors();
  return <View style={[styles.surface, { backgroundColor: muted ? colors.surfaceMuted : colors.surface, borderColor: colors.border }, style]}>{children}</View>;
}

export function PrimaryButton({ title, onPress, icon, disabled = false, variant = "primary", style }: { title: string; onPress?: PressableProps["onPress"]; icon?: React.ComponentProps<typeof MaterialIcons>["name"]; disabled?: boolean; variant?: "primary" | "secondary" | "ghost"; style?: object }) {
  const colors = useColors();
  const palette = variant === "primary" ? { backgroundColor: colors.primary, textColor: "#FFFFFF" } : variant === "secondary" ? { backgroundColor: colors.surfaceMuted, textColor: colors.foreground } : { backgroundColor: "transparent", textColor: colors.primary };
  return (
    <Pressable disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, { backgroundColor: palette.backgroundColor, borderColor: variant === "ghost" ? colors.border : palette.backgroundColor }, disabled && styles.disabled, pressed && styles.buttonPressed, style]}>
      {icon ? <MaterialIcons name={icon} size={19} color={palette.textColor} /> : null}
      <Text style={[styles.buttonText, { color: palette.textColor }]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  const colors = useColors();
  return (
    <View style={styles.fieldWrap}>
      <Text style={[styles.fieldLabel, { color: colors.foreground }]}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} {...props} style={[styles.input, { color: colors.foreground, borderColor: error ? colors.error : colors.border, backgroundColor: colors.surface }]} />
      {error ? <Text style={[styles.fieldError, { color: colors.error }]}>{error}</Text> : null}
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {action && onAction ? <Pressable onPress={onAction}><Text style={[styles.sectionAction, { color: colors.primary }]}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function StatusPill({ label, tone }: { label: string; tone: "success" | "warning" | "error" | "muted" }) {
  const colors = useColors();
  const palette = { success: colors.success, warning: colors.warning, error: colors.error, muted: colors.muted }[tone];
  return <View style={[styles.statusPill, { backgroundColor: `${palette}1A` }]}><View style={[styles.statusDot, { backgroundColor: palette }]} /><Text style={[styles.statusText, { color: palette }]}>{label}</Text></View>;
}

export function EmptyState({ icon = "inbox", title, body, action, onAction }: { icon?: React.ComponentProps<typeof MaterialIcons>["name"]; title: string; body: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return <Surface style={styles.emptyState}><MaterialIcons name={icon} size={30} color={colors.primary} /><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.emptyBody, { color: colors.muted }]}>{body}</Text>{action && onAction ? <PrimaryButton title={action} onPress={onAction} variant="secondary" style={styles.emptyButton} /> : null}</Surface>;
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 },
  headerCopy: { flex: 1 },
  eyebrow: { fontSize: 11, letterSpacing: 1.8, fontWeight: "800", marginBottom: 3 },
  headerTitle: { fontSize: 26, fontWeight: "800", letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 13, marginTop: 4 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 9, marginLeft: 12 },
  iconButton: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  notificationDot: { position: "absolute", top: 10, right: 10, width: 7, height: 7, borderRadius: 4, borderWidth: 1, borderColor: "#FFFFFF" },
  avatar: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },
  pressed: { opacity: 0.72 },
  surface: { borderRadius: 22, borderWidth: 1, padding: 18, shadowColor: "#000000", shadowOpacity: 0.04, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 1 },
  button: { minHeight: 52, borderRadius: 16, borderWidth: 1, paddingHorizontal: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  buttonText: { fontSize: 15, fontWeight: "800" },
  buttonPressed: { transform: [{ scale: 0.98 }], opacity: 0.88 },
  disabled: { opacity: 0.45 },
  fieldWrap: { marginBottom: 15 },
  fieldLabel: { fontSize: 13, fontWeight: "700", marginBottom: 8 },
  input: { minHeight: 52, borderRadius: 15, borderWidth: 1, paddingHorizontal: 15, fontSize: 15 },
  fieldError: { fontSize: 12, marginTop: 6 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800" },
  sectionAction: { fontSize: 13, fontWeight: "800" },
  statusPill: { borderRadius: 99, paddingHorizontal: 9, paddingVertical: 6, flexDirection: "row", alignItems: "center", gap: 5, alignSelf: "flex-start" },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "800" },
  emptyState: { alignItems: "center", gap: 9, paddingVertical: 30 },
  emptyTitle: { fontSize: 16, fontWeight: "800" },
  emptyBody: { textAlign: "center", fontSize: 13, lineHeight: 20, maxWidth: 290 },
  emptyButton: { marginTop: 6, minHeight: 44 },
  coinArtwork: { flexShrink: 0 },
});

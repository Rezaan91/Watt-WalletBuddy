import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/wattwallet-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { formatDate } from "@/lib/wattwallet/types";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function NotificationsScreen() {
  const colors = useColors();
  const { workspace, markAllNotificationsRead, markNotificationRead } = useWattWallet();
  const notifications = workspace?.notifications ?? [];
  return (
    <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}><Pressable onPress={() => router.back()} style={styles.back}><MaterialIcons name="arrow-back" size={22} color={colors.foreground} /></Pressable><View style={styles.headerCopy}><Text style={[styles.title, { color: colors.foreground }]}>Notifications</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Updates from your WattWallet.</Text></View>{notifications.some((item) => !item.read) ? <Pressable onPress={() => void markAllNotificationsRead()}><Text style={[styles.markAll, { color: colors.primary }]}>Mark read</Text></Pressable> : null}</View>
      {notifications.length === 0 ? <EmptyState icon="notifications-none" title="You're all caught up" body="Purchase and rewards updates will appear here." /> : <FlatList data={notifications} keyExtractor={(item) => item.id} contentContainerStyle={styles.list} renderItem={({ item }) => <Pressable onPress={() => void markNotificationRead(item.id)} style={[styles.row, { backgroundColor: item.read ? colors.surface : `${colors.primary}0D`, borderColor: colors.border }]}><View style={[styles.icon, { backgroundColor: item.kind === "reward" ? `${colors.gold}20` : `${colors.primary}18` }]}><MaterialIcons name={item.kind === "reward" ? "toll" : item.kind === "account" ? "person-outline" : "bolt"} size={20} color={item.kind === "reward" ? colors.gold : colors.primary} /></View><View style={styles.copy}><Text style={[styles.notificationTitle, { color: colors.foreground }]}>{item.title}</Text><Text style={[styles.body, { color: colors.muted }]}>{item.body}</Text><Text style={[styles.date, { color: colors.muted }]}>{formatDate(item.createdAt)}</Text></View>{!item.read ? <View style={[styles.unread, { backgroundColor: colors.primary }]} /> : null}</Pressable>} />}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 11, paddingBottom: 20 },
  back: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  headerCopy: { flex: 1 },
  title: { fontSize: 24, fontWeight: "900" },
  subtitle: { fontSize: 12, marginTop: 3 },
  markAll: { fontSize: 11, fontWeight: "800" },
  list: { paddingBottom: 25, gap: 10 },
  row: { flexDirection: "row", borderRadius: 18, borderWidth: 1, padding: 14, alignItems: "flex-start" },
  icon: { width: 40, height: 40, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  copy: { flex: 1, marginLeft: 11 },
  notificationTitle: { fontSize: 14, fontWeight: "900" },
  body: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  date: { fontSize: 10, marginTop: 7 },
  unread: { width: 7, height: 7, borderRadius: 4, marginTop: 5 },
});

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useState } from "react";

import { AppHeader, Field, PrimaryButton, SectionTitle, Surface } from "@/components/wattwallet-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useThemeContext } from "@/lib/theme-provider";
import { getInitials, maskEmail, type ThemePreference } from "@/lib/wattwallet/types";
import { useWattWallet } from "@/lib/wattwallet/store";

export default function ProfileScreen() {
  const colors = useColors();
  const { preference: activePreference } = useThemeContext();
  const { profile, workspace, unreadCount, setThemePreference, setNotificationsEnabled, setLanguage, setAssistantName, updateProfile, logout } = useWattWallet();
  const [profileModal, setProfileModal] = useState(false);
  const [langModal, setLangModal] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: profile?.firstName ?? "", lastName: profile?.lastName ?? "", idNumber: profile?.idNumber ?? "", mobileNumber: profile?.mobileNumber ?? "" });
  
  if (!profile || !workspace) return null;

  const languages = [
    { code: "en", name: "English", assistants: ["Thomas", "Mia"] },
    { code: "af", name: "Afrikaans", assistants: ["Jacobus", "Maria"] },
    { code: "xh", name: "isiXhosa", assistants: ["Bongani", "Thembi"] },
  ];

  const currentLang = languages.find(l => l.code === workspace.preferences.language) || languages[0];
  const selectedTheme = workspace.preferences.theme ?? activePreference;

  const saveProfile = async () => {
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
      Alert.alert("Add your name", "Both first and last name are required.");
      return;
    }
    await updateProfile(profileForm);
    setProfileModal(false);
  };

  const chooseTheme = (preference: ThemePreference) => {
    void setThemePreference(preference);
  };

  const confirmLogout = () => {
    Alert.alert("Log out of WattWallet?", "Your local account will stay on this device, but this session will end.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => void logout() },
    ]);
  };

  return (
    <ScreenContainer className="px-5 pt-4">
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <AppHeader title="Profile" subtitle="Your account and preferences." profile={profile} notificationCount={unreadCount} onNotifications={() => router.push("/notifications")} onProfile={() => undefined} />
        <Surface style={styles.profileCard}><View style={[styles.largeAvatar, { backgroundColor: colors.primary }]}><Text style={styles.largeAvatarText}>{getInitials(profile.firstName, profile.lastName)}</Text></View><View style={styles.profileCopy}><Text style={[styles.profileName, { color: colors.foreground }]}>{profile.firstName} {profile.lastName}</Text><Text style={[styles.profileEmail, { color: colors.muted }]}>{maskEmail(profile.email)}</Text><Text style={[styles.profileType, { color: colors.primary }]}>Launch Edition member</Text></View><Pressable onPress={() => { setProfileForm({ firstName: profile.firstName, lastName: profile.lastName }); setProfileModal(true); }}><MaterialIcons name="edit" size={19} color={colors.primary} /></Pressable></Surface>

        <SectionTitle title="Account" />
        <Surface style={styles.settingsCard}>
          <SettingRow icon="speed" title="My meters" body={`${workspace.meters.length} meter${workspace.meters.length === 1 ? "" : "s"} connected`} onPress={() => router.push("/meters")} />
          <SettingRow icon="notifications-none" title="Notifications" body={`${unreadCount} unread updates`} onPress={() => router.push("/notifications")} />
          <SettingRow icon="chat-bubble-outline" title="WattAssist" body="Electricity and money guidance" onPress={() => router.push("/wattassist")} last />
        </Surface>

        <SectionTitle title="Appearance" />
        <Surface style={styles.settingsCard}>
          <Text style={[styles.preferenceHint, { color: colors.muted }]}>Choose how WattWallet should look on this device.</Text>
          <View style={styles.themeRow}>{(["light", "dark", "system"] as ThemePreference[]).map((theme) => <Pressable key={theme} onPress={() => chooseTheme(theme)} style={[styles.themeChoice, { borderColor: selectedTheme === theme ? colors.primary : colors.border, backgroundColor: selectedTheme === theme ? `${colors.primary}12` : colors.surface }]}><MaterialIcons name={theme === "light" ? "light-mode" : theme === "dark" ? "dark-mode" : "settings-brightness"} size={18} color={selectedTheme === theme ? colors.primary : colors.muted} /><Text style={[styles.themeLabel, { color: selectedTheme === theme ? colors.primary : colors.muted }]}>{theme.charAt(0).toUpperCase() + theme.slice(1)}</Text></Pressable>)}</View>
        </Surface>

        <SectionTitle title="Preferences" />
        <Surface style={styles.settingsCard}>
          <SettingRow 
            icon="language" 
            title="Language & Assistant" 
            body={`${currentLang.name} (${workspace.preferences.assistantName || 'Not set'})`} 
            onPress={() => setLangModal(true)} 
          />
          <View style={styles.preferenceRow}>
            <View style={[styles.preferenceIcon, { backgroundColor: `${colors.secondary}18` }]}>
              <MaterialIcons name="notifications-active" size={18} color={colors.secondary} />
            </View>
            <View style={styles.preferenceCopy}>
              <Text style={[styles.preferenceTitle, { color: colors.foreground }]}>In-app notifications</Text>
              <Text style={[styles.preferenceBody, { color: colors.muted }]}>Purchase and reward updates</Text>
            </View>
            <Switch 
              value={workspace.preferences.notificationsEnabled} 
              onValueChange={(value) => void setNotificationsEnabled(value)} 
              trackColor={{ false: colors.border, true: colors.primary }} 
              thumbColor="#FFFFFF" 
            />
          </View>
        </Surface>

        <PrimaryButton title="Log out" variant="ghost" onPress={confirmLogout} icon="logout" style={styles.logoutButton} />
        <Text style={[styles.version, { color: colors.muted }]}>WattWallet Launch Edition · Mock services enabled</Text>
      </ScrollView>
      <Modal visible={profileModal} transparent animationType="slide" onRequestClose={() => setProfileModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Edit profile</Text>
              <Pressable onPress={() => setProfileModal(false)}>
                <MaterialIcons name="close" size={22} color={colors.muted} />
              </Pressable>
            </View>
            <Text style={[styles.modalSubtitle, { color: colors.muted }]}>Update your account details.</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Field label="First name" value={profileForm.firstName} onChangeText={(value) => setProfileForm((current) => ({ ...current, firstName: value }))} autoCapitalize="words" />
              <Field label="Last name" value={profileForm.lastName} onChangeText={(value) => setProfileForm((current) => ({ ...current, lastName: value }))} autoCapitalize="words" />
              <Field label="SA ID Number" value={profileForm.idNumber} onChangeText={(value) => setProfileForm((current) => ({ ...current, idNumber: value }))} keyboardType="number-pad" />
              <Field label="Mobile number" value={profileForm.mobileNumber} onChangeText={(value) => setProfileForm((current) => ({ ...current, mobileNumber: value }))} keyboardType="phone-pad" />
              <PrimaryButton title="Save profile" onPress={() => void saveProfile()} style={{ marginTop: 10 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={langModal} transparent animationType="slide" onRequestClose={() => setLangModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Language & Assistant</Text>
              <Pressable onPress={() => setLangModal(false)}>
                <MaterialIcons name="close" size={22} color={colors.muted} />
              </Pressable>
            </View>
            <Text style={[styles.modalSubtitle, { color: colors.muted }]}>Select your preferred language and assistant.</Text>
            
            <Text style={[styles.modalSectionLabel, { color: colors.foreground }]}>Select Language</Text>
            <View style={styles.langGrid}>
              {languages.map((lang) => (
                <Pressable 
                  key={lang.code} 
                  onPress={() => {
                    setLanguage(lang.code as any);
                    setAssistantName(lang.assistants[0]);
                  }}
                  style={[
                    styles.langOption, 
                    { 
                      borderColor: workspace.preferences.language === lang.code ? colors.primary : colors.border,
                      backgroundColor: workspace.preferences.language === lang.code ? colors.primary + '12' : 'transparent'
                    }
                  ]}
                >
                  <Text style={[styles.langText, { color: workspace.preferences.language === lang.code ? colors.primary : colors.foreground }]}>
                    {lang.name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.modalSectionLabel, { color: colors.foreground, marginTop: 20 }]}>Choose Assistant Name</Text>
            <View style={styles.langGrid}>
              {currentLang.assistants.map((name) => (
                <Pressable 
                  key={name} 
                  onPress={() => setAssistantName(name)}
                  style={[
                    styles.langOption, 
                    { 
                      borderColor: workspace.preferences.assistantName === name ? colors.primary : colors.border,
                      backgroundColor: workspace.preferences.assistantName === name ? colors.primary + '12' : 'transparent'
                    }
                  ]}
                >
                  <Text style={[styles.langText, { color: workspace.preferences.assistantName === name ? colors.primary : colors.foreground }]}>
                    {name}
                  </Text>
                </Pressable>
              ))}
            </View>

            <PrimaryButton title="Done" onPress={() => setLangModal(false)} style={{ marginTop: 30 }} />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

function SettingRow({ icon, title, body, onPress, last = false }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; title: string; body: string; onPress: () => void; last?: boolean }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.settingRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.border }, pressed && styles.pressed]}><View style={[styles.preferenceIcon, { backgroundColor: `${colors.primary}18` }]}><MaterialIcons name={icon} size={18} color={colors.primary} /></View><View style={styles.preferenceCopy}><Text style={[styles.preferenceTitle, { color: colors.foreground }]}>{title}</Text><Text style={[styles.preferenceBody, { color: colors.muted }]}>{body}</Text></View><MaterialIcons name="chevron-right" size={20} color={colors.muted} /></Pressable>;
}

const styles = StyleSheet.create({
  content: { paddingBottom: 120 },
  profileCard: { flexDirection: "row", alignItems: "center", padding: 17, marginBottom: 27 },
  largeAvatar: { width: 55, height: 55, borderRadius: 18, justifyContent: "center", alignItems: "center" },
  largeAvatarText: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  profileCopy: { flex: 1, marginLeft: 13 },
  profileName: { fontSize: 17, fontWeight: "900" },
  profileEmail: { fontSize: 12, marginTop: 3 },
  profileType: { fontSize: 11, fontWeight: "800", marginTop: 7 },
  settingsCard: { padding: 0, overflow: "hidden", marginBottom: 25 },
  settingRow: { minHeight: 70, flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  preferenceIcon: { width: 34, height: 34, borderRadius: 11, justifyContent: "center", alignItems: "center" },
  preferenceCopy: { flex: 1, marginLeft: 11 },
  preferenceTitle: { fontSize: 14, fontWeight: "800" },
  preferenceBody: { fontSize: 11, marginTop: 3 },
  preferenceHint: { fontSize: 12, lineHeight: 18, paddingHorizontal: 16, paddingTop: 16 },
  themeRow: { flexDirection: "row", gap: 8, padding: 16 },
  themeChoice: { flex: 1, minHeight: 66, borderWidth: 1, borderRadius: 15, justifyContent: "center", alignItems: "center", gap: 5 },
  themeLabel: { fontSize: 11, fontWeight: "800" },
  preferenceRow: { minHeight: 70, flexDirection: "row", alignItems: "center", paddingHorizontal: 16 },
  logoutButton: { marginTop: 2, borderColor: "#DDE9E2" },
  version: { textAlign: "center", fontSize: 11, marginTop: 18 },
  modalBackdrop: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(4, 12, 8, 0.45)" },
  modalCard: { borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 22, paddingBottom: 34 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { fontSize: 21, fontWeight: "900" },
  modalSubtitle: { fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 19 },
  modalSectionLabel: { fontSize: 14, fontWeight: "800", marginBottom: 12 },
  langGrid: { flexDirection: "row", gap: 10 },
  langOption: { flex: 1, height: 50, borderWidth: 1, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  langText: { fontSize: 14, fontWeight: "700" },
  pressed: { opacity: 0.68 },
});

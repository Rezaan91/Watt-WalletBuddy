import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Field, PrimaryButton, StatusPill, Surface } from "@/components/wattwallet-ui";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { maskMeter, type Meter } from "@/lib/wattwallet/types";
import { useWattWallet } from "@/lib/wattwallet/store";

const emptyForm = { nickname: "", meterNumber: "", provider: "" };

export default function MetersScreen() {
  const colors = useColors();
  const { workspace, addMeter, updateMeter, removeMeter, setDefaultMeter } = useWattWallet();
  const [editing, setEditing] = useState<Meter | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const meters = workspace?.meters ?? [];

  const openAdd = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (meter: Meter) => { setEditing(meter); setForm({ nickname: meter.nickname, meterNumber: meter.meterNumber, provider: meter.provider }); setModalOpen(true); };
  const save = async () => {
    if (!form.nickname.trim() || !form.meterNumber.trim() || !form.provider.trim()) {
      Alert.alert("Add a little more", "Enter a nickname, meter number, and provider.");
      return;
    }
    if (editing) await updateMeter(editing.id, form); else await addMeter(form);
    setEditing(null);
    setModalOpen(false);
  };
  const remove = (meter: Meter) => {
    Alert.alert("Remove meter?", `${meter.nickname} will be removed from this device.`, [{ text: "Cancel", style: "cancel" }, { text: "Remove", style: "destructive", onPress: () => void removeMeter(meter.id) }]);
  };
  return (
    <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}><Pressable onPress={() => router.back()} style={styles.backButton}><MaterialIcons name="arrow-back" size={22} color={colors.foreground} /></Pressable><View style={styles.headerCopy}><Text style={[styles.title, { color: colors.foreground }]}>My meters</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Keep all your power points together.</Text></View><Pressable onPress={openAdd} style={[styles.addButton, { backgroundColor: colors.primary }]}><MaterialIcons name="add" size={22} color="#FFFFFF" /></Pressable></View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.note, { backgroundColor: `${colors.primary}12` }]}><MaterialIcons name="security" size={18} color={colors.primary} /><Text style={[styles.noteText, { color: colors.muted }]}>Launch Edition uses fictional meter numbers. No live vending provider is connected.</Text></View>
        {meters.map((meter) => <Surface key={meter.id} style={styles.meterCard}><View style={styles.meterTop}><View style={[styles.meterIcon, { backgroundColor: `${colors.primary}18` }]}><MaterialIcons name="speed" size={21} color={colors.primary} /></View><View style={styles.meterCopy}><Text style={[styles.meterName, { color: colors.foreground }]}>{meter.nickname}</Text><Text style={[styles.meterNumber, { color: colors.muted }]}>{maskMeter(meter.meterNumber)}</Text></View>{meter.isDefault ? <StatusPill label="Default" tone="success" /> : null}</View><View style={[styles.meterMeta, { borderTopColor: colors.border }]}><Text style={[styles.provider, { color: colors.muted }]}>{meter.provider}</Text><View style={styles.actions}><Pressable onPress={() => void setDefaultMeter(meter.id)} disabled={meter.isDefault}><Text style={[styles.action, { color: meter.isDefault ? colors.muted : colors.primary }]}>Set default</Text></Pressable><Pressable onPress={() => openEdit(meter)}><Text style={[styles.action, { color: colors.primary }]}>Edit</Text></Pressable><Pressable onPress={() => remove(meter)}><Text style={[styles.action, { color: colors.error }]}>Remove</Text></Pressable></View></View></Surface>)}
        <PrimaryButton title="Add another meter" variant="secondary" icon="add" onPress={openAdd} style={styles.addCta} />
      </ScrollView>
      <Modal visible={modalOpen} animationType="slide" transparent onRequestClose={() => { setEditing(null); setModalOpen(false); }}>
        <View style={styles.modalBackdrop}><View style={[styles.modalCard, { backgroundColor: colors.surface }]}><View style={styles.modalHeader}><Text style={[styles.modalTitle, { color: colors.foreground }]}>{editing ? "Edit meter" : "Add meter"}</Text><Pressable onPress={() => { setEditing(null); setModalOpen(false); }}><MaterialIcons name="close" size={22} color={colors.muted} /></Pressable></View><Text style={[styles.modalSubtitle, { color: colors.muted }]}>Use a fictional number for this Launch Edition workspace.</Text><Field label="Meter nickname" value={form.nickname} onChangeText={(value) => setForm((current) => ({ ...current, nickname: value }))} placeholder="Flat 4 meter" /><Field label="Meter number" value={form.meterNumber} onChangeText={(value) => setForm((current) => ({ ...current, meterNumber: value }))} placeholder="MTR-2048-0193" autoCapitalize="characters" /><Field label="Provider / municipality" value={form.provider} onChangeText={(value) => setForm((current) => ({ ...current, provider: value }))} placeholder="Eskom" /><PrimaryButton title={editing ? "Save changes" : "Add meter"} onPress={() => void save()} /></View></View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 18 },
  backButton: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  headerCopy: { flex: 1 },
  title: { fontSize: 24, fontWeight: "900" },
  subtitle: { fontSize: 12, marginTop: 3 },
  addButton: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  content: { paddingBottom: 26 },
  note: { flexDirection: "row", gap: 9, padding: 12, borderRadius: 15, alignItems: "flex-start", marginBottom: 18 },
  noteText: { flex: 1, fontSize: 12, lineHeight: 18 },
  meterCard: { marginBottom: 13, padding: 16 },
  meterTop: { flexDirection: "row", alignItems: "center" },
  meterIcon: { width: 40, height: 40, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  meterCopy: { flex: 1, marginLeft: 11 },
  meterName: { fontSize: 15, fontWeight: "900" },
  meterNumber: { fontSize: 12, marginTop: 4 },
  meterMeta: { borderTopWidth: 1, marginTop: 15, paddingTop: 13, flexDirection: "row", alignItems: "center" },
  provider: { fontSize: 11, flex: 1 },
  actions: { flexDirection: "row", gap: 13 },
  action: { fontSize: 11, fontWeight: "800" },
  addCta: { marginTop: 3 },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(4, 12, 8, 0.45)", justifyContent: "flex-end" },
  modalCard: { borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 22, paddingBottom: 34 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { fontSize: 21, fontWeight: "900" },
  modalSubtitle: { fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 19 },
});

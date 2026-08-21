import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useWattWallet } from "@/lib/wattwallet/store";

const quickPrompts = ["How do WattCoins work?", "Help me buy electricity", "How can I save power?"];
const answerFor = (prompt: string, firstName: string) => {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("wattcoin")) return "You earn 1 WattCoin for every R10 of prepaid electricity you buy. Your Launch Edition balance is saved locally and can be explored on the Rewards tab.";
  if (normalized.includes("buy")) return "Start from Buy, choose one of your fictional meters, select an amount between R50 and R5 000, then review the simulated payment and vending steps. No real payment is collected.";
  if (normalized.includes("save") || normalized.includes("power")) return "Try switching off geysers and heaters when you are not using them, check standby appliances, and keep a small weekly electricity budget. Your usage habits are as important as your token balance.";
  if (normalized.includes("account") || normalized.includes("profile")) return `You can update your preferences from Profile. Your account, meters, history, WattCoins, and theme stay separate from other local accounts, ${firstName}.`;
  return "I can help with prepaid electricity, WattCoins, buying guidance, and account settings. Ask me about any of those topics.";
};

export default function WattAssistScreen() {
  const colors = useColors();
  const { profile, workspace } = useWattWallet();
  const assistantName = workspace?.preferences.assistantName || "WattAssist";
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ id: string; from: "assistant" | "user"; text: string }[]>([]);
  
  const greeting = useMemo(() => {
    const base = `Hi ${profile?.firstName ?? "there"}. I’m ${assistantName}, your local electricity and financial-wellness guide.`;
    return base;
  }, [profile?.firstName, assistantName]);

  const send = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");
    setMessages((current) => [
      ...current,
      { id: `${Date.now()}-u`, from: "user", text: trimmed },
      { id: `${Date.now()}-a`, from: "assistant", text: answerFor(trimmed, profile?.firstName ?? "there").replace("WattAssist", assistantName) }
    ]);
  };

  return (
    <ScreenContainer className="px-5 pt-4" edges={["top", "left", "right", "bottom"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <MaterialIcons name="arrow-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={[styles.assistIcon, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="bolt" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.headerCopy}>
          <Text style={[styles.title, { color: colors.foreground }]}>{assistantName}</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>Local guidance for Launch Edition</Text>
        </View>
      </View>
      <ScrollView style={styles.chat} contentContainerStyle={styles.chatContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.bubble, styles.assistantBubble, { backgroundColor: colors.surfaceMuted }]}>
          <Text style={[styles.bubbleText, { color: colors.foreground }]}>{greeting}</Text>
        </View>
        {messages.map((message) => (
          <View key={message.id} style={[styles.bubble, message.from === "user" ? [styles.userBubble, { backgroundColor: colors.primary }] : [styles.assistantBubble, { backgroundColor: colors.surfaceMuted }]]}>
            <Text style={[styles.bubbleText, { color: message.from === "user" ? "#FFFFFF" : colors.foreground }]}>{message.text}</Text>
          </View>
        ))}
        {messages.length === 0 ? (
          <View style={styles.quickWrap}>
            <Text style={[styles.quickTitle, { color: colors.muted }]}>Try asking</Text>
            {quickPrompts.map((prompt) => (
              <Pressable key={prompt} onPress={() => send(prompt)} style={[styles.prompt, { borderColor: colors.border }]}>
                <Text style={[styles.promptText, { color: colors.foreground }]}>{prompt}</Text>
                <MaterialIcons name="arrow-forward" size={15} color={colors.primary} />
              </Pressable>
            ))}
          </View>
        ) : null}
      </ScrollView>
      <View style={[styles.composer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <TextInput value={input} onChangeText={setInput} onSubmitEditing={() => send()} returnKeyType="send" placeholder={`Ask ${assistantName}…`} placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground }]} />
        <Pressable onPress={() => send()} style={[styles.send, { backgroundColor: colors.primary }]}>
          <MaterialIcons name="arrow-upward" size={19} color="#FFFFFF" />
        </Pressable>
      </View>
      <Text style={[styles.disclaimer, { color: colors.muted }]}>WattAssist replies are simulated locally and are not financial advice.</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", gap: 11, paddingBottom: 17 },
  back: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  assistIcon: { width: 38, height: 38, borderRadius: 13, justifyContent: "center", alignItems: "center" },
  headerCopy: { flex: 1 },
  title: { fontSize: 22, fontWeight: "900" },
  subtitle: { fontSize: 11, marginTop: 3 },
  chat: { flex: 1 },
  chatContent: { paddingVertical: 10, gap: 10 },
  bubble: { padding: 13, borderRadius: 18, maxWidth: "88%" },
  assistantBubble: { alignSelf: "flex-start", borderBottomLeftRadius: 5 },
  userBubble: { alignSelf: "flex-end", borderBottomRightRadius: 5 },
  bubbleText: { fontSize: 13, lineHeight: 19 },
  quickWrap: { marginTop: 16 },
  quickTitle: { fontSize: 12, fontWeight: "800", marginBottom: 8 },
  prompt: { minHeight: 46, borderWidth: 1, borderRadius: 15, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  promptText: { fontSize: 12, fontWeight: "700" },
  composer: { minHeight: 54, borderRadius: 18, borderWidth: 1, flexDirection: "row", alignItems: "center", paddingLeft: 15, paddingRight: 6, marginTop: 10 },
  input: { flex: 1, fontSize: 14 },
  send: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center" },
  disclaimer: { fontSize: 10, textAlign: "center", marginVertical: 9 },
});

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton, Surface, WattWalletMark } from "@/components/wattwallet-ui";
import { useColors } from "@/hooks/use-colors";
import { useWattWallet } from "@/lib/wattwallet/store";
import { formatCurrency } from "@/lib/wattwallet/types";

export default function AdvanceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { workspace, requestAdvance, repayAdvance } = useWattWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activeAdvance = workspace?.advances.find((a) => a.status === "active");

  const handleRequest = async (amount: number) => {
    setLoading(true);
    setError("");
    const result = await requestAdvance(amount);
    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? "Could not request advance.");
    } else {
      router.back();
    }
  };

  const handleRepay = async () => {
    if (!activeAdvance) return;
    setLoading(true);
    setError("");
    const result = await repayAdvance(activeAdvance.id);
    setLoading(false);
    if (!result.ok) {
      setError(result.message ?? "Could not repay advance.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 10, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Electricity Advance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
            <MaterialIcons name="bolt" size={40} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Buy Now, Pay Later</Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Get electricity credit now and repay it when you next top up.
          </Text>
        </View>

        {activeAdvance ? (
          <Surface style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>Active Advance</Text>
            <View style={styles.statRow}>
              <View>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Outstanding</Text>
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {formatCurrency(activeAdvance.outstandingAmount)}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.statLabel, { color: colors.muted }]}>Credit Received</Text>
                <Text style={[styles.statValue, { color: colors.foreground }]}>
                  {formatCurrency(activeAdvance.creditReceived)}
                </Text>
              </View>
            </View>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.infoText, { color: colors.muted }]}>
              This advance will be automatically deducted from your next purchase, or you can repay it now.
            </Text>
            <PrimaryButton
              title={loading ? "Repaying..." : "Repay Now"}
              onPress={handleRepay}
              disabled={loading}
              style={{ marginTop: 20 }}
            />
          </Surface>
        ) : (
          <View>
            <Surface style={styles.card}>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>Available for you</Text>
              <Text style={[styles.cardSubtitle, { color: colors.muted }]}>
                Choose an amount to receive as electricity credit.
              </Text>
              
              <View style={styles.optionsGrid}>
                {[50, 100].map((amount) => (
                  <Pressable
                    key={amount}
                    onPress={() => handleRequest(amount)}
                    disabled={loading}
                    style={({ pressed }) => [
                      styles.option,
                      { borderColor: colors.border, backgroundColor: pressed ? colors.border : "transparent" }
                    ]}
                  >
                    <Text style={[styles.optionLabel, { color: colors.muted }]}>Advance</Text>
                    <Text style={[styles.optionAmount, { color: colors.foreground }]}>
                      {formatCurrency(amount)}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {error ? <Text style={[styles.error, { color: colors.error }]}>{error}</Text> : null}
            </Surface>

            <View style={styles.termsContainer}>
              <MaterialIcons name="info-outline" size={16} color={colors.muted} />
              <Text style={[styles.termsText, { color: colors.muted }]}>
                Advances are for electricity credit only. No interest is charged for the Launch Edition.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
  },
  content: {
    padding: 20,
  },
  hero: {
    alignItems: "center",
    marginVertical: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
    maxWidth: 280,
  },
  card: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "900",
  },
  divider: {
    height: 1,
    marginVertical: 15,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 19,
  },
  optionsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  option: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: "center",
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  optionAmount: {
    fontSize: 22,
    fontWeight: "900",
  },
  error: {
    marginTop: 12,
    fontSize: 13,
    textAlign: "center",
  },
  termsContainer: {
    flexDirection: "row",
    marginTop: 24,
    paddingHorizontal: 10,
    gap: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});

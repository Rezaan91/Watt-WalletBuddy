import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useThemeContext } from "@/lib/theme-provider";
import {
  calculateWattCoins,
  createAccountWorkspace,
  createId,
  formatCurrency,
  getCurrentAccount,
  initialWorkspace,
  normalizeEmail,
  validateAmount,
  validateEmail,
  validatePassword,
  type Meter,
  type NotificationItem,
  type Profile,
  type Purchase,
  type PurchaseResult,
  type StoredAccount,
  type StoredState,
  type ThemePreference,
  type UserWorkspace,
} from "@/lib/wattwallet/types";
import { loadStoredState, saveStoredState } from "@/lib/wattwallet/storage";
import i18n from "@/src/i18n/config";
import {
  MockPaymentProvider,
  MockVendingProvider,
  type PaymentOutcome,
  type VendingOutcome,
} from "@/lib/wattwallet/providers";
import { executePurchase } from "@/lib/wattwallet/purchase-service";

export type AuthInput = {
  email: string;
  password: string;
};

export type SignUpInput = AuthInput & {
  firstName: string;
  lastName: string;
  idNumber: string;
  mobileNumber: string;
  confirmPassword: string;
};

type WattWalletContextValue = {
  hydrated: boolean;
  profile: Profile | null;
  workspace: UserWorkspace | null;
  authError: string | null;
  unreadCount: number;
  signUp: (input: SignUpInput) => Promise<{ ok: boolean; message?: string }>;
  login: (input: AuthInput) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ ok: boolean; message: string }>;
  updateProfile: (patch: Pick<Profile, "firstName" | "lastName">) => Promise<void>;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setLanguage: (language: "en" | "af" | "xh") => Promise<void>;
  setAssistantName: (name: string) => Promise<void>;
  addMeter: (input: Pick<Meter, "nickname" | "meterNumber" | "provider">) => Promise<void>;
  updateMeter: (meterId: string, patch: Pick<Meter, "nickname" | "meterNumber" | "provider">) => Promise<void>;
  removeMeter: (meterId: string) => Promise<{ ok: boolean; message?: string }>;
  setDefaultMeter: (meterId: string) => Promise<void>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  makePurchase: (input: {
    amount: number;
    meterId: string;
    paymentOutcome?: PaymentOutcome;
    vendingOutcome?: VendingOutcome;
  }) => Promise<PurchaseResult>;
  requestAdvance: (amount: number) => Promise<{ ok: boolean; message?: string }>;
  repayAdvance: (advanceId: string) => Promise<{ ok: boolean; message?: string }>;
};

const WattWalletContext = createContext<WattWalletContextValue | null>(null);

const createNotification = (
  title: string,
  body: string,
  kind: NotificationItem["kind"],
): NotificationItem => ({
  id: createId("notification"),
  title,
  body,
  kind,
  read: false,
  createdAt: new Date().toISOString(),
});

export function WattWalletProvider({ children }: { children: React.ReactNode }) {
  const { setThemePreference: applyThemePreference } = useThemeContext();
  const [state, setState] = useState<StoredState>({ accounts: {}, sessionUserId: null });
  const [hydrated, setHydrated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const currentAccount = getCurrentAccount(state);
  const profile = currentAccount?.profile ?? null;
  const workspace = currentAccount?.workspace ?? null;

  const commit = useCallback((nextState: StoredState) => {
    setState(nextState);
    void saveStoredState(nextState);
  }, []);

  useEffect(() => {
    let active = true;
    void loadStoredState().then((stored) => {
      if (!active) return;
      setState(stored);
      setHydrated(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !workspace) return;
    void applyThemePreference(workspace.preferences.theme);
  }, [applyThemePreference, hydrated, workspace?.preferences.theme]);

  useEffect(() => {
    if (!hydrated || !workspace) return;
    if (i18n.language !== workspace.preferences.language) {
      void i18n.changeLanguage(workspace.preferences.language);
    }
  }, [hydrated, workspace?.preferences.language]);

  const updateCurrentAccount = useCallback(
    (updater: (account: StoredAccount) => StoredAccount) => {
      if (!state.sessionUserId || !state.accounts[state.sessionUserId]) return null;
      const userId = state.sessionUserId;
      const nextState: StoredState = {
        ...state,
        accounts: {
          ...state.accounts,
          [userId]: updater(state.accounts[userId]),
        },
      };
      commit(nextState);
      return nextState.accounts[userId];
    },
    [commit, state],
  );

  const signUp = useCallback(
    async (input: SignUpInput) => {
      const email = normalizeEmail(input.email);
      if (!input.firstName.trim() || !input.lastName.trim()) {
        return { ok: false, message: "Enter your first and last name." };
      }
      if (!validateEmail(email)) return { ok: false, message: "Enter a valid email address." };
      if (!validatePassword(input.password)) {
        return { ok: false, message: "Use at least 8 characters for your password." };
      }
      if (input.password !== input.confirmPassword) {
        return { ok: false, message: "Passwords do not match." };
      }
      if (state.accounts[email]) return { ok: false, message: "An account already exists for this email." };

      const profileData: Profile = {
        id: email,
        firstName: input.firstName.trim(),
        lastName: input.lastName.trim(),
        idNumber: input.idNumber.trim(),
        mobileNumber: input.mobileNumber.trim(),
        email,
        createdAt: new Date().toISOString(),
      };
      const account: StoredAccount = {
        profile: profileData,
        password: input.password,
        workspace: {
          ...createAccountWorkspace(),
          notifications: [createNotification("Welcome to WattWallet", "Your local wallet is ready. Add a meter or make a simulated purchase to get started.", "account")],
        },
      };
      const nextState: StoredState = {
        accounts: { ...state.accounts, [email]: account },
        sessionUserId: email,
      };
      commit(nextState);
      setAuthError(null);
      await applyThemePreference("system");
      return { ok: true };
    },
    [applyThemePreference, commit, state.accounts],
  );

  const login = useCallback(
    async (input: AuthInput) => {
      const email = normalizeEmail(input.email);
      const account = state.accounts[email];
      if (!account || account.password !== input.password) {
        const message = "Those details did not match a WattWallet account.";
        setAuthError(message);
        return { ok: false, message };
      }
      const nextState = { ...state, sessionUserId: email };
      commit(nextState);
      setAuthError(null);
      await applyThemePreference(account.workspace.preferences.theme);
      return { ok: true };
    },
    [applyThemePreference, commit, state],
  );

  const logout = useCallback(async () => {
    commit({ ...state, sessionUserId: null });
    setAuthError(null);
    await applyThemePreference("system");
  }, [applyThemePreference, commit, state]);

  const forgotPassword = useCallback(
    async (emailInput: string) => {
      const email = normalizeEmail(emailInput);
      if (!validateEmail(email)) {
        return { ok: false, message: "Enter a valid email address." };
      }
      const exists = Boolean(state.accounts[email]);
      return {
        ok: true,
        message: exists
          ? "Reset instructions are ready for this demo account. No email provider is connected in Launch Edition."
          : "If an account exists for this email, reset instructions would be sent. This demo does not connect to email.",
      };
    },
    [state.accounts],
  );

  const updateProfile = useCallback(
    async (patch: Pick<Profile, "firstName" | "lastName">) => {
      updateCurrentAccount((account) => ({
        ...account,
        profile: { ...account.profile, firstName: patch.firstName.trim(), lastName: patch.lastName.trim() },
      }));
    },
    [updateCurrentAccount],
  );

  const setThemePreference = useCallback(
    async (preference: ThemePreference) => {
      updateCurrentAccount((account) => ({
        ...account,
        workspace: { ...account.workspace, preferences: { ...account.workspace.preferences, theme: preference } },
      }));
      await applyThemePreference(preference);
    },
    [applyThemePreference, updateCurrentAccount],
  );

  const setLanguage = useCallback(
    async (language: "en" | "af" | "xh") => {
      updateCurrentAccount((account) => ({
        ...account,
        workspace: {
          ...account.workspace,
          preferences: { ...account.workspace.preferences, language },
        },
      }));
    },
    [updateCurrentAccount],
  );

  const setAssistantName = useCallback(
    async (name: string) => {
      updateCurrentAccount((account) => ({
        ...account,
        workspace: {
          ...account.workspace,
          preferences: { ...account.workspace.preferences, assistantName: name },
        },
      }));
    },
    [updateCurrentAccount],
  );

  const setNotificationsEnabled = useCallback(
    async (enabled: boolean) => {
      updateCurrentAccount((account) => ({
        ...account,
        workspace: {
          ...account.workspace,
          preferences: { ...account.workspace.preferences, notificationsEnabled: enabled },
        },
      }));
    },
    [updateCurrentAccount],
  );

  const addMeter = useCallback(
    async (input: Pick<Meter, "nickname" | "meterNumber" | "provider">) => {
      updateCurrentAccount((account) => {
        const meter: Meter = {
          ...input,
          id: createId("meter"),
          createdAt: new Date().toISOString(),
          isDefault: account.workspace.meters.length === 0,
        };
        return { ...account, workspace: { ...account.workspace, meters: [...account.workspace.meters, meter] } };
      });
    },
    [updateCurrentAccount],
  );

  const updateMeter = useCallback(
    async (meterId: string, patch: Pick<Meter, "nickname" | "meterNumber" | "provider">) => {
      updateCurrentAccount((account) => ({
        ...account,
        workspace: {
          ...account.workspace,
          meters: account.workspace.meters.map((meter) => (meter.id === meterId ? { ...meter, ...patch } : meter)),
        },
      }));
    },
    [updateCurrentAccount],
  );

  const removeMeter = useCallback(
    async (meterId: string) => {
      if (!workspace || workspace.meters.length <= 1) {
        return { ok: false, message: "Keep at least one meter in your wallet." };
      }
      updateCurrentAccount((account) => {
        const remaining = account.workspace.meters.filter((meter) => meter.id !== meterId);
        const hadDefault = account.workspace.meters.find((meter) => meter.id === meterId)?.isDefault;
        return {
          ...account,
          workspace: {
            ...account.workspace,
            meters: hadDefault ? remaining.map((meter, index) => ({ ...meter, isDefault: index === 0 })) : remaining,
          },
        };
      });
      return { ok: true };
    },
    [updateCurrentAccount, workspace],
  );

  const setDefaultMeter = useCallback(
    async (meterId: string) => {
      updateCurrentAccount((account) => ({
        ...account,
        workspace: {
          ...account.workspace,
          meters: account.workspace.meters.map((meter) => ({ ...meter, isDefault: meter.id === meterId })),
        },
      }));
    },
    [updateCurrentAccount],
  );

  const markNotificationRead = useCallback(
    async (notificationId: string) => {
      updateCurrentAccount((account) => ({
        ...account,
        workspace: {
          ...account.workspace,
          notifications: account.workspace.notifications.map((item) =>
            item.id === notificationId ? { ...item, read: true } : item,
          ),
        },
      }));
    },
    [updateCurrentAccount],
  );

  const markAllNotificationsRead = useCallback(async () => {
    updateCurrentAccount((account) => ({
      ...account,
      workspace: {
        ...account.workspace,
        notifications: account.workspace.notifications.map((item) => ({ ...item, read: true })),
      },
    }));
  }, [updateCurrentAccount]);

  const makePurchase = useCallback(
    async ({ amount, meterId, paymentOutcome = "success", vendingOutcome = "success" }: {
      amount: number;
      meterId: string;
      paymentOutcome?: PaymentOutcome;
      vendingOutcome?: VendingOutcome;
    }) => {
      if (!profile || !workspace) return { ok: false as const, stage: "payment" as const, message: "Log in to buy electricity." };
      if (!validateAmount(amount)) return { ok: false as const, stage: "payment" as const, message: "Choose an amount between R50 and R5 000." };
      const meter = workspace.meters.find((item) => item.id === meterId);
      if (!meter) return { ok: false as const, stage: "payment" as const, message: "Select a valid meter before continuing." };

      const serviceResult = await executePurchase(
        { amount, userId: profile.id, meterNumber: meter.meterNumber },
        new MockPaymentProvider(paymentOutcome),
        new MockVendingProvider(vendingOutcome),
      );
      const payment = serviceResult.payment;
      if (!serviceResult.ok && serviceResult.stage === "payment") {
        const failedPurchase: Purchase = {
          id: createId("purchase"),
          userId: profile.id,
          amount,
          meterId,
          meterNickname: meter.nickname,
          meterNumber: meter.meterNumber,
          paymentReference: payment.reference,
          vendingReference: null,
          token: null,
          status: "failed",
          wattCoins: 0,
          createdAt: new Date().toISOString(),
          failureReason: payment.message,
        };
        updateCurrentAccount((account) => ({
          ...account,
          workspace: {
            ...account.workspace,
            purchases: [failedPurchase, ...account.workspace.purchases],
            notifications: [
              createNotification("Payment not completed", payment.message ?? "The simulated payment did not complete.", "purchase"),
              ...account.workspace.notifications,
            ],
          },
        }));
        return { ok: false as const, stage: "payment" as const, message: payment.message ?? "Payment failed." };
      }

      if (!serviceResult.ok) {
        const vending = serviceResult.vending;
        const failedPurchase: Purchase = {
          id: createId("purchase"),
          userId: profile.id,
          amount,
          meterId,
          meterNickname: meter.nickname,
          meterNumber: meter.meterNumber,
          paymentReference: payment.reference,
          vendingReference: vending.reference,
          token: null,
          status: "failed",
          wattCoins: 0,
          createdAt: new Date().toISOString(),
          failureReason: vending.message,
        };
        updateCurrentAccount((account) => ({
          ...account,
          workspace: {
            ...account.workspace,
            purchases: [failedPurchase, ...account.workspace.purchases],
            notifications: [
              createNotification("Vending needs attention", vending.message ?? "No token was issued.", "purchase"),
              ...account.workspace.notifications,
            ],
          },
        }));
        return { ok: false as const, stage: "vending" as const, message: vending.message ?? "Vending failed." };
      }

      const vending = serviceResult.vending;
      const wattCoins = calculateWattCoins(amount);
      const purchase: Purchase = {
        id: createId("purchase"),
        userId: profile.id,
        amount,
        meterId,
        meterNickname: meter.nickname,
        meterNumber: meter.meterNumber,
        paymentReference: payment.reference,
        vendingReference: vending.reference,
        token: vending.token ?? null,
        status: "success",
        wattCoins,
        createdAt: new Date().toISOString(),
      };
      updateCurrentAccount((account) => ({
        ...account,
        workspace: {
          ...account.workspace,
          purchases: [purchase, ...account.workspace.purchases],
          wattCoins: account.workspace.wattCoins + wattCoins,
          rewardEntries: [
            { id: createId("reward"), amount: wattCoins, description: `Earned from ${formatCurrency(amount)} purchase`, createdAt: purchase.createdAt },
            ...account.workspace.rewardEntries,
          ],
          notifications: [
            createNotification("Token ready", `${formatCurrency(amount)} added to ${meter.nickname}.`, "purchase"),
            createNotification("WattCoins earned", `You earned ${wattCoins} WattCoins.`, "reward"),
            ...account.workspace.notifications,
          ],
        },
      }));
      return { ok: true as const, purchase };
    },
    [profile, updateCurrentAccount, workspace],
  );

  const requestAdvance = useCallback(
    async (amount: number) => {
      if (!profile || !workspace) return { ok: false, message: "Log in to request an advance." };
      if (amount < 50 || amount > 100) return { ok: false, message: "Advances are limited to R50–R100." };
      if (workspace.advances.some((a) => a.status === "active")) {
        return { ok: false, message: "You already have an active advance." };
      }

      updateCurrentAccount((account) => {
        const advance: ElectricityAdvance = {
          id: createId("advance"),
          amount,
          creditReceived: amount,
          outstandingAmount: amount,
          status: "active",
          createdAt: new Date().toISOString(),
        };
        return {
          ...account,
          workspace: {
            ...account.workspace,
            advances: [advance, ...account.workspace.advances],
            notifications: [
              createNotification("Advance approved", `R${amount} electricity credit has been added to your wallet.`, "purchase"),
              ...account.workspace.notifications,
            ],
          },
        };
      });
      return { ok: true };
    },
    [profile, updateCurrentAccount, workspace],
  );

  const repayAdvance = useCallback(
    async (advanceId: string) => {
      if (!profile || !workspace) return { ok: false, message: "Log in to repay." };
      updateCurrentAccount((account) => ({
        ...account,
        workspace: {
          ...account.workspace,
          advances: account.workspace.advances.map((a) =>
            a.id === advanceId ? { ...a, status: "paid", outstandingAmount: 0 } : a,
          ),
          notifications: [
            createNotification("Advance repaid", "Your electricity advance has been settled.", "account"),
            ...account.workspace.notifications,
          ],
        },
      }));
      return { ok: true };
    },
    [profile, updateCurrentAccount, workspace],
  );

  const value = useMemo<WattWalletContextValue>(
    () => ({
      hydrated,
      profile,
      workspace,
      authError,
      unreadCount: workspace?.notifications.filter((item) => !item.read).length ?? 0,
      signUp,
      login,
      logout,
      forgotPassword,
      updateProfile,
      setThemePreference,
      setNotificationsEnabled,
      setLanguage,
      setAssistantName,
      addMeter,
      updateMeter,
      removeMeter,
      setDefaultMeter,
      markNotificationRead,
      markAllNotificationsRead,
      makePurchase,
      requestAdvance,
      repayAdvance,
    }),
    [
      addMeter,
      authError,
      forgotPassword,
      hydrated,
      login,
      logout,
      makePurchase,
      markAllNotificationsRead,
      markNotificationRead,
      profile,
      removeMeter,
      repayAdvance,
      requestAdvance,
      setAssistantName,
      setLanguage,
      setDefaultMeter,
      setNotificationsEnabled,
      setThemePreference,
      signUp,
      updateMeter,
      updateProfile,
      workspace,
    ],
  );

  return <WattWalletContext.Provider value={value}>{children}</WattWalletContext.Provider>;
}

export function useWattWallet() {
  const value = useContext(WattWalletContext);
  if (!value) throw new Error("useWattWallet must be used within WattWalletProvider");
  return value;
}

export const createTestWorkspace = (): UserWorkspace => initialWorkspace();

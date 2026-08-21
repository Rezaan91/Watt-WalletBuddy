export type ThemePreference = "light" | "dark" | "system";

export type PurchaseStatus = "success" | "failed" | "pending";

export type NotificationKind = "purchase" | "reward" | "account";

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  mobileNumber: string;
  email: string;
  createdAt: string;
};

export type Meter = {
  id: string;
  nickname: string;
  meterNumber: string;
  provider: string;
  isDefault: boolean;
  createdAt: string;
};

export type Purchase = {
  id: string;
  userId: string;
  amount: number;
  meterId: string;
  meterNickname: string;
  meterNumber: string;
  paymentReference: string;
  vendingReference: string | null;
  token: string | null;
  status: PurchaseStatus;
  wattCoins: number;
  createdAt: string;
  failureReason?: string;
};

export type RewardEntry = {
  id: string;
  amount: number;
  description: string;
  createdAt: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  kind: NotificationKind;
  read: boolean;
  createdAt: string;
};

export type UserPreferences = {
  theme: ThemePreference;
  notificationsEnabled: boolean;
  language: "en" | "af" | "xh";
  assistantName: string | null;
};

export type ElectricityAdvance = {
  id: string;
  amount: number;
  creditReceived: number;
  outstandingAmount: number;
  status: "active" | "paid";
  createdAt: string;
};

export type UserWorkspace = {
  meters: Meter[];
  purchases: Purchase[];
  rewardEntries: RewardEntry[];
  notifications: NotificationItem[];
  advances: ElectricityAdvance[];
  wattCoins: number;
  preferences: UserPreferences;
};

export type StoredAccount = {
  profile: Profile;
  password: string;
  workspace: UserWorkspace;
};

export type StoredState = {
  accounts: Record<string, StoredAccount>;
  sessionUserId: string | null;
};

export type PaymentResult = {
  ok: boolean;
  reference: string;
  message?: string;
};

export type VendingResult = {
  ok: boolean;
  reference: string;
  token?: string;
  message?: string;
};

export type PurchaseResult =
  | { ok: true; purchase: Purchase }
  | { ok: false; stage: "payment" | "vending"; message: string };

export const WATTCOINS_PER_RAND = 0.1;

export const calculateWattCoins = (amount: number) =>
  Math.max(1, Math.floor(amount * WATTCOINS_PER_RAND));

export const DEFAULT_METER: Omit<Meter, "id" | "createdAt"> = {
  nickname: "Home meter",
  meterNumber: "MTR-8842-0317-90",
  provider: "City Power",
  isDefault: true,
};

export const initialWorkspace = (): UserWorkspace => ({
  meters: [],
  purchases: [],
  rewardEntries: [],
  notifications: [],
  wattCoins: 0,
  preferences: {
    theme: "system",
    notificationsEnabled: true,
    language: "en",
    assistantName: null,
  },
  advances: [],
});

export const createId = (prefix: string) =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(isoDate));

export const maskMeter = (meterNumber: string) => {
  if (meterNumber.length <= 8) return meterNumber;
  return `${meterNumber.slice(0, 4)} •••• •••• ${meterNumber.slice(-2)}`;
};

export const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!name || !domain || name.length < 3) return email;
  return `${name.slice(0, 2)}•••@${domain}`;
};

export const getInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

export const generateDemoToken = () =>
  `DEMO-${Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000)).join(" ")}`;

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export const validateAmount = (amount: number) =>
  Number.isFinite(amount) && amount >= 50 && amount <= 5000;

export const validateEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const validatePassword = (password: string) => password.length >= 8;

export const buildDefaultMeter = (): Meter => ({
  id: createId("meter"),
  createdAt: new Date().toISOString(),
  ...DEFAULT_METER,
});

export const createAccountWorkspace = (): UserWorkspace => ({
  ...initialWorkspace(),
  meters: [buildDefaultMeter()],
});

export const createEmptyStoredState = (): StoredState => ({
  accounts: {},
  sessionUserId: null,
});

export const normalizeStoredState = (value: unknown): StoredState => {
  if (!value || typeof value !== "object") return createEmptyStoredState();
  const candidate = value as Partial<StoredState>;
  return {
    accounts: candidate.accounts ?? {},
    sessionUserId: candidate.sessionUserId ?? null,
  };
};

export const getCurrentAccount = (state: StoredState) =>
  state.sessionUserId ? state.accounts[state.sessionUserId] ?? null : null;

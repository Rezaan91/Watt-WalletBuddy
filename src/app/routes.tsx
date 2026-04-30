import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import OnboardingScreen from "./components/OnboardingScreen";
import AuthScreen from "./components/AuthScreen";
import VerificationScreen from "./components/VerificationScreen";
import DashboardScreen from "./components/DashboardScreen";
import BuyElectricityScreen from "./components/BuyElectricityScreen";
import UsageScreen from "./components/UsageScreen";
import AdvanceScreen from "./components/AdvanceScreen";
import LoadSheddingScreen from "./components/LoadSheddingScreen";
import RewardsScreen from "./components/RewardsScreen";
import TransactionsScreen from "./components/TransactionsScreen";
import AIAssistantScreen from "./components/AIAssistantScreen";
import SettingsScreen from "./components/SettingsScreen";
import EditProfileScreen from "./components/EditProfileScreen";
import FamilySharingScreen from "./components/FamilySharingScreen";
import PaymentMethodsScreen from "./components/PaymentMethodsScreen";
import LanguageScreen from "./components/LanguageScreen";
import ChangePasswordScreen from "./components/ChangePasswordScreen";
import TwoFactorScreen from "./components/TwoFactorScreen";
import HelpCenterScreen from "./components/HelpCenterScreen";
import ContactSupportScreen from "./components/ContactSupportScreen";
import RedeemVouchersScreen from "./components/RedeemVouchersScreen";
import ManageUsersScreen from "./components/ManageUsersScreen";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: OnboardingScreen },
      { path: "auth", Component: AuthScreen },
      { path: "verify", Component: VerificationScreen },
      { path: "dashboard", Component: DashboardScreen },
      { path: "buy", Component: BuyElectricityScreen },
      { path: "usage", Component: UsageScreen },
      { path: "advance", Component: AdvanceScreen },
      { path: "loadshedding", Component: LoadSheddingScreen },
      { path: "rewards", Component: RewardsScreen },
      { path: "rewards/redeem", Component: RedeemVouchersScreen },
      { path: "transactions", Component: TransactionsScreen },
      { path: "assistant", Component: AIAssistantScreen },
      { path: "settings", Component: SettingsScreen },
      { path: "settings/profile", Component: EditProfileScreen },
      { path: "settings/family", Component: FamilySharingScreen },
      { path: "settings/payment", Component: PaymentMethodsScreen },
      { path: "settings/language", Component: LanguageScreen },
      { path: "settings/password", Component: ChangePasswordScreen },
      { path: "settings/twofactor", Component: TwoFactorScreen },
      { path: "settings/users", Component: ManageUsersScreen },
      { path: "settings/help", Component: HelpCenterScreen },
      { path: "settings/contact", Component: ContactSupportScreen },
    ],
  },
]);

# WattWallet — Launch Edition

WattWallet is a local-first South African prepaid electricity wallet and financial-wellness mobile application built with Expo SDK 54, React Native, TypeScript, Expo Router, and AsyncStorage. The Launch Edition is designed for standalone Android packaging and keeps payment, vending, and assistant behaviour explicitly simulated.

## Implemented product behaviour

The application includes account creation, login, logout, session restoration, simulated forgot-password recovery, account-isolated local workspaces, editable profile information, multiple fictional meters, default-meter selection, meter editing and removal guards, Light/Dark/System appearance preferences, notification preferences, in-app notifications, WattAssist, WattCoin calculation and history, transaction history, receipt detail views, token copy/share support, and the full electricity purchase journey.

A successful purchase follows the complete local flow: select a meter, choose R50/R100/R150/R200/R300/R500 or a custom amount from R50 to R5 000, review the order, run mock payment, run mock vending, generate a fictional `DEMO-#### #### #### ####` token, award WattCoins using the configurable `1 WattCoin per R10` rule, save the receipt, and expose the transaction in History. Payment and vending failure states are persisted safely without awarding WattCoins or delivering a token.

## Architecture

The UI calls `useWattWallet`, which owns local session state and account isolation. The store persists a `StoredState` object in AsyncStorage under `wattwallet.launch-edition.v1`. The business layer is separated into `types.ts`, `storage.ts`, `purchase-service.ts`, and provider adapters in `providers.ts`.

| Layer | Responsibility |
| --- | --- |
| Screens and reusable components | Branded mobile UX, validation, loading, success, failure, empty, and offline-safe explanatory states |
| `lib/wattwallet/store.tsx` | Session lifecycle, profile, meters, preferences, notifications, purchases, rewards, and persistence orchestration |
| `lib/wattwallet/purchase-service.ts` | Payment-first purchase orchestration and vending short-circuit behaviour |
| `lib/wattwallet/providers.ts` | Provider-neutral interfaces plus `MockPaymentProvider` and `MockVendingProvider` |
| `lib/wattwallet/types.ts` | Domain models, validation, token generation, currency/date formatting, and WattCoin business rules |

No real payment credentials, card details, banking passwords, production API keys, live vending calls, paid AI providers, or live push infrastructure are used. Expo native modules are declared explicitly in `package.json`, including `expo-asset` for the `expo-audio` peer requirement and `expo-clipboard` for token copy support.

## Validation completed

The final checks completed successfully:

| Check | Result |
| --- | --- |
| Automated tests | 7 passed; the scaffold’s unrelated server logout test remains skipped |
| ESLint | Passed with no lint errors |
| TypeScript | Passed with `tsc --noEmit` |
| Expo Doctor | 18/18 checks passed |
| Expo public config | Passed; portrait orientation, Android package, mock flags, assets, and plugins resolved |
| Android prebuild | Passed; native `android/` directory generated and updated |

The sandbox does not include an Android SDK or `adb`, so `npx expo run:android` cannot compile an APK in this environment. The generated native project is ready for an Android-capable build environment. From the project root, run `npx expo run:android --variant debug` or use the WebDev Publish flow to generate an installable APK.

## Safe demo notes

Use fictional values such as `MTR-8842-0317-90` for meters. Use `MOCK_PAYMENT=true` and `MOCK_VENDING=true` as the safe default concept. The app itself also exposes these flags through Expo `extra` configuration. Any token shown in Launch Edition is intentionally labelled as fictional and is not valid for electricity vending.

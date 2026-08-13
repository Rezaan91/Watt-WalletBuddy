# WattWallet Mobile App Interface Design (Launch Edition)

## Design Principles & Brand Identity
- **Visual Identity**: Modern, premium, trustworthy South African fintech aesthetic (deep emerald/electric teal primary accents, clean slate cards, crisp typography, energetic green highlights).
- **Portrait Orientation (9:16)**: Optimized for one-handed thumb navigation with reachable primary CTA buttons at the bottom.
- **Apple HIG & Material Design Harmonisation**: Clean iOS/Android native feel with standard bottom tab bar and smooth modal transitions.
- **Theme Support**: Full dynamic Light and Dark mode with high contrast and preservation of transparent official brand assets (WattWallet icon & WattCoin).

## Screen List & Architecture

1. **Authentication Screens (`/auth/login`, `/auth/signup`, `/auth/forgot`)**
   - **Content**: Brand logo, email/password inputs, show/hide password toggle, validation errors, loading state.
   - **Flow**: User enters credentials or registers new account -> authenticated session created -> transitions to Home.

2. **Home Dashboard (`/(tabs)/index`)**
   - **Content**: Greeting with authenticated user name, notification bell, active meter card with nickname & balance preview, WattCoin balance widget with official transparent coin artwork, quick actions (Buy Electricity, Meters, Rewards, History), and recent activity feed.

3. **Buy Electricity & Purchase Flow (`/purchase/...`)**
   - **Content**: Step-by-step wizard:
     1. Select Meter (choose from user's meters or add new)
     2. Select/Custom Amount (R50, R100, R150, R200, R300, R500 or custom)
     3. Review Summary & Fee breakdown
     4. Mock Payment (Processing, Success/Failure simulation)
     5. Mock Electricity Vending (Token generation, transaction ref)
     6. Success Screen / Token Delivery / Receipt (Copy token, share, view WattCoins earned)

4. **Meters Management (`/meters`)**
   - **Content**: List of prepaid meters (nickname, meter number, address, municipality like Eskom / City Power / CoJ), default meter badge, Add Meter modal, Edit Meter, Delete/Remove meter.

5. **History & Transactions (`/(tabs)/history`)**
   - **Content**: Filterable list of past purchases, status badges (Successful, Failed, Pending), transaction details drawer/modal with token, payment ref, vending ref, and date/time.

6. **Rewards & WattCoins (`/(tabs)/rewards`)**
   - **Content**: Prominent WattCoin balance with official transparent coin artwork, "How WattCoins Work" guide, reward tiers/catalogue, and reward earnings history.

7. **Profile & Settings (`/(tabs)/profile`)**
   - **Content**: User profile details (First name, Last name, Email), Appearance / Theme Switcher (Light, Dark, System), Notification preferences, Security settings, and Log Out action.

8. **WattAssist (`/wattassist`)**
   - **Content**: Interactive electricity and financial-wellness assistant chatbot/guide answering prepaid electricity questions, token entry tips, and budgeting guidance.

9. **Notifications Center (`/notifications`)**
   - **Content**: List of in-app simulated notifications (purchase success, token ready, WattCoins earned, rewards available).

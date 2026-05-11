# WattWallet - Complete Project Blueprint

## Executive Summary

**Project Name:** WattWallet  
**Version:** 1.0.0  
**Platform:** Web Application (Mobile-First Responsive)  
**Technology Stack:** React 18.3.1 + TypeScript + Tailwind CSS v4  
**Target Market:** South African Prepaid Electricity Users  
**Primary Goal:** Smart electricity management with rewards, household sharing, and financial assistance

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technical Architecture](#2-technical-architecture)
3. [Feature Specifications](#3-feature-specifications)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Data Models](#5-data-models)
6. [User Flows](#6-user-flows)
7. [Screen Inventory](#7-screen-inventory)
8. [Design System](#8-design-system)
9. [Security & Authentication](#9-security--authentication)
10. [Demo Configuration](#10-demo-configuration)
11. [Deployment Strategy](#11-deployment-strategy)
12. [Future Roadmap](#12-future-roadmap)

---

## 1. Project Overview

### 1.1 Purpose
WattWallet is a comprehensive prepaid electricity management platform designed specifically for South African households. It combines electricity purchasing, usage tracking, rewards programs, and household member management in a single, user-friendly mobile application.

### 1.2 Key Value Propositions
- **Smart Usage Tracking:** Real-time monitoring of electricity consumption with AI-powered insights
- **WattCoins Rewards:** Gamified reward system for energy-efficient behavior
- **Household Sharing:** Multi-user support with role-based permissions
- **Financial Assistance:** Advance request system for emergencies
- **Load Shedding Integration:** Real-time schedules and notifications
- **Free Basic Electricity:** Government subsidy eligibility checking

### 1.3 Target Users
- **Primary Users:** Household heads/account owners
- **Secondary Users:** Family members, tenants, co-habitants
- **Demographics:** South African prepaid electricity users across all income levels

---

## 2. Technical Architecture

### 2.1 Technology Stack

#### Frontend Framework
- **React 18.3.1** - Component-based UI framework
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing with nested routes
- **React Hooks** - State management (useState, useEffect, useContext)

#### Styling & UI
- **Tailwind CSS v4.0** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Custom CSS Variables** - Theme tokens in `/src/styles/theme.css`

#### Charts & Visualization
- **Recharts** - Data visualization for usage analytics

#### Internationalization
- **react-i18next** - Multi-language support (English, Afrikaans, isiXhosa)

#### Build Tools
- **Vite** - Fast build tool and dev server
- **pnpm** - Package manager

### 2.2 Project Structure

```
/workspaces/default/code/
├── src/
│   ├── app/
│   │   ├── components/          # All React components
│   │   │   ├── Root.tsx         # Main layout wrapper
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── AuthScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── BuyElectricityScreen.tsx
│   │   │   ├── ManageUsersScreen.tsx
│   │   │   └── [28+ screen components]
│   │   ├── context/
│   │   │   └── UserContext.tsx  # Global user state
│   │   ├── routes.tsx           # Route configuration
│   │   └── App.tsx              # Main app entry
│   ├── styles/
│   │   ├── theme.css            # Design tokens & variables
│   │   ├── fonts.css            # Font imports
│   │   └── index.css            # Global styles
│   ├── imports/                 # Images & assets
│   ├── i18n/                    # Translation files
│   └── index.tsx                # React mount point
├── package.json
└── tsconfig.json
```

### 2.3 State Management

#### Context API
- **UserContext** - Global user authentication and profile data
  - User data (name, email, phone, ID, role)
  - Household ID and linkage
  - PRIMARY/SECONDARY role permissions

#### Local Storage
- `userData` - Persisted user profile
- `households` - Household configuration and metadata
- `householdUsers` - All household members
- `electricityRequests` - Pending/approved/rejected requests
- `twoFactorEnabled` - 2FA status
- `twoFactorMethod` - SMS or Email preference
- `darkMode` - Theme preference

### 2.4 Routing Architecture

```typescript
Browser Router (Hash-based)
├── / (Root Layout)
│   ├── index → OnboardingScreen
│   ├── /auth → AuthScreen
│   ├── /verify → VerificationScreen
│   ├── /dashboard → DashboardScreen
│   ├── /buy → BuyElectricityScreen
│   ├── /usage → UsageScreen
│   ├── /advance → AdvanceScreen
│   ├── /loadshedding → LoadSheddingScreen
│   ├── /rewards → RewardsScreen
│   ├── /rewards/redeem → RedeemVouchersScreen
│   ├── /transactions → TransactionsScreen
│   ├── /assistant → AIAssistantScreen
│   ├── /settings → SettingsScreen
│   ├── /settings/profile → EditProfileScreen
│   ├── /settings/family → FamilySharingScreen
│   ├── /settings/users → ManageUsersScreen
│   ├── /settings/payment → PaymentMethodsScreen
│   ├── /settings/language → LanguageScreen
│   ├── /settings/password → ChangePasswordScreen
│   ├── /settings/twofactor → TwoFactorScreen
│   ├── /settings/help → HelpCenterScreen
│   └── /settings/contact → ContactSupportScreen
```

---

## 3. Feature Specifications

### 3.1 Authentication & Onboarding

#### Sign-Up Flow
1. Welcome/Onboarding screens with feature highlights
2. User registration form:
   - Full Name
   - South African ID Number (13 digits)
   - Cellphone Number (10 digits)
   - Email Address
   - Password (8-13 chars, capital, number, special char)
   - Optional: Family Code for joining existing household
3. Two-factor verification (SMS/Email)
4. Account activation

#### Login Options
- Email + Password
- Google OAuth
- Microsoft OAuth
- Apple Sign-In
- Two-Factor Authentication (optional)

### 3.2 Dashboard

#### Primary User Dashboard
- Total balance display (Rand amount + kWh remaining)
- Smart meter status (Active/Offline + last sync time)
- WattCoins balance with link to rewards
- Active advance repayment progress
- **Pending Requests Section** (NEW):
  - Shows electricity requests from secondary users
  - Approve/Reject actions
  - Request details (amount, user, purpose, timestamp)
- Quick action buttons:
  - Buy Electricity
  - Request Advance
  - Load Shedding Schedule
- Recent transaction history (last 5)
- View All Transactions link

#### Secondary User Dashboard
- Same as Primary BUT:
  - "Request Electricity" instead of "Buy Electricity"
  - Individual WattCoins balance (not household total)
  - **Permissions Card** showing:
    - ✓ Can Request Electricity
    - ✓ Can View Balance & Usage
    - ✗ Cannot Approve Advances
    - ✗ Cannot Manage Users
  - No Pending Requests section (can't approve)

### 3.3 Electricity Purchase/Request

#### PRIMARY User Flow (Buy Electricity)
1. Enter amount (R10 - R1000) or select quick amounts
2. View estimated kWh
3. Check Free Basic Electricity eligibility (optional)
   - Enter meter number
   - System checks eligibility
   - Claim 50 kWh if eligible
4. Select payment method:
   - WattWallet Balance
   - Credit/Debit Card
5. Confirm purchase
6. Receive 20-digit token
7. Success screen with copy token feature

#### SECONDARY User Flow (Request Electricity)
1. Enter amount (R10 - R1000) or select quick amounts
2. Add optional purpose/note
3. Submit request
4. Request goes to PRIMARY user for approval
5. Notification when approved/rejected

### 3.4 WattCoins Rewards System

#### Earning WattCoins
- **Smart Usage:** Reduce consumption by 10% → 50 WC
- **Weekly Goal:** Stay under budget → 25 WC
- **Referral Bonus:** Invite a friend → 100 WC
- Automatic tracking and notifications

#### Redeeming WattCoins
- **Electricity Credits:**
  - R50 = 50 WC
  - R100 = 95 WC (Best Value)
  - R200 = 180 WC (Popular)
- **Grocery Vouchers:**
  - Pick n Pay: R50, R100, R200
  - Shoprite: R50, R100, R200
  - Checkers: R50, R100, R200
  - Woolworths: R50, R100, R200
  - FreshStop: R50, R100, R200
- **Custom Amount:** R30 - R500 (1:1 ratio)

#### Achievements & Milestones
- First Purchase ⭐
- Energy Saver ⚡
- 30 Day Streak 🔥
- Premium User 💎
- Top 10% 🏆
- Goal Master 🎯

### 3.5 Usage Analytics

#### Visualization
- Daily usage chart (last 7 days)
- Weekly comparison
- Monthly trends
- Time-of-day breakdown

#### Metrics
- Average daily consumption
- Peak usage hours
- Cost per kWh
- Savings vs. previous period

#### AI Assistant Insights
- Usage pattern analysis
- Recommendations for savings
- Appliance-level breakdown estimates
- Cost optimization tips

### 3.6 Advance Request System

#### Request Flow
1. Select advance amount
2. Choose repayment plan
3. View terms and conditions
4. Submit request
5. PRIMARY user approval required
6. Funds disbursed to WattWallet balance
7. Automatic repayment deduction from future purchases

#### Advance Tiers
- Emergency: Up to R120
- Standard: Up to R500
- Premium: Up to R1000 (credit score dependent)

### 3.7 Load Shedding Integration

#### Features
- Real-time load shedding stage display
- Area-specific schedule
- Next outage countdown timer
- Push notifications (planned)
- Smart recommendations:
  - "Buy electricity before next outage"
  - "Charge devices now"

### 3.8 Household Management

#### Multi-User System
- **Household Profile:**
  - Household Name (e.g., "Juries Family")
  - Unique Family Code (e.g., "JURIES-8472")
  - Meter Number
  - Shared Address
  - Monthly Budget
  - Household WattCoins Balance

#### User Roles

**PRIMARY User (Account Owner):**
- Full control of account
- Approve/decline electricity requests
- Manage household members
- Buy electricity directly
- Manage payment methods
- View all usage analytics
- Set household budget

**SECONDARY User (Family/Tenant):**
- Request electricity (requires approval)
- View household balance
- View usage analytics
- Earn individual WattCoins
- Cannot approve requests
- Cannot remove members
- Cannot manage payments

#### Invite System
1. PRIMARY user clicks "Invite User"
2. Enter email/phone number
3. System sends invite with family code
4. Invitee signs up with family code
5. Automatically linked to household as SECONDARY
6. Appears in household members list

#### Member Management
- View all household members
- See member roles (Primary/Secondary badge)
- View join dates and activity
- Remove SECONDARY users (PRIMARY only)
- Copy/share family code

### 3.9 Settings & Account Management

#### Profile Settings
- Edit personal information
- Update phone number
- Change email address
- Upload profile picture (planned)

#### Security Settings
- Change password
- Two-factor authentication (SMS/Email)
- Login history
- Active sessions

#### Payment Methods
- Link credit/debit cards
- Bank account connection
- Digital wallets (planned)
- Remove payment methods

#### Preferences
- Dark mode toggle
- Language selection (English, Afrikaans, isiXhosa)
- Notification preferences
- Currency display

---

## 4. User Roles & Permissions

### 4.1 Permission Matrix

| Feature | PRIMARY User | SECONDARY User |
|---------|--------------|----------------|
| **Authentication** |
| Sign Up | ✅ | ✅ |
| Login | ✅ | ✅ |
| 2FA Setup | ✅ | ✅ |
| **Dashboard** |
| View Balance | ✅ | ✅ |
| View Usage | ✅ | ✅ |
| View WattCoins | ✅ (Household) | ✅ (Personal) |
| View Transactions | ✅ (All) | ✅ (Own) |
| **Electricity** |
| Buy Electricity | ✅ | ❌ |
| Request Electricity | ✅ | ✅ |
| Approve Requests | ✅ | ❌ |
| Reject Requests | ✅ | ❌ |
| **Rewards** |
| Earn WattCoins | ✅ | ✅ |
| Redeem Vouchers | ✅ | ✅ |
| View Achievements | ✅ | ✅ |
| **Household** |
| Invite Members | ✅ | ❌ |
| Remove Members | ✅ | ❌ |
| View Members | ✅ | ✅ |
| Change Family Code | ✅ | ❌ |
| **Settings** |
| Edit Profile | ✅ | ✅ |
| Manage Payments | ✅ | ❌ |
| Change Budget | ✅ | ❌ |
| Language | ✅ | ✅ |
| **Advances** |
| Request Advance | ✅ | ✅ |
| Approve Advance | ✅ | ❌ |

### 4.2 Role Assignment

**PRIMARY Role Assignment:**
- Automatically assigned when creating new household
- First user to register = PRIMARY
- Cannot be changed or transferred (in v1.0)

**SECONDARY Role Assignment:**
- Automatically assigned when joining with family code
- Invited users = SECONDARY
- Cannot self-promote to PRIMARY

---

## 5. Data Models

### 5.1 User Data Model

```typescript
interface UserData {
  // Personal Information
  name: string;                    // Full name
  email: string;                   // Email address (unique)
  phone: string;                   // South African phone (+27...)
  idNumber: string;                // SA ID Number (13 digits)
  
  // Household Linkage
  householdId: string;             // Unique household identifier
  role: "PRIMARY" | "SECONDARY";   // User role
  
  // Meter Information
  meterNumber?: string;            // Prepaid meter number
  address?: string;                // Physical address
  
  // Metadata
  joinedDate?: string;             // Account creation date
  lastLogin?: string;              // Last login timestamp
  wattCoins?: number;              // Individual WattCoins balance
}
```

### 5.2 Household Data Model

```typescript
interface Household {
  householdId: string;             // Unique ID (e.g., "JURIES-8472")
  householdName: string;           // Display name (e.g., "Juries Family")
  meterNumber: string;             // Shared meter number
  address: string;                 // Household address
  primaryUser: string;             // Email of PRIMARY user
  status: "Active" | "Suspended";  // Account status
  monthlyBudget: number;           // Budget in Rand
  wattCoinsBalance: number;        // Household total WattCoins
  createdDate: string;             // Household creation date
}
```

### 5.3 Household Member Model

```typescript
interface HouseholdMember {
  id: string;                      // Unique member ID
  name: string;                    // Member name
  email: string;                   // Member email
  phone: string;                   // Member phone
  role: "PRIMARY" | "SECONDARY";   // Member role
  joinedDate: string;              // When they joined household
  wattCoins?: number;              // Individual balance (SECONDARY)
  lastLogin?: string;              // Last activity
  relationship?: string;           // e.g., "Husband", "Sister", "Tenant"
}
```

### 5.4 Electricity Request Model

```typescript
interface ElectricityRequest {
  id: string;                      // Unique request ID
  userId: string;                  // Requester's email
  userName: string;                // Requester's name
  amount: number;                  // Amount in Rand
  kwhEstimate: string;             // Estimated kWh
  status: "pending" | "approved" | "rejected";
  requestedAt: string;             // ISO timestamp
  householdId: string;             // Household ID
  purpose?: string;                // Optional note
  processedAt?: string;            // When approved/rejected
  processedBy?: string;            // Who approved/rejected
}
```

### 5.5 Transaction Model

```typescript
interface Transaction {
  id: number;                      // Unique transaction ID
  type: "purchase" | "advance" | "reward" | "request";
  amount: number;                  // Positive or negative
  description: string;             // Transaction description
  date: string;                    // Display date
  status: "success" | "pending" | "failed";
  userId?: string;                 // Who initiated
  metadata?: {
    token?: string;                // Electricity token
    kWh?: number;                  // kWh purchased
    paymentMethod?: string;        // How paid
  };
}
```

### 5.6 Voucher Redemption Model

```typescript
interface VoucherRedemption {
  id: string;                      // Unique redemption ID
  userId: string;                  // Who redeemed
  voucherType: "electricity" | "grocery";
  title: string;                   // e.g., "R 100 Pick n Pay"
  value: number;                   // Voucher value in Rand
  cost: number;                    // WattCoins spent
  voucherCode: string;             // 16-digit code
  redeemedAt: string;              // ISO timestamp
  status: "active" | "used" | "expired";
  store?: string;                  // For grocery vouchers
}
```

---

## 6. User Flows

### 6.1 New User Onboarding (Creating Household)

```
1. Open App → Onboarding Screen
2. Tap "Get Started" → Auth Screen
3. Switch to "Sign Up" tab
4. Fill in registration form:
   - Full Name
   - SA ID Number
   - Cellphone Number
   - Email
   - Password
   - Confirm Password
   - Keep "I have a family code" UNCHECKED
5. Tap "Create Account"
6. System creates:
   - User account (role: PRIMARY)
   - New household with unique code
   - Links user to household
7. Redirect to Verification Screen
8. Choose verification method (SMS/Email)
9. Enter 6-digit code
10. Redirect to Dashboard
11. Complete profile:
    - Add meter number
    - Set address
    - Set monthly budget
```

### 6.2 Joining Existing Household (Secondary User)

```
1. Open App → Onboarding Screen
2. Tap "Get Started" → Auth Screen
3. Switch to "Sign Up" tab
4. Fill in registration form:
   - Full Name
   - SA ID Number
   - Cellphone Number
   - Email
   - Password
   - Confirm Password
   - Check "I have a family code"
   - Enter family code (e.g., "JURIES-8472")
5. Tap "Create Account"
6. System validates family code
7. If valid:
   - Creates user account (role: SECONDARY)
   - Links to existing household
   - Adds to household members list
8. Redirect to Verification Screen
9. Verify account
10. Redirect to Dashboard (Secondary view)
```

### 6.3 Electricity Request Flow (Secondary User)

```
1. Dashboard → Tap "Request Electricity"
2. Enter amount or select quick amount
3. View estimated kWh
4. (Optional) Add purpose note
5. Tap "Send Request"
6. System creates pending request
7. Show success screen:
   - "Request Sent!"
   - "Pending approval from primary account holder"
8. Notification sent to PRIMARY user
9. Wait for approval
10. Receive notification when processed
```

### 6.4 Request Approval Flow (Primary User)

```
1. Dashboard shows "Pending Requests" badge
2. View request details:
   - Requester name
   - Amount (Rand + kWh)
   - Purpose/note
   - Timestamp
3. Review request
4. Tap "Approve" OR "Reject"
5. If Approved:
   - Redirect to payment flow
   - Complete purchase
   - Electricity added to household
   - Requester notified
6. If Rejected:
   - Requester notified
   - Request removed from queue
```

### 6.5 WattCoins Redemption Flow

```
1. Dashboard → Tap "View Rewards"
2. Rewards Screen → Tap "Redeem WattCoins"
3. Choose voucher type:
   - Electricity Credit
   - Grocery Voucher (select store)
4. Select amount tier OR enter custom amount
5. Verify sufficient WattCoins balance
6. Tap voucher → Confirmation screen
7. Review:
   - Voucher details
   - Cost in WC
   - Remaining balance after redemption
8. Tap "Redeem Now"
9. Success screen:
   - Shows voucher code
   - Copy to clipboard option
   - Instructions for use
10. WattCoins deducted from balance
```

---

## 7. Screen Inventory

### 7.1 Authentication Screens (3)
1. **OnboardingScreen** - Welcome slides, feature highlights
2. **AuthScreen** - Login/Sign-up with OAuth options
3. **VerificationScreen** - 2FA code entry (SMS/Email)

### 7.2 Main Screens (13)
4. **DashboardScreen** - Home screen with balance, actions, requests
5. **BuyElectricityScreen** - Purchase/request electricity
6. **UsageScreen** - Analytics and charts
7. **AdvanceScreen** - Request financial advance
8. **LoadSheddingScreen** - Schedules and notifications
9. **RewardsScreen** - WattCoins, achievements, earn ways
10. **RedeemVouchersScreen** - Voucher redemption flow
11. **TransactionsScreen** - Transaction history
12. **AIAssistantScreen** - AI-powered help and insights
13. **SettingsScreen** - Account settings hub
14. **ManageUsersScreen** - Household member management
15. **EditProfileScreen** - Edit personal information
16. **FamilySharingScreen** - Legacy sharing features

### 7.3 Settings Sub-Screens (7)
17. **PaymentMethodsScreen** - Manage payment methods
18. **LanguageScreen** - Change app language
19. **ChangePasswordScreen** - Password update
20. **TwoFactorScreen** - Configure 2FA
21. **HelpCenterScreen** - FAQs and support
22. **ContactSupportScreen** - Contact form

### 7.4 Layout Components (1)
23. **Root** - Main layout wrapper with navigation

**Total Screens: 23**

---

## 8. Design System

### 8.1 Color Palette

#### Primary Colors
```css
--color-primary: #FF6B00;           /* Orange - Main brand */
--color-primary-light: #FFA500;     /* Light orange - Gradients */
--color-primary-dark: #E55000;      /* Dark orange - Hover states */
```

#### Semantic Colors
```css
--color-success: #10b981;           /* Green - Success states */
--color-warning: #f59e0b;           /* Amber - Warnings */
--color-error: #ef4444;             /* Red - Errors */
--color-info: #3b82f6;              /* Blue - Info messages */
```

#### Neutral Colors (Light Mode)
```css
--color-background: #f9fafb;        /* Light gray background */
--color-foreground: #111827;        /* Dark text */
--color-muted: #6b7280;             /* Muted text */
--color-border: #e5e7eb;            /* Borders */
--color-card: #ffffff;              /* Card backgrounds */
```

#### Neutral Colors (Dark Mode)
```css
--color-background-dark: #0f172a;   /* Navy dark background */
--color-foreground-dark: #f9fafb;   /* Light text */
--color-muted-dark: #94a3b8;        /* Muted text */
--color-border-dark: #1e293b;       /* Borders */
--color-card-dark: #1e293b;         /* Card backgrounds */
```

### 8.2 Typography

#### Font Family
- **Primary:** System UI fonts (SF Pro, Segoe UI, Roboto)
- **Mono:** Consolas, Monaco (for codes/tokens)

#### Font Sizes (Tailwind Classes)
- `text-xs` → 0.75rem (12px)
- `text-sm` → 0.875rem (14px)
- `text-base` → 1rem (16px)
- `text-lg` → 1.125rem (18px)
- `text-xl` → 1.25rem (20px)
- `text-2xl` → 1.5rem (24px)
- `text-3xl` → 1.875rem (30px)
- `text-4xl` → 2.25rem (36px)

### 8.3 Spacing & Layout

#### Border Radius
- `rounded-lg` → 0.5rem (8px) - Small elements
- `rounded-xl` → 0.75rem (12px) - Inputs, buttons
- `rounded-2xl` → 1rem (16px) - Cards
- `rounded-3xl` → 1.5rem (24px) - Large cards, modals
- `rounded-full` → 50% - Circular elements

#### Shadows
```css
/* Elevation 1 - Cards */
shadow-[0_0_30px_rgba(0,0,0,0.3)]

/* Elevation 2 - Primary buttons */
shadow-[0_0_40px_rgba(255,165,0,0.3)]

/* Hover states - Enhanced glow */
shadow-[0_0_50px_rgba(255,165,0,0.5)]
```

#### Spacing Scale (Tailwind)
- `p-1` → 0.25rem (4px)
- `p-2` → 0.5rem (8px)
- `p-3` → 0.75rem (12px)
- `p-4` → 1rem (16px)
- `p-6` → 1.5rem (24px)
- `p-8` → 2rem (32px)

### 8.4 Component Patterns

#### Primary Button
```tsx
<button className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FFA500] text-white py-4 rounded-2xl shadow-[0_0_20px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] transition-shadow">
  Button Text
</button>
```

#### Card
```tsx
<div className="bg-card/50 backdrop-blur-lg rounded-2xl p-6 border border-border/50">
  Card Content
</div>
```

#### Input Field
```tsx
<input className="w-full bg-input border border-border rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
```

#### Badge
```tsx
<span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
  Badge
</span>
```

---

## 9. Security & Authentication

### 9.1 Password Requirements
- Length: 8-13 characters
- Must contain:
  - At least one uppercase letter
  - At least one number
  - At least one special character (!@#$%^&*)

### 9.2 Two-Factor Authentication
- Methods: SMS or Email
- 6-digit verification code
- Stored in localStorage: `twoFactorEnabled`, `twoFactorMethod`
- Optional but recommended

### 9.3 Data Storage

#### LocalStorage Items
```javascript
// User data
localStorage.setItem('userData', JSON.stringify(user));

// Household data
localStorage.setItem('households', JSON.stringify(households));

// Household members
localStorage.setItem('householdUsers', JSON.stringify(members));

// Requests
localStorage.setItem('electricityRequests', JSON.stringify(requests));

// Settings
localStorage.setItem('darkMode', JSON.stringify(true));
localStorage.setItem('twoFactorEnabled', JSON.stringify(true));
localStorage.setItem('twoFactorMethod', 'sms');
```

### 9.4 Role-Based Access Control
- Implemented via `useUser()` context hook
- `isPrimary()` function checks user role
- UI conditionally renders based on permissions
- Backend validation required for production

---

## 10. Demo Configuration

### 10.1 Demo Household: Juries Family

**Household Details:**
- **Household ID:** JURIES-8472
- **Household Name:** Juries Family
- **Meter Number:** 04178522931
- **Address:** 24 Protea Crescent, Mitchells Plain, Cape Town, Western Cape, 7785, South Africa
- **Status:** Active
- **Monthly Budget:** R 1,500
- **Household WattCoins:** 2,450 WC

### 10.2 Demo Users

#### 1. Zhaida Juries (PRIMARY)
```
Name: Zhaida Juries
Email: zhaida@wattwalletdemo.co.za
Password: WattWallet@2026
Phone: +27 71 234 5678
ID Number: 9604290812346
Role: PRIMARY
Permissions: Full Control
```

#### 2. Keagsan Juries (SECONDARY)
```
Name: Keagsan Juries
Email: keagsan@wattwalletdemo.co.za
Password: WattWallet@2026
Phone: +27 72 458 9136
ID Number: 9103245189087
Role: SECONDARY
Relationship: Husband
Permissions: Request Electricity, View Balance, View Usage
Personal WattCoins: 350 WC
Last Login: Today — 08:42 AM
Last Activity: Requested R150 electricity (2 days ago)
```

#### 3. Nicole Jacobs (SECONDARY)
```
Name: Nicole Jacobs
Email: nicole@wattwalletdemo.co.za
Password: WattWallet@2026
Phone: +27 83 567 8901
ID Number: 9107150812348
Role: SECONDARY
Relationship: Sister
Permissions: View Usage Only
```

#### 4. Simon Van Wyk (SECONDARY - Pending)
```
Name: Simon Van Wyk
Email: simon@wattwalletdemo.co.za
Phone: +27 84 678 9012
Role: SECONDARY
Relationship: Tenant
Status: Pending Invite
```

### 10.3 Demo Transactions
```javascript
[
  { type: "purchase", amount: -150, description: "Electricity Purchase (Keagsan)", date: "Today, 14:30" },
  { type: "reward", amount: 50, description: "WattCoins Earned", date: "Today, 10:15" },
  { type: "purchase", amount: -200, description: "Electricity Purchase", date: "Yesterday" },
  { type: "purchase", amount: -100, description: "Electricity Purchase (Nicole)", date: "2 days ago" },
  { type: "advance", amount: 120, description: "Advance Repayment", date: "3 days ago" }
]
```

### 10.4 Demo Pending Request
```javascript
{
  id: "demo-req-1",
  userId: "keagsan@wattwalletdemo.co.za",
  userName: "Keagsan Juries",
  amount: 150,
  kwhEstimate: "60.0",
  status: "pending",
  purpose: "Evening electricity top-up",
  requestedAt: "2 days ago",
  householdId: "JURIES-8472"
}
```

**Note:** Demo credentials are hidden from UI but fully functional for testing.

---

## 11. Deployment Strategy

### 11.1 Build Configuration

#### Production Build
```bash
pnpm run build
```
Output: `dist/` folder with optimized static files

#### Environment Variables
```env
VITE_API_URL=https://api.wattwallet.co.za
VITE_SENTRY_DSN=<sentry-url>
VITE_GOOGLE_ANALYTICS_ID=<ga-id>
```

### 11.2 Hosting Options

#### Option 1: Vercel (Recommended)
- Automatic deployments from Git
- CDN edge network
- Zero-config deployment
- Free SSL certificates

#### Option 2: Netlify
- Continuous deployment
- Form handling
- Serverless functions support

#### Option 3: AWS Amplify
- Full AWS integration
- Backend services
- Custom domain support

### 11.3 Domain Configuration
- Primary: `app.wattwallet.co.za`
- Staging: `staging.wattwallet.co.za`
- Demo: `demo.wattwallet.co.za`

### 11.4 CI/CD Pipeline

```yaml
# Example GitHub Actions
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run deploy
```

---

## 12. Future Roadmap

### 12.1 Phase 2 Features (Q3 2026)

#### Backend Integration
- [ ] Real API integration (replace localStorage)
- [ ] Database setup (PostgreSQL/MongoDB)
- [ ] User authentication server
- [ ] Payment gateway integration (PayFast, Ozow)
- [ ] Real electricity token generation

#### Enhanced Security
- [ ] JWT authentication
- [ ] Refresh tokens
- [ ] Session management
- [ ] Rate limiting
- [ ] CSRF protection

#### Notifications
- [ ] Push notifications (Firebase/OneSignal)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] In-app notification center

### 12.2 Phase 3 Features (Q4 2026)

#### Smart Features
- [ ] AI-powered usage predictions
- [ ] Appliance-level tracking
- [ ] Smart home integration (IoT)
- [ ] Automated purchasing
- [ ] Budget recommendations

#### Social Features
- [ ] Neighborhood comparisons
- [ ] Community challenges
- [ ] Leaderboards
- [ ] Social sharing

#### Financial Features
- [ ] Credit scoring system
- [ ] Larger advance amounts
- [ ] Flexible repayment plans
- [ ] Insurance products

### 12.3 Phase 4 Features (2027)

#### Platform Expansion
- [ ] Native mobile apps (iOS/Android)
- [ ] Desktop applications
- [ ] White-label solution for municipalities
- [ ] API for third-party integrations

#### Geographic Expansion
- [ ] Support for other African countries
- [ ] Multi-currency support
- [ ] Regional partnerships

#### Advanced Analytics
- [ ] Machine learning predictions
- [ ] Carbon footprint tracking
- [ ] Solar integration recommendations
- [ ] ROI calculators

---

## 13. Key Metrics & KPIs

### 13.1 User Metrics
- Monthly Active Users (MAU)
- Daily Active Users (DAU)
- User retention rate
- Churn rate
- Average session duration

### 13.2 Business Metrics
- Total electricity purchased (Rand)
- Average transaction value
- WattCoins redeemed
- Advance approval rate
- Customer acquisition cost (CAC)

### 13.3 Technical Metrics
- Page load time
- Time to interactive
- Error rate
- API response time
- Uptime percentage

---

## 14. Support & Documentation

### 14.1 User Documentation
- In-app help center
- Video tutorials (planned)
- FAQ section
- Feature guides

### 14.2 Developer Documentation
- API documentation (planned)
- Component library docs
- Integration guides
- Contribution guidelines

### 14.3 Support Channels
- In-app chat support (planned)
- Email: support@wattwallet.co.za
- Phone: +27 21 XXX XXXX
- WhatsApp support

---

## 15. Compliance & Legal

### 15.1 Data Protection
- POPIA (Protection of Personal Information Act) compliance
- GDPR ready (for international expansion)
- Data encryption at rest and in transit
- Regular security audits

### 15.2 Terms & Conditions
- User agreement
- Privacy policy
- Cookie policy
- Refund policy

### 15.3 Regulatory
- South African Reserve Bank compliance
- Financial sector regulations
- Prepaid electricity regulations
- Consumer protection laws

---

## 16. Team & Responsibilities

### 16.1 Core Team
- **Product Owner:** Strategy, roadmap, stakeholder management
- **Lead Developer:** Architecture, code review, deployment
- **UI/UX Designer:** Design system, user research, prototypes
- **Backend Developer:** API, database, integrations
- **QA Engineer:** Testing, quality assurance, bug tracking

### 16.2 Extended Team
- **DevOps Engineer:** Infrastructure, CI/CD, monitoring
- **Customer Support:** User assistance, feedback collection
- **Marketing Manager:** User acquisition, retention campaigns
- **Data Analyst:** Metrics, reporting, insights

---

## 17. Risk Management

### 17.1 Technical Risks
- **Risk:** API downtime
  - **Mitigation:** Fallback mechanisms, caching, redundancy
- **Risk:** Data loss
  - **Mitigation:** Regular backups, database replication
- **Risk:** Security breach
  - **Mitigation:** Security audits, encryption, monitoring

### 17.2 Business Risks
- **Risk:** Low user adoption
  - **Mitigation:** User research, MVP testing, marketing
- **Risk:** Regulatory changes
  - **Mitigation:** Legal consultation, compliance monitoring
- **Risk:** Competition
  - **Mitigation:** Unique features, superior UX, partnerships

---

## Appendix A: File Structure Reference

```
src/
├── app/
│   ├── components/
│   │   ├── Root.tsx
│   │   ├── OnboardingScreen.tsx
│   │   ├── AuthScreen.tsx
│   │   ├── VerificationScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── BuyElectricityScreen.tsx
│   │   ├── UsageScreen.tsx
│   │   ├── AdvanceScreen.tsx
│   │   ├── LoadSheddingScreen.tsx
│   │   ├── RewardsScreen.tsx
│   │   ├── RedeemVouchersScreen.tsx
│   │   ├── TransactionsScreen.tsx
│   │   ├── AIAssistantScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── ManageUsersScreen.tsx
│   │   ├── EditProfileScreen.tsx
│   │   ├── FamilySharingScreen.tsx
│   │   ├── PaymentMethodsScreen.tsx
│   │   ├── LanguageScreen.tsx
│   │   ├── ChangePasswordScreen.tsx
│   │   ├── TwoFactorScreen.tsx
│   │   ├── HelpCenterScreen.tsx
│   │   └── ContactSupportScreen.tsx
│   ├── context/
│   │   └── UserContext.tsx
│   ├── routes.tsx
│   └── App.tsx
├── styles/
│   ├── theme.css
│   ├── fonts.css
│   └── index.css
├── imports/
│   ├── wattwallet-icon.png
│   ├── wattcoin-logo-1.png
│   └── [other assets]
├── i18n/
│   ├── en.json
│   ├── af.json
│   └── xh.json
└── index.tsx
```

---

## Appendix B: API Endpoints (Planned)

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/verify
POST   /api/auth/refresh-token
```

### User Management
```
GET    /api/user/profile
PUT    /api/user/profile
DELETE /api/user/account
GET    /api/user/transactions
```

### Household Management
```
GET    /api/household/:id
POST   /api/household/create
PUT    /api/household/:id
GET    /api/household/:id/members
POST   /api/household/:id/invite
DELETE /api/household/:id/member/:userId
```

### Electricity
```
POST   /api/electricity/purchase
POST   /api/electricity/request
GET    /api/electricity/requests
PUT    /api/electricity/request/:id/approve
PUT    /api/electricity/request/:id/reject
GET    /api/electricity/usage
```

### WattCoins & Rewards
```
GET    /api/rewards/balance
POST   /api/rewards/redeem
GET    /api/rewards/achievements
GET    /api/rewards/history
```

### Advances
```
POST   /api/advance/request
GET    /api/advance/history
GET    /api/advance/status/:id
```

---

## Document Version History

- **v1.0.0** - May 4, 2026 - Initial blueprint creation
- Complete feature documentation
- Demo configuration details
- Technical architecture specification
- All 23 screens documented

---

**End of Blueprint**

For questions or clarifications, contact: dev@wattwallet.co.za

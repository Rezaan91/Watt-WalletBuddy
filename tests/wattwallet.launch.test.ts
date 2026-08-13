import { describe, expect, it, vi } from "vitest";

import { MockPaymentProvider, MockVendingProvider } from "@/lib/wattwallet/providers";
import { executePurchase } from "@/lib/wattwallet/purchase-service";
import {
  calculateWattCoins,
  createAccountWorkspace,
  createEmptyStoredState,
  normalizeEmail,
  normalizeStoredState,
  validateAmount,
  validateEmail,
  validatePassword,
} from "@/lib/wattwallet/types";

describe("WattWallet business rules", () => {
  it("calculates WattCoins inside the business layer", () => {
    expect(calculateWattCoins(200)).toBe(20);
    expect(calculateWattCoins(50)).toBe(5);
    expect(calculateWattCoins(1)).toBe(1);
  });

  it("validates South African Rand purchase boundaries", () => {
    expect(validateAmount(50)).toBe(true);
    expect(validateAmount(5000)).toBe(true);
    expect(validateAmount(49)).toBe(false);
    expect(validateAmount(5001)).toBe(false);
  });

  it("validates account identity inputs", () => {
    expect(normalizeEmail("  KEAGAN@example.com ")).toBe("keagan@example.com");
    expect(validateEmail("hello@example.com")).toBe(true);
    expect(validateEmail("not-an-email")).toBe(false);
    expect(validatePassword("12345678")).toBe(true);
    expect(validatePassword("short")).toBe(false);
  });
});

describe("Mock provider safety", () => {
  it("completes successful payment and vending without live calls", async () => {
    const payment = await new MockPaymentProvider("success").initiatePayment({ amount: 200, userId: "user-a" });
    expect(payment.ok).toBe(true);
    expect(payment.reference).toMatch(/^PAY-/);
    const vending = await new MockVendingProvider("success").vendElectricity({ amount: 200, meterNumber: "MTR-DEMO", paymentReference: payment.reference });
    expect(vending.ok).toBe(true);
    expect(vending.reference).toMatch(/^VEND-/);
    expect(vending.token).toMatch(/^DEMO-/);
  });

  it("does not request vending after payment failure", async () => {
    const vending = { vendElectricity: vi.fn() };
    const result = await executePurchase({ amount: 200, userId: "user-a", meterNumber: "MTR-DEMO" }, new MockPaymentProvider("failure"), vending);
    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.stage).toBe("payment");
    expect(vending.vendElectricity).not.toHaveBeenCalled();
  });

  it("does not issue a token after vending failure", async () => {
    const result = await executePurchase({ amount: 200, userId: "user-a", meterNumber: "MTR-DEMO" }, new MockPaymentProvider("success"), new MockVendingProvider("failure"));
    expect(result.ok).toBe(false);
    expect(result.ok ? "" : result.stage).toBe("vending");
    if (!result.ok && result.stage === "vending") {
      expect(result.vending.token).toBeUndefined();
    }
  });
});

describe("Account isolation", () => {
  it("creates independent workspaces and safely normalizes stored state", () => {
    const state = createEmptyStoredState();
    state.accounts["one@example.com"] = {
      profile: { id: "one@example.com", firstName: "One", lastName: "User", email: "one@example.com", createdAt: new Date().toISOString() },
      password: "password-one",
      workspace: createAccountWorkspace(),
    };
    state.accounts["two@example.com"] = {
      profile: { id: "two@example.com", firstName: "Two", lastName: "User", email: "two@example.com", createdAt: new Date().toISOString() },
      password: "password-two",
      workspace: createAccountWorkspace(),
    };
    state.accounts["one@example.com"].workspace.wattCoins = 20;
    expect(state.accounts["two@example.com"].workspace.wattCoins).toBe(0);
    expect(normalizeStoredState(JSON.parse(JSON.stringify(state))).accounts["one@example.com"].profile.firstName).toBe("One");
  });
});

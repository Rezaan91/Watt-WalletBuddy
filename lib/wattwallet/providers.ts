import {
  createId,
  generateDemoToken,
  type PaymentResult,
  type VendingResult,
} from "@/lib/wattwallet/types";

export type PaymentOutcome = "success" | "failure" | "timeout";
export type VendingOutcome = "success" | "failure";

export interface PaymentProvider {
  initiatePayment(input: { amount: number; userId: string }): Promise<PaymentResult>;
}

export interface VendingProvider {
  vendElectricity(input: {
    amount: number;
    meterNumber: string;
    paymentReference: string;
  }): Promise<VendingResult>;
}

const wait = (duration = 500) => new Promise((resolve) => setTimeout(resolve, duration));

export class MockPaymentProvider implements PaymentProvider {
  constructor(private readonly outcome: PaymentOutcome = "success") {}

  async initiatePayment(_input: { amount: number; userId: string }): Promise<PaymentResult> {
    await wait(650);
    const reference = `PAY-${createId("demo").slice(-12).toUpperCase()}`;
    if (this.outcome === "failure") {
      return { ok: false, reference, message: "The simulated payment was declined." };
    }
    if (this.outcome === "timeout") {
      return { ok: false, reference, message: "The simulated payment timed out. Please try again." };
    }
    return { ok: true, reference };
  }
}

export class MockVendingProvider implements VendingProvider {
  constructor(private readonly outcome: VendingOutcome = "success") {}

  async vendElectricity(_input: { amount: number; meterNumber: string; paymentReference: string }): Promise<VendingResult> {
    await wait(750);
    const reference = `VEND-${createId("demo").slice(-12).toUpperCase()}`;
    if (this.outcome === "failure") {
      return { ok: false, reference, message: "The simulated vending service could not issue a token." };
    }
    return { ok: true, reference, token: generateDemoToken() };
  }
}

export const paymentProvider = new MockPaymentProvider("success");
export const vendingProvider = new MockVendingProvider("success");

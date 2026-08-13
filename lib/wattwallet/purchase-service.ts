import type { PaymentProvider, VendingProvider } from "@/lib/wattwallet/providers";
import type { PaymentResult, VendingResult } from "@/lib/wattwallet/types";

export type PurchaseServiceResult =
  | { ok: true; payment: PaymentResult; vending: VendingResult }
  | { ok: false; stage: "payment"; payment: PaymentResult }
  | { ok: false; stage: "vending"; payment: PaymentResult; vending: VendingResult };

export async function executePurchase(
  input: { amount: number; userId: string; meterNumber: string },
  paymentProvider: PaymentProvider,
  vendingProvider: VendingProvider,
): Promise<PurchaseServiceResult> {
  const payment = await paymentProvider.initiatePayment({ amount: input.amount, userId: input.userId });
  if (!payment.ok) return { ok: false, stage: "payment", payment };
  const vending = await vendingProvider.vendElectricity({ amount: input.amount, meterNumber: input.meterNumber, paymentReference: payment.reference });
  if (!vending.ok) return { ok: false, stage: "vending", payment, vending };
  return { ok: true, payment, vending };
}

import type { QrMerchant } from '../types/retailQrPayment';

export const DEMO_QR_MERCHANTS: Record<string, QrMerchant> = {
  abc_restaurant: {
    id: 'abc_restaurant',
    name: 'ABC Restaurant',
    upiId: 'abcrestaurant@upi',
    city: 'Mumbai',
    verified: true,
    encodedAmount: 850,
  },
  metro_grocery: {
    id: 'metro_grocery',
    name: 'Metro Grocery',
    upiId: 'metrogrocery@okaxis',
    city: 'Mumbai',
    verified: true,
  },
  invalid: {
    id: 'invalid',
    name: 'Invalid',
    upiId: '',
    city: '',
    verified: false,
  },
};

export const QR_DEMO_FAIL_AMOUNT = 9999;
export const QR_DEMO_PENDING_AMOUNT = 7777;
export const QR_PAYMENT_FEE = 0;

const PENDING_QR_KEY = 'retail_qr_pending_payment';

export function markQrPaymentPending(merchantId: string): void {
  sessionStorage.setItem(PENDING_QR_KEY, merchantId);
}

export function clearQrPaymentPending(): void {
  sessionStorage.removeItem(PENDING_QR_KEY);
}

export function isQrPaymentDuplicate(merchantId: string): boolean {
  return sessionStorage.getItem(PENDING_QR_KEY) === merchantId;
}

export function buildUpiTransactionId(): string {
  return String(Math.floor(100000000000 + Math.random() * 900000000000));
}

export function formatQrPaymentTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function validateQrAmount(
  raw: string,
  availableBalance: number
): { valid: boolean; message?: string } {
  const amount = Number(raw);
  if (!raw.trim() || !Number.isFinite(amount) || amount <= 0) {
    return { valid: false, message: 'Enter a valid amount.' };
  }
  if (amount < 1) {
    return { valid: false, message: 'Minimum amount is ₹1.' };
  }
  if (amount > 100000) {
    return { valid: false, message: 'Maximum UPI payment is ₹1,00,000.' };
  }
  if (amount > availableBalance) {
    return { valid: false, message: 'Insufficient account balance.' };
  }
  if (amount === QR_DEMO_FAIL_AMOUNT) {
    return { valid: true };
  }
  return { valid: true };
}

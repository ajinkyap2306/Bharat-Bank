import type { AmountValidationState, VendorPaymentLimits } from '../types/corporateVendorPaymentDetails';

export function parseAmountInput(value: string): number {
  const cleaned = value.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatAmountDisplay(amount: number): string {
  if (amount === 0) return '';
  return amount.toLocaleString('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

export function validatePaymentAmount(
  amount: number,
  limits: VendorPaymentLimits
): AmountValidationState {
  if (amount <= 0) return 'empty';
  if (amount > limits.availableBalance) return 'insufficient-balance';
  if (amount > limits.singleTransactionLimit) return 'exceeds-single-limit';
  if (amount > limits.dailyRemainingLimit) return 'exceeds-daily-limit';
  return 'valid';
}

export function getAmountValidationMessage(
  state: AmountValidationState,
  limits: VendorPaymentLimits
): string | null {
  switch (state) {
    case 'empty':
      return 'Enter a payment amount.';
    case 'insufficient-balance':
      return 'Insufficient available balance.';
    case 'exceeds-single-limit':
      return `Amount exceeds the single transaction limit of ₹${limits.singleTransactionLimit.toLocaleString('en-IN')}.`;
    case 'exceeds-daily-limit':
      return 'Daily payment limit exceeded.';
    case 'valid':
      return 'Amount available';
    default:
      return null;
  }
}

export function isFormValid(
  amount: number,
  limits: VendorPaymentLimits,
  purpose: string,
  paymentDate: string
): boolean {
  if (!purpose || !paymentDate) return false;
  return validatePaymentAmount(amount, limits) === 'valid';
}

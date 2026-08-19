import { PAYMENT_TYPE_ACCOUNTS } from './corporatePaymentTypeSelectionMock';
import { VENDOR_PAYMENT_BENEFICIARIES } from './corporateVendorBeneficiarySelectionMock';
import type {
  PaymentRailMethod,
  VendorPaymentForm,
  VendorPaymentLimits,
  VendorPaymentPurpose,
} from '../types/corporateVendorPaymentDetails';

export const PAYMENT_PURPOSE_OPTIONS: { id: VendorPaymentPurpose; label: string }[] = [
  { id: 'vendor-settlement', label: 'Vendor Settlement' },
  { id: 'invoice-payment', label: 'Invoice Payment' },
  { id: 'business-expense', label: 'Business Expense' },
  { id: 'service-payment', label: 'Service Payment' },
  { id: 'purchase-payment', label: 'Purchase Payment' },
  { id: 'other', label: 'Other' },
];

export const CHARGE_OPTIONS = [
  { id: 'shared' as const, label: 'Shared' },
  { id: 'our-company' as const, label: 'Our Company' },
  { id: 'beneficiary' as const, label: 'Beneficiary' },
];

export const PAYMENT_METHOD_OPTIONS: {
  id: PaymentRailMethod;
  label: string;
  description: string;
  minAmount?: number;
  maxAmount?: number;
}[] = [
  { id: 'NEFT', label: 'NEFT', description: 'Standard bank transfer' },
  { id: 'RTGS', label: 'RTGS', description: 'Near real-time during supported hours', minAmount: 200000 },
  { id: 'IMPS', label: 'IMPS', description: 'Instant transfer up to ₹5,00,000', maxAmount: 500000 },
];

export const VENDOR_PAYMENT_LIMITS_DEFAULT: VendorPaymentLimits = {
  availableBalance: 1245000,
  singleTransactionLimit: 1000000,
  dailyPaymentLimit: 5000000,
  dailyRemainingLimit: 3750000,
  currency: '₹',
};

export function getTodayIso(): string {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export function formatPaymentDisplayDate(isoDate: string): string {
  const d = new Date(`${isoDate}T12:00:00`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getVendorBeneficiaryById(beneficiaryId: string) {
  return VENDOR_PAYMENT_BENEFICIARIES.find((b) => b.id === beneficiaryId);
}

export function getVendorPaymentAccount(accountId: string) {
  return PAYMENT_TYPE_ACCOUNTS.find((a) => a.id === accountId);
}

export function isVendorPaymentAccountEligible(accountId: string): boolean {
  return accountId === 'acc_corp_op_01' || accountId === 'acc_corp_col_03';
}

export function buildDefaultVendorPaymentForm(beneficiaryId: string): VendorPaymentForm {
  return {
    beneficiaryId,
    accountId: 'acc_corp_op_01',
    amount: 0,
    currency: 'INR',
    purpose: 'vendor-settlement',
    invoiceNumber: '',
    reference: '',
    paymentDate: getTodayIso(),
    scheduled: false,
    executionDate: getTodayIso(),
    repeatPayment: false,
    remarks: '',
    charges: 'shared',
    paymentMethod: 'NEFT',
  };
}

export function getRecommendedPaymentMethod(amount: number): PaymentRailMethod {
  if (amount <= 0) return 'NEFT';
  if (amount >= 200000 && amount <= 500000) return 'NEFT';
  if (amount > 500000) return 'RTGS';
  return 'IMPS';
}

export function getCompatiblePaymentMethods(amount: number): PaymentRailMethod[] {
  if (amount <= 0) return ['NEFT', 'RTGS', 'IMPS'];
  return PAYMENT_METHOD_OPTIONS.filter((m) => {
    if (m.minAmount != null && amount < m.minAmount) return false;
    if (m.maxAmount != null && amount > m.maxAmount) return false;
    return true;
  }).map((m) => m.id);
}

export function getTransactionFee(method: PaymentRailMethod, amount: number): number {
  if (amount <= 0) return 0;
  switch (method) {
    case 'RTGS':
      return 50;
    case 'IMPS':
      return 5;
    case 'NEFT':
    default:
      return 25;
  }
}

export function getProcessingEstimate(method: PaymentRailMethod): string {
  switch (method) {
    case 'RTGS':
      return 'Near real-time during supported hours';
    case 'IMPS':
      return 'Usually within minutes';
    case 'NEFT':
    default:
      return 'Same business day';
  }
}

export function getVendorPaymentLimits(accountId: string): VendorPaymentLimits {
  const account = getVendorPaymentAccount(accountId);
  return {
    ...VENDOR_PAYMENT_LIMITS_DEFAULT,
    availableBalance: account?.availableBalance ?? VENDOR_PAYMENT_LIMITS_DEFAULT.availableBalance,
  };
}

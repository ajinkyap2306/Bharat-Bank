import type { LucideIcon } from 'lucide-react';

export type PaymentTypeId =
  | 'vendor'
  | 'bank-transfer'
  | 'internal-transfer'
  | 'tax'
  | 'other';

export interface PaymentType {
  id: PaymentTypeId;
  name: string;
  description: string;
  examples?: string[];
  icon: LucideIcon;
  available: boolean;
  route: string;
  recommended?: boolean;
  internalTransferPreview?: { from: string; to: string };
}

export interface PaymentAccount {
  id: string;
  name: string;
  maskedNumber: string;
  availableBalance: number;
  currency: string;
  eligiblePaymentTypes: PaymentTypeId[];
}

export interface PaymentTemplatePreview {
  id: string;
  name: string;
}

export interface PaymentTypeSelectionData {
  companyName: string;
  accounts: PaymentAccount[];
  selectedAccountId: string;
  paymentTypes: PaymentType[];
  recentPaymentTypeIds: PaymentTypeId[];
  templates: PaymentTemplatePreview[];
}

export type PaymentTypeErrorKind = 'account-unavailable' | 'no-eligible-account';

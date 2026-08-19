import {
  ArrowLeftRight,
  ArrowRightLeft,
  BriefcaseBusiness,
  Building2,
  Landmark,
} from 'lucide-react';
import type {
  PaymentAccount,
  PaymentType,
  PaymentTypeId,
  PaymentTypeSelectionData,
} from '../types/corporatePaymentTypeSelection';
import { CORPORATE_ACCOUNTS_LIST } from './corporateAccountsMock';

const ELIGIBLE_ACCOUNT_IDS = ['acc_corp_op_01', 'acc_corp_pay_02', 'acc_corp_col_03'];

export const PAYMENT_TYPE_SELECTION_COMPANY = 'Acme Technologies Pvt. Ltd.';

export const PAYMENT_TYPE_ACCOUNTS: PaymentAccount[] = CORPORATE_ACCOUNTS_LIST.filter((a) =>
  ELIGIBLE_ACCOUNT_IDS.includes(a.id)
).map((a) => ({
  id: a.id,
  name: a.accountType,
  maskedNumber: a.maskedNumber,
  availableBalance: a.availableBalance,
  currency: a.currency,
  eligiblePaymentTypes: getDefaultEligibleTypes(a.id),
}));

function getDefaultEligibleTypes(accountId: string): PaymentTypeId[] {
  const all: PaymentTypeId[] = [
    'vendor',
    'bank-transfer',
    'internal-transfer',
    'tax',
    'other',
  ];
  if (accountId === 'acc_corp_col_03') {
    return ['vendor', 'bank-transfer', 'other'];
  }
  return all;
}

export const PAYMENT_TYPES: PaymentType[] = [
  {
    id: 'vendor',
    name: 'Vendor Payment',
    description: 'Pay suppliers, vendors and business partners.',
    examples: ['Supplier invoice', 'Vendor settlement', 'Business expense'],
    icon: Building2,
    available: true,
    route: '/corporate/payments/create/vendor',
    recommended: true,
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Transfer funds to another bank account.',
    examples: ['Business transfer', 'External bank transfer'],
    icon: ArrowLeftRight,
    available: true,
    route: '/corporate/payments/create/bank-transfer',
  },
  {
    id: 'internal-transfer',
    name: 'Internal Transfer',
    description: "Move funds between your company's accounts.",
    examples: ['Operating Account', 'Payroll Account'],
    icon: ArrowRightLeft,
    available: true,
    route: '/corporate/payments/create/internal-transfer',
    internalTransferPreview: {
      from: 'Operating Account',
      to: 'Payroll Account',
    },
  },
  {
    id: 'tax',
    name: 'Tax & Statutory Payment',
    description: 'Pay eligible taxes and statutory obligations.',
    examples: ['GST', 'TDS', 'Government payments'],
    icon: Landmark,
    available: false,
    route: '/corporate/payments/create/tax',
  },
  {
    id: 'other',
    name: 'Other Business Payment',
    description: 'Create another authorized business payment.',
    icon: BriefcaseBusiness,
    available: false,
    route: '/corporate/payments/create/other',
  },
];

export const RECENT_PAYMENT_TYPE_IDS: PaymentTypeId[] = ['vendor', 'bank-transfer'];

export const PAYMENT_TYPE_TEMPLATES = [
  { id: 'tpl_01', name: 'Monthly Office Rent' },
  { id: 'tpl_03', name: 'Vendor Settlement' },
];

export function buildPaymentTypeSelectionData(
  selectedAccountId = 'acc_corp_op_01'
): PaymentTypeSelectionData {
  return {
    companyName: PAYMENT_TYPE_SELECTION_COMPANY,
    accounts: PAYMENT_TYPE_ACCOUNTS,
    selectedAccountId,
    paymentTypes: PAYMENT_TYPES,
    recentPaymentTypeIds: RECENT_PAYMENT_TYPE_IDS,
    templates: PAYMENT_TYPE_TEMPLATES,
  };
}

export function getEligibleAccountsForType(
  accounts: PaymentAccount[],
  typeId: PaymentTypeId
): PaymentAccount[] {
  return accounts.filter((a) => a.eligiblePaymentTypes.includes(typeId));
}

export function isAccountEligibleForType(
  account: PaymentAccount,
  typeId: PaymentTypeId
): boolean {
  return account.eligiblePaymentTypes.includes(typeId);
}

export function getPaymentTypeById(typeId: PaymentTypeId): PaymentType | undefined {
  return PAYMENT_TYPES.find((t) => t.id === typeId);
}

export function getPaymentTypeByRoute(route: string): PaymentType | undefined {
  return PAYMENT_TYPES.find((t) => t.route === route);
}

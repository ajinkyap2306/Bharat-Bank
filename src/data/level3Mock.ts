export interface NachMandate {
  id: string;
  umrn: string;
  utilityName: string;
  accountLabel: string;
  maxAmount: number;
  frequency: 'Monthly' | 'Quarterly' | 'As Presented';
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
}

export interface MobilePayContact {
  id: string;
  name: string;
  mobile: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  upiId?: string;
}

export const INITIAL_NACH_MANDATES: NachMandate[] = [
  {
    id: 'nach_1',
    umrn: 'APEX7H0001234567',
    utilityName: 'HDFC Home Loan EMI',
    accountLabel: 'Savings •••• 0012',
    maxAmount: 45000,
    frequency: 'Monthly',
    startDate: '01 Apr 2024',
    endDate: '01 Apr 2034',
    status: 'active',
  },
  {
    id: 'nach_2',
    umrn: 'APEX7H0009876543',
    utilityName: 'BSES Electricity AutoPay',
    accountLabel: 'Savings •••• 0012',
    maxAmount: 5000,
    frequency: 'As Presented',
    startDate: '15 Jan 2025',
    endDate: 'Until Cancelled',
    status: 'active',
  },
  {
    id: 'nach_3',
    umrn: 'APEX7H0005551212',
    utilityName: 'Mutual Fund SIP - Axis Bluechip',
    accountLabel: 'Current •••• 9943',
    maxAmount: 10000,
    frequency: 'Monthly',
    startDate: '05 Jun 2023',
    endDate: '05 Jun 2028',
    status: 'expired',
  },
];

export interface BharatPhoneContact {
  id: string;
  name: string;
  mobile: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
}

/** Simulates contacts saved on the user's mobile phone. */
export const PHONE_SAVED_CONTACTS: { id: string; name: string; mobile: string }[] = [
  { id: 'ph_1', name: 'Rahul Verma', mobile: '9820045821' },
  { id: 'ph_2', name: 'Priya Sharma', mobile: '9876543210' },
  { id: 'ph_3', name: 'Sneha Mehta', mobile: '9988776655' },
  { id: 'ph_4', name: 'Amit Patel', mobile: '9819023456' },
  { id: 'ph_5', name: 'Kavita Desai', mobile: '9765432109' },
  { id: 'ph_6', name: 'Vikram Singh', mobile: '9890123456' },
];

export function isBharatBankCustomer(contact: MobilePayContact): boolean {
  return contact.bankName.toLowerCase().includes('bharat');
}

export function getBharatBankPhoneContacts(): BharatPhoneContact[] {
  return PHONE_SAVED_CONTACTS.flatMap((phone) => {
    const resolved = lookupMobilePayContact(phone.mobile);
    if (!isBharatBankCustomer(resolved)) return [];
    return [
      {
        id: phone.id,
        name: phone.name,
        mobile: phone.mobile,
        accountNumber: resolved.accountNumber,
        ifsc: resolved.ifsc,
        bankName: resolved.bankName,
      },
    ];
  });
}

export function resolveBharatBankPhoneContact(
  mobile: string,
  name?: string
): BharatPhoneContact | null {
  const digits = mobile.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return null;
  const resolved = lookupMobilePayContact(digits);
  if (!isBharatBankCustomer(resolved)) return null;
  return {
    id: `ph_pick_${digits}`,
    name: name?.trim() || resolved.name,
    mobile: digits,
    accountNumber: resolved.accountNumber,
    ifsc: resolved.ifsc,
    bankName: resolved.bankName,
  };
}

export const MOBILE_PAY_CONTACTS: MobilePayContact[] = [
  {
    id: 'mc_1',
    name: 'Priya Sharma',
    mobile: '9876543210',
    bankName: 'HDFC Bank',
    accountNumber: '501009182901',
    ifsc: 'HDFC0000120',
    upiId: 'priya@okhdfcbank',
  },
  {
    id: 'mc_2',
    name: 'Rahul Verma',
    mobile: '9820045821',
    bankName: 'Bharat Co-operative Bank',
    accountNumber: '409288112233',
    ifsc: 'APEX0001048',
    upiId: 'rahul.verma@apex',
  },
  {
    id: 'mc_3',
    name: 'Sneha Mehta',
    mobile: '9988776655',
    bankName: 'ICICI Bank',
    accountNumber: '55556666909033',
    ifsc: 'UTIB0009876',
  },
  {
    id: 'mc_4',
    name: 'Kavita Desai',
    mobile: '9765432109',
    bankName: 'Bharat Co-operative Bank',
    accountNumber: '409288445566',
    ifsc: 'APEX0001048',
  },
  {
    id: 'mc_5',
    name: 'Vikram Singh',
    mobile: '9890123456',
    bankName: 'Bharat Co-operative Bank',
    accountNumber: '409288778899',
    ifsc: 'APEX0001048',
  },
];

export function lookupMobilePayContact(mobile: string): MobilePayContact | null {
  const digits = mobile.replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return null;

  const found = MOBILE_PAY_CONTACTS.find((c) => c.mobile === digits);
  if (found) return found;

  return {
    id: `mc_dyn_${digits}`,
    name: `Mobile User ${digits.slice(-4)}`,
    mobile: digits,
    bankName: 'Bharat Co-operative Bank',
    accountNumber: `4092${digits}`,
    ifsc: 'APEX0001048',
    upiId: `${digits}@bharat`,
  };
}

export const TAX_PAYMENT_TYPES = [
  { id: 'advance', label: 'Advance Tax', authority: 'Income Tax Department' },
  { id: 'self', label: 'Self Assessment Tax', authority: 'Income Tax Department' },
  { id: 'gst', label: 'GST Payment', authority: 'GST Network' },
  { id: 'tds', label: 'TDS / TCS Payment', authority: 'Income Tax Department' },
] as const;

export const AUTO_FAVORITE_TXN_THRESHOLD = 3;

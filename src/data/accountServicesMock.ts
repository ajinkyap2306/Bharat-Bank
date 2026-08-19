export interface BanlLookupResult {
  accountHolderName: string;
  bankName: string;
  branch: string;
  matchStatus: 'matched' | 'partial' | 'not_found';
}

export interface EStatementSubscription {
  id: string;
  accountId: string;
  accountLabel: string;
  frequency: 'monthly' | 'quarterly' | 'annual';
  email: string;
  format: 'PDF' | 'Excel' | 'TEXT';
  status: 'active' | 'stopped' | 'pending';
  nextDelivery: string;
  startedOn: string;
}

const BANL_DIRECTORY: Record<string, { name: string; bank: string; branch: string }> = {
  '501009182901|HDFC0000120': { name: 'Priya Sharma', bank: 'HDFC Bank', branch: 'BKC, Mumbai' },
  '98765432107821|HDFC0001234': { name: 'ABC Suppliers Ltd', bank: 'HDFC Bank', branch: 'Andheri East' },
  '409288190012|APEX0001048': { name: 'Arjun Mehta', bank: 'Bharat Co-operative Bank', branch: 'BKC, Mumbai' },
  '55556666909033|UTIB0009876': { name: 'Office Supplies Co', bank: 'Axis Bank', branch: 'Lower Parel' },
};

export function lookupBanl(accountNumber: string, ifsc: string): BanlLookupResult {
  const key = `${accountNumber.trim()}|${ifsc.trim().toUpperCase()}`;
  const hit = BANL_DIRECTORY[key];
  if (hit) {
    return {
      accountHolderName: hit.name,
      bankName: hit.bank,
      branch: hit.branch,
      matchStatus: 'matched',
    };
  }
  if (accountNumber.length >= 10 && ifsc.length === 11) {
    return {
      accountHolderName: 'Demo Account Holder',
      bankName: 'Registered Bank',
      branch: 'Verified via NPCI BANL (demo)',
      matchStatus: 'partial',
    };
  }
  return {
    accountHolderName: '',
    bankName: '',
    branch: '',
    matchStatus: 'not_found',
  };
}

export const INITIAL_ESTATEMENT_SUBSCRIPTIONS: EStatementSubscription[] = [
  {
    id: 'est_1',
    accountId: 'acc_ret_sav_01',
    accountLabel: 'Savings •••• 0012',
    frequency: 'monthly',
    email: 'arjun.mehta@fintechmail.com',
    format: 'PDF',
    status: 'active',
    nextDelivery: '01 Sep 2026',
    startedOn: '01 Jan 2024',
  },
];

export function generateEStatementRef(): string {
  return `EST-${Date.now().toString(36).toUpperCase()}`;
}

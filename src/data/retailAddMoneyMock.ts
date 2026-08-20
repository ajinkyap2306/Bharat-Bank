import type {
  AddMoneyLimits,
  AddMoneySourceType,
  LinkedBankAccount,
  LinkedDebitCard,
} from '../types/retailAddMoney';

export const ADD_MONEY_LIMITS: AddMoneyLimits = {
  minAmount: 100,
  maxAmount: 100000,
  dailyLimit: 200000,
  usedToday: 25000,
  fee: 0,
};

export const LINKED_BANK_ACCOUNTS: LinkedBankAccount[] = [
  {
    id: 'ext_icici_01',
    bankName: 'ICICI Bank',
    accountType: 'Savings',
    maskedNumber: '•••• 0012',
    availableBalance: 482450,
  },
  {
    id: 'ext_hdfc_01',
    bankName: 'HDFC Bank',
    accountType: 'Savings',
    maskedNumber: '•••• 7821',
    availableBalance: 125000,
  },
];

export const LINKED_DEBIT_CARDS: LinkedDebitCard[] = [
  {
    id: 'card_icici_01',
    bankName: 'ICICI Debit Card',
    maskedNumber: '•••• 4582',
    network: 'Visa',
  },
];

export const UPI_APPS = [
  { id: 'gpay', label: 'Google Pay' },
  { id: 'phonepe', label: 'PhonePe' },
  { id: 'paytm', label: 'Paytm' },
];

export const QUICK_AMOUNTS = [1000, 2000, 5000, 10000];

export const DEMO_FAIL_AMOUNT = 9999;

export type AmountValidationCode =
  | 'valid'
  | 'empty'
  | 'invalid'
  | 'below_min'
  | 'above_max'
  | 'daily_limit'
  | 'insufficient_source';

export function validateAddMoneyAmount(
  raw: string,
  limits: AddMoneyLimits,
  sourceType: AddMoneySourceType | null,
  sourceBalance?: number
): { code: AmountValidationCode; message?: string } {
  const amount = Number(raw);
  if (!raw.trim()) return { code: 'empty' };
  if (!Number.isFinite(amount) || amount <= 0) return { code: 'invalid', message: 'Enter a valid amount.' };

  if (amount < limits.minAmount) {
    return { code: 'below_min', message: `Minimum amount is ₹${limits.minAmount.toLocaleString('en-IN')}.` };
  }
  if (amount > limits.maxAmount) {
    return { code: 'above_max', message: `Maximum amount is ₹${limits.maxAmount.toLocaleString('en-IN')}.` };
  }

  const remainingDaily = limits.dailyLimit - limits.usedToday;
  if (amount > remainingDaily) {
    return {
      code: 'daily_limit',
      message: `Daily add-money limit exceeded. Remaining today: ₹${remainingDaily.toLocaleString('en-IN')}.`,
    };
  }

  if (sourceType === 'bank_account' && sourceBalance !== undefined && amount > sourceBalance) {
    return { code: 'insufficient_source', message: 'Insufficient balance in selected bank account.' };
  }

  return { code: 'valid' };
}

export function buildTransactionId(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `TXN${y}${m}${day}${suffix}`;
}

export function playAddMoneySuccessChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const tone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };
    tone(523.25, ctx.currentTime, 0.12);
    tone(659.25, ctx.currentTime + 0.1, 0.18);
  } catch {
    // Audio not available
  }
}

export function formatAddMoneyTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

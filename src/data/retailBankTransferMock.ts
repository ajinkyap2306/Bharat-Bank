import type { BankTransferMode } from '../types/retailBankTransfer';
import { playAddMoneySuccessChime } from './retailAddMoneyMock';

export const DEMO_FAIL_TRANSFER_AMOUNT = 9999;

export const TRANSFER_FEE = 0;

export const FUND_TRANSFER_TYPE_OPTIONS = [
  {
    id: 'within-bank',
    label: 'Within Bank',
    subtitle: 'Transfer between your Bharat Bank accounts',
    path: 'self' as const,
    mode: null,
  },
  {
    id: 'bharat-contact',
    label: 'Send to Contact',
    subtitle: 'Pay Bharat Bank customers from your phone contacts',
    path: 'contact' as const,
    mode: null,
  },
  {
    id: 'imps',
    label: 'IMPS',
    subtitle: 'Instant transfer 24×7 · up to ₹5 lakh',
    path: 'bank' as const,
    mode: 'IMPS' as BankTransferMode,
  },
  {
    id: 'neft',
    label: 'NEFT',
    subtitle: 'Batch settlement during banking hours',
    path: 'bank' as const,
    mode: 'NEFT' as BankTransferMode,
  },
  {
    id: 'rtgs',
    label: 'RTGS',
    subtitle: 'High-value same-day · ₹2 lakh and above',
    path: 'bank' as const,
    mode: 'RTGS' as BankTransferMode,
  },
] as const;

export function getAvailableTransferModes(amount: number): BankTransferMode[] {
  const modes: BankTransferMode[] = [];
  if (amount > 0 && amount <= 500000) modes.push('IMPS');
  if (amount > 0) modes.push('NEFT');
  if (amount >= 200000) modes.push('RTGS');
  return modes.length ? modes : ['IMPS'];
}

export function defaultTransferMode(amount: number): BankTransferMode {
  return getAvailableTransferModes(amount)[0];
}

export function validateTransferModeForAmount(mode: BankTransferMode, amount: number): string | null {
  if (amount <= 0) return null;
  if (mode === 'RTGS' && amount < 200000) {
    return 'RTGS is available for ₹2,00,000 and above.';
  }
  if (mode === 'IMPS' && amount > 500000) {
    return 'IMPS limit is ₹5,00,000 per transaction.';
  }
  return null;
}

export function buildTransferTransactionId(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const suffix = String(Math.floor(1000 + Math.random() * 9000));
  return `TXN${y}${m}${day}${suffix}`;
}

export function formatTransferTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function playTransferSuccessChime(): void {
  playAddMoneySuccessChime();
}

export function maskAccountNumber(accountNumber: string): string {
  const digits = accountNumber.replace(/\s/g, '');
  if (digits.length <= 4) return digits;
  return `•••• ${digits.slice(-4)}`;
}

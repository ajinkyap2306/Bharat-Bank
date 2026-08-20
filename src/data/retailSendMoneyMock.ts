import type { SendMoneyRecipient } from '../types/retailSendMoney';
import { lookupMobilePayContact, MOBILE_PAY_CONTACTS } from './level3Mock';
import { playAddMoneySuccessChime } from './retailAddMoneyMock';

export const SEND_MONEY_QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export const SEND_MONEY_FEE = 0;

export const DEMO_FAIL_SEND_AMOUNT = 9999;
export const DEMO_PENDING_SEND_AMOUNT = 8888;

export const RECENT_SEND_RECIPIENTS: SendMoneyRecipient[] = [
  {
    id: 'send_rec_1',
    name: 'Rahul Sharma',
    upiId: 'rahul@upi',
    verified: true,
  },
  {
    id: 'send_rec_2',
    name: 'Priya Sharma',
    mobile: '9898765421',
    mobileMasked: '98••••••21',
    upiId: 'priya@okhdfcbank',
    verified: true,
  },
];

const UPI_DIRECTORY: Record<string, SendMoneyRecipient> = {
  'rahul@upi': {
    id: 'upi_rahul',
    name: 'Rahul Sharma',
    upiId: 'rahul@upi',
    verified: true,
  },
  'priya@okhdfcbank': {
    id: 'upi_priya',
    name: 'Priya Sharma',
    upiId: 'priya@okhdfcbank',
    mobileMasked: '98••••••21',
    verified: true,
  },
  'rahul.verma@apex': {
    id: 'upi_rv',
    name: 'Rahul Verma',
    upiId: 'rahul.verma@apex',
    verified: true,
  },
};

export function lookupSendMoneyQuery(query: string): SendMoneyRecipient | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  if (trimmed.includes('@')) {
    const key = trimmed.toLowerCase();
    if (UPI_DIRECTORY[key]) return UPI_DIRECTORY[key];

    const contact = MOBILE_PAY_CONTACTS.find(
      (c) => c.upiId?.toLowerCase() === key
    );
    if (contact) {
      return {
        id: contact.id,
        name: contact.name,
        upiId: contact.upiId,
        mobileMasked: `•••• ${contact.mobile.slice(-4)}`,
        verified: true,
      };
    }

    const handle = trimmed.split('@')[0];
    return {
      id: `upi_dyn_${key}`,
      name: handle.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      upiId: trimmed,
      verified: true,
    };
  }

  const digits = trimmed.replace(/\D/g, '').slice(-10);
  if (digits.length === 10) {
    const contact = lookupMobilePayContact(digits);
    if (contact) {
      return {
        id: contact.id,
        name: contact.name,
        upiId: contact.upiId ?? `${digits}@bharat`,
        mobile: contact.mobile,
        mobileMasked: `${digits.slice(0, 2)}••••••${digits.slice(-2)}`,
        verified: true,
      };
    }
  }

  const byName = RECENT_SEND_RECIPIENTS.find(
    (r) => r.name.toLowerCase().includes(trimmed.toLowerCase())
  );
  if (byName) return byName;

  const contactByName = MOBILE_PAY_CONTACTS.find((c) =>
    c.name.toLowerCase().includes(trimmed.toLowerCase())
  );
  if (contactByName) {
    return {
      id: contactByName.id,
      name: contactByName.name,
      upiId: contactByName.upiId ?? `${contactByName.mobile}@bharat`,
      mobileMasked: `•••• ${contactByName.mobile.slice(-4)}`,
      verified: true,
    };
  }

  return null;
}

export function recipientDisplayLine(recipient: SendMoneyRecipient): string {
  if (recipient.upiId) return recipient.upiId;
  if (recipient.mobileMasked) return recipient.mobileMasked;
  if (recipient.mobile) return recipient.mobile;
  return '';
}

export function buildSendMoneyTransactionId(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const suffix = String(Math.floor(100000000000 + Math.random() * 900000000000));
  return suffix.slice(0, 12);
}

export function formatSendMoneyTimestamp(): string {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function playSendMoneySuccessChime(): void {
  playAddMoneySuccessChime();
}

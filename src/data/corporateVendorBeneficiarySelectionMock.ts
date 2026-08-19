import type {
  VendorBeneficiary,
  VendorBeneficiarySelectionData,
} from '../types/corporateVendorBeneficiarySelection';

export const VENDOR_BENEFICIARY_COMPANY = 'Acme Technologies Pvt. Ltd.';

export const VENDOR_PAYMENT_BENEFICIARIES: VendorBeneficiary[] = [
  {
    id: 'ben_vendor_abc',
    beneficiaryId: 'BEN-2026-0048',
    name: 'ABC Suppliers Ltd.',
    nickname: 'Office Supplies Vendor',
    accountNumber: '50200078219012',
    maskedAccountNumber: '•••• 7821',
    bankName: 'HDFC Bank',
    bankCode: 'HDFC',
    type: 'vendor',
    typeLabel: 'Vendor',
    status: 'verified',
    isFavorite: true,
    lastPaymentDate: '18 Aug 2026',
    verifiedAt: '13 Mar 2024',
  },
  {
    id: 'ben_vendor_xyz',
    beneficiaryId: 'BEN-2026-0025',
    name: 'XYZ Logistics',
    nickname: 'Logistics Partner',
    accountNumber: '50200091345678',
    maskedAccountNumber: '•••• 9134',
    bankName: 'ICICI Bank',
    bankCode: 'ICICI',
    type: 'vendor',
    typeLabel: 'Vendor',
    status: 'verified',
    isFavorite: true,
    lastPaymentDate: '15 Aug 2026',
    verifiedAt: '23 Jun 2023',
  },
  {
    id: 'ben_vendor_office',
    beneficiaryId: 'BEN-2026-0033',
    name: 'Office Supplies Co.',
    nickname: 'Office Supplies',
    accountNumber: '40918254321098',
    maskedAccountNumber: '•••• 5432',
    bankName: 'Axis Bank',
    bankCode: 'AXIS',
    type: 'supplier',
    typeLabel: 'Supplier',
    status: 'verified',
    isFavorite: false,
    lastPaymentDate: '12 Aug 2026',
    verifiedAt: '10 Jan 2025',
  },
  {
    id: 'ben_vendor_new',
    beneficiaryId: 'BEN-2026-0051',
    name: 'New Services Pvt. Ltd.',
    nickname: 'New Services',
    accountNumber: '50200034567890',
    maskedAccountNumber: '•••• 3456',
    bankName: 'SBI',
    bankCode: 'SBI',
    type: 'vendor',
    typeLabel: 'Vendor',
    status: 'pending-approval',
    isFavorite: false,
  },
  {
    id: 'ben_vendor_blocked',
    beneficiaryId: 'BEN-2025-0099',
    name: 'Blocked Vendor Ltd.',
    nickname: 'Blocked Vendor',
    accountNumber: '50200087654321',
    maskedAccountNumber: '•••• 8765',
    bankName: 'HDFC Bank',
    bankCode: 'HDFC',
    type: 'vendor',
    typeLabel: 'Vendor',
    status: 'blocked',
    isFavorite: false,
  },
];

export const VENDOR_BENEFICIARY_BANKS = ['HDFC Bank', 'ICICI Bank', 'Axis Bank', 'SBI'];

export function buildVendorBeneficiaryData(): VendorBeneficiarySelectionData {
  return {
    companyName: VENDOR_BENEFICIARY_COMPANY,
    beneficiaries: [...VENDOR_PAYMENT_BENEFICIARIES],
    lastUpdated: 'Updated just now',
  };
}

export function searchVendorBeneficiaries(
  beneficiaries: VendorBeneficiary[],
  query: string
): VendorBeneficiary[] {
  const q = query.trim().toLowerCase();
  if (!q) return beneficiaries;

  return beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(q) ||
      b.nickname?.toLowerCase().includes(q) ||
      b.bankName.toLowerCase().includes(q) ||
      b.maskedAccountNumber.toLowerCase().includes(q) ||
      b.accountNumber.includes(q) ||
      b.beneficiaryId.toLowerCase().includes(q)
  );
}

export function getBeneficiaryInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function groupBeneficiariesByLetter(
  beneficiaries: VendorBeneficiary[]
): { letter: string; items: VendorBeneficiary[] }[] {
  const sorted = [...beneficiaries].sort((a, b) => a.name.localeCompare(b.name));
  const groups = new Map<string, VendorBeneficiary[]>();

  sorted.forEach((b) => {
    const letter = b.name.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(letter) ? letter : '#';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(b);
  });

  return Array.from(groups.entries()).map(([letter, items]) => ({ letter, items }));
}

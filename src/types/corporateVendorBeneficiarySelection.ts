export type VendorBeneficiaryStatus =
  | 'verified'
  | 'pending-verification'
  | 'pending-approval'
  | 'blocked'
  | 'inactive';

export type VendorBeneficiaryType = 'vendor' | 'supplier' | 'service-provider';

export interface VendorBeneficiary {
  id: string;
  name: string;
  nickname?: string;
  beneficiaryId: string;
  accountNumber: string;
  maskedAccountNumber: string;
  bankName: string;
  bankCode: string;
  type: VendorBeneficiaryType;
  typeLabel: string;
  status: VendorBeneficiaryStatus;
  isFavorite: boolean;
  lastPaymentDate?: string;
  verifiedAt?: string;
}

export interface VendorBeneficiaryFilters {
  statuses: VendorBeneficiaryStatus[];
  banks: string[];
  types: VendorBeneficiaryType[];
  favoritesOnly: boolean;
}

export const DEFAULT_VENDOR_BENEFICIARY_FILTERS: VendorBeneficiaryFilters = {
  statuses: [],
  banks: [],
  types: [],
  favoritesOnly: false,
};

export interface VendorBeneficiarySelectionData {
  companyName: string;
  beneficiaries: VendorBeneficiary[];
  lastUpdated?: string;
}

export function isVendorBeneficiarySelectable(status: VendorBeneficiaryStatus): boolean {
  return status === 'verified';
}

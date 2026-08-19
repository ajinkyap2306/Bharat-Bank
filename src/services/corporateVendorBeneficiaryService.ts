import type { VendorBeneficiarySelectionData } from '../types/corporateVendorBeneficiarySelection';
import { buildVendorBeneficiaryData } from '../data/corporateVendorBeneficiarySelectionMock';

const FETCH_DELAY_MS = 550;

export async function fetchVendorBeneficiaries(): Promise<VendorBeneficiarySelectionData> {
  await new Promise((resolve) => setTimeout(resolve, FETCH_DELAY_MS));
  return buildVendorBeneficiaryData();
}

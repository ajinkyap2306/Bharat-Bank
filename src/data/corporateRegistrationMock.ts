export const CORPORATE_REG_DEMO_COMPANY_ID = 'CORP-13456';
export const CORPORATE_REG_DEMO_GSTIN = '27AABCA1234F1Z5';
export const CORPORATE_REG_DEMO_OTP = '123456';

export function generateCorporateUserId(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `CB-${suffix}`;
}

export function validateCorporateCompanyAuth(companyId: string, gstin: string): string | null {
  const id = companyId.trim().toUpperCase();
  const gst = gstin.trim().toUpperCase();
  if (!id) return 'Enter your Corporate ID.';
  if (id !== CORPORATE_REG_DEMO_COMPANY_ID) {
    return `Demo: use Corporate ID ${CORPORATE_REG_DEMO_COMPANY_ID}.`;
  }
  if (!gst) return 'Enter your GSTIN.';
  if (gst !== CORPORATE_REG_DEMO_GSTIN) {
    return `Demo: use GSTIN ${CORPORATE_REG_DEMO_GSTIN}.`;
  }
  return null;
}

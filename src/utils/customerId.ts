const CORPORATE_PREFIXES = ['MAK-', 'CHK-', 'CB-', 'CUS-', 'CORP-'];

export function isCorporateCustomerId(customerId: string): boolean {
  const id = customerId.trim().toUpperCase();
  return CORPORATE_PREFIXES.some((prefix) => id.startsWith(prefix));
}

export function isRetailCustomerId(customerId: string): boolean {
  const id = customerId.trim().toUpperCase();
  if (!id) return true;
  if (isCorporateCustomerId(id)) return false;
  return id.startsWith('RB-') || id.startsWith('U1') || id.startsWith('R');
}

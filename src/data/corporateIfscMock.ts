export interface IfscBankBranch {
  ifsc: string;
  bankName: string;
  branch: string;
  city: string;
}

export const IFSC_DIRECTORY: IfscBankBranch[] = [
  { ifsc: 'HDFC0000120', bankName: 'HDFC Bank', branch: 'Bandra Kurla Complex', city: 'Mumbai' },
  { ifsc: 'HDFC0000060', bankName: 'HDFC Bank', branch: 'Fort', city: 'Mumbai' },
  { ifsc: 'HDFC0001234', bankName: 'HDFC Bank', branch: 'Andheri East', city: 'Mumbai' },
  { ifsc: 'ICIC0000105', bankName: 'ICICI Bank', branch: 'Nariman Point', city: 'Mumbai' },
  { ifsc: 'ICIC0001823', bankName: 'ICICI Bank', branch: 'Powai', city: 'Mumbai' },
  { ifsc: 'SBIN0000300', bankName: 'State Bank of India', branch: 'Fort', city: 'Mumbai' },
  { ifsc: 'SBIN0003786', bankName: 'State Bank of India', branch: 'BKC', city: 'Mumbai' },
  { ifsc: 'UTIB0009876', bankName: 'Axis Bank', branch: 'Lower Parel', city: 'Mumbai' },
  { ifsc: 'UTIB0000456', bankName: 'Axis Bank', branch: 'Andheri West', city: 'Mumbai' },
  { ifsc: 'APEX0001048', bankName: 'Bharat Co-operative Bank', branch: 'BKC', city: 'Mumbai' },
  { ifsc: 'KKBK0000958', bankName: 'Kotak Mahindra Bank', branch: 'BKC', city: 'Mumbai' },
  { ifsc: 'YESB0000001', bankName: 'Yes Bank', branch: 'Nariman Point', city: 'Mumbai' },
];

export function searchIfsc(query: string): IfscBankBranch[] {
  const q = query.trim().toUpperCase();
  if (!q) return IFSC_DIRECTORY;
  return IFSC_DIRECTORY.filter(
    (item) =>
      item.ifsc.includes(q) ||
      item.bankName.toUpperCase().includes(q) ||
      item.branch.toUpperCase().includes(q) ||
      item.city.toUpperCase().includes(q)
  );
}

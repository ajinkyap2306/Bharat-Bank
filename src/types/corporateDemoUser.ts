export type CorporateDemoRole = 'maker' | 'checker';

export interface CorporateDemoUser {
  corporateId: string;
  userId: string;
  password: string;
  role: CorporateDemoRole;
  name: string;
  displayRole: string;
  email: string;
  phone: string;
  avatar: string;
  approvalAuthority: number;
  canApprove: boolean;
  canSubmitPayment: boolean;
  canCreateBulk: boolean;
}

export function isCorporateApprover(role: CorporateDemoRole): boolean {
  return role === 'checker';
}

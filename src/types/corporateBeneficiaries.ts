export type CorporateBeneficiaryType = 'vendor' | 'customer' | 'employee' | 'internal' | 'other';

export type CorporateBeneficiaryDisplayStatus =
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Active'
  | 'Cooling Period'
  | 'Blocked'
  | 'Rejected'
  | 'Deleted';

export type CorporateBeneficiaryTab = 'all' | 'active' | 'pending' | 'blocked';

export type CorporateBeneficiariesScreen =
  | 'home'
  | 'groups'
  | 'group-members'
  | 'add-type'
  | 'add-business'
  | 'add-bank'
  | 'verify'
  | 'duplicate'
  | 'review'
  | 'submitted'
  | 'auth'
  | 'activated'
  | 'details'
  | 'approve-confirm'
  | 'reject-reason'
  | 'edit'
  | 'deactivate-confirm'
  | 'rejected-view'
  | 'success';

export interface CorporateBeneficiaryRecord {
  id: string;
  beneficiaryId: string;
  name: string;
  type: CorporateBeneficiaryType;
  typeLabel: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  nickname: string;
  bankName: string;
  maskedAccount: string;
  accountNumber: string;
  ifsc: string;
  accountType: string;
  status: CorporateBeneficiaryDisplayStatus;
  isFavourite: boolean;
  lastPaymentAmount?: number;
  lastPaymentDate?: string;
  totalPayments?: number;
  createdBy: string;
  createdRole?: string;
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  createdDate: string;
  approvalDate?: string;
  blockedReason?: string;
  blockedOn?: string;
  groupIds: string[];
  coolingPeriodEnds?: string;
}

export interface CorporateBeneficiaryActivity {
  id: string;
  beneficiaryId: string;
  action: string;
  user: string;
  date: string;
  time: string;
  status?: string;
}

export interface CorporateBeneficiaryGroup {
  id: string;
  name: string;
  memberIds: string[];
}

export interface CorporateBeneficiaryForm {
  type: CorporateBeneficiaryType;
  name: string;
  companyName: string;
  contactPerson: string;
  mobile: string;
  email: string;
  nickname: string;
  bankName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifsc: string;
  accountType: string;
}

export const DEFAULT_BENEFICIARY_FORM: CorporateBeneficiaryForm = {
  type: 'vendor',
  name: '',
  companyName: '',
  contactPerson: '',
  mobile: '',
  email: '',
  nickname: '',
  bankName: '',
  accountNumber: '',
  confirmAccountNumber: '',
  ifsc: '',
  accountType: 'Current',
};

export interface CorporateBeneficiaryApprovalLevel {
  level: number;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  date?: string;
}

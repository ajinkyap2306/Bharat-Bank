export interface CorporateProfileCompany {
  name: string;
  corporateId: string;
  gstinMasked: string;
  cin: string;
  verified: boolean;
  legalName: string;
  registeredAddress: string;
  registeredAddressShort: string;
  businessType: string;
  businessRegistration: string;
  gstin: string;
  pan: string;
  contactEmail: string;
  contactPhone: string;
  relationshipManager: string;
  relationshipManagerPhone: string;
}

export interface CorporateProfileUser {
  name: string;
  role: string;
  authorizationRole: string;
  lastLogin: string;
  lastLoginDevice: string;
  approvalAuthority: number;
  authorized: boolean;
}

export interface CorporateSignatory {
  id: string;
  name: string;
  role: string;
  authorizationLevel: string;
  status: 'Active' | 'Inactive';
}

export interface CorporateLinkedAccount {
  id: string;
  name: string;
  maskedNumber: string;
  balance?: number;
  isPrimary?: boolean;
}

export interface CorporateProfilePersonalDetails {
  name: string;
  role: string;
  corporateId: string;
  userId: string;
  maskedMobile: string;
  email: string;
  initials: string;
  authorized: boolean;
}

export interface CorporateRoleCapability {
  label: string;
  allowed: boolean;
}

export interface CorporateRolePermissions {
  roleTitle: string;
  capabilities: CorporateRoleCapability[];
  approvalAuthorityLabel: string;
  approvalAuthorityEnabled: boolean;
}

export interface CorporateApprovalStatusStat {
  label: string;
  value: number;
}

export interface CorporateApprovalStatusSummary {
  sectionTitle: string;
  stats: CorporateApprovalStatusStat[];
  ctaLabel: string;
  ctaRoute: string;
}

export interface CorporateRoleLimitItem {
  label: string;
  value: string;
}

export interface CorporateRoleLimits {
  sectionTitle: string;
  items: CorporateRoleLimitItem[];
}

export interface CorporateProfileView {
  role: 'maker' | 'checker';
  personal: CorporateProfilePersonalDetails;
  permissions: CorporateRolePermissions;
  approvalSummary: CorporateApprovalStatusSummary;
  limits: CorporateRoleLimits;
  linkedAccounts: CorporateLinkedAccount[];
  notificationPrefs: CorporateNotificationPref[];
  security: {
    lastLogin: string;
    lastLoginDevice: string;
  };
}

export interface CorporateLimits {
  dailyPaymentLimit: number;
  usedToday: number;
  singleTransactionLimit: number;
  bulkPaymentLimit: number;
}

export interface CorporateAccessUser {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  approvalAuthority?: number;
}

export interface CorporateApprovalRule {
  id: string;
  category: string;
  rule: string;
}

export interface CorporateNotificationPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export interface CorporateProfileData {
  company: CorporateProfileCompany;
  user: CorporateProfileUser;
  signatories: CorporateSignatory[];
  linkedAccounts: CorporateLinkedAccount[];
  limits: CorporateLimits;
  accessUsers: CorporateAccessUser[];
  approvalRules: CorporateApprovalRule[];
  notificationPrefs: CorporateNotificationPref[];
}

export type CorporateProfileScreen =
  | 'home'
  | 'company'
  | 'signatories'
  | 'accounts'
  | 'limits'
  | 'users'
  | 'approval-rules'
  | 'security'
  | 'notifications'
  | 'support';

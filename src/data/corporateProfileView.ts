import type { CorporateDemoUser } from '../types/corporateDemoUser';
import type {
  CorporateLinkedAccount,
  CorporateNotificationPref,
  CorporateProfileView,
} from '../types/corporateProfile';
import { CORPORATE_PROFILE_DATA } from './corporateProfileMock';

const MAKER_NOTIFICATIONS: CorporateNotificationPref[] = [
  { id: 'm1', label: 'Payment Submitted', description: 'When you submit a payment for approval', enabled: true },
  { id: 'm2', label: 'Request Approved', description: 'When your request is approved', enabled: true },
  { id: 'm3', label: 'Request Rejected', description: 'When your request is rejected', enabled: true },
  { id: 'm4', label: 'Request Returned', description: 'When a request is returned for changes', enabled: true },
  { id: 'm5', label: 'Payment Failed', description: 'When a payment fails to process', enabled: true },
  { id: 'm6', label: 'Beneficiary Updates', description: 'Add, edit or activation of beneficiaries', enabled: true },
  { id: 'm7', label: 'Security Alerts', description: 'New device logins and security events', enabled: true },
];

const CHECKER_NOTIFICATIONS: CorporateNotificationPref[] = [
  { id: 'c1', label: 'Payment Submitted', description: 'When a payment is submitted for approval', enabled: true },
  { id: 'c2', label: 'Approval Required', description: 'When an item needs your approval', enabled: true },
  { id: 'c3', label: 'Payment Approved', description: 'When you approve a payment', enabled: true },
  { id: 'c4', label: 'Payment Rejected', description: 'When a payment is rejected', enabled: true },
  { id: 'c5', label: 'Payment Failed', description: 'When a payment fails to process', enabled: true },
  { id: 'c6', label: 'Approval Completed', description: 'When approval workflow completes', enabled: true },
  { id: 'c7', label: 'Returned Request', description: 'When a request is returned for changes', enabled: true },
  { id: 'c8', label: 'Beneficiary Updates', description: 'Beneficiary changes requiring review', enabled: true },
  { id: 'c9', label: 'Security Alerts', description: 'New device logins and security events', enabled: true },
];

const ALL_ACCOUNTS: CorporateLinkedAccount[] = [
  { id: 'acc_corp_op_01', name: 'Operating Account', maskedNumber: '•••• 4582', balance: 1245000, isPrimary: true },
  { id: 'acc_corp_pay_02', name: 'Payroll Account', maskedNumber: '•••• 7821', balance: 685000 },
  { id: 'acc_corp_col_03', name: 'Collection Account', maskedNumber: '•••• 3491', balance: 420000 },
];

const MAKER_ACCOUNTS = ALL_ACCOUNTS.filter((a) => a.id !== 'acc_corp_col_03');

function maskMobile(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const last4 = digits.slice(-4);
  return `••••••${last4}`;
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function getCorporateProfileView(
  session: CorporateDemoUser | null
): CorporateProfileView | null {
  if (!session) return null;

  const role = session.role;
  const isChecker = role === 'checker';

  const personal = {
    name: session.name,
    role: session.displayRole,
    corporateId: session.corporateId,
    userId: session.userId,
    maskedMobile: maskMobile(session.phone),
    email: session.email,
    initials: initialsFromName(session.name),
    authorized: true,
  };

  const permissions = isChecker
    ? {
        roleTitle: 'Finance Checker',
        capabilities: [
          { label: 'Review Payments', allowed: true },
          { label: 'Approve Payments', allowed: true },
          { label: 'Reject Payments', allowed: true },
          { label: 'Return Payments for Changes', allowed: true },
          { label: 'Review Bulk Payments', allowed: true },
          { label: 'View Payment Status', allowed: true },
          { label: 'Create Payments', allowed: false },
        ],
        approvalAuthorityLabel: 'Payment Approval Enabled',
        approvalAuthorityEnabled: true,
      }
    : {
        roleTitle: 'Finance Maker',
        capabilities: [
          { label: 'Create Payments', allowed: true },
          { label: 'Add Beneficiaries', allowed: true },
          { label: 'Create Bulk Payments', allowed: true },
          { label: 'Schedule Payments', allowed: true },
          { label: 'Submit Payments for Approval', allowed: true },
          { label: 'View Payment Status', allowed: true },
          { label: 'Approve Payments', allowed: false },
        ],
        approvalAuthorityLabel: 'Not Authorized',
        approvalAuthorityEnabled: false,
      };

  const approvalSummary = isChecker
    ? {
        sectionTitle: 'Approval Center',
        stats: [
          { label: 'Pending Approvals', value: 5 },
          { label: 'Approved', value: 24 },
          { label: 'Rejected', value: 2 },
          { label: 'Returned', value: 3 },
        ],
        ctaLabel: 'View Approvals',
        ctaRoute: '/corporate/approvals',
      }
    : {
        sectionTitle: 'Approval Status',
        stats: [
          { label: 'Submitted Requests', value: 3 },
          { label: 'Pending Approval', value: 3 },
          { label: 'Approved', value: 12 },
          { label: 'Rejected', value: 1 },
        ],
        ctaLabel: 'View My Requests',
        ctaRoute: '/corporate/payments',
      };

  const limits = isChecker
    ? {
        sectionTitle: 'Approval Limits',
        items: [
          { label: 'Single Approval Limit', value: '₹10,00,000' },
          { label: 'Daily Approval Limit', value: '₹50,00,000' },
          { label: 'Bulk Approval Limit', value: '₹50,00,000' },
          { label: 'Approval Authority', value: 'Enabled' },
        ],
      }
    : {
        sectionTitle: 'Transaction Limits',
        items: [
          { label: 'Single Payment Limit', value: '₹10,00,000' },
          { label: 'Daily Payment Limit', value: '₹25,00,000' },
          { label: 'Bulk Payment Limit', value: '₹25,00,000' },
          { label: 'Approval Required', value: 'Above configured threshold' },
        ],
      };

  return {
    role,
    personal,
    permissions,
    approvalSummary,
    limits,
    linkedAccounts: isChecker ? ALL_ACCOUNTS : MAKER_ACCOUNTS,
    notificationPrefs: isChecker ? CHECKER_NOTIFICATIONS : MAKER_NOTIFICATIONS,
    security: {
      lastLogin: CORPORATE_PROFILE_DATA.user.lastLogin,
      lastLoginDevice: CORPORATE_PROFILE_DATA.user.lastLoginDevice,
    },
  };
}

/** Demo-only mock credentials — not for production use */
import type { CorporateDemoUser } from '../types/corporateDemoUser';
import type { UserProfile } from '../types/banking';

export const CORPORATE_DEMO_COMPANY_ID = 'CORP-13456';
export const CORPORATE_DEMO_COMPANY_NAME = 'Acme Technologies Pvt. Ltd.';
export const CORPORATE_DEMO_OTP = '123456';
export const CORPORATE_MASKED_MOBILE = '******4582';
export const CORPORATE_OTP_RESEND_SECONDS = 30;
export const CORPORATE_MAX_OTP_ATTEMPTS = 3;

const AVATAR_MAKER =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
const AVATAR_CHECKER =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
export const CORPORATE_DEMO_USERS: CorporateDemoUser[] = [
  {
    corporateId: CORPORATE_DEMO_COMPANY_ID,
    userId: 'C001',
    password: 'demo123',
    role: 'maker',
    name: 'Rahul Sharma',
    displayRole: 'Finance Maker',
    email: 'rahul.sharma@acmetech.in',
    phone: '+91 98200 45821',
    avatar: AVATAR_MAKER,
    approvalAuthority: 0,
    canApprove: false,
    canSubmitPayment: true,
    canCreateBulk: true,
  },
  {
    corporateId: CORPORATE_DEMO_COMPANY_ID,
    userId: 'C002',
    password: 'demo123',
    role: 'checker',
    name: 'Amit Verma',
    displayRole: 'Finance Checker',
    email: 'amit.verma@acmetech.in',
    phone: '+91 98200 45822',
    avatar: AVATAR_CHECKER,
    approvalAuthority: 5000000,
    canApprove: true,
    canSubmitPayment: false,
    canCreateBulk: false,
  },
];

/** @deprecated Use CORPORATE_DEMO_COMPANY_ID */
export const CORPORATE_DEMO_ID = CORPORATE_DEMO_COMPANY_ID;
export const CORPORATE_DEMO_PASSWORD = 'demo123';
export const CORPORATE_DEMO_ROLE = 'Finance Maker';

export const CORPORATE_DEMO_HINT =
  'Customer ID: RB-123456 · C001 (Maker) · C002 (Checker) · Password: demo123 · OTP: 123456';

export interface CorporateLoginCredentials {
  corporateId: string;
  userId: string;
  password: string;
}

export function findCorporateDemoUser(
  corporateId: string,
  userId: string,
  password: string
): CorporateDemoUser | null {
  const corp = corporateId.trim().toUpperCase();
  const uid = userId.trim().toUpperCase();
  const pwd = password;

  if (
    corporateId.trim().toLowerCase() === 'corp' &&
    password === '1234' &&
    (!userId.trim() || userId.trim().toUpperCase() === 'C001')
  ) {
    return CORPORATE_DEMO_USERS.find((u) => u.role === 'maker') ?? null;
  }

  const byUserId = CORPORATE_DEMO_USERS.find(
    (u) => u.userId.toUpperCase() === uid && u.password === pwd
  );
  if (byUserId) return byUserId;

  return (
    CORPORATE_DEMO_USERS.find(
      (u) =>
        u.corporateId.toUpperCase() === corp &&
        u.userId.toUpperCase() === uid &&
        u.password === pwd
    ) ?? null
  );
}

/** Login with Customer ID + password only (Corporate ID inferred for demo users). */
export function findCorporateDemoUserByCustomerId(
  customerId: string,
  password: string
): CorporateDemoUser | null {
  return findCorporateDemoUser(CORPORATE_DEMO_COMPANY_ID, customerId, password);
}

/** Resolve corporate demo user by Customer ID only (MPIN / biometric quick login). */
export function findCorporateDemoUserByCustomerIdOnly(
  customerId: string
): CorporateDemoUser | null {
  const uid = customerId.trim().toUpperCase();
  return CORPORATE_DEMO_USERS.find((u) => u.userId.toUpperCase() === uid) ?? null;
}

export const validateCorporateCredentials = (
  corporateId: string,
  userId: string,
  password: string
): boolean => Boolean(findCorporateDemoUser(corporateId, userId, password));

export const validateCorporateOtp = (otp: string): boolean =>
  otp.replace(/\s/g, '') === CORPORATE_DEMO_OTP;

export function getCorporateDemoUserByRole(
  role: CorporateDemoUser['role']
): CorporateDemoUser | undefined {
  return CORPORATE_DEMO_USERS.find((u) => u.role === role);
}

export function corporateDemoUserToProfile(user: CorporateDemoUser): UserProfile {
  return {
    id: user.userId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    type: 'corporate',
    customerNumber: user.corporateId,
    companyName: CORPORATE_DEMO_COMPANY_NAME,
    role: user.displayRole,
    cin: 'U72200MH2018PTC309812',
    gstin: '27AABCA1234F1Z5',
    kycStatus: 'verified',
    lastLogin: 'Today, from this device',
  };
}

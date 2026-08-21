import type {
  PasswordRuleStatus,
  RetailLinkedAccount,
  RetailSimOption,
  SecurityQuestionOption,
  SimSlotId,
} from '../types/retailRegistration';

/** Registered mobile linked to the bank account (demo). */
export const RETAIL_DEMO_REGISTERED_MOBILE = '9898765421';
export const RETAIL_DEMO_CUSTOMER_ID = '2847193';
export const RETAIL_DEMO_DOB = '15/08/1990';
export const RETAIL_DEMO_ACCOUNT_NUMBER = '50123456789';

export const RETAIL_DEMO_DEBIT_CARD = '4532123456789010';
export const RETAIL_DEMO_DEBIT_EXPIRY = '12/28';
export const RETAIL_DEMO_ATM_PIN = '1234';
export const RETAIL_DEMO_AUTO_OTP = '582941';

export const RETAIL_DEMO_AADHAAR = '123456781234';
export const RETAIL_DEMO_PAN = 'ABCDE1234F';

export const RETAIL_DEMO_CODE_A = '12';
export const RETAIL_DEMO_CODE_J = '34';
export const RETAIL_DEMO_CODE_L = '56';

export const RETAIL_COOLING_PAN = 'COOLING1234K';
export const RETAIL_OTP_RESEND_SECONDS = 30;
export const RETAIL_MAX_OTP_ATTEMPTS = 3;
export const RETAIL_MAX_VERIFICATION_ATTEMPTS = 3;

export const RETAIL_HELPLINE = '1800-202-APEX';

export const RETAIL_DEMO_SIMS: RetailSimOption[] = [
  { id: 'sim1', carrier: 'Jio', mobile: RETAIL_DEMO_REGISTERED_MOBILE, isRegistered: true },
  { id: 'sim2', carrier: 'Airtel', mobile: '9988774455', isRegistered: false },
];

export const RETAIL_LINKED_ACCOUNTS: RetailLinkedAccount[] = [
  {
    id: 'acc_savings_0012',
    type: 'Savings Account',
    maskedAccount: '••••0012',
    customerId: RETAIL_DEMO_CUSTOMER_ID,
    accountNumber: '5001200012',
  },
  {
    id: 'acc_savings_7821',
    type: 'Savings Account',
    maskedAccount: '••••7821',
    customerId: RETAIL_DEMO_CUSTOMER_ID,
    accountNumber: '5001277821',
  },
  {
    id: 'acc_current_9943',
    type: 'Current Account',
    maskedAccount: '••••9943',
    customerId: RETAIL_DEMO_CUSTOMER_ID,
    accountNumber: '5001299943',
  },
];

export const RETAIL_TERMS_TEXT = `Bharat Co-operative Bank (Mumbai) Ltd — Mobile Banking Terms & Conditions

1. Definitions
"Bank", "You", and "Mobile Banking" refer to Bharat Co-operative Bank (Mumbai) Ltd and the digital banking services offered through this application.

2. Eligibility
You must be an existing account holder with valid KYC and an active relationship with the Bank. Registration is permitted only for accounts in good standing.

3. Authentication
You agree to safeguard your User ID, MPIN, OTP, debit card credentials, and Code Card values. The Bank will never ask for your full MPIN or OTP via phone or email.

4. Transactions
All transactions initiated through Mobile Banking are subject to applicable limits, cooling periods, and regulatory guidelines issued by RBI. The Bank may decline transactions that appear suspicious or exceed assigned limits.

5. Device Binding
Upon registration, an encrypted device seed is stored on your device for identification. You must not register on untrusted or rooted devices.

6. Liability
You are responsible for all transactions performed using your credentials unless reported to the Bank within the stipulated timeframe under the applicable policy.

7. Privacy
Personal data is processed in accordance with the Bank's Privacy Policy and applicable data protection regulations.

8. Amendments
The Bank may amend these terms with reasonable notice through the application or registered communication channels.

9. Governing Law
These terms are governed by the laws of India. Disputes shall be subject to the jurisdiction of courts in Mumbai.

By accepting, you confirm that you have read, understood, and agree to be bound by these Terms & Conditions.`;

export const RETAIL_PRIVACY_TEXT = `Bharat Co-operative Bank (Mumbai) Ltd — Privacy Policy

We collect personal information necessary to provide banking services, including identity, contact, transaction, and device data.

Your data is protected using industry-standard encryption and access controls. We do not sell your personal information to third parties.

For the full policy, visit www.bharatbank.co.in/privacy or contact our Data Protection Officer.`;

export const RETAIL_MOBILE_BANKING_TERMS = `Mobile Banking Specific Terms

• Registration is permitted only on devices with verified SIM matching your registered mobile number.
• MPIN is required for login and transaction authentication.
• Biometric login is optional and uses your device's secure enclave only.
• Session timeout applies after periods of inactivity.
• The Bank may suspend mobile banking access for security reasons.`;

export const SECURITY_QUESTIONS: SecurityQuestionOption[] = [
  { id: 'sq_01', text: "What is your mother's maiden name?" },
  { id: 'sq_02', text: 'What was the name of your first school?' },
  { id: 'sq_03', text: 'What is your favourite book?' },
  { id: 'sq_04', text: 'In which city were you born?' },
  { id: 'sq_05', text: 'What was your childhood nickname?' },
  { id: 'sq_06', text: 'What is the name of your first pet?' },
];

export function maskRegisteredMobile(digits: string): string {
  const d = digits.replace(/\D/g, '');
  if (d.length < 10) return d;
  const local = d.length > 10 ? d.slice(-10) : d;
  return `+91 ${local.slice(0, 2)}••••••${local.slice(-2)}`;
}

export function maskCustomerId(id: string): string {
  const trimmed = id.trim();
  if (!trimmed) return '—';
  if (trimmed.length <= 4) return `CUST••••${trimmed}`;
  return `CUST••••${trimmed.slice(-4)}`;
}

export function maskUserId(id: string): string {
  const trimmed = id.trim();
  if (!trimmed) return '—';
  if (trimmed.length <= 3) return `user••••${trimmed}`;
  return `user••••${trimmed.slice(-3)}`;
}

export function maskAadhaar(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 12);
  if (d.length <= 4) return d;
  return `${'X'.repeat(Math.max(0, d.length - 4))} ${d.slice(-4)}`.replace(/(.{4})/g, '$1 ').trim();
}

export function formatAadhaarInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 12);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatDobInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

export function formatExpiryInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function validateCustomerVerification(customerId: string, dateOfBirth: string): string | null {
  const id = customerId.trim();
  if (!/^\d{6,12}$/.test(id)) {
    return 'Enter a valid Customer ID (6–12 digits).';
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth.trim())) {
    return 'Enter date of birth as DD/MM/YYYY.';
  }
  if (id !== RETAIL_DEMO_CUSTOMER_ID || dateOfBirth.trim() !== RETAIL_DEMO_DOB) {
    return 'Customer ID or date of birth could not be verified.';
  }
  return null;
}

export function recoverCustomerId(
  accountNumber: string,
  dateOfBirth: string
): { error: string | null; customerId: string | null } {
  const acct = accountNumber.replace(/\D/g, '');
  if (acct.length < 8) {
    return { error: 'Enter a valid account number.', customerId: null };
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth.trim())) {
    return { error: 'Enter date of birth as DD/MM/YYYY.', customerId: null };
  }
  if (acct !== RETAIL_DEMO_ACCOUNT_NUMBER || dateOfBirth.trim() !== RETAIL_DEMO_DOB) {
    return { error: 'Account details could not be verified.', customerId: null };
  }
  return { error: null, customerId: RETAIL_DEMO_CUSTOMER_ID };
}

export function validateDebitCardVerification(cardNumber: string, expiry: string): string | null {
  const digits = normalizeCardNumber(cardNumber);
  if (digits.length !== 16) return 'Enter a valid 16-digit card number.';
  if (!/^\d{2}\/\d{2}$/.test(expiry.trim())) return 'Enter expiry as MM/YY.';
  if (digits !== RETAIL_DEMO_DEBIT_CARD || expiry.trim() !== RETAIL_DEMO_DEBIT_EXPIRY) {
    return 'Debit card details could not be verified.';
  }
  return null;
}

export function validateAadhaarVerification(aadhaar: string): { error: string | null; requiresOtp: boolean } {
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length !== 12) {
    return { error: 'Enter a valid 12-digit Aadhaar number.', requiresOtp: false };
  }
  if (digits !== RETAIL_DEMO_AADHAAR) {
    return { error: 'Aadhaar details could not be verified.', requiresOtp: false };
  }
  return { error: null, requiresOtp: true };
}

export function validatePanVerification(pan: string, dateOfBirth: string): string | null {
  const panNorm = pan.trim().toUpperCase();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNorm)) {
    return 'Enter a valid PAN (e.g. ABCDE1234F).';
  }
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateOfBirth.trim())) {
    return 'Enter date of birth as DD/MM/YYYY.';
  }
  if (panNorm !== RETAIL_DEMO_PAN || dateOfBirth.trim() !== RETAIL_DEMO_DOB) {
    return 'PAN details could not be verified.';
  }
  return null;
}

export function verifyRegistrationOtp(otp: string): boolean {
  return otp.replace(/\D/g, '') === RETAIL_DEMO_AUTO_OTP;
}

export function getPasswordRuleStatus(password: string): PasswordRuleStatus {
  return {
    length: password.length >= 8 && password.length <= 20,
    upperLower: /[a-z]/.test(password) && /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function validateLoginCredentials(
  userId: string,
  password: string,
  confirmPassword: string
): string | null {
  const uid = userId.trim();
  if (uid.length < 4 || uid.length > 20) {
    return 'User ID must be 4–20 characters.';
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(uid)) {
    return 'User ID may only contain letters, numbers, dots, hyphens, and underscores.';
  }
  const rules = getPasswordRuleStatus(password);
  if (!rules.length || !rules.upperLower || !rules.number || !rules.special) {
    return 'Password does not meet all requirements.';
  }
  if (password !== confirmPassword) {
    return 'Password and confirmation do not match.';
  }
  return null;
}

export function isUserIdTaken(userId: string): boolean {
  const reserved = ['admin', 'test', 'demo', 'bank', 'user'];
  return reserved.includes(userId.trim().toLowerCase());
}

const WEAK_MPINS = new Set([
  '000000', '111111', '222222', '333333', '444444', '555555',
  '666666', '777777', '888888', '999999', '123456', '654321',
  '121212', '112233', '123123',
]);

export function validateMpin(mpin: string, confirmMpin: string): string | null {
  if (mpin.length !== 6) return 'MPIN must be 6 digits.';
  if (mpin !== confirmMpin) return 'MPINs do not match.';
  if (WEAK_MPINS.has(mpin)) return 'This MPIN is too common. Choose a stronger MPIN.';
  if (/^(\d)\1{5}$/.test(mpin)) return 'Avoid repeated digits in your MPIN.';
  if ('0123456789'.includes(mpin) || '9876543210'.includes(mpin)) {
    return 'Avoid sequential digits in your MPIN.';
  }
  return null;
}

const WEAK_TPINS = new Set(['0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999', '1234', '4321']);

export function validateTpin(tpin: string, confirmTpin: string): string | null {
  if (tpin.length !== 4) return 'TPIN must be 4 digits.';
  if (tpin !== confirmTpin) return 'TPINs do not match.';
  if (WEAK_TPINS.has(tpin)) return 'This TPIN is too common. Choose a stronger TPIN.';
  if (/^(\d)\1{3}$/.test(tpin)) return 'Avoid repeated digits in your TPIN.';
  return null;
}

export function getSimById(simId: SimSlotId | null): RetailSimOption | undefined {
  return RETAIL_DEMO_SIMS.find((sim) => sim.id === simId);
}

export function getLinkedAccountById(accountId: string): RetailLinkedAccount | undefined {
  return RETAIL_LINKED_ACCOUNTS.find((account) => account.id === accountId);
}

/** Demo: verify selected SIM against bank-registered mobile. */
export function simulateSimVerification(
  selectedSimId: SimSlotId | null
): Promise<{ success: boolean; mobile?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sim = getSimById(selectedSimId);
      if (sim?.isRegistered) {
        resolve({ success: true, mobile: sim.mobile });
      } else {
        resolve({ success: false });
      }
    }, 1800);
  });
}

export function simulateRegistrationSubmit(): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 2200);
  });
}

export function generateRetailUserId(): string {
  const suffix = Math.floor(100000 + Math.random() * 900000);
  return `RB-${suffix}`;
}

export function normalizeCardNumber(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCardNumberDisplay(digits: string): string {
  const d = normalizeCardNumber(digits).slice(0, 16);
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function formatCardNumberMasked(digits: string): string {
  const d = normalizeCardNumber(digits);
  if (d.length < 4) return formatCardNumberDisplay(digits);
  const last4 = d.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

export function validateDebitCardAuth(cardNumber: string, atmPin: string): string | null {
  const digits = normalizeCardNumber(cardNumber);
  if (digits.length !== 16) return 'Enter a valid 16-digit card number.';
  if (atmPin.length !== 4) return 'ATM PIN must be 4 digits.';
  if (digits !== RETAIL_DEMO_DEBIT_CARD || atmPin !== RETAIL_DEMO_ATM_PIN) {
    return 'Card number or ATM PIN is incorrect.';
  }
  return null;
}

export function validatePanCardCode(
  pan: string,
  codeA: string,
  codeJ: string,
  codeL: string
): { error: string | null; cooling: boolean } {
  const panNorm = pan.trim().toUpperCase();
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(panNorm)) {
    return { error: 'Enter a valid PAN (e.g. ABCDE1234F).', cooling: false };
  }
  if (panNorm === RETAIL_COOLING_PAN) {
    return { error: null, cooling: true };
  }
  if (codeA.length !== 2 || codeJ.length !== 2 || codeL.length !== 2) {
    return { error: 'Each Code Card value must be exactly 2 digits.', cooling: false };
  }
  if (
    panNorm !== RETAIL_DEMO_PAN ||
    codeA !== RETAIL_DEMO_CODE_A ||
    codeJ !== RETAIL_DEMO_CODE_J ||
    codeL !== RETAIL_DEMO_CODE_L
  ) {
    return {
      error: 'PAN or Code Card values are incorrect.',
      cooling: false,
    };
  }
  return { error: null, cooling: false };
}

export const RETAIL_REGISTRATION_STORAGE_KEY = 'bharat_retail_registration';

import type { PasswordRuleStatus, SecurityQuestionOption } from '../types/retailRegistration';

/** Registered mobile linked to the bank account (demo). */
export const RETAIL_DEMO_REGISTERED_MOBILE = '9898765421';
export const RETAIL_DEMO_CUSTOMER_ID = '2847193';
export const RETAIL_DEMO_DOB = '15/08/1990';

export const RETAIL_DEMO_DEBIT_CARD = '4532123456789010';
export const RETAIL_DEMO_ATM_PIN = '1234';
export const RETAIL_DEMO_AUTO_OTP = '582941';

export const RETAIL_DEMO_PAN = 'ABCDE1234F';
export const RETAIL_DEMO_CODE_A = '12';
export const RETAIL_DEMO_CODE_J = '34';
export const RETAIL_DEMO_CODE_L = '56';

/** Triggers branch cooling-period demo when PAN matches. */
export const RETAIL_COOLING_PAN = 'COOLING1234K';

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

export const CODE_CARD_WHAT_IS = `A CODE CARD is a security card issued by Bharat Co-operative Bank containing printed reference values used during Mobile Banking registration.

Each card has labelled boxes (for example A, J, L) with two-digit values printed inside. During registration you enter the values exactly as shown on your physical card.`;

export const CODE_CARD_HOW_TO_OBTAIN = `Your Code Card is provided when you open an account or request Mobile Banking at any Bharat Co-operative Bank branch.

If you do not have a Code Card, visit your home branch with valid ID proof. A relationship manager will issue a new card and activate it against your account.

Never share Code Card values with anyone, including bank staff on phone calls.`;

export const SECURITY_QUESTIONS: SecurityQuestionOption[] = [
  { id: 'sq_01', text: 'What is your mother\'s maiden name?' },
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

export function formatDobInput(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
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
    return `Customer ID or date of birth is incorrect. Demo: ${RETAIL_DEMO_CUSTOMER_ID} / ${RETAIL_DEMO_DOB}`;
  }
  return null;
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

/** Demo: SIM on device matches registered mobile after short delay. */
export function simulateSimVerification(simMismatch = false): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: !simMismatch }), 1500);
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

export function validateDebitCardAuth(cardNumber: string, atmPin: string): string | null {
  const digits = normalizeCardNumber(cardNumber);
  if (digits.length !== 16) return 'Enter a valid 16-digit card number.';
  if (atmPin.length !== 4) return 'ATM PIN must be 4 digits.';
  if (digits !== RETAIL_DEMO_DEBIT_CARD || atmPin !== RETAIL_DEMO_ATM_PIN) {
    return 'Card number or ATM PIN is incorrect. Demo: 4532 1234 5678 9010 / PIN 1234';
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
      error: 'PAN or Code Card values are incorrect. Demo: ABCDE1234F / A=12, J=34, L=56',
      cooling: false,
    };
  }
  return { error: null, cooling: false };
}

export const RETAIL_REGISTRATION_STORAGE_KEY = 'bharat_retail_registration';

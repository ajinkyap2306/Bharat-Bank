export interface PreLoginFaq {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface PreLoginLocator {
  id: string;
  name: string;
  address: string;
  distance: string;
  hours: string;
  services: string[];
  lat?: number;
  lng?: number;
}

export interface PreLoginOffer {
  id: string;
  title: string;
  description: string;
  validTill: string;
  cta: string;
  badge?: string;
}

export interface PreLoginTip {
  id: string;
  title: string;
  body: string;
  icon: 'shield' | 'lock' | 'alert' | 'phone';
}

export const PRE_LOGIN_TICKER_MESSAGES = [
  'Enjoy 7.75% p.a. on 18-month Fixed Deposits — limited period offer.',
  'Never share your MPIN, OTP, or card details with anyone, including bank staff.',
  'Last security scan completed on 18 Aug 2026 — your app environment is protected.',
  'Register for Mobile Banking in under 5 minutes with your debit card.',
];

export const INDUSFACE_SCAN = {
  provider: 'Indusface',
  lastScanDate: '18 Aug 2026, 09:14 AM',
  status: 'Protected' as const,
  threatsBlocked: 0,
  appIntegrity: 'Verified',
  certificatePinning: 'Active',
};

export const PRE_LOGIN_FAQS: PreLoginFaq[] = [
  {
    id: 'faq_1',
    category: 'Registration',
    question: 'How do I register for Mobile Banking?',
    answer:
      'Use your debit card & ATM PIN or PAN with CODE CARD values. Complete OTP verification, accept Terms & Conditions, set MPIN, and enable device binding.',
  },
  {
    id: 'faq_2',
    category: 'Login',
    question: 'What if I forget my MPIN?',
    answer:
      'Tap "Forgot MPIN?" on the login screen. Verify with OTP and set a new 6-digit MPIN. For security, a cooling period may apply on high-value transactions.',
  },
  {
    id: 'faq_3',
    category: 'Transfers',
    question: 'What are IMPS, NEFT, and RTGS?',
    answer:
      'IMPS is instant (24x7). NEFT settles in batches during banking hours. RTGS is for high-value transfers (typically ₹2 lakh and above) with same-day settlement.',
  },
  {
    id: 'faq_4',
    category: 'Security',
    question: 'Is Mobile Banking safe?',
    answer:
      'Yes. We use device binding, MPIN/biometric login, session timeout, and continuous app security scanning. Never share credentials over phone or email.',
  },
  {
    id: 'faq_5',
    category: 'Bills',
    question: 'Can I pay utility bills through the app?',
    answer:
      'Yes. Pay electricity, water, gas, mobile, DTH, broadband, and more via BBPS-certified bill payment with saved billers and AutoPay.',
  },
  {
    id: 'faq_6',
    category: 'Cards',
    question: 'How do I block my card in an emergency?',
    answer:
      'Go to Cards → Block Card, or use Emergency Card Block from Help & Support. You can unblock or request replacement later.',
  },
];

export const ATM_LOCATORS: PreLoginLocator[] = [
  {
    id: 'atm_1',
    name: 'Bandra Kurla Complex ATM',
    address: 'G Block, BKC, Mumbai 400051',
    distance: '0.4 km',
    hours: '24x7',
    services: ['Cash Withdrawal', 'Mini Statement', 'PIN Change'],
  },
  {
    id: 'atm_2',
    name: 'Andheri West ATM',
    address: 'SV Road, Andheri West, Mumbai 400058',
    distance: '2.1 km',
    hours: '24x7',
    services: ['Cash Withdrawal', 'Cash Deposit (Recycler)'],
  },
  {
    id: 'atm_3',
    name: 'Powai Hiranandani ATM',
    address: 'Hiranandani Gardens, Powai, Mumbai 400076',
    distance: '4.8 km',
    hours: '24x7',
    services: ['Cash Withdrawal', 'Mini Statement'],
  },
];

export const BRANCH_LOCATORS: PreLoginLocator[] = [
  {
    id: 'br_1',
    name: 'Bandra Kurla Complex Branch',
    address: 'G Block, BKC, Mumbai 400051',
    distance: '0.5 km',
    hours: 'Mon–Sat, 10:00 AM – 4:00 PM',
    services: ['Account Opening', 'Cheque Services', 'Locker', 'Forex'],
  },
  {
    id: 'br_2',
    name: 'Fort Branch',
    address: 'D N Road, Fort, Mumbai 400001',
    distance: '8.2 km',
    hours: 'Mon–Sat, 10:00 AM – 4:00 PM',
    services: ['NRI Services', 'Loan Desk', 'Demat'],
  },
  {
    id: 'br_3',
    name: 'Thane West Branch',
    address: 'Ghodbunder Road, Thane 400607',
    distance: '12.4 km',
    hours: 'Mon–Sat, 10:00 AM – 4:00 PM',
    services: ['Retail Banking', 'Corporate Banking'],
  },
];

export const PROMOTIONAL_OFFERS: PreLoginOffer[] = [
  {
    id: 'off_1',
    title: 'Festive FD Bonanza',
    description: 'Earn up to 7.75% p.a. on 18-month FDs. Senior citizens get +0.50% extra.',
    validTill: '30 Sep 2026',
    cta: 'Open FD',
    badge: 'Limited',
  },
  {
    id: 'off_2',
    title: 'Zero Fee IMPS',
    description: 'Unlimited IMPS transfers at zero charge for salary account holders.',
    validTill: '31 Dec 2026',
    cta: 'Transfer Now',
  },
  {
    id: 'off_3',
    title: 'Credit Card Welcome Offer',
    description: 'Get ₹2,000 cashback on first bill payment above ₹5,000.',
    validTill: '15 Oct 2026',
    cta: 'Apply Now',
    badge: 'New',
  },
];

export const SECURITY_TIPS: PreLoginTip[] = [
  {
    id: 'sec_1',
    title: 'Never share credentials',
    body: 'Bank staff will never ask for MPIN, OTP, CVV, or full card number over call, SMS, or email.',
    icon: 'lock',
  },
  {
    id: 'sec_2',
    title: 'Verify beneficiary details',
    body: 'Always confirm account number and IFSC before adding a payee. Use BANL where available.',
    icon: 'shield',
  },
  {
    id: 'sec_3',
    title: 'Enable biometric login',
    body: 'Use Face ID or fingerprint for faster, secure access after MPIN is set.',
    icon: 'shield',
  },
  {
    id: 'sec_4',
    title: 'Report suspicious activity',
    body: 'Call 1800-202-APEX immediately if you notice unknown transactions or login alerts.',
    icon: 'phone',
  },
];

export const SAFETY_TIPS: PreLoginTip[] = [
  {
    id: 'safe_1',
    title: 'Use official app only',
    body: 'Download Bharat Mobile Banking only from the official website or verified app store listing.',
    icon: 'alert',
  },
  {
    id: 'safe_2',
    title: 'Avoid public Wi‑Fi',
    body: 'Do not access banking on unsecured networks. Use mobile data or trusted home Wi‑Fi.',
    icon: 'shield',
  },
  {
    id: 'safe_3',
    title: 'Log out on shared devices',
    body: 'Always log out and clear app data if you used a shared or borrowed phone.',
    icon: 'lock',
  },
  {
    id: 'safe_4',
    title: 'Keep OS updated',
    body: 'Install security patches for your phone OS to reduce malware and phishing risks.',
    icon: 'alert',
  },
];

export const CONTACT_CHANNELS = [
  { id: 'phone', label: 'Customer Care', value: '1800-202-APEX', sub: '24x7 toll-free' },
  { id: 'email', label: 'Email Support', value: 'care@bharatbank.co.in', sub: 'Response within 24 hours' },
  { id: 'branch', label: 'Nearest Branch', value: 'BKC, Mumbai', sub: 'Mon–Sat, 10 AM – 4 PM' },
  { id: 'whatsapp', label: 'WhatsApp Banking', value: '+91 98765 00000', sub: 'Balance & mini statement' },
];

export const MOBILE_BANKING_DEMO_STEPS = [
  { step: 1, title: 'Login', desc: 'Use demo Customer ID RB-123456 / password demo123' },
  { step: 2, title: 'OTP & Biometric', desc: 'Complete 2FA and biometric simulation' },
  { step: 3, title: 'Explore Dashboard', desc: 'View balances, pay bills, transfer funds' },
  { step: 4, title: 'Corporate Demo', desc: 'Try C001 (Maker) or C002 (Checker) for approvals' },
];

export const PRIVACY_POLICY_EXCERPT = `Bharat Co-operative Bank (Mumbai) Ltd — Privacy Policy (Excerpt)

We collect personal information necessary to provide banking services, including identity, contact, transaction, and device data.

Your data is used for account servicing, fraud prevention, regulatory compliance, and—with your consent—product communications.

We do not sell personal data. Sharing is limited to regulators, payment networks, and service providers under strict agreements.

You may update marketing preferences and request data access through the app or branch.

For the full policy, visit www.bharatbank.co.in/privacy or contact our Data Protection Officer.`;

export { RETAIL_TERMS_TEXT as TERMS_EXCERPT } from './retailRegistrationMock';

export const LOGIN_OFFER = {
  title: 'Welcome to Bharat Mobile Banking',
  subtitle: 'Festive season offer',
  description: 'Open an 18-month FD at 7.75% p.a. Exclusive for app users this month.',
  cta: 'Explore Offers',
  dismissKey: 'apex_login_offer_dismissed_v1',
};

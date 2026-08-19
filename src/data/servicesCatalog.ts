import { ServiceCategory } from '../types/services';

const tab = (t: import('../types/banking').RetailTab) => ({ kind: 'tab' as const, tab: t });
const profile = (screen: string) => ({ kind: 'profile' as const, screen });
const cheque = () => ({ kind: 'tab' as const, tab: 'cheque' as const });
const epassbook = () => ({ kind: 'tab' as const, tab: 'epassbook' as const });
const estatement = () => ({ kind: 'tab' as const, tab: 'estatement' as const });
const nach = () => ({ kind: 'tab' as const, tab: 'nach' as const });
const nominee = () => ({ kind: 'tab' as const, tab: 'nominee' as const });
const taxPayment = () => ({ kind: 'bill' as const, screen: 'tax-payment' });
const scheduled = () => ({ kind: 'tab' as const, tab: 'scheduled' as const });
const requestMoney = () => ({ kind: 'tab' as const, tab: 'request-money' as const });
const openAccount = () => ({ kind: 'tab' as const, tab: 'open-account' as const });
const cardless = () => ({ kind: 'tab' as const, tab: 'cardless' as const });
const myActivity = () => ({ kind: 'profile' as const, screen: 'my-activity' });
const txnLimits = () => ({ kind: 'profile' as const, screen: 'transaction-limits' });
const atmLocator = () => ({ kind: 'locator' as const, locatorType: 'atm' as const });
const branchLocator = () => ({ kind: 'locator' as const, locatorType: 'branch' as const });
const govtSavings = () => ({ kind: 'tab' as const, tab: 'govt-savings' as const });
const form15g = () => ({ kind: 'tab' as const, tab: 'form-15g' as const });
const remittance = () => ({ kind: 'tab' as const, tab: 'remittance' as const });
const forexCard = () => ({ kind: 'tab' as const, tab: 'forex-card' as const });
const branchAppointment = () => ({ kind: 'tab' as const, tab: 'branch-appointment' as const });
const rewards = () => ({ kind: 'tab' as const, tab: 'rewards' as const });
const locker = () => ({ kind: 'tab' as const, tab: 'locker' as const });
const cdmLocator = () => ({ kind: 'locator' as const, locatorType: 'cdm' as const });
const loanClosureCert = () => ({ kind: 'tab' as const, tab: 'loan-closure-cert' as const });
const bonds = () => ({ kind: 'tab' as const, tab: 'bonds' as const });
const demat = () => ({ kind: 'tab' as const, tab: 'demat' as const });
const feedback = () => ({ kind: 'tab' as const, tab: 'feedback' as const });

export const SERVICES_CATALOG: ServiceCategory[] = [
  {
    id: 'account-banking',
    title: 'ACCOUNT & BANKING',
    services: [
      { id: 'acc-details', name: 'Account Details', description: 'View your account information and balances.', icon: 'Wallet', keywords: ['account', 'balance', 'details'], route: tab('accounts') },
      { id: 'open-account', name: 'Open New Account', description: 'Explore savings and current account options.', icon: 'PlusCircle', keywords: ['open', 'new account'], badge: 'Available', route: openAccount() },
      { id: 'linked-accounts', name: 'Manage Linked Accounts', description: 'View and manage all linked accounts.', icon: 'Link', keywords: ['linked', 'accounts'], route: profile('linked-accounts') },
      { id: 'set-primary', name: 'Set Primary Account', description: 'Choose your default account for eligible payments and transfers.', icon: 'Star', keywords: ['primary', 'default account'], route: profile('set-primary') },
      { id: 'default-debit', name: 'Default Debit Account', description: 'Set the default account for debits and bill payments.', icon: 'CreditCard', keywords: ['debit', 'default'], route: profile('default-debit') },
      { id: 'account-nickname', name: 'Account Nickname', description: 'Personalize your account names.', icon: 'Pencil', keywords: ['nickname', 'rename'], route: profile('linked-accounts') },
      { id: 'hide-account', name: 'Hide / Show Account', description: 'Control account visibility on your dashboard.', icon: 'EyeOff', keywords: ['hide', 'show', 'visibility'], route: profile('hide-account') },
      { id: 'update-kyc', name: 'Update KYC', description: 'Review or update your KYC information.', icon: 'ShieldCheck', keywords: ['kyc', 'verification'], route: profile('kyc-details') },
      { id: 'update-contact', name: 'Update Contact Details', description: 'Change mobile number or email address.', icon: 'Phone', keywords: ['contact', 'mobile', 'email'], route: profile('contact-details') },
      { id: 'update-address', name: 'Update Address', description: 'Update residential or mailing address.', icon: 'MapPin', keywords: ['address', 'mailing'], route: profile('edit-address') },
      { id: 'update-nominee', name: 'Update Nominee', description: 'View, add, or amend registered nominees.', icon: 'Users', keywords: ['nominee'], route: nominee() },
      { id: 'interest-cert-acct', name: 'Interest Certificate', description: 'Download interest certificates for your accounts.', icon: 'FileText', keywords: ['interest', 'certificate'], route: profile('documents') },
      { id: 'account-upgrade', name: 'Account Upgrade', description: 'Explore premium banking tiers and benefits.', icon: 'TrendingUp', keywords: ['upgrade', 'premium'], badge: 'New', route: profile('account-management') },
    ],
  },
  {
    id: 'payments-transfers',
    title: 'PAYMENTS & TRANSFERS',
    services: [
      { id: 'fund-transfer', name: 'Fund Transfer', description: 'Transfer money securely to any account.', icon: 'SendHorizontal', keywords: ['transfer', 'neft', 'imps', 'fund'], route: tab('transfers') },
      { id: 'beneficiaries', name: 'Manage Beneficiaries', description: 'Add, edit, or remove payment beneficiaries.', icon: 'UserPlus', keywords: ['beneficiary', 'payee'], route: tab('beneficiaries') },
      { id: 'upi-qr', name: 'UPI / QR Payments', description: 'Scan and pay using UPI or QR codes.', icon: 'QrCode', keywords: ['upi', 'qr', 'scan'], route: { kind: 'scanner' } },
      { id: 'request-money', name: 'Request Money', description: 'Request payments from contacts via UPI.', icon: 'HandCoins', keywords: ['request', 'money', 'collect'], route: requestMoney() },
      { id: 'scheduled-transfer', name: 'Scheduled Transfers', description: 'Set up future-dated or recurring transfers.', icon: 'CalendarClock', keywords: ['scheduled', 'recurring', 'standing'], route: scheduled() },
      { id: 'bill-payments', name: 'Bill Payments', description: 'Pay electricity, mobile, broadband and more.', icon: 'Receipt', keywords: ['bill', 'bbps', 'utility'], route: tab('bills') },
      { id: 'mobile-recharge', name: 'Mobile Recharge', description: 'Recharge prepaid or pay postpaid bills.', icon: 'Smartphone', keywords: ['recharge', 'mobile', 'prepaid'], route: tab('bills') },
      { id: 'fastag-recharge', name: 'FASTag Recharge', description: 'Top up your FASTag wallet instantly.', icon: 'Car', keywords: ['fastag', 'toll'], route: tab('bills') },
      { id: 'autopay', name: 'AutoPay', description: 'Manage automatic bill payments.', icon: 'RefreshCw', keywords: ['autopay', 'auto pay'], route: tab('bills') },
      { id: 'nach-mandates', name: 'NACH Mandates', description: 'View and cancel registered e-mandates.', icon: 'FileSignature', keywords: ['nach', 'mandate', 'autopay'], route: nach() },
      { id: 'payment-history', name: 'Payment History', description: 'View bill payment and transfer history.', icon: 'History', keywords: ['history', 'payments'], route: tab('bills') },
      { id: 'txn-receipts', name: 'Transaction Receipts', description: 'Download receipts for past transactions.', icon: 'Download', keywords: ['receipt', 'download'], route: tab('statements') },
      { id: 'epassbook', name: 'ePassbook', description: 'View passbook with running balance entries.', icon: 'BookOpen', keywords: ['passbook', 'epassbook'], route: epassbook() },
      { id: 'estatement', name: 'eStatement Request', description: 'Request, stop, and manage statement delivery.', icon: 'Mail', keywords: ['estatement', 'email statement'], route: estatement() },
    ],
  },
  {
    id: 'cards-atm',
    title: 'CARDS & ATM',
    services: [
      { id: 'debit-cards', name: 'Debit Cards', description: 'View cards, controls, limits and recent activity.', icon: 'CreditCard', keywords: ['debit', 'card'], badge: 'Active', route: tab('cards') },
      { id: 'credit-cards', name: 'Credit Cards', description: 'Manage credit cards, bills and rewards.', icon: 'CreditCard', keywords: ['credit', 'card'], route: tab('cards') },
      { id: 'card-management', name: 'Card Management', description: 'Freeze, block, or replace your cards.', icon: 'Settings', keywords: ['card', 'manage'], route: tab('cards') },
      { id: 'card-controls', name: 'Card Controls', description: 'Enable or disable online, contactless and ATM usage.', icon: 'Sliders', keywords: ['controls', 'online', 'contactless'], route: tab('cards') },
      { id: 'card-limits', name: 'Set Card Limits', description: 'Configure daily transaction limits.', icon: 'Gauge', keywords: ['limits', 'daily'], route: tab('cards') },
      { id: 'change-pin', name: 'Change PIN', description: 'Reset your debit or credit card PIN securely.', icon: 'KeyRound', keywords: ['pin', 'change'], route: tab('cards') },
      { id: 'block-card', name: 'Block / Unblock Card', description: 'Instantly block or unblock your card.', icon: 'Ban', keywords: ['block', 'unblock'], route: tab('cards') },
      { id: 'replace-card', name: 'Replace Card', description: 'Request a replacement for damaged or lost cards.', icon: 'RefreshCcw', keywords: ['replace', 'lost'], route: tab('cards') },
      { id: 'atm-locator', name: 'ATM Locator', description: 'Find nearby ATMs and cash withdrawal points.', icon: 'MapPinned', keywords: ['atm', 'locator', 'nearby'], route: atmLocator() },
      { id: 'branch-locator', name: 'Branch Locator', description: 'Locate branches and service centres.', icon: 'Building2', keywords: ['branch', 'locator'], route: branchLocator() },
      { id: 'cardless-cash', name: 'Cardless Cash Withdrawal', description: 'Withdraw cash without your physical card.', icon: 'Banknote', keywords: ['cardless', 'cash'], badge: 'New', route: cardless() },
    ],
  },
  {
    id: 'deposits-savings',
    title: 'DEPOSITS & SAVINGS',
    services: [
      { id: 'fixed-deposit', name: 'Fixed Deposit', description: 'Open or manage your fixed deposits.', icon: 'Landmark', keywords: ['fd', 'fixed deposit'], route: tab('deposits') },
      { id: 'recurring-deposit', name: 'Recurring Deposit', description: 'Start or manage recurring deposit plans.', icon: 'PiggyBank', keywords: ['rd', 'recurring'], route: tab('deposits') },
      { id: 'my-deposits', name: 'My Deposits', description: 'View all active FDs and RDs in one place.', icon: 'Layers', keywords: ['deposits', 'my'], badge: 'Active', route: tab('deposits') },
      { id: 'maturity-instructions', name: 'Maturity Instructions', description: 'Set what happens when your deposit matures.', icon: 'CalendarCheck', keywords: ['maturity', 'renew'], route: tab('deposits') },
      { id: 'premature-closure', name: 'Premature Closure', description: 'Close a deposit before maturity where eligible.', icon: 'XCircle', keywords: ['premature', 'close'], route: tab('deposits') },
      { id: 'deposit-certificate', name: 'Deposit Certificate', description: 'Download certificates for your deposits.', icon: 'FileBadge', keywords: ['certificate', 'deposit'], route: profile('documents') },
      { id: 'ppf-deposit', name: 'PPF', description: 'Contribute to your Public Provident Fund account.', icon: 'Shield', keywords: ['ppf', 'provident'], route: govtSavings() },
      { id: 'ssa', name: 'Sukanya Samriddhi Account', description: 'Manage SSA for girl child savings.', icon: 'Heart', keywords: ['ssa', 'sukanya'], route: govtSavings() },
      { id: 'nps-deposit', name: 'National Pension System', description: 'Contribute to your NPS Tier I or II account.', icon: 'Briefcase', keywords: ['nps', 'pension'], route: govtSavings() },
    ],
  },
  {
    id: 'loans',
    title: 'LOANS',
    services: [
      { id: 'personal-loan', name: 'Personal Loan', description: 'Apply for a personal loan with instant eligibility.', icon: 'User', keywords: ['personal', 'loan'], route: tab('loans') },
      { id: 'home-loan', name: 'Home Loan', description: 'Explore home loan options and apply online.', icon: 'Home', keywords: ['home', 'housing', 'loan'], route: tab('loans') },
      { id: 'vehicle-loan', name: 'Vehicle Loan', description: 'Finance your new or used vehicle purchase.', icon: 'Car', keywords: ['vehicle', 'car', 'loan'], route: tab('loans') },
      { id: 'education-loan', name: 'Education Loan', description: 'Fund higher education with flexible repayment.', icon: 'GraduationCap', keywords: ['education', 'study', 'loan'], route: tab('loans') },
      { id: 'loan-eligibility', name: 'Loan Eligibility', description: 'Check how much you can borrow instantly.', icon: 'Calculator', keywords: ['eligibility', 'check'], badge: 'Available', route: tab('loans') },
      { id: 'loan-calculator', name: 'Loan Calculator', description: 'Estimate EMIs for different loan amounts.', icon: 'Percent', keywords: ['calculator', 'emi'], route: tab('loans') },
      { id: 'my-loans', name: 'My Loans', description: 'View active loans, EMIs and outstanding balance.', icon: 'FileStack', keywords: ['my loans', 'active'], badge: 'Active', route: tab('loans') },
      { id: 'emi-payment', name: 'EMI Payment', description: 'Pay your upcoming loan EMI.', icon: 'IndianRupee', keywords: ['emi', 'pay'], badge: 'Due Soon', route: tab('loans') },
      { id: 'emi-schedule', name: 'EMI Schedule', description: 'View your complete repayment schedule.', icon: 'Calendar', keywords: ['schedule', 'emi'], route: tab('loans') },
      { id: 'loan-statement', name: 'Loan Statement', description: 'Download loan account statements.', icon: 'FileText', keywords: ['statement', 'loan'], route: tab('statements') },
      { id: 'loan-closure-cert', name: 'Loan Closure Certificate', description: 'Request closure certificate for closed loans.', icon: 'Award', keywords: ['closure', 'certificate'], route: loanClosureCert() },
    ],
  },
  {
    id: 'investments',
    title: 'INVESTMENTS',
    services: [
      { id: 'mutual-funds', name: 'Mutual Funds', description: 'Explore available mutual fund investment options.', icon: 'TrendingUp', keywords: ['mutual fund', 'mf'], route: tab('investments') },
      { id: 'my-portfolio', name: 'My Portfolio', description: 'View your investment holdings and performance.', icon: 'PieChart', keywords: ['portfolio', 'holdings'], badge: 'Active', route: tab('investments') },
      { id: 'start-sip', name: 'Start SIP', description: 'Begin a systematic investment plan.', icon: 'Repeat', keywords: ['sip', 'systematic'], route: tab('investments') },
      { id: 'inv-transactions', name: 'Investment Transactions', description: 'View buy, sell and SIP transaction history.', icon: 'ArrowLeftRight', keywords: ['transactions', 'investment'], route: tab('investments') },
      { id: 'redeem', name: 'Redeem Investment', description: 'Redeem mutual fund units where eligible.', icon: 'ArrowDownToLine', keywords: ['redeem', 'sell'], route: tab('investments') },
      { id: 'bonds', name: 'Bonds', description: 'Explore government and corporate bond options.', icon: 'Landmark', keywords: ['bonds', 'gsec'], route: bonds() },
      { id: 'govt-securities', name: 'Government Securities', description: 'View sovereign debt investment options.', icon: 'Building', keywords: ['government', 'securities'], route: bonds() },
      { id: 'tax-saving-inv', name: 'Tax-Saving Investments', description: 'Explore ELSS and other tax-saving options.', icon: 'BadgePercent', keywords: ['tax saving', 'elss', '80c'], route: tab('investments') },
    ],
  },
  {
    id: 'insurance',
    title: 'INSURANCE',
    services: [
      { id: 'health-insurance', name: 'Health Insurance', description: 'Browse health insurance plans for you and family.', icon: 'HeartPulse', keywords: ['health', 'insurance'], route: tab('insurance') },
      { id: 'life-insurance', name: 'Life Insurance', description: 'Explore term and life cover options.', icon: 'Shield', keywords: ['life', 'insurance'], route: tab('insurance') },
      { id: 'motor-insurance', name: 'Motor Insurance', description: 'Insure your car or two-wheeler.', icon: 'Car', keywords: ['motor', 'car', 'insurance'], route: tab('insurance') },
      { id: 'travel-insurance', name: 'Travel Insurance', description: 'Get coverage for domestic and international travel.', icon: 'Plane', keywords: ['travel', 'insurance'], route: tab('insurance') },
      { id: 'my-policies', name: 'My Policies', description: 'View all active insurance policies.', icon: 'FileCheck', keywords: ['policies', 'my'], badge: 'Active', route: tab('insurance') },
      { id: 'pay-premium', name: 'Pay Premium', description: 'Pay upcoming insurance premiums.', icon: 'IndianRupee', keywords: ['premium', 'pay'], route: tab('insurance') },
      { id: 'renew-policy', name: 'Renew Policy', description: 'Review and renew eligible insurance policies.', icon: 'RefreshCw', keywords: ['renew', 'policy'], badge: 'Due Soon', route: tab('insurance') },
      { id: 'raise-claim', name: 'Raise Claim', description: 'File a new insurance claim.', icon: 'FileWarning', keywords: ['claim', 'raise'], route: tab('insurance') },
      { id: 'track-claim', name: 'Track Claim', description: 'Check status of submitted claims.', icon: 'Search', keywords: ['track', 'claim'], route: tab('insurance') },
      { id: 'policy-documents', name: 'Policy Documents', description: 'Download policy documents and certificates.', icon: 'FileText', keywords: ['policy', 'documents'], route: profile('documents') },
    ],
  },
  {
    id: 'government-tax',
    title: 'GOVERNMENT & TAX',
    services: [
      { id: 'ppf-govt', name: 'Public Provident Fund (PPF)', description: 'Manage your PPF account and contributions.', icon: 'Landmark', keywords: ['ppf', 'provident'], route: govtSavings() },
      { id: 'ssa-govt', name: 'Sukanya Samriddhi Account (SSA)', description: 'Government savings scheme for girl child.', icon: 'Heart', keywords: ['ssa', 'sukanya'], route: govtSavings() },
      { id: 'nps-govt', name: 'National Pension System (NPS)', description: 'Pension planning with tax benefits.', icon: 'Briefcase', keywords: ['nps', 'pension'], route: govtSavings() },
      { id: 'form-15g', name: 'Form 15G / 15H Submission', description: 'Submit eligible tax declaration forms.', icon: 'FileInput', keywords: ['15g', '15h', 'form', 'tds'], route: form15g() },
      { id: 'tds-certificate', name: 'TDS Certificate', description: 'Download TDS certificates for tax filing.', icon: 'FileText', keywords: ['tds', 'certificate', 'tax'], route: profile('documents') },
      { id: 'interest-cert-govt', name: 'Interest Certificate', description: 'Download interest earned certificates.', icon: 'FileSpreadsheet', keywords: ['interest', 'certificate'], route: profile('documents') },
      { id: 'tax-services', name: 'Tax Payment Online', description: 'Pay income tax, GST and other government dues.', icon: 'Calculator', keywords: ['tax', 'itr', 'gst'], route: taxPayment() },
      { id: 'govt-schemes', name: 'Government Scheme Information', description: 'Learn about supported government schemes.', icon: 'Info', keywords: ['government', 'scheme'], route: govtSavings() },
    ],
  },
  {
    id: 'forex-international',
    title: 'FOREX, CARDS & INTERNATIONAL',
    services: [
      { id: 'forex-card', name: 'Forex Card', description: 'Apply for a multi-currency travel forex card.', icon: 'Globe', keywords: ['forex', 'card', 'travel'], route: forexCard() },
      { id: 'forex-mgmt', name: 'Forex Card Management', description: 'Manage balances and controls on your forex card.', icon: 'Settings', keywords: ['forex', 'manage'], route: forexCard() },
      { id: 'multi-forex', name: 'Multi-Currency Forex Card', description: 'Load and manage multiple foreign currencies.', icon: 'Coins', keywords: ['multi currency', 'forex'], badge: 'New', route: forexCard() },
      { id: 'intl-remittance', name: 'International Remittance', description: 'Send eligible international transfers through supported channels.', icon: 'Plane', keywords: ['remittance', 'international', 'wire'], route: remittance() },
      { id: 'lrs', name: 'LRS Remittance', description: 'Liberalised Remittance Scheme transfers.', icon: 'ArrowUpRight', keywords: ['lrs', 'remittance'], route: remittance() },
      { id: 'fx-exchange', name: 'Foreign Currency Exchange', description: 'Buy or sell foreign currency at competitive rates.', icon: 'RefreshCw', keywords: ['exchange', 'currency', 'forex'], route: forexCard() },
      { id: 'intl-payment-settings', name: 'International Payment Settings', description: 'Configure international transaction preferences.', icon: 'Globe2', keywords: ['international', 'settings'], route: tab('cards') },
      { id: 'travel-card', name: 'Travel Card', description: 'Prepaid card for international travel expenses.', icon: 'Luggage', keywords: ['travel', 'card'], route: forexCard() },
    ],
  },
  {
    id: 'cheque-cash',
    title: 'CHEQUE & CASH',
    services: [
      { id: 'cheque-book', name: 'Request Cheque Book', description: 'Request a new cheque book delivered to your address.', icon: 'BookOpen', keywords: ['cheque', 'book', 'request'], route: cheque() },
      { id: 'stop-cheque', name: 'Stop Cheque Payment', description: 'Revoke and hold specific cheque payments.', icon: 'Ban', keywords: ['stop', 'cheque'], route: cheque() },
      { id: 'cheque-status', name: 'Cheque Status', description: 'Track status of issued cheques.', icon: 'Search', keywords: ['cheque', 'status', 'track'], route: cheque() },
      { id: 'positive-pay', name: 'Positive Pay', description: 'Register high-value cheques for added security.', icon: 'ShieldCheck', keywords: ['positive pay', 'cheque'], badge: 'New', route: cheque() },
      { id: 'cash-deposit', name: 'Cash Deposit', description: 'Find cash deposit options at branches and CDMs.', icon: 'ArrowDownToLine', keywords: ['cash', 'deposit'], route: cdmLocator() },
      { id: 'cash-withdrawal', name: 'Cash Withdrawal', description: 'Locate ATMs and withdrawal services.', icon: 'Banknote', keywords: ['cash', 'withdrawal', 'atm'], route: atmLocator() },
      { id: 'atm-locator-cash', name: 'ATM Locator', description: 'Find nearby ATMs for cash withdrawal.', icon: 'MapPinned', keywords: ['atm', 'locator'], route: atmLocator() },
      { id: 'cdm-locator', name: 'Cash Deposit Machine Locator', description: 'Find cash deposit machines near you.', icon: 'MapPin', keywords: ['cdm', 'deposit machine'], route: cdmLocator() },
      { id: 'branch-locator-cash', name: 'Branch Locator', description: 'Find branches for cash and cheque services.', icon: 'Building2', keywords: ['branch', 'locator'], route: branchLocator() },
    ],
  },
  {
    id: 'value-added',
    title: 'VALUE-ADDED SERVICES',
    services: [
      { id: 'locker', name: 'Safe Deposit Locker', description: 'Check locker availability and apply.', icon: 'Lock', keywords: ['locker', 'safe deposit'], route: locker() },
      { id: 'locker-appointment', name: 'Locker Appointment', description: 'Book an appointment to access your locker.', icon: 'Calendar', keywords: ['locker', 'appointment'], route: locker() },
      { id: 'demat', name: 'Demat Account', description: 'Open or link a demat account for securities.', icon: 'BarChart3', keywords: ['demat', 'securities'], route: demat() },
      { id: 'rewards', name: 'Rewards', description: 'View and redeem your reward points.', icon: 'Gift', keywords: ['rewards', 'points'], badge: 'Available', route: rewards() },
      { id: 'offers', name: 'Offers', description: 'Explore exclusive banking offers and deals.', icon: 'Tag', keywords: ['offers', 'deals'], route: rewards() },
      { id: 'calculators', name: 'Financial Calculators', description: 'EMI, FD, and savings calculators.', icon: 'Calculator', keywords: ['calculator', 'emi', 'fd'], route: tab('loans') },
      { id: 'document-center', name: 'Document Center', description: 'Access statements, certificates and policies.', icon: 'FolderOpen', keywords: ['documents', 'statements'], route: profile('documents') },
      { id: 'travel-services', name: 'Travel Services', description: 'Forex, travel insurance and related services.', icon: 'Plane', keywords: ['travel'], route: tab('insurance') },
    ],
  },
  {
    id: 'support-requests',
    title: 'SUPPORT & REQUESTS',
    services: [
      { id: 'help-support', name: 'Help & Support', description: 'Get help with your banking queries.', icon: 'Headphones', keywords: ['help', 'support'], route: profile('help-support') },
      { id: 'my-activity', name: 'My Activity', description: 'View login, transfer and profile activity.', icon: 'Activity', keywords: ['activity', 'audit', 'history'], route: myActivity() },
      { id: 'txn-limits', name: 'Transaction Limits', description: 'Update channel-wise daily limits.', icon: 'Gauge', keywords: ['limits', 'transaction'], route: txnLimits() },
      { id: 'faqs', name: 'FAQs', description: 'Find answers to frequently asked questions.', icon: 'HelpCircle', keywords: ['faq', 'questions'], route: profile('help-support') },
      { id: 'contact-bank', name: 'Contact Bank', description: 'Call or message customer care.', icon: 'Phone', keywords: ['contact', 'call'], route: profile('help-support') },
      { id: 'chat-support', name: 'Chat Support', description: 'Chat with our support team.', icon: 'MessageCircle', keywords: ['chat', 'support'], route: profile('help-support') },
      { id: 'service-request', name: 'Raise Service Request', description: 'Submit a new service request.', icon: 'FilePlus', keywords: ['service request', 'raise'], route: profile('service-requests') },
      { id: 'track-request', name: 'Track Service Request', description: 'Check status of your service requests.', icon: 'ListChecks', keywords: ['track', 'request'], route: profile('service-requests') },
      { id: 'complaint', name: 'Complaint / Grievance', description: 'Register a complaint or grievance.', icon: 'AlertCircle', keywords: ['complaint', 'grievance'], route: profile('help-support') },
      { id: 'branch-appointment', name: 'Branch Appointment', description: 'Schedule a visit to your branch.', icon: 'CalendarCheck', keywords: ['appointment', 'branch'], route: branchAppointment() },
      { id: 'feedback', name: 'Feedback', description: 'Share your feedback about our services.', icon: 'MessageSquare', keywords: ['feedback'], route: feedback() },
      { id: 'emergency-block', name: 'Emergency Card Block', description: 'Instantly block your card in case of loss or fraud.', icon: 'AlertOctagon', keywords: ['emergency', 'block', 'card', 'fraud'], route: tab('cards') },
    ],
  },
];

export const ALL_SERVICES = SERVICES_CATALOG.flatMap((c) =>
  c.services.map((s) => ({ ...s, categoryId: c.id, categoryTitle: c.title }))
);

export const getServiceById = (id: string) => ALL_SERVICES.find((s) => s.id === id);

export const DEFAULT_RECENT_SERVICE_IDS = ['fund-transfer', 'bill-payments', 'fixed-deposit'];
export const DEFAULT_FAVORITE_SERVICE_IDS = ['fund-transfer', 'bill-payments', 'fixed-deposit', 'my-portfolio'];

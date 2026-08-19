import type {
  CorporateScheduledPaymentDetail,
  ScheduleFrequency,
  ScheduledPaymentDraft,
  ScheduledPaymentListItem,
  ScheduledPaymentsHomeSummary,
  ScheduledPaymentTab,
} from '../types/corporateScheduledPayments';
import { VENDOR_PAYMENT_BENEFICIARIES } from './corporateVendorBeneficiarySelectionMock';
import { PAYMENT_TYPE_ACCOUNTS } from './corporatePaymentTypeSelectionMock';
import { formatPaymentDisplayDate } from './corporateVendorPaymentDetailsMock';

const DRAFT_KEY = 'corporateScheduledPaymentDraft';
const CANCELLED_KEY = 'corporateCancelledScheduledPayments';
const DYNAMIC_KEY = 'corporateDynamicScheduledPayments';
const PENDING_APPROVAL_KEY = 'corporateScheduledPendingApprovalIds';

export const SCHEDULED_PAYMENT_DRAFT_KEY = DRAFT_KEY;

const FREQUENCY_LABELS: Record<ScheduleFrequency, string> = {
  one_time: 'One Time',
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJson(key: string, value: unknown) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

const BASE_DETAILS: Record<string, CorporateScheduledPaymentDetail> = {
  sch_01: {
    id: 'sch_01',
    scheduleRef: 'SCH-20260825-001',
    title: 'ABC Suppliers Ltd.',
    status: 'upcoming',
    paymentType: 'Vendor Payment',
    amount: 250000,
    fee: 25,
    totalDebit: 250025,
    currency: '₹',
    beneficiary: { id: 'ben_corp_abc', name: 'ABC Suppliers Ltd.', maskedAccount: '•••• 7821', bankName: 'HDFC Bank' },
    sourceAccount: {
      id: 'acc_corp_op_01',
      name: 'Operating Account',
      maskedNumber: '•••• 4582',
      companyName: 'Acme Technologies Pvt. Ltd.',
      availableBalance: 1245000,
    },
    scheduledDate: '25 Aug 2026',
    executionTime: '10:00 AM',
    frequency: 'Monthly',
    frequencyKey: 'monthly',
    scheduleLabel: 'Monthly • 25th',
    paymentMethod: 'NEFT',
    purpose: 'Vendor Settlement',
    reference: 'August Vendor Invoice',
    channel: 'Corporate Mobile Banking',
    createdBy: 'Rahul Sharma',
    createdRole: 'Finance Maker',
    createdAt: '10 Aug 2026 • 02:15 PM',
    approvedBy: 'Amit Verma',
    approvedRole: 'Finance Checker',
    approvedAt: '11 Aug 2026 • 09:20 AM',
    nextExecution: '25 Aug 2026 • 10:00 AM',
    startDate: '25 Aug 2026',
    endDate: '25 Dec 2026',
    monthlyDay: 25,
    occurrences: 5,
    estimatedTotal: 1250000,
    canEdit: true,
    canCancel: true,
  },
  sch_02: {
    id: 'sch_02',
    scheduleRef: 'SCH-20260828-002',
    approvalId: 'APR-20260818-SCH01',
    title: 'Office Rent',
    status: 'pending_approval',
    paymentType: 'Vendor Payment',
    amount: 150000,
    fee: 25,
    totalDebit: 150025,
    currency: '₹',
    beneficiary: { name: 'Office Rent — BKC', maskedAccount: '•••• 3344', bankName: 'ICICI Bank' },
    sourceAccount: {
      id: 'acc_corp_op_01',
      name: 'Operating Account',
      maskedNumber: '•••• 4582',
      companyName: 'Acme Technologies Pvt. Ltd.',
      availableBalance: 1245000,
    },
    scheduledDate: '28 Aug 2026',
    executionTime: '09:00 AM',
    frequency: 'Monthly',
    frequencyKey: 'monthly',
    scheduleLabel: 'Monthly • 28th',
    paymentMethod: 'NEFT',
    purpose: 'Office Rent',
    reference: 'RENT-BKC-AUG',
    invoiceNumber: 'INV-RENT-0826',
    channel: 'Corporate Mobile Banking',
    createdBy: 'Rahul Sharma',
    createdRole: 'Finance Maker',
    createdAt: '12 Aug 2026 • 10:40 AM',
    nextExecution: '28 Aug 2026 • 09:00 AM',
    startDate: '28 Aug 2026',
    endDate: '25 Dec 2026',
    monthlyDay: 28,
    occurrences: 5,
    estimatedTotal: 750000,
    canEdit: false,
    canCancel: false,
  },
  sch_03: {
    id: 'sch_03',
    scheduleRef: 'SCH-20260830-003',
    approvalId: 'APR-20260818-SCH02',
    title: 'Vendor Settlement',
    status: 'pending_approval',
    paymentType: 'Vendor Payment',
    amount: 225000,
    fee: 25,
    totalDebit: 225025,
    currency: '₹',
    beneficiary: { id: 'ben_corp_abc', name: 'ABC Suppliers Ltd.', maskedAccount: '•••• 7821', bankName: 'HDFC Bank' },
    sourceAccount: {
      id: 'acc_corp_op_01',
      name: 'Operating Account',
      maskedNumber: '•••• 4582',
      companyName: 'Acme Technologies Pvt. Ltd.',
      availableBalance: 1245000,
    },
    scheduledDate: '30 Aug 2026',
    executionTime: '10:30 AM',
    frequency: 'One Time',
    frequencyKey: 'one_time',
    scheduleLabel: 'One Time',
    paymentMethod: 'NEFT',
    purpose: 'Vendor Settlement',
    reference: 'March Supplier Settlement',
    channel: 'Corporate Mobile Banking',
    createdBy: 'Rahul Sharma',
    createdRole: 'Finance Maker',
    createdAt: '15 Aug 2026 • 04:20 PM',
    nextExecution: '30 Aug 2026 • 10:30 AM',
    canEdit: false,
    canCancel: false,
  },
  sch_04: {
    id: 'sch_04',
    scheduleRef: 'SCH-20260725-004',
    linkedPaymentId: 'PAY-2026-0725-012',
    title: 'Payroll',
    status: 'completed',
    paymentType: 'Payroll Payment',
    amount: 845000,
    fee: 50,
    totalDebit: 845050,
    currency: '₹',
    beneficiary: { name: 'Salary Batch', maskedAccount: '•••• 9102', bankName: 'Bharat Co-operative Bank' },
    sourceAccount: {
      id: 'acc_corp_pay_02',
      name: 'Payroll Account',
      maskedNumber: '•••• 9102',
      companyName: 'Acme Technologies Pvt. Ltd.',
    },
    scheduledDate: '25 Jul 2026',
    executionTime: '09:00 AM',
    frequency: 'Monthly',
    frequencyKey: 'monthly',
    scheduleLabel: 'Monthly • 25th',
    paymentMethod: 'NEFT',
    purpose: 'Monthly Payroll',
    reference: 'PAYROLL-JUL-2026',
    channel: 'Corporate Mobile Banking',
    createdBy: 'Rahul Sharma',
    createdRole: 'Finance Maker',
    createdAt: '10 Jul 2026 • 02:15 PM',
    approvedBy: 'Amit Verma',
    approvedRole: 'Finance Checker',
    lastExecutedAt: '25 Jul 2026 • 09:02 AM',
    canEdit: false,
    canCancel: false,
  },
};

function getAllDetails(): Record<string, CorporateScheduledPaymentDetail> {
  const dynamic = loadJson<Record<string, CorporateScheduledPaymentDetail>>(DYNAMIC_KEY, {});
  return { ...BASE_DETAILS, ...dynamic };
}

function loadCancelledIds(): string[] {
  return loadJson<string[]>(CANCELLED_KEY, []);
}

export function cancelScheduledPayment(id: string, _reason?: string): void {
  const cancelled = loadCancelledIds();
  if (!cancelled.includes(id)) saveJson(CANCELLED_KEY, [...cancelled, id]);
}

function applyCancelledState(item: CorporateScheduledPaymentDetail): CorporateScheduledPaymentDetail {
  if (loadCancelledIds().includes(item.id)) {
    return { ...item, status: 'cancelled', canEdit: false, canCancel: false };
  }
  return item;
}

export function getScheduledPaymentDetail(id: string): CorporateScheduledPaymentDetail | null {
  const base = getAllDetails()[id];
  if (!base) return null;
  return applyCancelledState({ ...base });
}

export function getScheduledPaymentsList(tab: ScheduledPaymentTab): ScheduledPaymentListItem[] {
  const all: ScheduledPaymentListItem[] = Object.values(getAllDetails()).map((d) => {
    const detail = applyCancelledState(d);
    return {
      id: detail.id,
      scheduleRef: detail.scheduleRef,
      title: detail.title,
      beneficiaryName: detail.beneficiary.name,
      amount: detail.amount,
      currency: detail.currency,
      scheduledDate: detail.scheduledDate,
      executionTime: detail.executionTime,
      frequency: detail.frequency,
      frequencyKey: detail.frequencyKey,
      status: detail.status,
      paymentType: detail.paymentType,
      approvalId: detail.approvalId,
      scheduleLabel: detail.scheduleLabel,
    };
  });

  switch (tab) {
    case 'upcoming':
      return all.filter((i) => i.status === 'upcoming');
    case 'pending_approval':
      return all.filter((i) => i.status === 'pending_approval');
    case 'completed':
      return all.filter((i) => i.status === 'completed');
    case 'cancelled':
      return all.filter((i) => i.status === 'cancelled');
    default:
      return all;
  }
}

export function getScheduledPaymentsHomeSummary(): ScheduledPaymentsHomeSummary {
  const upcoming = getScheduledPaymentsList('upcoming');
  const pending = getScheduledPaymentsList('pending_approval');
  return {
    upcomingTotal: upcoming.reduce((s, i) => s + i.amount, 0),
    pendingApprovalCount: pending.length,
    currency: '₹',
  };
}

export async function fetchScheduledPaymentsList(tab: ScheduledPaymentTab): Promise<ScheduledPaymentListItem[]> {
  await new Promise((r) => setTimeout(r, 350));
  return getScheduledPaymentsList(tab);
}

export async function fetchScheduledPaymentDetail(id: string): Promise<CorporateScheduledPaymentDetail | null> {
  await new Promise((r) => setTimeout(r, 350));
  return getScheduledPaymentDetail(id);
}

export async function fetchScheduledPaymentsHomeSummary(): Promise<ScheduledPaymentsHomeSummary> {
  await new Promise((r) => setTimeout(r, 200));
  return getScheduledPaymentsHomeSummary();
}

export function loadScheduledPaymentDraft(): ScheduledPaymentDraft | null {
  return loadJson<ScheduledPaymentDraft | null>(DRAFT_KEY, null);
}

export function saveScheduledPaymentDraft(draft: ScheduledPaymentDraft): void {
  saveJson(DRAFT_KEY, draft);
}

export function clearScheduledPaymentDraft(): void {
  sessionStorage.removeItem(DRAFT_KEY);
}

export function createDefaultScheduledDraft(): ScheduledPaymentDraft {
  return {
    paymentType: 'vendor',
    beneficiaryId: '',
    beneficiaryName: '',
    beneficiaryMaskedAccount: '',
    beneficiaryBank: '',
    accountId: 'acc_corp_op_01',
    amount: 0,
    reference: '',
    remarks: '',
    frequency: 'monthly',
    paymentDate: '2026-08-25',
    executionTime: '10:00',
    startDate: '2026-08-25',
    endDate: '2026-12-25',
    noEndDate: false,
    weeklyDay: 'Monday',
    monthlyDay: 25,
  };
}

export function getScheduledBeneficiaries() {
  return VENDOR_PAYMENT_BENEFICIARIES.filter((b) => b.status === 'active' || !b.status);
}

export function getScheduledSourceAccounts() {
  return PAYMENT_TYPE_ACCOUNTS.filter((a) => a.id !== 'acc_corp_tax_03');
}

export function formatScheduleLabel(draft: ScheduledPaymentDraft): string {
  const freq = FREQUENCY_LABELS[draft.frequency];
  if (draft.frequency === 'weekly') return `${freq} • ${draft.weeklyDay}`;
  if (draft.frequency === 'monthly' || draft.frequency === 'quarterly') {
    return `${freq} • ${draft.monthlyDay}${getOrdinal(draft.monthlyDay)}`;
  }
  return freq;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function estimateOccurrences(draft: ScheduledPaymentDraft): number | null {
  if (draft.noEndDate || draft.frequency === 'one_time') return draft.frequency === 'one_time' ? 1 : null;
  const start = new Date(`${draft.startDate}T12:00:00`);
  const end = new Date(`${draft.endDate}T12:00:00`);
  if (end <= start) return 1;
  const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  switch (draft.frequency) {
    case 'daily':
      return Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (86400000 * 7)) * 7);
    case 'weekly':
      return Math.max(1, Math.ceil(months * 4.33));
    case 'monthly':
      return Math.max(1, months);
    case 'quarterly':
      return Math.max(1, Math.ceil(months / 3));
    default:
      return 1;
  }
}

export function draftToDetailPreview(draft: ScheduledPaymentDraft): Partial<CorporateScheduledPaymentDetail> {
  const account = PAYMENT_TYPE_ACCOUNTS.find((a) => a.id === draft.accountId);
  const occurrences = estimateOccurrences(draft);
  const fee = 25;
  return {
    paymentType: draft.paymentType === 'vendor' ? 'Vendor Payment' : draft.paymentType === 'bank_transfer' ? 'Bank Transfer' : 'Internal Transfer',
    amount: draft.amount,
    fee,
    totalDebit: draft.amount + fee,
    currency: '₹',
    beneficiary: {
      id: draft.beneficiaryId,
      name: draft.beneficiaryName,
      maskedAccount: draft.beneficiaryMaskedAccount,
      bankName: draft.beneficiaryBank,
    },
    sourceAccount: {
      id: draft.accountId,
      name: account?.name ?? 'Operating Account',
      maskedNumber: account?.maskedNumber ?? '•••• 4582',
      companyName: 'Acme Technologies Pvt. Ltd.',
      availableBalance: account?.availableBalance,
    },
    scheduledDate: formatPaymentDisplayDate(draft.paymentDate),
    executionTime: formatTime12h(draft.executionTime),
    frequency: FREQUENCY_LABELS[draft.frequency],
    frequencyKey: draft.frequency,
    scheduleLabel: formatScheduleLabel(draft),
    reference: draft.reference,
    remarks: draft.remarks,
    paymentMethod: 'NEFT',
    purpose: 'Vendor Settlement',
    startDate: formatPaymentDisplayDate(draft.startDate),
    endDate: draft.noEndDate ? undefined : formatPaymentDisplayDate(draft.endDate),
    occurrences: occurrences ?? undefined,
    estimatedTotal: occurrences ? draft.amount * occurrences : undefined,
    nextExecution: `${formatPaymentDisplayDate(draft.paymentDate)} • ${formatTime12h(draft.executionTime)}`,
  };
}

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function submitScheduledPaymentForApproval(draft: ScheduledPaymentDraft): {
  scheduleId: string;
  approvalId: string;
} {
  const id = `sch_${Date.now().toString(36)}`;
  const approvalId = `APR-20260818-SCH${String(Math.floor(Math.random() * 900) + 100)}`;
  const preview = draftToDetailPreview(draft);
  const detail: CorporateScheduledPaymentDetail = {
    id,
    scheduleRef: `SCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(Math.floor(Math.random() * 900) + 100)}`,
    approvalId,
    title: draft.beneficiaryName,
    status: 'pending_approval',
    paymentType: preview.paymentType ?? 'Vendor Payment',
    amount: draft.amount,
    fee: preview.fee ?? 25,
    totalDebit: preview.totalDebit ?? draft.amount + 25,
    currency: '₹',
    beneficiary: preview.beneficiary!,
    sourceAccount: preview.sourceAccount!,
    scheduledDate: preview.scheduledDate!,
    executionTime: preview.executionTime!,
    frequency: preview.frequency!,
    frequencyKey: draft.frequency,
    scheduleLabel: preview.scheduleLabel!,
    paymentMethod: 'NEFT',
    purpose: 'Vendor Settlement',
    reference: draft.reference,
    remarks: draft.remarks,
    channel: 'Corporate Mobile Banking',
    createdBy: 'Rahul Sharma',
    createdRole: 'Finance Maker',
    createdAt: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    nextExecution: preview.nextExecution,
    startDate: preview.startDate,
    endDate: preview.endDate,
    monthlyDay: draft.monthlyDay,
    weeklyDay: draft.weeklyDay,
    occurrences: preview.occurrences,
    estimatedTotal: preview.estimatedTotal,
    canEdit: false,
    canCancel: false,
  };

  const dynamic = loadJson<Record<string, CorporateScheduledPaymentDetail>>(DYNAMIC_KEY, {});
  dynamic[id] = detail;
  saveJson(DYNAMIC_KEY, dynamic);

  const pendingIds = loadJson<string[]>(PENDING_APPROVAL_KEY, []);
  saveJson(PENDING_APPROVAL_KEY, [...pendingIds, id]);

  clearScheduledPaymentDraft();
  return { scheduleId: id, approvalId };
}

export function activateScheduledPayment(scheduleId: string): void {
  const all = getAllDetails();
  const item = all[scheduleId];
  if (!item) return;
  const updated: CorporateScheduledPaymentDetail = {
    ...item,
    status: 'upcoming',
    approvedBy: 'Amit Verma',
    approvedRole: 'Finance Checker',
    approvedAt: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    canEdit: true,
    canCancel: true,
  };
  const dynamic = loadJson<Record<string, CorporateScheduledPaymentDetail>>(DYNAMIC_KEY, {});
  if (BASE_DETAILS[scheduleId]) {
    dynamic[scheduleId] = updated;
  } else {
    dynamic[scheduleId] = updated;
  }
  saveJson(DYNAMIC_KEY, dynamic);
}

export function getScheduleIdByApprovalId(approvalId: string): string | null {
  const match = Object.values(getAllDetails()).find((d) => d.approvalId === approvalId);
  return match?.id ?? null;
}

export function updateScheduledPaymentDraftEdit(scheduleId: string, draft: ScheduledPaymentDraft): void {
  const all = getAllDetails();
  const existing = all[scheduleId];
  if (!existing) return;
  const preview = draftToDetailPreview(draft);
  const updated: CorporateScheduledPaymentDetail = {
    ...existing,
    ...preview,
    title: draft.beneficiaryName,
    status: 'pending_approval',
    amount: draft.amount,
    reference: draft.reference,
    remarks: draft.remarks,
    canEdit: false,
    canCancel: false,
    approvedBy: undefined,
    approvedRole: undefined,
    approvedAt: undefined,
  } as CorporateScheduledPaymentDetail;
  const dynamic = loadJson<Record<string, CorporateScheduledPaymentDetail>>(DYNAMIC_KEY, {});
  dynamic[scheduleId] = updated;
  saveJson(DYNAMIC_KEY, dynamic);
}

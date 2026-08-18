export type BillCategory =
  | 'electricity'
  | 'water'
  | 'gas'
  | 'mobile'
  | 'broadband'
  | 'dth'
  | 'fastag'
  | 'insurance'
  | 'credit_card'
  | 'education'
  | 'municipal';

export type BillStatus = 'due' | 'overdue' | 'paid' | 'no_outstanding';

export type BillPaymentStatus = 'completed' | 'pending' | 'failed';

export interface BillIdentifierField {
  key: string;
  label: string;
  placeholder: string;
  required: boolean;
  type?: 'text' | 'tel' | 'select';
  options?: string[];
}

export interface BillProvider {
  id: string;
  name: string;
  category: BillCategory;
  serviceArea: string;
  identifierFields: BillIdentifierField[];
  allowsPartialPayment: boolean;
  processingInfo?: string;
  paymentMethod: string;
  iconName: string;
}

export interface FetchedBill {
  providerId: string;
  billerName: string;
  category: BillCategory;
  customerName: string;
  consumerNumber: string;
  maskedConsumerNumber: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  amount: number;
  status: BillStatus;
  lateFeeNote?: string;
  convenienceFee: number;
  allowsPartialPayment: boolean;
}

export interface BillPaymentRecord {
  id: string;
  txnId: string;
  referenceNumber: string;
  billerName: string;
  category: BillCategory;
  customerName: string;
  consumerNumberMasked: string;
  billNumber: string;
  amount: number;
  convenienceFee: number;
  totalPaid: number;
  paymentDate: string;
  debitAccountId: string;
  debitAccountMasked: string;
  debitAccountType: string;
  status: BillPaymentStatus;
  failureReason?: string;
  paymentMethod: string;
}

export interface UpcomingBill {
  id: string;
  billerName: string;
  category: BillCategory;
  dueDate: string;
  dueLabel: string;
  amount: number;
  status: BillStatus;
  savedBillerId?: string;
  providerId?: string;
}

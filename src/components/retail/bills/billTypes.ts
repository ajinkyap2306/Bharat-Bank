import { BillCategory } from '../../../types/bills';

export type BillScreen =
  | 'home'
  | 'history'
  | 'history-detail'
  | 'receipt'
  | 'search'
  | 'pay'
  | 'saved-billers'
  | 'add-biller'
  | 'edit-biller'
  | 'autopay'
  | 'tax-payment';

export type BillPayStep =
  | 'category'
  | 'biller-list'
  | 'biller-info'
  | 'customer-details'
  | 'fetching'
  | 'bill-details'
  | 'amount'
  | 'select-account'
  | 'review'
  | 'auth'
  | 'processing'
  | 'success'
  | 'failed'
  | 'pending'
  | 'save-biller';

export interface BillPayContext {
  category?: BillCategory;
  providerId?: string;
  savedBillerId?: string;
  formData?: Record<string, string>;
}

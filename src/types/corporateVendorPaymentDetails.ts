export type VendorPaymentPurpose =
  | 'vendor-settlement'
  | 'invoice-payment'
  | 'business-expense'
  | 'service-payment'
  | 'purchase-payment'
  | 'other';

export type PaymentChargeBearer = 'shared' | 'our-company' | 'beneficiary';

export type PaymentRailMethod = 'NEFT' | 'RTGS' | 'IMPS';

export type AmountValidationState =
  | 'empty'
  | 'insufficient-balance'
  | 'exceeds-single-limit'
  | 'exceeds-daily-limit'
  | 'valid';

export interface VendorPaymentForm {
  beneficiaryId: string;
  accountId: string;
  amount: number;
  currency: string;
  purpose: VendorPaymentPurpose;
  invoiceNumber: string;
  reference: string;
  paymentDate: string;
  scheduled: boolean;
  executionDate: string;
  repeatPayment: boolean;
  remarks: string;
  charges: PaymentChargeBearer;
  paymentMethod: PaymentRailMethod;
}

export interface VendorPaymentLimits {
  availableBalance: number;
  singleTransactionLimit: number;
  dailyPaymentLimit: number;
  dailyRemainingLimit: number;
  currency: string;
}

export interface VendorPaymentFeeInfo {
  fee: number;
  totalDebit: number;
}

export interface VendorPaymentContext {
  limits: VendorPaymentLimits;
  supportsChargeSelection: boolean;
  availableMethods: PaymentRailMethod[];
}

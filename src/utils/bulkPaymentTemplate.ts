export const BULK_PAYMENT_TEMPLATE_FILENAME = 'Bharat_Bulk_Payment_Template.csv';

export const BULK_PAYMENT_TEMPLATE_PATH = '/samples/bulk-payment-template.csv';

/** CSV template aligned with demo bulk payment validation data. */
export const BULK_PAYMENT_TEMPLATE_CSV = `Beneficiary Name,Account Number,IFSC Code,Bank Name,Amount,Reference,Payment Method,Payment Type,Remarks
ABC Suppliers Ltd.,98765432107821,HDFC0001234,HDFC Bank,250000,INV-4582,NEFT,Vendor Payment,August invoice
XYZ Logistics,12345678904412,ICIC0005678,ICICI Bank,125000,LOG-AUG-01,NEFT,Vendor Payment,
Office Supplies Co.,55556666909033,UTIB0009876,Axis Bank,75000,SUP-0826,NEFT,Vendor Payment,
TechServe India,44445555665521,HDFC0001234,HDFC Bank,320000,TECH-Q3,RTGS,Vendor Payment,
CleanPro Facilities,11112222111888,SBIN0001111,SBI,45000,FAC-AUG,NEFT,Vendor Payment,
`;

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = 'noopener';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Download the bulk payment CSV template (works offline once cached). */
export async function downloadBulkPaymentTemplate(): Promise<void> {
  try {
    const response = await fetch(BULK_PAYMENT_TEMPLATE_PATH, { cache: 'force-cache' });
    if (response.ok) {
      const blob = await response.blob();
      triggerBlobDownload(blob, BULK_PAYMENT_TEMPLATE_FILENAME);
      return;
    }
  } catch {
    /* fall through to in-memory CSV */
  }

  const blob = new Blob([BULK_PAYMENT_TEMPLATE_CSV], { type: 'text/csv;charset=utf-8' });
  triggerBlobDownload(blob, BULK_PAYMENT_TEMPLATE_FILENAME);
}

/** Sample file used when simulating an upload in the demo flow. */
export function createSampleBulkPaymentFile(): File {
  return new File([BULK_PAYMENT_TEMPLATE_CSV], 'August_Vendor_Payments.csv', {
    type: 'text/csv',
  });
}

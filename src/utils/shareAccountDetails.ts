export interface ShareableAccountDetails {
  accountHolder?: string;
  accountType: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
  bankName?: string;
}

export function formatAccountDetailsText(details: ShareableAccountDetails): string {
  const bank = details.bankName ?? 'Bharat Co-operative Bank';
  const holder = details.accountHolder ? `Account Holder: ${details.accountHolder}\n` : '';
  return (
    `${holder}` +
    `Bank: ${bank}\n` +
    `Account Type: ${details.accountType}\n` +
    `Account Number: ${details.accountNumber}\n` +
    `IFSC: ${details.ifsc}\n` +
    `Branch: ${details.branch}`
  );
}

export async function shareAccountDetails(
  details: ShareableAccountDetails,
  onFallback?: (message: string) => void
): Promise<'shared' | 'copied'> {
  const text = formatAccountDetailsText(details);
  const title = 'Bank Account Details';

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch {
      // User cancelled or share failed — fall through to clipboard
    }
  }

  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    onFallback?.('Account details copied to clipboard.');
    return 'copied';
  }

  onFallback?.(text);
  return 'copied';
}

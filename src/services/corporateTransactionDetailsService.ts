import type { CorporateTransactionDetails } from '../types/corporateTransactionDetails';
import { getTransactionDetailsById } from '../data/corporateTransactionDetailsMock';

export async function fetchTransactionDetails(
  accountId: string,
  transactionId: string
): Promise<CorporateTransactionDetails | null> {
  await new Promise((r) => setTimeout(r, 500));
  const details = getTransactionDetailsById(transactionId, accountId);
  if (!details || details.accountId !== accountId) return null;
  return details;
}

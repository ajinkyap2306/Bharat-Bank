import type { PaymentsHomeData } from '../types/corporatePaymentsHome';
import { buildPaymentsHomeData } from '../data/corporatePaymentsHomeMock';

export async function fetchPaymentsHome(accountId: string): Promise<PaymentsHomeData> {
  await new Promise((r) => setTimeout(r, 550));
  return buildPaymentsHomeData(accountId);
}

import type { ContextAlertItem } from '../services/shared/ServiceUI';
import type { FixedDeposit, InsurancePolicy } from '../../../types/banking';
import type { UpcomingBill } from '../../../types/bills';

interface BuildRetailContextAlertsParams {
  upcomingBills: UpcomingBill[];
  fixedDeposits: FixedDeposit[];
  insurancePolicies: InsurancePolicy[];
  onPayBill: () => void;
  onViewMaturity: () => void;
  onRenewPolicy: () => void;
}

export function buildRetailContextAlerts({
  upcomingBills,
  fixedDeposits,
  insurancePolicies,
  onPayBill,
  onViewMaturity,
  onRenewPolicy,
}: BuildRetailContextAlertsParams): ContextAlertItem[] {
  const items: ContextAlertItem[] = [];

  const upcomingBill = upcomingBills[0];
  const maturingFd = fixedDeposits[0];
  const renewingPolicy = insurancePolicies.find((policy) => policy.status === 'active');

  if (upcomingBill) {
    items.push({
      id: 'upcoming-bill',
      tone: 'warning',
      title: 'Upcoming Payment',
      message: `${upcomingBill.billerName} — ${upcomingBill.dueLabel}`,
      cta: 'Pay Now',
      onClick: onPayBill,
    });
  }

  if (maturingFd) {
    items.push({
      id: 'maturing-fd',
      tone: 'action',
      title: 'Action Required',
      message: `Your Fixed Deposit ${maturingFd.fdNumber.slice(-4)} matures soon`,
      cta: 'View Maturity Instructions',
      onClick: onViewMaturity,
    });
  }

  if (renewingPolicy) {
    items.push({
      id: 'renew-policy',
      tone: 'info',
      title: 'Renewal Due',
      message: `${renewingPolicy.planName} policy renewal due`,
      cta: 'Renew Policy',
      onClick: onRenewPolicy,
    });
  }

  return items;
}

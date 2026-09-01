import type { BankingType } from '../types/banking';
import type { CorporateDemoRole } from '../types/corporateDemoUser';

export const DEMO_TOUR_KEY_PREFIX = 'apex_demo_tour_';

export interface DemoTourStep {
  id: string;
  target?: string;
  title: string;
  message: string;
  placement: 'center' | 'above-nav' | 'below-target';
}

export function getDemoTourStorageKey(
  bankingType: BankingType,
  retailActiveUserId: string,
  corporateRole?: CorporateDemoRole | null
): string {
  if (bankingType === 'retail') {
    return `${DEMO_TOUR_KEY_PREFIX}retail_${retailActiveUserId}_v1`;
  }
  return `${DEMO_TOUR_KEY_PREFIX}corporate_${corporateRole ?? 'maker'}_v1`;
}

function clearDemoTourKeysFrom(storage: Storage): void {
  for (let i = storage.length - 1; i >= 0; i--) {
    const storageKey = storage.key(i);
    if (storageKey?.startsWith(DEMO_TOUR_KEY_PREFIX)) {
      storage.removeItem(storageKey);
    }
  }
}

export function hasCompletedDemoTour(key: string): boolean {
  return Boolean(sessionStorage.getItem(key));
}

export function markDemoTourFinished(key: string, skipped = false): void {
  sessionStorage.setItem(key, skipped ? 'skipped' : 'completed');
}

export function clearAllDemoTourKeys(): void {
  clearDemoTourKeysFrom(sessionStorage);
  // Remove legacy keys from localStorage (tour used to persist there).
  clearDemoTourKeysFrom(localStorage);
}

export function getRetailDemoTourSteps(hasJointApprovalAccess: boolean): DemoTourStep[] {
  const approvalStep: DemoTourStep = {
    id: 'approvals',
    target: 'nav-approvals',
    title: 'Joint approvals',
    message: 'Click here to review and approve pending joint account requests.',
    placement: 'above-nav',
  };

  const base: DemoTourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Bharat Bank',
      message: 'This quick tour will show you where to find key features in the demo app.',
      placement: 'center',
    },
    {
      id: 'dashboard',
      target: 'retail-home-dashboard',
      title: 'Your dashboard',
      message: 'View account balances, recent activity, and quick actions from your home screen.',
      placement: 'below-target',
    },
    {
      id: 'payments',
      target: 'nav-payments',
      title: 'Payments',
      message: 'Click here to send money, pay bills, scan QR, and manage beneficiaries.',
      placement: 'above-nav',
    },
  ];

  if (hasJointApprovalAccess) {
    base.push(approvalStep);
  }

  base.push(
    {
      id: 'accounts',
      target: 'nav-accounts',
      title: 'Accounts',
      message: 'Click here to see all accounts, statements, and account services.',
      placement: 'above-nav',
    },
    {
      id: 'services',
      target: 'nav-services',
      title: 'Services',
      message: 'Explore cards, deposits, loans, and other banking services from here.',
      placement: 'above-nav',
    },
    {
      id: 'profile',
      target: 'nav-profile',
      title: 'Profile',
      message: 'Click here to view your profile, security settings, and preferences.',
      placement: 'above-nav',
    }
  );

  return base;
}

export function getCorporateDemoTourSteps(): DemoTourStep[] {
  return [
    {
      id: 'welcome',
      title: 'Welcome to Corporate Banking',
      message: 'Let us walk you through the main sections of the corporate demo portal.',
      placement: 'center',
    },
    {
      id: 'dashboard',
      target: 'corporate-home-dashboard',
      title: 'Company dashboard',
      message: 'Monitor balances, approvals, and upcoming payments for your entity.',
      placement: 'below-target',
    },
    {
      id: 'payments',
      target: 'nav-payments',
      title: 'Payments',
      message: 'Click here to initiate vendor payments, bulk transfers, and scheduled payments.',
      placement: 'above-nav',
    },
    {
      id: 'approvals',
      target: 'nav-approvals',
      title: 'Approvals',
      message: 'Review and approve pending payment requests from your team.',
      placement: 'above-nav',
    },
    {
      id: 'accounts',
      target: 'nav-accounts',
      title: 'Accounts',
      message: 'Click here to view corporate accounts, limits, and statements.',
      placement: 'above-nav',
    },
    {
      id: 'more',
      target: 'nav-more',
      title: 'More options',
      message: 'Open More to access profile, reports, beneficiaries, and company settings.',
      placement: 'above-nav',
    },
  ];
}

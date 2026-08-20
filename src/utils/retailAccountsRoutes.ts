/** Retail accounts route helpers. Bottom navigation is hidden for the entire accounts flow. */

export const RETAIL_ACCOUNTS_ROOT = '/retail/accounts';

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export interface RetailAccountsRoute {
  accountId?: string;
  screen:
    | 'overview'
    | 'details'
    | 'manage'
    | 'nickname'
    | 'holders'
    | 'share'
    | 'freeze'
    | 'positive-pay'
    | 'positive-pay-add'
    | 'positive-pay-review'
    | 'beneficiaries'
    | 'beneficiaries-add'
    | 'beneficiaries-review'
    | 'beneficiary-detail'
    | 'close'
    | 'close-reason'
    | 'close-confirm'
    | 'close-auth'
    | 'close-success';
  beneficiaryId?: string;
}

export function parseRetailAccountsRoute(pathname: string): RetailAccountsRoute {
  const path = normalizePath(pathname);

  if (path === RETAIL_ACCOUNTS_ROOT) {
    return { screen: 'overview' };
  }

  const patterns: Array<{ re: RegExp; screen: RetailAccountsRoute['screen']; group?: number }> = [
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/close\/auth$/, screen: 'close-auth' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/close\/confirm$/, screen: 'close-confirm' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/close\/reason$/, screen: 'close-reason' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/close\/success$/, screen: 'close-success' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/close$/, screen: 'close' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/beneficiaries\/([^/]+)$/, screen: 'beneficiary-detail', group: 2 },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/beneficiaries\/add$/, screen: 'beneficiaries-add' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/beneficiaries\/review$/, screen: 'beneficiaries-review' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/beneficiaries$/, screen: 'beneficiaries' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/positive-pay\/review$/, screen: 'positive-pay-review' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/positive-pay\/add$/, screen: 'positive-pay-add' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/positive-pay$/, screen: 'positive-pay' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/freeze$/, screen: 'freeze' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/share$/, screen: 'share' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/holders$/, screen: 'holders' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage\/nickname$/, screen: 'nickname' },
    { re: /^\/retail\/accounts\/([^/]+)\/manage$/, screen: 'manage' },
    { re: /^\/retail\/accounts\/([^/]+)$/, screen: 'details' },
  ];

  for (const { re, screen, group } of patterns) {
    const m = path.match(re);
    if (m) {
      const route: RetailAccountsRoute = { screen, accountId: m[1] };
      if (group && m[group]) {
        route.beneficiaryId = m[group];
      }
      return route;
    }
  }

  return { screen: 'overview' };
}

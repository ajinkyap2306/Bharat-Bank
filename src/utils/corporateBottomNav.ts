/**
 * Corporate bottom navigation is shown only on primary tab roots.
 * All detail flows, create wizards, and sub-screens hide the bar.
 */
const CORPORATE_BOTTOM_NAV_ROOTS = [
  '/corporate/home',
  '/corporate/payments',
  '/corporate/approvals',
  '/corporate/accounts',
  '/corporate/more',
] as const;

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export function isCorporateBottomNavRoute(pathname: string): boolean {
  const path = normalizePath(pathname);
  return CORPORATE_BOTTOM_NAV_ROOTS.some((root) => path === root);
}

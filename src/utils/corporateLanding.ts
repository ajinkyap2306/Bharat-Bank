import type { CorporateDemoRole } from '../types/corporateDemoUser';

export function getCorporateLandingPath(role?: CorporateDemoRole | null): string {
  return role === 'checker' ? '/corporate/approvals' : '/corporate/home';
}

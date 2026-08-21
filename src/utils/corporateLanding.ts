import type { CorporateDemoRole } from '../types/corporateDemoUser';

/** Post-login landing for all corporate roles (maker and checker). */
export function getCorporateLandingPath(_role?: CorporateDemoRole | null): string {
  return '/corporate/home';
}

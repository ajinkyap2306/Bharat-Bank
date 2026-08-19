import { useMemo } from 'react';
import { useBanking } from '../context/BankingContext';
import { getCorporateProfileView } from '../data/corporateProfileView';
import { CORPORATE_PROFILE_DATA } from '../data/corporateProfileMock';
import type { CorporateProfileView } from '../types/corporateProfile';

export function useCorporateProfileView(): {
  view: CorporateProfileView | null;
  company: typeof CORPORATE_PROFILE_DATA.company;
} {
  const { corporateSession } = useBanking();

  const view = useMemo(
    () => getCorporateProfileView(corporateSession),
    [corporateSession]
  );

  return {
    view,
    company: CORPORATE_PROFILE_DATA.company,
  };
}

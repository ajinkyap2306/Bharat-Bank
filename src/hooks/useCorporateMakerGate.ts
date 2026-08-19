import { useCallback } from 'react';
import { useBanking } from '../context/BankingContext';

export function useCorporateMakerGate() {
  const { canSubmitCorporatePayment, canCreateCorporateBulk, addToast, corporateSession } =
    useBanking();

  const blockIfChecker = useCallback(
    (action = 'create payments') => {
      if (canSubmitCorporatePayment) return false;
      addToast({
        type: 'info',
        title: 'Permission required',
        message: `Your role (${corporateSession?.displayRole ?? 'Finance Checker'}) cannot ${action}. Please sign in as a Finance Maker.`,
      });
      return true;
    },
    [canSubmitCorporatePayment, addToast, corporateSession]
  );

  const blockBulkIfChecker = useCallback(() => {
    if (canCreateCorporateBulk) return false;
    addToast({
      type: 'info',
      title: 'Permission required',
      message: `Your role (${corporateSession?.displayRole ?? 'Finance Checker'}) cannot create bulk payments.`,
    });
    return true;
  }, [canCreateCorporateBulk, addToast, corporateSession]);

  return {
    canCreatePayment: canSubmitCorporatePayment,
    canCreateBulk: canCreateCorporateBulk,
    isChecker: !canSubmitCorporatePayment,
    blockIfChecker,
    blockBulkIfChecker,
  };
}

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { useBanking } from '../../../../../context/BankingContext';
import { clonePreferences } from '../../../../../data/corporateAccountPreferencesMock';
import { PAYMENT_TYPE_ACCOUNTS } from '../../../../../data/corporatePaymentTypeSelectionMock';
import { searchVendorBeneficiaries } from '../../../../../data/corporateVendorBeneficiarySelectionMock';
import { fetchVendorBeneficiaries } from '../../../../../services/corporateVendorBeneficiaryService';
import type {
  VendorBeneficiary,
  VendorBeneficiaryFilters,
} from '../../../../../types/corporateVendorBeneficiarySelection';
import { DEFAULT_VENDOR_BENEFICIARY_FILTERS } from '../../../../../types/corporateVendorBeneficiarySelection';
import { PaymentSourceAccount } from '../PaymentSourceAccount';
import { BeneficiarySelectionHeader } from './BeneficiarySelectionHeader';
import { BeneficiarySearch } from './BeneficiarySearch';
import { AddBeneficiaryCTA } from './AddBeneficiaryCTA';
import { FavoriteBeneficiaries } from './FavoriteBeneficiaries';
import { RecentBeneficiaries } from './RecentBeneficiaries';
import { BeneficiaryList } from './BeneficiaryList';
import { BeneficiaryFilterSheet } from './BeneficiaryFilterSheet';
import { SelectBeneficiarySheet } from './SelectBeneficiarySheet';
import { VendorAccountSelectorSheet } from './VendorAccountSelectorSheet';
import {
  BeneficiaryEmptyState,
  BeneficiarySearchEmptyState,
} from './BeneficiaryEmptyState';
import { BeneficiaryErrorState } from './BeneficiaryErrorState';
import { BeneficiarySkeleton } from './BeneficiarySkeleton';

const VENDOR_BASE_PATH = '/corporate/payments/create/vendor';

function isVendorPaymentAccountEligible(accountId: string): boolean {
  return accountId === 'acc_corp_op_01' || accountId === 'acc_corp_col_03';
}

function countActiveFilters(filters: VendorBeneficiaryFilters): number {
  return (
    filters.statuses.length +
    filters.banks.length +
    filters.types.length +
    (filters.favoritesOnly ? 1 : 0)
  );
}

function applyBeneficiaryFilters(
  beneficiaries: VendorBeneficiary[],
  filters: VendorBeneficiaryFilters
): VendorBeneficiary[] {
  return beneficiaries.filter((b) => {
    if (filters.favoritesOnly && !b.isFavorite) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(b.status)) return false;
    if (filters.banks.length > 0 && !filters.banks.includes(b.bankName)) return false;
    if (filters.types.length > 0 && !filters.types.includes(b.type)) return false;
    return true;
  });
}

export const VendorBeneficiarySelection: React.FC = () => {
  const navigate = useNavigate();
  const {
    addToast,
    getPrimaryCorporateAccount,
    setBottomNavHidden,
    closeDetailFlow,
    setCorporateTab,
  } = useBanking();

  const accounts = useMemo(
    () =>
      PAYMENT_TYPE_ACCOUNTS.map((a) => ({
        ...a,
        eligiblePaymentTypes: a.eligiblePaymentTypes,
      })),
    []
  );

  const [selectedAccountId, setSelectedAccountId] = useState(
    getPrimaryCorporateAccount()?.id || 'acc_corp_op_01'
  );
  const [beneficiaries, setBeneficiaries] = useState<VendorBeneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [filters, setFilters] = useState<VendorBeneficiaryFilters>(
    DEFAULT_VENDOR_BENEFICIARY_FILTERS
  );
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [pendingBeneficiary, setPendingBeneficiary] = useState<VendorBeneficiary | null>(null);
  const [showConfirmSheet, setShowConfirmSheet] = useState(false);

  const pullStartY = useRef(0);
  const [pullDistance, setPullDistance] = useState(0);

  const selectedAccount =
    accounts.find((a) => a.id === selectedAccountId) ?? accounts[0];

  const hideBalance = clonePreferences(selectedAccountId)?.hideBalance ?? false;
  const showBalances = !hideBalance;

  useEffect(() => {
    if (!isVendorPaymentAccountEligible(selectedAccountId)) {
      const eligible = accounts.find((a) => isVendorPaymentAccountEligible(a.id));
      if (eligible) setSelectedAccountId(eligible.id);
    }
  }, [selectedAccountId, accounts]);

  useEffect(() => {
    setBottomNavHidden(true);
    closeDetailFlow();
  }, [setBottomNavHidden, closeDetailFlow]);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(false);
    try {
      const result = await fetchVendorBeneficiaries();
      setBeneficiaries(result.beneficiaries);
      setLastUpdated(result.lastUpdated ?? 'Updated just now');
    } catch {
      setError(true);
      setBeneficiaries([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredBeneficiaries = useMemo(() => {
    let list = applyBeneficiaryFilters(beneficiaries, filters);
    if (searchQuery.trim()) {
      list = searchVendorBeneficiaries(list, searchQuery);
    }
    return list;
  }, [beneficiaries, filters, searchQuery]);

  const handleBack = () => {
    navigate('/corporate/payments/create');
  };

  const handleAddBeneficiary = () => {
    setCorporateTab('more');
    addToast({
      type: 'info',
      title: 'Add Beneficiary',
      message: 'Opening the add beneficiary flow.',
    });
    navigate('/corporate/beneficiaries/add');
  };

  const handleToggleFavorite = (beneficiaryId: string) => {
    setBeneficiaries((prev) =>
      prev.map((b) => {
        if (b.id !== beneficiaryId) return b;
        const nextFavorite = !b.isFavorite;
        addToast({
          type: 'success',
          title: nextFavorite ? 'Added to favorites' : 'Removed from favorites',
          message: b.name,
        });
        return { ...b, isFavorite: nextFavorite };
      })
    );
  };

  const handleSelectBeneficiary = (beneficiary: VendorBeneficiary) => {
    setPendingBeneficiary(beneficiary);
    setShowConfirmSheet(true);
  };

  const handleConfirmBeneficiary = () => {
    if (!pendingBeneficiary) return;
    setShowConfirmSheet(false);
    navigate(`${VENDOR_BASE_PATH}/${pendingBeneficiary.id}`);
    setPendingBeneficiary(null);
  };

  const handleViewStatus = (beneficiaryId: string) => {
    setCorporateTab('more');
    addToast({
      type: 'info',
      title: 'Beneficiary Status',
      message: 'Beneficiary details will open from the beneficiaries module.',
    });
    navigate(`/corporate/beneficiaries/${beneficiaryId}`);
  };

  const handleRefresh = () => {
    load(true);
    addToast({
      type: 'success',
      title: 'Beneficiaries updated',
      message: 'Latest beneficiary data refreshed.',
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY <= 0) pullStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY.current > 0) {
      const dist = Math.max(0, e.touches[0].clientY - pullStartY.current);
      if (dist < 120) setPullDistance(dist);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 72) handleRefresh();
    pullStartY.current = 0;
    setPullDistance(0);
  };

  const activeFilterCount = countActiveFilters(filters);
  const isSearching = searchQuery.trim().length > 0;
  const showEmpty = !isLoading && !error && beneficiaries.length === 0;
  const showSearchEmpty =
    !isLoading && !error && isSearching && filteredBeneficiaries.length === 0;

  if (isLoading && beneficiaries.length === 0) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <BeneficiarySelectionHeader onBack={handleBack} onSearch={() => {}} />
        <BeneficiarySkeleton />
      </div>
    );
  }

  if (error && beneficiaries.length === 0) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-safe">
        <BeneficiarySelectionHeader onBack={handleBack} onSearch={() => {}} />
        <div className="pt-4">
          <BeneficiaryErrorState onRetry={() => load()} onAddBeneficiary={handleAddBeneficiary} />
        </div>
      </div>
    );
  }

  if (!selectedAccount) {
    return (
      <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950">
        <BeneficiarySelectionHeader onBack={handleBack} onSearch={() => {}} />
        <BeneficiarySkeleton />
      </div>
    );
  }

  return (
    <div
      className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-safe"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {(pullDistance > 0 || isRefreshing) && (
        <div
          className="flex justify-center py-2 text-[#667085]"
          style={{ height: isRefreshing ? 32 : pullDistance * 0.4 }}
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin motion-reduce:animate-none' : ''}`}
            aria-hidden
          />
        </div>
      )}

      <BeneficiarySelectionHeader
        onBack={handleBack}
        onSearch={() => setIsSearchFocused(true)}
        searchActive={isSearchFocused || isSearching}
      />

      <div className="space-y-4 pt-4 pb-8 max-w-[430px] mx-auto">
        {lastUpdated && (
          <p className="px-4 text-[11px] text-[#667085] text-center">{lastUpdated}</p>
        )}

        <PaymentSourceAccount
          account={selectedAccount}
          showBalances={showBalances}
          onOpen={() => setShowAccountSheet(true)}
        />

        <AddBeneficiaryCTA onClick={handleAddBeneficiary} />

        <BeneficiarySearch
          value={searchQuery}
          onChange={setSearchQuery}
          onFilter={() => setShowFilterSheet(true)}
          activeFilterCount={activeFilterCount}
          isSearching={isLoading && isSearching}
          autoFocus={isSearchFocused}
        />

        {showEmpty ? (
          <BeneficiaryEmptyState
            onAddBeneficiary={handleAddBeneficiary}
            onCancel={handleBack}
          />
        ) : showSearchEmpty ? (
          <BeneficiarySearchEmptyState onAddBeneficiary={handleAddBeneficiary} />
        ) : (
          <>
            {!isSearching && (
              <>
                <FavoriteBeneficiaries
                  beneficiaries={filteredBeneficiaries}
                  onSelect={handleSelectBeneficiary}
                  onToggleFavorite={handleToggleFavorite}
                />
                <RecentBeneficiaries
                  beneficiaries={filteredBeneficiaries}
                  onSelect={handleSelectBeneficiary}
                  onToggleFavorite={handleToggleFavorite}
                />
              </>
            )}

            <BeneficiaryList
              beneficiaries={filteredBeneficiaries}
              onSelect={handleSelectBeneficiary}
              onToggleFavorite={handleToggleFavorite}
              onViewStatus={handleViewStatus}
              showHeading={!isSearching}
            />

            {isSearching && filteredBeneficiaries.length > 0 && (
              <p className="px-4 text-[12px] text-[#667085]">
                {filteredBeneficiaries.length} result
                {filteredBeneficiaries.length !== 1 ? 's' : ''}
              </p>
            )}
          </>
        )}
      </div>

      <VendorAccountSelectorSheet
        isOpen={showAccountSheet}
        accounts={accounts}
        selectedId={selectedAccountId}
        showBalances={showBalances}
        isVendorEligible={isVendorPaymentAccountEligible}
        onClose={() => setShowAccountSheet(false)}
        onSelect={setSelectedAccountId}
      />

      <BeneficiaryFilterSheet
        isOpen={showFilterSheet}
        filters={filters}
        onClose={() => setShowFilterSheet(false)}
        onApply={setFilters}
      />

      <SelectBeneficiarySheet
        isOpen={showConfirmSheet}
        beneficiary={pendingBeneficiary}
        onClose={() => {
          setShowConfirmSheet(false);
          setPendingBeneficiary(null);
        }}
        onContinue={handleConfirmBeneficiary}
      />
    </div>
  );
};

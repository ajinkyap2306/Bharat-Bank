import React, { useCallback, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { CorporateDashboardAccount } from '../../../types/corporateDashboard';
import { AccountCard } from './AccountCard';
import { CorpSkeleton } from './shared/CorporateHomeUI';

interface AccountCarouselProps {
  accounts: CorporateDashboardAccount[];
  isLoading?: boolean;
  onAccountClick: (accountId: string) => void;
  onAllAccountsClick: () => void;
}

export const AccountCarousel: React.FC<AccountCarouselProps> = ({
  accounts,
  isLoading,
  onAccountClick,
  onAllAccountsClick,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hiddenAccounts, setHiddenAccounts] = useState<Record<string, boolean>>({});

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || accounts.length === 0) return;
    const cardWidth = el.scrollWidth / accounts.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), accounts.length - 1));
  }, [accounts.length]);

  const toggleBalance = (accountId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenAccounts((prev) => ({ ...prev, [accountId]: !prev[accountId] }));
  };

  if (isLoading) {
    return (
      <section aria-label="Account balances" className="px-4">
        <CorpSkeleton className="h-44 w-full" />
      </section>
    );
  }

  if (accounts.length === 0) {
    return (
      <section aria-label="Account balances" className="px-4">
        <p className="text-sm text-[#667085]">No accounts available</p>
      </section>
    );
  }

  return (
    <section aria-label="Account balances" aria-roledescription="carousel">
      <div className="flex items-center justify-between px-4 mb-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Business Accounts
        </h3>
        <button
          type="button"
          onClick={onAllAccountsClick}
          className="text-xs font-bold text-congress-blue-700 dark:text-congress-blue-400 hover:underline flex items-center gap-0.5 min-h-11"
        >
          All Accounts <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar snap-x snap-mandatory scroll-px-4"
      >
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            isPrimary={account.isPrimary ?? false}
            isHidden={!!hiddenAccounts[account.id]}
            onToggleHidden={(e) => toggleBalance(account.id, e)}
            onClick={() => onAccountClick(account.id)}
          />
        ))}
      </div>

      {accounts.length > 1 && (
        <div
          className="flex items-center justify-center gap-1.5 mt-3"
          role="tablist"
          aria-label="Account carousel pagination"
        >
          {accounts.map((account, index) => (
            <button
              key={account.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${account.name}, slide ${index + 1} of ${accounts.length}`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const cardWidth = el.scrollWidth / accounts.length;
                el.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
                setActiveIndex(index);
              }}
              className={`rounded-full transition-all ${
                index === activeIndex ? 'w-2 h-2 bg-congress-blue-700' : 'w-2 h-2 bg-[#D0D5DD]'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

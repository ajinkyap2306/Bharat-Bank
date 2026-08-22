import React, { useCallback, useRef, useState } from 'react';
import type { CorporateAccount } from '../../../../types/corporateAccounts';
import { AccountCard } from './AccountCard';

interface AccountsCarouselProps {
  accounts: CorporateAccount[];
  primaryAccountId?: string;
  showBalances: boolean;
  onSelect: (accountId: string) => void;
}

export const AccountsCarousel: React.FC<AccountsCarouselProps> = ({
  accounts,
  primaryAccountId,
  showBalances,
  onSelect,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || accounts.length === 0) return;
    const cardWidth = el.scrollWidth / accounts.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), accounts.length - 1));
  }, [accounts.length]);

  if (accounts.length === 0) return null;

  return (
    <section aria-label="Your accounts" aria-roledescription="carousel">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar snap-x snap-mandatory scroll-px-4"
      >
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            isPrimary={account.isPrimary || account.id === primaryAccountId}
            showBalances={showBalances}
            onClick={() => onSelect(account.id)}
            compact
          />
        ))}
      </div>

      {accounts.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2" aria-label="Account pagination">
          {accounts.map((account, index) => (
            <button
              key={account.id}
              type="button"
              aria-label={`${account.accountType}, slide ${index + 1}`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const cardWidth = el.scrollWidth / accounts.length;
                el.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
                setActiveIndex(index);
              }}
              className={`rounded-full transition-all ${
                index === activeIndex ? 'w-4 h-1.5 bg-congress-blue-700' : 'w-1.5 h-1.5 bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

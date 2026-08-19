import React, { useMemo, useState } from 'react';
import { useBanking } from '../../../context/BankingContext';
import { ATM_LOCATORS, BRANCH_LOCATORS } from '../../../data/preLoginMock';
import { CDM_LOCATORS } from '../../../data/level6Mock';
import { ScreenHeader } from '../../common/ScreenHeader';

const LOCATOR_CONFIG = {
  atm: { title: 'ATM Locator', subtitle: 'Cash withdrawal points near you', items: ATM_LOCATORS },
  branch: { title: 'Branch Locator', subtitle: 'Near your current location (demo)', items: BRANCH_LOCATORS },
  cdm: { title: 'CDM Locator', subtitle: 'Cash deposit machines near you', items: CDM_LOCATORS },
} as const;

export const LocatorModule: React.FC = () => {
  const { locatorType, setRetailTab, setBottomNavHidden } = useBanking();
  const [query, setQuery] = useState('');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const config = LOCATOR_CONFIG[locatorType];
  const filtered = useMemo(
    () =>
      config.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.address.toLowerCase().includes(query.toLowerCase())
      ),
    [config.items, query]
  );

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader
        title={config.title}
        subtitle={config.subtitle}
        onBack={() => setRetailTab('services')}
      />

      <div className="pt-3 pb-6 space-y-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or area..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
        />
        {filtered.map((loc) => (
          <div
            key={loc.id}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between gap-2">
              <p className="text-sm font-bold">{loc.name}</p>
              <span className="text-[10px] font-bold text-blue-600">{loc.distance}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{loc.address}</p>
            <p className="text-[11px] text-slate-400 mt-1">{loc.hours}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {loc.services.map((s) => (
                <span
                  key={s}
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

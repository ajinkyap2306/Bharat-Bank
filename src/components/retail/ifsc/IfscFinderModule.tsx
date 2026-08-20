import React, { useMemo, useState } from 'react';
import { Building2, Copy, Search } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { searchIfsc } from '../../../data/ifscMock';

export const IfscFinderModule: React.FC = () => {
  const { setRetailTab, addToast, setBottomNavHidden } = useBanking();
  const [query, setQuery] = useState('');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const results = useMemo(() => searchIfsc(query), [query]);

  const copyIfsc = (ifsc: string) => {
    navigator.clipboard?.writeText(ifsc);
    addToast({ type: 'info', title: 'Copied', message: `${ifsc} copied to clipboard.` });
  };

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader
        title="IFSC Search"
        subtitle="Find bank branch IFSC codes"
        onBack={() => setRetailTab('services')}
      />

      <div className="pt-3 pb-6 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by IFSC, bank, branch or city..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {results.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-10">No branches match your search.</p>
        ) : (
          results.map((item) => (
            <div
              key={item.ifsc}
              className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{item.bankName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.branch}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.city}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyIfsc(item.ifsc)}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {item.ifsc}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

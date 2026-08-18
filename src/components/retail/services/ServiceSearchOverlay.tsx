import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Search, ChevronLeft } from 'lucide-react';
import { ALL_SERVICES } from '../../../data/servicesCatalog';
import { ServiceItem } from '../../../types/services';
import { ServiceGridItem, ServiceSectionCard } from './shared/ServiceUI';

interface ServiceSearchOverlayProps {
  onClose: () => void;
  onSelectService: (service: ServiceItem) => void;
}

export const ServiceSearchOverlay: React.FC<ServiceSearchOverlayProps> = ({
  onClose,
  onSelectService,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_SERVICES.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.includes(q)) ||
        s.categoryTitle.toLowerCase().includes(q)
    );
  }, [query]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>();
    results.forEach((s) => {
      const list = map.get(s.categoryTitle) || [];
      list.push(s);
      map.set(s.categoryTitle, list);
    });
    return map;
  }, [results]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="fixed inset-0 z-50 bg-[#F7F9FC] dark:bg-slate-950 flex flex-col"
    >
      <div className="px-3 pt-3 pb-2 safe-top border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm"
            />
          </div>
        </div>
        <p className="text-xs font-bold text-[#111827] dark:text-white mt-3">Search services</p>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 w-full">
        {query.trim() === '' ? (
          <p className="text-sm text-[#667085] text-center py-12">Search by service name, category, or keyword</p>
        ) : results.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-base font-bold text-[#111827] dark:text-white">No service found</p>
            <p className="text-sm text-[#667085] mt-2">Try another service name or keyword.</p>
          </div>
        ) : (
          Array.from(grouped.entries()).map(([category, items]) => (
            <ServiceSectionCard key={category} title={category} count={items.length}>
              {items.map((s) => (
                <ServiceGridItem
                  key={s.id}
                  name={s.name}
                  icon={s.icon}
                  badge={s.badge}
                  onClick={() => onSelectService(s)}
                  emergency={s.id === 'emergency-block'}
                />
              ))}
            </ServiceSectionCard>
          ))
        )}
      </div>
    </motion.div>
  );
};

import React, { useMemo } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import {
  SERVICES_CATALOG,
  getServiceById,
  DEFAULT_RECENT_SERVICE_IDS,
} from '../../../data/servicesCatalog';
import { ServiceCard, SectionLabel, ContextAlertCard, ServiceIcon } from './shared/ServiceUI';
import { ServiceItem } from '../../../types/services';

interface AllServicesScreenProps {
  onOpenSearch: () => void;
  onSelectService: (service: ServiceItem) => void;
}

export const AllServicesScreen: React.FC<AllServicesScreenProps> = ({
  onOpenSearch,
  onSelectService,
}) => {
  const {
    upcomingBills,
    fixedDeposits,
    insurancePolicies,
    favoriteServiceIds,
    recentServiceIds,
    toggleFavoriteService,
    addToast,
  } = useBanking();

  const recentServices = useMemo(
    () => (recentServiceIds.length ? recentServiceIds : DEFAULT_RECENT_SERVICE_IDS)
      .map((id) => getServiceById(id))
      .filter(Boolean) as (ServiceItem & { categoryId: string; categoryTitle: string })[],
    [recentServiceIds]
  );

  const favoriteServices = useMemo(
    () => favoriteServiceIds.map((id) => getServiceById(id)).filter(Boolean) as (ServiceItem & { categoryId: string; categoryTitle: string })[],
    [favoriteServiceIds]
  );

  const upcomingBill = upcomingBills[0];
  const maturingFd = fixedDeposits[0];
  const renewingPolicy = insurancePolicies.find((p) => p.status === 'active');

  return (
    <div className="pt-1 pb-24 max-w-lg mx-auto bg-[#F7F9FC] dark:bg-slate-950 min-h-full px-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h1 className="text-xl font-bold text-[#111827] dark:text-white tracking-tight">All Services</h1>
          <p className="text-xs text-[#667085] dark:text-slate-400 mt-0.5">Explore all banking and financial services</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shadow-xs"
            aria-label="Search services"
          >
            <Search className="w-4 h-4 text-[#667085]" />
          </button>
          <button
            type="button"
            onClick={() => addToast({ type: 'info', title: 'Help', message: 'Call 1800-202-APEX for assistance.' })}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center shadow-xs"
            aria-label="Help"
          >
            <HelpCircle className="w-4 h-4 text-[#667085]" />
          </button>
        </div>
      </div>

      {/* Contextual alerts */}
      <div className="space-y-2 mb-4">
        {upcomingBill && (
          <ContextAlertCard
            tone="warning"
            title="Upcoming Payment"
            message={`${upcomingBill.billerName} — ${upcomingBill.dueLabel}`}
            cta="Pay Now"
            onClick={() => {
              const s = getServiceById('bill-payments');
              if (s) onSelectService(s);
            }}
          />
        )}
        {maturingFd && (
          <ContextAlertCard
            tone="action"
            title="Action Required"
            message={`Your Fixed Deposit ${maturingFd.fdNumber.slice(-4)} matures soon`}
            cta="View Maturity Instructions"
            onClick={() => {
              const s = getServiceById('maturity-instructions');
              if (s) onSelectService(s);
            }}
          />
        )}
        {renewingPolicy && (
          <ContextAlertCard
            tone="info"
            title="Renewal Due"
            message={`${renewingPolicy.planName} policy renewal due`}
            cta="Renew Policy"
            onClick={() => {
              const s = getServiceById('renew-policy');
              if (s) onSelectService(s);
            }}
          />
        )}
      </div>

      {/* Recently Used */}
      {recentServices.length > 0 && (
        <div className="mb-4">
          <SectionLabel title="Recently Used" />
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
            {recentServices.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectService(s)}
                className="shrink-0 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs min-h-11"
              >
                <ServiceIcon name={s.icon} className="w-4 h-4 text-congress-blue-700" />
                <span className="text-xs font-semibold text-[#111827] dark:text-white whitespace-nowrap">{s.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Favorites */}
      {favoriteServices.length > 0 && (
        <div className="mb-4">
          <SectionLabel title="My Services" />
          <div className="space-y-2">
            {favoriteServices.map((s) => (
              <ServiceCard
                key={s.id}
                name={s.name}
                description={s.description}
                icon={s.icon}
                badge={s.badge}
                isFavorite
                onToggleFavorite={() => toggleFavoriteService(s.id)}
                onClick={() => onSelectService(s)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All categories */}
      {SERVICES_CATALOG.map((category) => (
        <div key={category.id} className="mb-3">
          <SectionLabel title={category.title} />
          <div className="space-y-2">
            {category.services.map((service) => (
              <ServiceCard
                key={service.id}
                name={service.name}
                description={service.description}
                icon={service.icon}
                badge={service.badge}
                isFavorite={favoriteServiceIds.includes(service.id)}
                onToggleFavorite={() => toggleFavoriteService(service.id)}
                onClick={() => onSelectService(service)}
                emergency={service.id === 'emergency-block'}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

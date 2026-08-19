import React, { useMemo } from 'react';
import { Search, HelpCircle } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import {
  SERVICES_CATALOG,
  getServiceById,
  DEFAULT_RECENT_SERVICE_IDS,
} from '../../../data/servicesCatalog';
import { ServiceGridItem, ServiceSectionCard } from './shared/ServiceUI';
import { ServiceItem } from '../../../types/services';
import { ContextAlertsCarousel } from '../shared/ContextAlertsCarousel';
import { buildRetailContextAlerts } from '../shared/buildRetailContextAlerts';

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

  const alertItems = useMemo(
    () =>
      buildRetailContextAlerts({
        upcomingBills,
        fixedDeposits,
        insurancePolicies,
        onPayBill: () => {
          const s = getServiceById('bill-payments');
          if (s) onSelectService(s);
        },
        onViewMaturity: () => {
          const s = getServiceById('maturity-instructions');
          if (s) onSelectService(s);
        },
        onRenewPolicy: () => {
          const s = getServiceById('renew-policy');
          if (s) onSelectService(s);
        },
      }),
    [upcomingBills, fixedDeposits, insurancePolicies, onSelectService]
  );

  return (
    <div className="pt-1 pb-24 min-h-full -mx-3 px-3 bg-[#F7F9FC] dark:bg-slate-950">
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
      <ContextAlertsCarousel items={alertItems} className="mb-4" />

      {/* Recently Used */}
      {recentServices.length > 0 && (
        <ServiceSectionCard title="Recently Used" count={recentServices.slice(0, 4).length}>
          {recentServices.slice(0, 4).map((s) => (
            <ServiceGridItem
              key={s.id}
              name={s.name}
              icon={s.icon}
              badge={s.badge}
              onClick={() => onSelectService(s)}
            />
          ))}
        </ServiceSectionCard>
      )}

      {/* Favorites */}
      {favoriteServices.length > 0 && (
        <ServiceSectionCard title="My Services" count={favoriteServices.length}>
          {favoriteServices.map((s) => (
            <ServiceGridItem
              key={s.id}
              name={s.name}
              icon={s.icon}
              badge={s.badge}
              isFavorite
              onToggleFavorite={() => toggleFavoriteService(s.id)}
              onClick={() => onSelectService(s)}
            />
          ))}
        </ServiceSectionCard>
      )}

      {/* All categories */}
      {SERVICES_CATALOG.map((category) => (
        <ServiceSectionCard key={category.id} title={category.title} count={category.services.length}>
          {category.services.map((service) => (
            <ServiceGridItem
              key={service.id}
              name={service.name}
              icon={service.icon}
              badge={service.badge}
              isFavorite={favoriteServiceIds.includes(service.id)}
              onToggleFavorite={() => toggleFavoriteService(service.id)}
              onClick={() => onSelectService(service)}
              emergency={service.id === 'emergency-block'}
            />
          ))}
        </ServiceSectionCard>
      ))}
    </div>
  );
};

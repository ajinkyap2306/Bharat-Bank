import { useCallback, useEffect, useState } from 'react';
import type { CorporateDashboardSummary } from '../types/corporateDashboard';
import { fetchCorporateDashboard } from '../data/corporateDashboardMock';

export function useCorporateDashboard(entityId: string) {
  const [data, setData] = useState<CorporateDashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [sectionErrors, setSectionErrors] = useState<Record<string, boolean>>({});

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(false);

      try {
        const result = await fetchCorporateDashboard(entityId);
        setData(result);
        setSectionErrors({});
        setLastUpdated(new Date());
      } catch {
        if (!isRefresh) setError(true);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [entityId]
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    data,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    sectionErrors,
    refresh: () => load(true),
    retry: () => load(false),
  };
}

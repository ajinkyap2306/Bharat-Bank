import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/** Bulk payment screens use pathname matching (no React Router :batchId route). */
export function parseBulkBatchIdFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] !== 'corporate' || segments[1] !== 'bulk-payments') return '';
  const candidate = segments[2];
  if (!candidate || candidate === 'create') return '';
  return candidate;
}

export function useBulkBatchId(): string {
  const { pathname } = useLocation();
  return useMemo(() => parseBulkBatchIdFromPath(pathname), [pathname]);
}

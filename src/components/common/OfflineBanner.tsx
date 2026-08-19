import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div
      role="status"
      className="fixed top-0 left-0 right-0 z-[100] bg-amber-600 text-white px-4 py-2 text-center text-[12px] font-semibold safe-top flex items-center justify-center gap-2 shadow-md"
    >
      <WifiOff className="w-4 h-4 shrink-0" aria-hidden />
      <span>You&apos;re offline — cached demo data is still available</span>
    </div>
  );
};

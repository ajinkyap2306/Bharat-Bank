import React from 'react';
import { Loader2 } from 'lucide-react';

interface RouteLoadingStateProps {
  label?: string;
}

export const RouteLoadingState: React.FC<RouteLoadingStateProps> = ({
  label = 'Loading…',
}) => (
  <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-[#667085]">
    <Loader2 className="w-6 h-6 animate-spin motion-reduce:animate-none" aria-hidden />
    <p className="text-[13px] font-medium">{label}</p>
  </div>
);

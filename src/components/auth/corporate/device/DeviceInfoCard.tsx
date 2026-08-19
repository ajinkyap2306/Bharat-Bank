import React from 'react';
import { Smartphone } from 'lucide-react';
import type { MockDeviceInfo } from '../../../../types/corporateDevice';

interface DeviceInfoCardProps {
  device: MockDeviceInfo;
}

export const DeviceInfoCard: React.FC<DeviceInfoCardProps> = ({ device }) => (
  <div className="mx-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-[#F7F9FC] dark:bg-slate-800 border border-[#E4E7EC] dark:border-slate-700 flex items-center justify-center shrink-0">
        <Smartphone className="w-4.5 h-4.5 text-[#0B5CAB]" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-[#667085] uppercase tracking-wide">
          Device
        </p>
        <p className="text-[15px] font-semibold text-[#111827] dark:text-white mt-0.5">
          {device.label}
        </p>
        <p className="text-[13px] text-[#667085] dark:text-slate-400 mt-0.5">
          {device.platform}
        </p>
        <div className="flex items-center gap-1.5 mt-2.5">
          <span
            className={`w-2 h-2 rounded-full ${
              device.deviceStatus === 'trusted'
                ? 'bg-[#16A34A]'
                : 'bg-[#F59E0B]'
            }`}
            aria-hidden
          />
          <span className="text-[12px] font-medium text-[#667085]">
            {device.deviceStatus === 'trusted'
              ? 'Trusted device'
              : 'Verification required'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

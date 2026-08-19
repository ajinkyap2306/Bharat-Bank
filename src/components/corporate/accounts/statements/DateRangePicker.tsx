import React, { useState } from 'react';
import { BottomSheet } from '../../../common/BottomSheet';
import type { StatementDateRange } from '../../../../types/corporateAccountStatements';

interface DateRangePickerProps {
  isOpen: boolean;
  initialFrom: string;
  initialTo: string;
  onClose: () => void;
  onApply: (range: StatementDateRange) => void;
}

function formatDisplay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  isOpen,
  initialFrom,
  initialTo,
  onClose,
  onApply,
}) => {
  const [fromISO, setFromISO] = useState(initialFrom);
  const [toISO, setToISO] = useState(initialTo);
  const [error, setError] = useState('');

  const handleApply = () => {
    if (fromISO > toISO) {
      setError('From date cannot be after To date');
      return;
    }
    const today = '2026-08-18';
    if (toISO > today) {
      setError('To date cannot be in the future');
      return;
    }
    setError('');
    onApply({
      fromISO,
      toISO,
      fromDate: formatDisplay(fromISO),
      toDate: formatDisplay(toISO),
    });
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Custom Date Range">
      <div className="space-y-4 pb-2">
        <div>
          <label className="text-[13px] font-medium text-[#667085]">From Date</label>
          <input
            type="date"
            value={fromISO}
            max="2026-08-18"
            onChange={(e) => setFromISO(e.target.value)}
            className="w-full mt-1.5 p-3 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] min-h-12"
          />
        </div>
        <div>
          <label className="text-[13px] font-medium text-[#667085]">To Date</label>
          <input
            type="date"
            value={toISO}
            max="2026-08-18"
            onChange={(e) => setToISO(e.target.value)}
            className="w-full mt-1.5 p-3 rounded-xl border border-[#E4E7EC] dark:border-slate-800 bg-white dark:bg-slate-900 text-[14px] min-h-12"
          />
        </div>
        {error && <p className="text-[13px] text-[#DC2626]">{error}</p>}
        <button
          type="button"
          onClick={handleApply}
          className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-12"
        >
          Apply
        </button>
      </div>
    </BottomSheet>
  );
};

import React, { useState } from 'react';
import { ChevronRight, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBanking } from '../../../../context/BankingContext';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { lookupMobilePayContact, MOBILE_PAY_CONTACTS } from '../../../../data/level3Mock';

export const CorporateMobilePayModule: React.FC = () => {
  const navigate = useNavigate();
  const { addToast, setBottomNavHidden } = useBanking();
  const [mobile, setMobile] = useState('');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  const digits = mobile.replace(/\D/g, '').slice(-10);
  const canPay = digits.length === 10;
  const contact = canPay ? lookupMobilePayContact(digits) : null;

  const startPayment = () => {
    if (!contact) {
      addToast({
        type: 'error',
        title: 'Invalid Mobile Number',
        message: 'Enter a valid 10-digit mobile number.',
      });
      return;
    }
    navigate('/corporate/payments/create/bank-transfer', {
      state: {
        mobilePay: {
          name: contact.name,
          mobile: contact.mobile,
          accountNumber: contact.accountNumber,
          ifsc: contact.ifsc,
          bankName: contact.bankName,
        },
      },
    });
  };

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-8">
      <ScreenHeader
        title="Pay via Mobile"
        subtitle="Send money using registered mobile number"
        onBack={() => navigate('/corporate/payments')}
      />

      <div className="pt-3 space-y-3">
        <div className="relative">
          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="tel"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            placeholder="Enter 10-digit mobile number"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm outline-none focus:border-congress-blue-700"
          />
        </div>

        {canPay && contact && (
          <button
            type="button"
            onClick={startPayment}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-left"
          >
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Send to {contact.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {contact.mobile} • {contact.bankName}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-emerald-600" />
          </button>
        )}

        <div>
          <p className="text-[11px] font-bold text-slate-500 uppercase px-1 mb-2">Demo contacts</p>
          <div className="space-y-2">
            {MOBILE_PAY_CONTACTS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setMobile(c.mobile)}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left"
              >
                <div>
                  <p className="text-sm font-bold">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.mobile}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

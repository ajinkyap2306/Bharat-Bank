import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Globe, 
  ShieldCheck, 
  KeyRound, 
  Landmark, 
  Receipt, 
  HelpCircle, 
  ChevronRight, 
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const RetailServices: React.FC = () => {
  const { addToast, setBottomNavHidden } = useBanking();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Bottom Navigation visibility: HIDDEN during Service Request dialogs
  useEffect(() => {
    if (activeModal) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [activeModal, setBottomNavHidden]);

  const handleServiceClick = (title: string, actionMsg: string) => {
    addToast({
      type: 'success',
      title: title,
      message: actionMsg,
    });
  };

  const serviceCategories = [
    {
      title: 'Cheque & Account Services',
      items: [
        { name: 'Request New Cheque Book', desc: 'Dispatched to registered mailing address in 3 business days', action: 'Cheque book request submitted. Tracking ID: CHQ-88192.' },
        { name: 'Stop Cheque Payment', desc: 'Instantly revoke and hold specific cheque leaf numbers', action: 'Stop Cheque order registered with central clearing house.' },
        { name: 'Interest Certificate (TDS / IT)', desc: 'Download provisional & final financial year interest certificates', action: 'Interest Certificate downloaded in PDF format.' },
        { name: 'Update Nominee Details', desc: 'View, add, or amend registered account nominees with OTP', action: 'Nominee authentication initiated.' },
      ]
    },
    {
      title: 'Government & Tax Schemes',
      items: [
        { name: 'Public Provident Fund (PPF)', desc: 'Government-backed 15-year wealth builder with 7.1% tax-free interest', action: 'PPF statement and contribution panel opened.' },
        { name: 'Sukanya Samriddhi Account (SSA)', desc: 'Dedicated high-interest savings for girl child education and future', action: 'SSA enrollment details loaded.' },
        { name: 'National Pension System (NPS Tier 1 & 2)', desc: 'Additional ₹50,000 tax deduction under Section 80CCD(1B)', action: 'NPS portal connection verified.' },
        { name: 'Form 15G / 15H Submission', desc: 'Zero TDS declaration submission for FY 2025-26', action: 'Form 15G digitally signed and recorded.' },
      ]
    },
    {
      title: 'Forex, Cards & Lockers',
      items: [
        { name: 'Apply Bharat Multi-Currency Forex Card', desc: 'Zero forex markup with 16 foreign currencies locked in real-time', action: 'Forex Travel Card application submitted.' },
        { name: 'Instant International Remittance (LRS)', desc: 'Send university fees or family support overseas under RBI LRS', action: 'LRS Outward Remittance gateway launched.' },
        { name: 'Safe Deposit Locker Allocation', desc: 'Check automated vault availability across nearby branches', action: 'Locker availability query submitted for BKC Branch.' },
      ]
    }
  ];

  return (
    <div className="space-y-5 pb-6">
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Banking & Value-Added Services</h3>
        <p className="text-xs text-slate-500">Government schemes, Forex, Tax certificates, and Requests</p>
      </div>

      <div className="space-y-4">
        {serviceCategories.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              {cat.title}
            </h4>

            <div className="space-y-2">
              {cat.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  onClick={() => handleServiceClick(item.name, item.action)}
                  className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 cursor-pointer shadow-xs active:scale-98 transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5 max-w-[85%]">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-snug">
                      {item.desc}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

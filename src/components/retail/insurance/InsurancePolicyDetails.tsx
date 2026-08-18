import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  Car, 
  LifeBuoy, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  Download, 
  History, 
  AlertCircle,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { InsurancePolicy } from '../../../types/banking';
import { BottomSheet } from '../../common/BottomSheet';
import { SecureAuthModal } from '../../common/SecureAuthModal';

interface InsurancePolicyDetailsProps {
  policy: InsurancePolicy;
  onClose: () => void;
  onRaiseClaim: () => void;
}

export const InsurancePolicyDetails: React.FC<InsurancePolicyDetailsProps> = ({ 
  policy, 
  onClose,
  onRaiseClaim 
}) => {
  const { payInsurancePremium, renewInsurancePolicy, accounts } = useBanking();
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authType, setAuthType] = useState<'pay' | 'renew'>('pay');

  const handlePayPremium = () => {
    setAuthType('pay');
    setIsAuthOpen(true);
  };

  const handleRenew = () => {
    setAuthType('renew');
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    if (authType === 'pay') {
      payInsurancePremium(policy.id, policy.premiumAmount, accounts[0].id);
    } else {
      renewInsurancePolicy(policy.id, policy.premiumAmount, accounts[0].id);
      setIsRenewOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Policy Details</h2>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">{policy.policyNumber}</p>
          </div>
        </div>
        <button 
          onClick={() => setIsOptionsOpen(true)}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <MoreVertical className="w-5 h-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Status Card */}
        <div className="p-6">
          <div className={`p-6 rounded-[32px] text-white space-y-6 relative overflow-hidden ${
            policy.type === 'Health' ? 'bg-rose-600' : 
            policy.type === 'Life' ? 'bg-blue-600' : 'bg-orange-600'
          }`}>
            <div className="absolute top-0 right-0 p-4">
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-md">
                {policy.status.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                {policy.type === 'Health' ? <Heart className="w-7 h-7" /> : 
                 policy.type === 'Life' ? <LifeBuoy className="w-7 h-7" /> : <Car className="w-7 h-7" />}
              </div>
              <div>
                <h3 className="text-xl font-black">{policy.planName}</h3>
                <p className="text-xs text-white/70">{policy.provider}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Coverage Amount</p>
                <p className="text-lg font-black mt-1">₹{(policy.coverageAmount / 100000).toFixed(0)} Lakh</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Premium ({policy.premiumFrequency})</p>
                <p className="text-lg font-black mt-1">₹{policy.premiumAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="px-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Start Date</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{policy.startDate}</p>
            </div>
             <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Expiry Date</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{policy.expiryDate}</p>
            </div>
          </div>

          <div className="p-5 rounded-[28px] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nominees</h4>
            {policy.nominee.map((nom, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{nom.name}</p>
                    <p className="text-[10px] text-slate-500">{nom.relationship}</p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white">{nom.allocation}%</span>
              </div>
            ))}
          </div>

          <div className="p-5 rounded-[28px] bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-blue-600">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Policy Certificate</p>
                <p className="text-[10px] text-slate-500">PDF • 1.2 MB</p>
              </div>
            </div>
            <button className="p-2 rounded-xl bg-white dark:bg-slate-800 text-blue-600 shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Claim History Header */}
        <div className="mt-8 px-6 space-y-4">
           <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest px-1">Policy History</h3>
           <div className="space-y-3">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center z-10">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 my-1" />
                </div>
                <div className="flex-1 pb-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Premium Paid</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Jan 12, 2026 • ₹15,000 via •••• 0012</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center z-10">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1 pb-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Policy Active</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Verified & active since start date</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md absolute bottom-0 left-0 right-0">
        <div className="flex gap-3">
          <button 
            onClick={onRaiseClaim}
            className="flex-1 py-4 bg-rose-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-rose-200 dark:shadow-none"
          >
            <AlertCircle className="w-4 h-4" /> Raise Claim
          </button>
          <button 
            onClick={() => setIsRenewOpen(true)}
            className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2"
          >
            <History className="w-4 h-4" /> Renew
          </button>
        </div>
      </div>

      {/* Options Bottom Sheet */}
      <BottomSheet
        isOpen={isOptionsOpen}
        onClose={() => setIsOptionsOpen(false)}
        title="Policy Options"
      >
        <div className="space-y-2 p-2">
          <button className="w-full p-4 flex items-center gap-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Download Tax Receipt</p>
              <p className="text-[10px] text-slate-500">80C exemption certificate</p>
            </div>
          </button>
          <button className="w-full p-4 flex items-center gap-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Update Nominee</p>
              <p className="text-[10px] text-slate-500">Change beneficiary details</p>
            </div>
          </button>
          <button className="w-full p-4 flex items-center gap-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-left text-rose-600">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold">Cancel Policy</p>
              <p className="text-[10px] text-rose-500/70">Request policy termination</p>
            </div>
          </button>
        </div>
      </BottomSheet>

      {/* Renew Bottom Sheet */}
      <BottomSheet
        isOpen={isRenewOpen}
        onClose={() => setIsRenewOpen(false)}
        title="Renew Policy"
      >
        <div className="p-4 space-y-6">
          <div className="p-5 rounded-3xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 flex gap-4">
             <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
             <div className="space-y-1">
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-400">Continuous Coverage</h4>
                <p className="text-xs text-blue-700 dark:text-blue-500/80 leading-relaxed">
                  Renewing now ensures no break in coverage and preserves your No Claim Bonus (NCB).
                </p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Policy Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{policy.planName}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Renewal Term</span>
              <span className="font-bold text-slate-900 dark:text-white">1 Year (2026 - 2027)</span>
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <span className="font-extrabold text-slate-900 dark:text-white">Total Premium</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">₹{policy.premiumAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button 
            onClick={handleRenew}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none"
          >
            Confirm & Pay Renewal
          </button>
        </div>
      </BottomSheet>

      <SecureAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        title={authType === 'pay' ? 'Premium Payment' : 'Policy Renewal'}
      />
    </div>
  );
};

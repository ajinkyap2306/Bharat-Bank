import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Plus, 
  ArrowRight, 
  Heart, 
  Car, 
  Home, 
  Plane,
  ChevronRight,
  AlertCircle,
  Clock,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';

interface InsuranceOverviewProps {
  onBrowsePlans: () => void;
  onViewPolicy: (policy: any) => void;
  onRaiseClaim: (policy: any) => void;
}

export const InsuranceOverview: React.FC<InsuranceOverviewProps> = ({ 
  onBrowsePlans, 
  onViewPolicy,
  onRaiseClaim 
}) => {
  const { insurancePolicies, insuranceClaims } = useBanking();

  const activePolicies = insurancePolicies.filter(p => p.status === 'active');
  const pendingClaims = insuranceClaims.filter(c => c.status !== 'settled');

  return (
    <div className="space-y-6 pb-6">
      {/* Insurance Hero Card */}
      <div className="p-6 rounded-4xl bg-linear-to-br from-blue-700 to-indigo-800 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12 blur-2xl" />
        
        <div className="relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200">Active Protection</span>
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">{activePolicies.length}</h2>
            <p className="text-xs text-blue-100 font-medium mt-1">Live Insurance Policies</p>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex -space-x-2">
              {[Heart, Car, Home, Plane].map((Icon, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-white/20 border-2 border-blue-700 flex items-center justify-center backdrop-blur-md">
                  <Icon className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
            <button 
              onClick={onBrowsePlans}
              className="text-xs font-bold bg-white text-blue-700 px-4 py-2 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all shadow-lg"
            >
              Get More Cover <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Pending Claims Notification */}
      {pendingClaims.length > 0 && (
        <div className="p-4 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Claim in Progress</h4>
              <p className="text-[10px] text-slate-500">Claim ID: {pendingClaims[0].claimNumber}</p>
            </div>
          </div>
          <button className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-400 shadow-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Categories</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Heart, label: 'Health', color: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' },
            { icon: LifeBuoy, label: 'Life', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' },
            { icon: Car, label: 'Motor', color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600' },
            { icon: Plane, label: 'Travel', color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600' }
          ].map((cat, i) => (
            <button key={i} onClick={onBrowsePlans} className="flex flex-col items-center gap-2">
              <div className={`w-14 h-14 rounded-2xl ${cat.color} flex items-center justify-center shadow-sm active:scale-95 transition-all`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* My Policies */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Policies</h3>
          <button className="text-[10px] font-bold text-blue-600">View History</button>
        </div>

        <div className="space-y-3">
          {activePolicies.length === 0 ? (
            <div className="p-8 rounded-4xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">No active policies</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-50">Secure your future with our flexible plans.</p>
              <button 
                onClick={onBrowsePlans}
                className="mt-4 text-xs font-bold text-blue-600"
              >
                Browse Plans
              </button>
            </div>
          ) : (
            activePolicies.map(policy => (
              <motion.div
                key={policy.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewPolicy(policy)}
                className="p-5 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs relative overflow-hidden group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                      policy.type === 'Health' ? 'bg-rose-50 text-rose-600' : 
                      policy.type === 'Life' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {policy.type === 'Health' ? <Heart className="w-5 h-5" /> : 
                       policy.type === 'Life' ? <LifeBuoy className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">{policy.planName}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{policy.policyNumber}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Coverage</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">₹{(policy.coverageAmount / 100000).toFixed(0)} Lakh</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Expiry</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{policy.expiryDate}</p>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                    <span>Next Premium: ₹{policy.premiumAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRaiseClaim(policy); }}
                    className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg"
                  >
                    Raise Claim
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Support Card */}
      <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
            <LifeBuoy className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Insurance Helpline</h4>
            <p className="text-[10px] text-slate-500">24/7 Claim Assistance</p>
          </div>
        </div>
        <button className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm">
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

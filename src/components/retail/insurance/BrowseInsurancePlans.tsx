import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Heart, 
  Car, 
  LifeBuoy, 
  Plane, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight,
  Info,
  ArrowRight,
  User,
  Users,
  Briefcase,
  Plus
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { InsurancePlan } from '../../../types/banking';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { ScreenHeader } from '../../common/ScreenHeader';

interface BrowseInsurancePlansProps {
  onClose: () => void;
}

type FlowStep = 'list' | 'details' | 'customize' | 'nominee' | 'review' | 'success';

export const BrowseInsurancePlans: React.FC<BrowseInsurancePlansProps> = ({ onClose }) => {
  const { insurancePlans, buyInsurance, accounts } = useBanking();
  const [activeCategory, setActiveCategory] = useState<'All' | 'Health' | 'Life' | 'Motor' | 'Travel'>('All');
  const [step, setStep] = useState<FlowStep>('list');
  const [selectedPlan, setSelectedPlan] = useState<InsurancePlan | null>(null);
  const [coverageAmount, setCoverageAmount] = useState(1000000);
  const [nominees, setNominees] = useState([{ name: '', relationship: '', allocation: 100 }]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const filteredPlans = insurancePlans.filter(p => activeCategory === 'All' || p.type === activeCategory);

  const handleSelectPlan = (plan: InsurancePlan) => {
    setSelectedPlan(plan);
    setStep('details');
  };

  const handleBuy = () => {
    setIsAuthOpen(true);
  };

  const handleAuthComplete = () => {
    setIsAuthOpen(false);
    if (selectedPlan) {
      buyInsurance(selectedPlan.id, {
        coverageAmount,
        nominees
      });
      setStep('success');
    }
  };

  const handleHeaderBack = () => {
    if (step === 'list' || step === 'success') {
      onClose();
      return;
    }
    if (step === 'details') setStep('list');
    else if (step === 'customize') setStep('details');
    else if (step === 'nominee') setStep('customize');
    else if (step === 'review') setStep('nominee');
  };

  const headerTitle =
    step === 'list' ? 'Browse Insurance' :
    step === 'success' ? 'Policy Issued' :
    selectedPlan?.name ?? 'Insurance Plan';

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col h-full overflow-hidden">
      <ScreenHeader
        edgeToEdge={false}
        title={headerTitle}
        subtitle={step === 'list' ? 'Compare plans & buy online' : undefined}
        onBack={handleHeaderBack}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {step === 'list' && (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 space-y-6"
            >
              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
                {['All', 'Health', 'Life', 'Motor', 'Travel'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeCategory === cat 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Plans List */}
              <div className="space-y-4">
                {filteredPlans.map(plan => (
                  <motion.div
                    key={plan.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelectPlan(plan)}
                    className="p-5 rounded-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          plan.type === 'Health' ? 'bg-rose-50 text-rose-600' : 
                          plan.type === 'Life' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {plan.type === 'Health' ? <Heart className="w-6 h-6" /> : 
                           plan.type === 'Life' ? <LifeBuoy className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{plan.name}</h4>
                          <p className="text-[10px] text-slate-500">{plan.provider}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-slate-400 uppercase font-bold">From</p>
                        <p className="text-sm font-black text-slate-900 dark:text-white">₹{plan.startingPremium}/mo</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">{plan.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {plan.keyBenefits.slice(0, 2).map((benefit, i) => (
                        <span key={i} className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {benefit}
                        </span>
                      ))}
                    </div>

                    <button className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2">
                      View Details <ChevronRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'details' && selectedPlan && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="p-6 bg-slate-900 text-white space-y-4">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                    {selectedPlan.type === 'Health' ? <Heart className="w-7 h-7 text-rose-400" /> : 
                     selectedPlan.type === 'Life' ? <LifeBuoy className="w-7 h-7 text-blue-400" /> : <Car className="w-7 h-7 text-orange-400" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black">{selectedPlan.name}</h3>
                    <p className="text-xs text-slate-400">{selectedPlan.provider}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Key Benefits</h4>
                  <div className="grid gap-3">
                    {selectedPlan.keyBenefits.map((benefit, i) => (
                      <div key={i} className="flex gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                        <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0 text-emerald-500">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white self-center">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Coverage Details</h4>
                  <div className="p-5 rounded-[28px] bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100/50 dark:border-blue-900/20">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs text-slate-700 dark:text-slate-300">Coverage Range</span>
                      <span className="text-sm font-bold text-blue-700 dark:text-blue-400">{selectedPlan.coverageRange}</span>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">What's not covered</h5>
                      <div className="space-y-1">
                        {selectedPlan.exclusions.map((exc, i) => (
                          <div key={i} className="flex items-center gap-2 text-[10px] text-slate-500">
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            {exc}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'customize' && (
            <motion.div 
              key="customize"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 space-y-8"
            >
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Sum Insured (Coverage)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[500000, 1000000, 2500000, 5000000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setCoverageAmount(amt)}
                      className={`p-4 rounded-2xl border-2 text-center transition-all ${
                        coverageAmount === amt 
                          ? 'border-blue-600 bg-blue-50/30 text-blue-700 font-black' 
                          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 font-bold'
                      }`}
                    >
                      ₹{(amt/100000).toFixed(0)} Lakh
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">Premium Payer</label>
                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Self (Pay for myself)</p>
                      <p className="text-[10px] text-slate-500">Age: 28 Years</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>

              <div className="p-6 rounded-4xl bg-blue-600 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Monthly Premium</p>
                    <h3 className="text-2xl font-black mt-1">₹{(selectedPlan!.startingPremium * (coverageAmount/500000)).toLocaleString('en-IN')}</h3>
                  </div>
                  <ShieldCheck className="w-10 h-10 text-white/20" />
                </div>
                <p className="text-[10px] text-blue-100/70 mt-4 leading-relaxed">
                  Includes GST and applicable taxes. No medical test required for this coverage amount.
                </p>
              </div>
            </motion.div>
          )}

          {step === 'nominee' && (
            <motion.div 
              key="nominee"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 space-y-6"
            >
              <div className="text-center space-y-2 mb-4">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Add Nominee Details</h3>
                <p className="text-xs text-slate-500">Designate who will receive the benefits of this policy.</p>
              </div>

              <div className="space-y-4">
                {nominees.map((nominee, idx) => (
                  <div key={idx} className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Full Name</label>
                      <input 
                        type="text" 
                        value={nominee.name}
                        onChange={(e) => {
                          const newNominees = [...nominees];
                          newNominees[idx].name = e.target.value;
                          setNominees(newNominees);
                        }}
                        className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl text-xs font-bold outline-none border border-slate-100 dark:border-slate-700 focus:border-blue-500 transition-colors"
                        placeholder="As per Aadhaar"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Relationship</label>
                        <select 
                          value={nominee.relationship}
                          onChange={(e) => {
                            const newNominees = [...nominees];
                            newNominees[idx].relationship = e.target.value;
                            setNominees(newNominees);
                          }}
                          className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl text-xs font-bold outline-none border border-slate-100 dark:border-slate-700"
                        >
                          <option value="">Select</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Child">Child</option>
                          <option value="Parent">Parent</option>
                          <option value="Sibling">Sibling</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Allocation (%)</label>
                        <input 
                          type="number" 
                          value={nominee.allocation}
                          className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl text-xs font-bold outline-none border border-slate-100 dark:border-slate-700"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2">
                  <Plus className="w-3 h-3" /> Add Another Nominee
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center space-y-6 py-12 px-6"
            >
              <div className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center relative">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Policy Issued!</h3>
                <p className="text-sm text-slate-500 max-w-70 mx-auto leading-relaxed">
                  Your insurance policy has been successfully issued. Digital copy sent to your registered email.
                </p>
              </div>

              <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-5 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Sum Insured</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{(coverageAmount/100000).toFixed(0)} Lakh</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500">Validity</span>
                  <span className="font-bold text-slate-900 dark:text-white">Aug 18, 2026 - Aug 17, 2027</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white">Annual Premium</span>
                  <span className="font-black text-slate-900 dark:text-white">₹{(selectedPlan!.startingPremium * 12 * (coverageAmount/500000)).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Go to My Policies <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      {step !== 'list' && step !== 'success' && (
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <button
            onClick={() => {
              if (step === 'details') setStep('customize');
              else if (step === 'customize') setStep('nominee');
              else if (step === 'nominee') handleBuy();
            }}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            {step === 'details' ? 'Check Premium' : 
             step === 'customize' ? 'Add Nominee' : 'Confirm & Buy'} 
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Authentication */}
      <SecureAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthComplete}
        title="Payment Authorization"
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  Search, 
  Building2, 
  CreditCard, 
  Check, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Building
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { Beneficiary } from '../../../types/banking';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { searchIfsc } from '../../../data/ifscMock';

interface AddBeneficiaryFlowProps {
  onBack: () => void;
  onSuccess: (ben: Beneficiary) => void;
}

const AddBeneficiaryFlow: React.FC<AddBeneficiaryFlowProps> = ({ onBack, onSuccess }) => {
  const { addBeneficiary, hideBottomNav, showBottomNav } = useBanking();
  const [step, setStep] = useState<'type' | 'details' | 'verify' | 'auth' | 'success'>('type');
  const [type, setType] = useState<'retail_other' | 'retail_internal'>('retail_other');
  
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: '',
    ifsc: '',
    nickname: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState<Beneficiary | null>(null);
  const [ifscQuery, setIfscQuery] = useState('');

  const ifscMatches = searchIfsc(ifscQuery || formData.ifsc).slice(0, 6);

  useEffect(() => {
    hideBottomNav();
    return () => showBottomNav();
  }, []);

  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Full name is required';
    if (!formData.accountNumber) newErrors.accountNumber = 'Account number is required';
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      newErrors.confirmAccountNumber = 'Account numbers do not match';
    }
    if (type === 'retail_other' && !formData.ifsc) newErrors.ifsc = 'IFSC code is required';
    if (type === 'retail_other' && !formData.bankName) newErrors.bankName = 'Bank name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = () => {
    if (!validateDetails()) return;
    
    setIsVerifying(true);
    // Mock verification delay
    setTimeout(() => {
      setIsVerifying(false);
      setStep('verify');
    }, 2000);
  };

  const handleAuthComplete = () => {
    setIsAuthOpen(false);
    
    const ben = addBeneficiary({
      name: formData.name,
      accountNumber: formData.accountNumber,
      bankName: formData.bankName || 'Bharat Bank',
      ifsc: formData.ifsc || 'BHARAT001',
      type: type,
      transferLimit: 100000,
      nickname: formData.nickname,
      phone: formData.phone,
      email: formData.email,
      addedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    });

    setNewBeneficiary(ben);
    setStep('success');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 z-20">
      {/* Header */}
      <div className="px-4 py-4 flex items-center border-b border-slate-100 dark:border-slate-800">
        <button onClick={step === 'type' ? onBack : () => setStep('type')} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="ml-2 text-xl font-bold text-slate-900 dark:text-white">
          {step === 'success' ? 'Success' : 'Add Beneficiary'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 'type' && (
            <motion.div
              key="type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Select Beneficiary Type
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Choose how you want to add the new payee.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    setType('retail_other');
                    setStep('details');
                  }}
                  className="w-full p-4 flex items-center space-x-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-left hover:border-blue-500 transition-colors group"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">Other Bank Account</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Add payee with different bank account</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </button>

                <button
                  onClick={() => {
                    setType('retail_internal');
                    setStep('details');
                    setFormData(prev => ({ ...prev, bankName: 'Bharat Bank', ifsc: 'BHARAT001' }));
                  }}
                  className="w-full p-4 flex items-center space-x-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl text-left hover:border-blue-500 transition-colors group"
                >
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white">Bharat Bank Account</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Payee already has a Bharat Bank account</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter full name as per bank records"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Account Number
                  </label>
                  <input
                    type="password"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    placeholder="Enter bank account number"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.accountNumber ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.accountNumber && <p className="text-xs text-red-500 mt-1 font-medium">{errors.accountNumber}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Confirm Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.confirmAccountNumber}
                    onChange={(e) => setFormData({ ...formData, confirmAccountNumber: e.target.value })}
                    placeholder="Re-enter bank account number"
                    className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.confirmAccountNumber ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {errors.confirmAccountNumber && <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmAccountNumber}</p>}
                </div>

                {type === 'retail_other' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          IFSC Code
                        </label>
                        <input
                          type="text"
                          value={formData.ifsc}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            setFormData({ ...formData, ifsc: value });
                            setIfscQuery(value);
                          }}
                          placeholder="e.g. HDFC0001"
                          className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase ${
                            errors.ifsc ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          placeholder="Bank name"
                          className={`w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                            errors.bankName ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                          }`}
                        />
                      </div>
                    </div>
                    {ifscMatches.length > 0 && formData.ifsc.length >= 2 && (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                        {ifscMatches.map((match) => (
                          <button
                            key={match.ifsc}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                ifsc: match.ifsc,
                                bankName: match.bankName,
                              });
                              setIfscQuery('');
                            }}
                            className="w-full text-left px-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                          >
                            <p className="text-xs font-bold font-mono">{match.ifsc}</p>
                            <p className="text-[11px] text-slate-500">{match.bankName} — {match.branch}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    {(errors.ifsc || errors.bankName) && (
                      <p className="text-xs text-red-500 mt-1 font-medium">IFSC and Bank name are required</p>
                    )}
                  </>
                )}

                <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    placeholder="e.g. Rent, Mom's Account"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={handleVerify}
                  disabled={isVerifying}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2 disabled:bg-blue-400"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify Details</span>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-8"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verify Payee Details</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Bank details verified successfully.</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-start pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beneficiary Name</p>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{formData.name}</p>
                  </div>
                  <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 p-1 rounded">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 pt-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bank</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formData.bankName || 'Bharat Bank'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IFSC</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{formData.ifsc || 'BHARAT001'}</p>
                  </div>
                  <div className="col-span-2 space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Number</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wider">
                      •••• •••• {formData.accountNumber.slice(-4)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center"
                >
                  Confirm & Add
                </button>
                <button
                  onClick={() => setStep('details')}
                  className="w-full py-3 text-slate-600 dark:text-slate-400 font-bold"
                >
                  Edit Details
                </button>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[500px]"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 mb-6"
              >
                <Check className="w-12 h-12" strokeWidth={3} />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Beneficiary Added Successfully
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-[250px]">
                {newBeneficiary?.name} has been added to your verified list.
              </p>

              <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 text-left mb-8 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payee Name</span>
                  <span className="font-bold text-slate-900 dark:text-white">{newBeneficiary?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Bank</span>
                  <span className="font-bold text-slate-900 dark:text-white">{newBeneficiary?.bankName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Account No.</span>
                  <span className="font-bold text-slate-900 dark:text-white">{newBeneficiary?.maskedAccount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Beneficiary ID</span>
                  <span className="font-bold text-slate-900 dark:text-white">{newBeneficiary?.id.toUpperCase()}</span>
                </div>
              </div>

              <div className="w-full space-y-4">
                <button
                  onClick={() => newBeneficiary && onSuccess(newBeneficiary)}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold"
                >
                  Transfer Money
                </button>
                <button
                  onClick={onBack}
                  className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold"
                >
                  Go to Beneficiaries
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SecureAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthComplete}
        actionName="Add Beneficiary"
        amount={0}
      />
    </div>
  );
};

export default AddBeneficiaryFlow;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronLeft, 
  AlertCircle, 
  Calendar, 
  FileText, 
  Upload, 
  Camera, 
  CheckCircle2, 
  ArrowRight,
  Info,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { InsurancePolicy } from '../../../types/banking';

interface InsuranceClaimFlowProps {
  policy: InsurancePolicy;
  onClose: () => void;
}

type ClaimStep = 'type' | 'details' | 'documents' | 'review' | 'success';

export const InsuranceClaimFlow: React.FC<InsuranceClaimFlowProps> = ({ policy, onClose }) => {
  const { submitInsuranceClaim } = useBanking();
  const [step, setStep] = useState<ClaimStep>('type');
  const [claimType, setClaimType] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [files, setFiles] = useState<string[]>([]);

  const handleNext = () => {
    if (step === 'type') setStep('details');
    else if (step === 'details') setStep('documents');
    else if (step === 'documents') setStep('review');
    else if (step === 'review') {
      submitInsuranceClaim(policy.id, {
        type: claimType,
        date: incidentDate,
        description,
        amount: Number(amount)
      });
      setStep('success');
    }
  };

  const handleBack = () => {
    if (step === 'details') setStep('type');
    else if (step === 'documents') setStep('details');
    else if (step === 'review') setStep('documents');
  };

  const claimTypes = policy.type === 'Health' 
    ? ['Hospitalization', 'Day Care Treatment', 'OPD / Consultation', 'Critical Illness']
    : policy.type === 'Motor'
    ? ['Accident', 'Theft', 'Third Party Liability', 'Natural Calamity']
    : ['Natural Death', 'Accidental Death', 'Terminal Illness'];

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-950 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {step !== 'type' && step !== 'success' && (
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          )}
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {step === 'success' ? 'Claim Raised' : 'Raise Insurance Claim'}
          </h2>
        </div>
        {step !== 'success' && (
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {step !== 'success' && (
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <motion.div 
            className="h-full bg-rose-600"
            initial={{ width: '0%' }}
            animate={{ 
              width: step === 'type' ? '25%' : 
                     step === 'details' ? '50%' : 
                     step === 'documents' ? '75%' : '95%' 
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <AnimatePresence mode="wait">
          {step === 'type' && (
            <motion.div 
              key="type"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Select Claim Type</h3>
                <div className="space-y-3">
                  {claimTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setClaimType(type)}
                      className={`w-full p-5 rounded-[28px] border-2 text-left transition-all ${
                        claimType === type 
                          ? 'border-rose-600 bg-rose-50/30 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400' 
                          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">{type}</span>
                        {claimType === type && <CheckCircle2 className="w-5 h-5" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 'details' && (
            <motion.div 
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Date of Incident</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date"
                      value={incidentDate}
                      onChange={(e) => setIncidentDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 p-4 pl-12 rounded-2xl text-xs font-bold outline-none border border-slate-100 dark:border-slate-800 focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Estimated Claim Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 p-4 pl-8 rounded-2xl text-xs font-bold outline-none border border-slate-100 dark:border-slate-800 focus:border-rose-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase px-1">Describe Incident</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl text-xs font-bold outline-none border border-slate-100 dark:border-slate-800 focus:border-rose-500 transition-colors resize-none"
                    placeholder="Provide brief details about the event..."
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'documents' && (
            <motion.div 
              key="documents"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Upload Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all">
                    <Camera className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-bold">Take Photo</span>
                  </button>
                  <button className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all">
                    <Upload className="w-6 h-6 mb-2" />
                    <span className="text-[10px] font-bold">Upload PDF</span>
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase px-1">Required for {policy.type}</p>
                  <div className="space-y-2">
                    {[
                      'Policy Document copy',
                      policy.type === 'Health' ? 'Hospital Bills & Summary' : 'FIR / Incident Report',
                      'Bank account details for settlement'
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{doc}</span>
                        </div>
                        <Plus className="w-4 h-4 text-slate-300" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="p-6 rounded-[32px] bg-slate-900 text-white space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claim Amount</p>
                    <h3 className="text-2xl font-black mt-1 text-rose-400">₹{Number(amount).toLocaleString('en-IN')}</h3>
                  </div>
                  <AlertCircle className="w-8 h-8 text-rose-500" />
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Policy</p>
                    <p className="text-sm font-bold mt-1 truncate">{policy.planName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</p>
                    <p className="text-sm font-bold mt-1">{claimType}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incident Date</p>
                    <p className="text-sm font-bold mt-1">{incidentDate}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-[10px] text-amber-700 leading-normal font-medium">
                  Please ensure all information provided is accurate. Fraudulent claims are subject to legal action as per insurance terms.
                </p>
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
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Claim Submitted</h3>
                <p className="text-sm text-slate-500 max-w-[280px] mx-auto leading-relaxed">
                  Your claim has been registered and assigned a unique Reference Number for tracking.
                </p>
              </div>

              <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Claim Ref No</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">CLM-920144</p>
              </div>

              <div className="w-full space-y-3">
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-left">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">1</div>
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Document verification in progress</p>
                </div>
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-left opacity-50">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">2</div>
                  <p className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Claims officer assigned</p>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Back to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      {step !== 'success' && (
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
          <button
            onClick={handleNext}
            disabled={
              (step === 'type' && !claimType) ||
              (step === 'details' && (!incidentDate || !amount))
            }
            className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all ${
              ((step === 'type' && !claimType) || (step === 'details' && (!incidentDate || !amount)))
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-rose-600 hover:bg-rose-500 text-white active:scale-[0.98]'
            }`}
          >
            {step === 'review' ? 'Submit Claim' : 'Continue'} 
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

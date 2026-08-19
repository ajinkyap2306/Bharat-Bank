import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Flashlight, Scan, CheckCircle2 } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

interface CorporateQrScannerProps {
  onClose: () => void;
}

export const CorporateQrScanner: React.FC<CorporateQrScannerProps> = ({ onClose }) => {
  const { executeTransfer, accounts } = useBanking();
  const [step, setStep] = useState<'camera' | 'success'>('camera');
  const [amount] = useState('15000');

  const handleSimulateScan = () => {
    executeTransfer({
      fromAccountId: accounts[0]?.id || '',
      beneficiaryName: 'Bharat Cloud Solutions Vendor',
      beneficiaryAccount: 'bharatcloud.corp@bharatbank',
      bankName: 'UPI QR Payment',
      amount: Number(amount),
      mode: 'UPI',
      remarks: 'Corporate QR Scan Pay',
    });
    setStep('success');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
    >
      <div className="flex items-center justify-between px-4 pt-3 pb-2 safe-top text-white">
        <h1 className="text-base font-bold">Scan QR</h1>
        <button type="button" onClick={onClose} className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <X className="w-5 h-5" />
        </button>
      </div>

      {step === 'camera' ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="relative w-64 h-64 rounded-3xl border-2 border-white/30 flex items-center justify-center">
            <Scan className="w-12 h-12 text-white/40" />
          </div>
          <button
            type="button"
            onClick={handleSimulateScan}
            className="mt-8 px-4 py-2 rounded-full bg-white/15 text-white text-sm"
          >
            Simulate Vendor QR (₹15,000)
          </button>
          <button type="button" className="mt-6 p-3 rounded-full bg-white/15 text-white">
            <Flashlight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-white text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4" />
          <h2 className="text-xl font-bold">Payment Successful</h2>
          <button type="button" onClick={onClose} className="mt-6 px-6 py-3 rounded-2xl bg-congress-blue-600 font-bold">
            Done
          </button>
        </div>
      )}
    </motion.div>
  );
};

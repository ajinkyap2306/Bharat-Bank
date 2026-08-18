import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Flashlight, Image as ImageIcon, QrCode, Scan, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';

export const ScannerModal: React.FC = () => {
  const { isScannerOpen, closeScanner, executeTransfer, accounts, bankingType } = useBanking();
  const [activeMode, setActiveMode] = useState<'scan' | 'my_qr'>('scan');
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [scannedMerchant, setScannedMerchant] = useState<{
    name: string;
    upiId: string;
    defaultAmount?: number;
    category: string;
  } | null>(null);
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'camera' | 'amount' | 'pin' | 'success'>('camera');
  const [pin, setPin] = useState(['', '', '', '']);

  if (!isScannerOpen) return null;

  const handleSimulateScan = (merchantType: 'starbucks' | 'croma' | 'vendor') => {
    if (merchantType === 'starbucks') {
      setScannedMerchant({
        name: 'Starbucks Coffee Reserve',
        upiId: 'starbucks.mumbai@hdfcbank',
        defaultAmount: 480,
        category: 'Food & Dining',
      });
      setAmount('480');
    } else if (merchantType === 'croma') {
      setScannedMerchant({
        name: 'Croma Electronics BKC',
        upiId: 'croma.retail@icici',
        defaultAmount: 2499,
        category: 'Electronics & Retail',
      });
      setAmount('2499');
    } else {
      setScannedMerchant({
        name: 'Bharat Cloud Solutions Vendor',
        upiId: 'bharatcloud.corp@bharatbank',
        defaultAmount: 15000,
        category: 'Enterprise IT Services',
      });
      setAmount('15000');
    }
    setStep('amount');
  };

  const handlePay = () => {
    if (!amount || Number(amount) <= 0) return;
    setStep('pin');
  };

  const handlePinInput = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newPin = [...pin];
    newPin[index] = val ? val.slice(-1) : '';
    setPin(newPin);

    // Auto submit if 4 digits entered
    if (index === 3 && val) {
      setTimeout(() => {
        executeTransfer({
          fromAccountId: accounts[0]?.id || '',
          beneficiaryName: scannedMerchant?.name || 'QR Merchant',
          beneficiaryAccount: scannedMerchant?.upiId || 'merchant@upi',
          bankName: 'UPI QR Payment',
          amount: Number(amount),
          mode: 'UPI',
          remarks: `QR Scan Pay to ${scannedMerchant?.name}`
        });
        setStep('success');
      }, 500);
    }
  };

  const handleResetAndClose = () => {
    setStep('camera');
    setScannedMerchant(null);
    setAmount('');
    setPin(['', '', '', '']);
    closeScanner();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-950 flex flex-col justify-between"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 pt-12 pb-4 text-white z-20">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Scan className="w-4 h-4 text-emerald-400" />
            </span>
            <span className="font-bold text-sm tracking-wide">BharatQR Scanner</span>
          </div>
          <button
            onClick={handleResetAndClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center z-20 px-6">
          <div className="flex bg-white/10 backdrop-blur-md p-1 rounded-full text-xs font-semibold text-white/70">
            <button
              onClick={() => { setActiveMode('scan'); setStep('camera'); }}
              className={`px-5 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeMode === 'scan' ? 'bg-blue-600 text-white shadow-md' : 'hover:text-white'
              }`}
            >
              <Scan className="w-3.5 h-3.5" /> Scan QR
            </button>
            <button
              onClick={() => setActiveMode('my_qr')}
              className={`px-5 py-2 rounded-full transition-all flex items-center gap-1.5 ${
                activeMode === 'my_qr' ? 'bg-blue-600 text-white shadow-md' : 'hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" /> My QR Code
            </button>
          </div>
        </div>

        {/* Center Viewport */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
          {activeMode === 'scan' ? (
            <>
              {step === 'camera' && (
                <div className="relative w-72 h-72 rounded-3xl border-2 border-emerald-400/60 flex items-center justify-center overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />

                  {/* Animated laser line */}
                  <motion.div
                    animate={{ y: [-130, 130] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', repeatType: 'reverse' }}
                    className="absolute w-full h-1 bg-linear-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399]"
                  />

                  <div className="text-center text-white/60 text-xs px-4">
                    <p className="font-medium text-white mb-1">Align QR Code within Frame</p>
                    <p className="text-[11px]">Supports UPI, BharatQR, GST Invoices & Diners</p>
                  </div>
                </div>
              )}

              {step === 'amount' && scannedMerchant && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800"
                >
                  <div className="text-center mb-5">
                    <span className="inline-block px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold mb-2">
                      Verified UPI Merchant
                    </span>
                    <h3 className="text-lg font-bold">{scannedMerchant.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{scannedMerchant.upiId}</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl mb-5">
                    <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Paying Amount</label>
                    <div className="flex items-center mt-1">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white mr-2">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full text-3xl font-extrabold bg-transparent outline-none text-slate-900 dark:text-white"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 mb-6 flex justify-between">
                    <span>Debit from: {accounts[0]?.nickname || 'Primary Account'}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      ₹{accounts[0]?.availableBalance.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={handlePay}
                    disabled={!amount || Number(amount) <= 0}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Proceed to Pay</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {step === 'pin' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 text-slate-900 dark:text-white shadow-2xl text-center"
                >
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-2xl mx-auto flex items-center justify-center text-blue-600 mb-3">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold">Enter 4-Digit MPIN</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-6">Authenticating ₹{Number(amount).toLocaleString('en-IN')}</p>

                  <div className="flex justify-center gap-3 mb-6">
                    {pin.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`pin-${idx}`}
                        type="password"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinInput(idx, e.target.value)}
                        className="w-12 h-14 text-center text-2xl font-bold bg-slate-100 dark:bg-slate-800 rounded-xl outline-none border-2 border-transparent focus:border-blue-500 text-slate-900 dark:text-white"
                        autoFocus={idx === 0}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400">Default Demo MPIN: 1 2 3 4</p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 text-center text-slate-900 dark:text-white shadow-2xl"
                >
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 rounded-full mx-auto flex items-center justify-center text-emerald-500 mb-4 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Payment Successful!</h3>
                  <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                    ₹{Number(amount).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Paid to {scannedMerchant?.name}</p>

                  <div className="mt-6 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-left text-xs space-y-1.5 font-mono text-slate-600 dark:text-slate-400">
                    <div className="flex justify-between">
                      <span>UPI Ref No:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {Math.floor(100000000000 + Math.random() * 900000000000)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="text-emerald-500 font-bold">SUCCESS (Settled)</span>
                    </div>
                  </div>

                  <button
                    onClick={handleResetAndClose}
                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl"
                  >
                    Done
                  </button>
                </motion.div>
              )}
            </>
          ) : (
            /* My QR Code Card */
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xs bg-white dark:bg-slate-900 rounded-3xl p-6 text-center text-slate-900 dark:text-white shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">
                {bankingType === 'retail' ? 'Bharat Personal VPA' : 'Bharat Enterprise Virtual Account'}
              </div>
              <h3 className="font-bold text-base">
                {bankingType === 'retail' ? 'Arjun Mehta' : 'Nexus Innovations Pvt Ltd'}
              </h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {bankingType === 'retail' ? 'arjun.mehta@bharatbank' : 'nexus.corp@bharatbank'}
              </p>

              {/* QR Code Graphic */}
              <div className="my-5 p-4 bg-white rounded-2xl shadow-inner border border-slate-200 inline-block">
                <svg viewBox="0 0 100 100" className="w-44 h-44 fill-slate-900">
                  {/* Stylized QR Matrix Pattern */}
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#005dd4" />
                  <rect x="9" y="9" width="18" height="18" fill="white" />
                  <rect x="13" y="13" width="10" height="10" fill="#005dd4" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#005dd4" />
                  <rect x="73" y="9" width="18" height="18" fill="white" />
                  <rect x="77" y="13" width="10" height="10" fill="#005dd4" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#005dd4" />
                  <rect x="9" y="73" width="18" height="18" fill="white" />
                  <rect x="13" y="77" width="10" height="10" fill="#005dd4" />

                  {/* Data blocks */}
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="48" y="8" width="8" height="6" />
                  <rect x="36" y="20" width="8" height="6" />
                  <rect x="48" y="20" width="6" height="6" />
                  <rect x="8" y="38" width="6" height="8" />
                  <rect x="20" y="38" width="8" height="6" />
                  <rect x="38" y="38" width="24" height="24" rx="4" fill="#005dd4" />
                  <circle cx="50" cy="50" r="6" fill="white" />
                  <rect x="68" y="38" width="8" height="8" />
                  <rect x="82" y="38" width="10" height="6" />
                  <rect x="38" y="68" width="6" height="10" />
                  <rect x="50" y="72" width="12" height="6" />
                  <rect x="72" y="68" width="10" height="8" />
                  <rect x="84" y="80" width="8" height="12" />
                </svg>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 dark:bg-emerald-950/50 py-1.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" /> Instant Credit Activated
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Simulated Scan Helpers */}
        {step === 'camera' && activeMode === 'scan' && (
          <div className="p-6 text-center z-20 bg-linear-to-t from-black/90 to-transparent">
            <p className="text-xs text-white/70 mb-3">Simulate Scanning Quick Merchants:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => handleSimulateScan('starbucks')}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur-md transition-all"
              >
                ☕ Starbucks (₹480)
              </button>
              <button
                onClick={() => handleSimulateScan('croma')}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur-md transition-all"
              >
                ⚡ Croma (₹2,499)
              </button>
              <button
                onClick={() => handleSimulateScan('vendor')}
                className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium backdrop-blur-md transition-all"
              >
                🏢 Enterprise Vendor (₹15,000)
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-6">
              <button
                onClick={() => setIsTorchOn(!isTorchOn)}
                className={`p-3 rounded-full ${isTorchOn ? 'bg-yellow-400 text-slate-900' : 'bg-white/15 text-white'}`}
              >
                <Flashlight className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleSimulateScan('starbucks')}
                className="p-3 rounded-full bg-white/15 text-white"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

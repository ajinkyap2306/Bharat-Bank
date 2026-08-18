import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  Wifi, 
  Flame, 
  Smartphone, 
  Tv, 
  Droplet, 
  CreditCard, 
  Car, 
  CheckCircle2, 
  ArrowRight, 
  Search,
  Plus
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { Biller } from '../../types/banking';

export const RetailBills: React.FC = () => {
  const { billers, payBiller, accounts, addToast, setBottomNavHidden } = useBanking();
  const [selectedBiller, setSelectedBiller] = useState<Biller | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isPaying, setIsPaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Bottom Navigation visibility: HIDDEN during Bill Payment form & processing
  useEffect(() => {
    if (selectedBiller) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [selectedBiller, setBottomNavHidden]);

  const categories = [
    { id: 'all', name: 'All Bills', icon: Zap },
    { id: 'electricity', name: 'Electricity', icon: Zap },
    { id: 'broadband', name: 'Broadband', icon: Wifi },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
    { id: 'gas', name: 'Piped Gas', icon: Flame },
    { id: 'water', name: 'Water', icon: Droplet },
    { id: 'dth', name: 'DTH TV', icon: Tv },
  ];

  const filteredBillers = billers.filter(b => 
    activeCategory === 'all' ? true : b.category === activeCategory
  );

  const handleOpenBiller = (biller: Biller) => {
    setSelectedBiller(biller);
    setAmount(biller.lastBilledAmount ? biller.lastBilledAmount.toString() : '999');
  };

  const handlePayBill = () => {
    if (!selectedBiller) return;
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      payBiller(selectedBiller.id, Number(amount), accounts[0].id);
      setSelectedBiller(null);
    }, 1000);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Bill Payments & Utilities</h3>
        <p className="text-xs text-slate-500">Bharat Bill Payment System (BBPS) certified</p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border shrink-0 ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Saved Billers Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Your Active Billers ({filteredBillers.length})
          </h4>
          <button
            onClick={() => addToast({ type: 'info', title: 'Add Biller', message: 'Search across 20,000+ BBPS utility billers.' })}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add New
          </button>
        </div>

        <div className="space-y-2.5">
          {filteredBillers.map((biller) => {
            const hasDue = biller.lastBilledAmount && biller.lastBilledAmount > 0;
            return (
              <div
                key={biller.id}
                onClick={() => handleOpenBiller(biller)}
                className="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 cursor-pointer shadow-xs active:scale-98 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    {biller.category === 'electricity' && <Zap className="w-5 h-5" />}
                    {biller.category === 'broadband' && <Wifi className="w-5 h-5" />}
                    {biller.category === 'gas' && <Flame className="w-5 h-5" />}
                    {biller.category === 'mobile' && <Smartphone className="w-5 h-5" />}
                    {biller.category === 'water' && <Droplet className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {biller.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Consumer ID: {biller.consumerNumber}
                    </p>
                    {biller.isAutoPay && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded-md mt-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> AutoPay Active
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {hasDue ? (
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        ₹{biller.lastBilledAmount?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-amber-500 font-semibold mt-0.5">
                        Due by {biller.dueDate}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        Paid
                      </span>
                      <p className="text-[9px] text-slate-400 mt-0.5">{biller.dueDate}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pay Biller Bottom Sheet Modal */}
      {selectedBiller && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="text-center pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600">
                BBPS Bill Payment
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5">
                {selectedBiller.name}
              </h3>
              <p className="text-xs text-slate-400 font-mono">Consumer No: {selectedBiller.consumerNumber}</p>
            </div>

            <div className="py-4 space-y-3">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl">
                <label className="text-[11px] text-slate-500 font-medium">Billed Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-2xl font-extrabold bg-transparent outline-none text-slate-900 dark:text-white mt-1"
                />
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Debit from:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Primary Salary Account (•••• 0012)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Convenience Fee:</span>
                  <span className="text-emerald-500 font-bold">₹0.00</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => setSelectedBiller(null)}
                className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handlePayBill}
                disabled={isPaying}
                className="py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md disabled:opacity-50"
              >
                {isPaying ? 'Authorizing...' : 'Pay Bill Now'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

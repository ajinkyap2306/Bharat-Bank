import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronLeft, 
  Download, 
  Share2, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  CreditCard, 
  Calendar,
  ArrowRightLeft,
  MapPin, 
  Info,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  XCircle,
  Hash,
  ChevronRight
} from 'lucide-react';
import { Transaction } from '../../../types/banking';
import { useBanking } from '../../../context/BankingContext';

interface TransactionDetailsViewProps {
  transaction: Transaction;
  onBack: () => void;
}

const TransactionDetailsView: React.FC<TransactionDetailsViewProps> = ({ transaction, onBack }) => {
  const { setTransferRepeat, setRetailTab, addToast } = useBanking();

  const handleRepeatTransfer = () => {
    if (transaction.type !== 'debit' || transaction.category !== 'transfer') {
      addToast({
        type: 'info',
        title: 'Repeat Transfer',
        message: 'Only outbound transfer transactions can be repeated.',
      });
      return;
    }
    setTransferRepeat({
      beneficiaryName: transaction.counterpartyName,
      beneficiaryAccount: transaction.counterpartyAccount,
      bankName: 'Beneficiary Bank',
      amount: transaction.amount,
      mode: transaction.paymentMode,
      remarks: transaction.remarks || `Repeat: ${transaction.referenceNumber}`,
    });
    setRetailTab('transfers');
    addToast({ type: 'info', title: 'Repeat Transfer', message: 'Transfer details pre-filled.' });
  };
  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 z-20">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Transaction Details
        </h1>
        <button className="p-2">
          <Share2 className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Success Banner */}
        <div className="p-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-blue-600/10 ${
            transaction.status === 'completed' 
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' 
              : transaction.status === 'pending'
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600'
          }`}>
            {transaction.status === 'completed' && <CheckCircle2 className="w-10 h-10" />}
            {transaction.status === 'pending' && <Clock className="w-10 h-10" />}
            {transaction.status === 'failed' && <XCircle className="w-10 h-10" />}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
              {transaction.type === 'credit' ? 'Received From' : 'Paid To'}
            </p>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {transaction.counterpartyName}
            </h2>
            <p className={`text-3xl font-black mt-2 ${
              transaction.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
            }`}>
              {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              transaction.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {transaction.status}
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction Info</span>
              <div className="flex items-center space-x-1 text-xs font-bold text-blue-600">
                <Hash className="w-3 h-3" />
                <span>Reference: {transaction.referenceNumber}</span>
              </div>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date & Time</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{transaction.date}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{transaction.paymentMode}</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Savings Account (•••• 0012)</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</p>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                    {transaction.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Category Chip */}
          <div className="flex items-center justify-between px-5 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">{transaction.category}</p>
              </div>
            </div>
            <button className="text-xs font-bold text-blue-600 flex items-center">
              Change
              <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>

          <div className="pt-4 space-y-4">
            {transaction.type === 'debit' && (
              <button
                type="button"
                onClick={handleRepeatTransfer}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2"
              >
                <ArrowRightLeft className="w-5 h-5" />
                <span>Repeat Transfer</span>
              </button>
            )}
            <button type="button" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center space-x-2">
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>
            <button className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold flex items-center justify-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>Report Issue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsView;

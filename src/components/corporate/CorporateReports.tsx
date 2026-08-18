import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  ShieldCheck, 
  Globe2, 
  Layers, 
  Calendar, 
  Landmark, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2,
  DollarSign,
  PieChart
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { motion } from 'motion/react';

export const CorporateReports: React.FC = () => {
  const { securityLogs, transactions, addToast } = useBanking();
  const [fxAmount, setFxAmount] = useState('50000');
  const [fxCurrency, setFxCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');

  const fxRates = {
    USD: 87.42,
    EUR: 95.10,
    GBP: 111.35
  };

  const calculatedInr = (Number(fxAmount) || 0) * fxRates[fxCurrency];

  const handleDownloadReport = (name: string) => {
    addToast({
      type: 'success',
      title: 'Report Generated',
      message: `${name} exported as official compliance PDF.`,
    });
  };

  return (
    <div className="p-4 space-y-4 pb-28 max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-teal-800/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Audit & Compliance
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Enterprise Analytics</h2>
            <p className="text-xs text-slate-300">
              Statutory logs, cashflow breakdowns & forex hedging rates
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <FileText className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Forex Rate Converter & Booking */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Live Treasury FX Spot Rates
            </h3>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 font-bold">RBI Interbank Midrate</span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          {(['USD', 'EUR', 'GBP'] as const).map(curr => (
            <button
              key={curr}
              onClick={() => setFxCurrency(curr)}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                fxCurrency === curr
                  ? 'border-teal-600 bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold ring-1 ring-teal-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <p className="font-bold">{curr}/INR</p>
              <p className="font-mono text-xs mt-0.5">₹{fxRates[curr]}</p>
            </button>
          ))}
        </div>

        <div className="pt-1 flex items-center justify-between text-xs">
          <div className="flex-1 mr-2">
            <label className="text-[10px] text-slate-400 block mb-1">Remittance Amount ({fxCurrency})</label>
            <input
              type="number"
              value={fxAmount}
              onChange={(e) => setFxAmount(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white"
            />
          </div>
          <div className="flex-1 ml-2">
            <label className="text-[10px] text-slate-400 block mb-1">INR Settlement Value</label>
            <div className="p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900 text-xs font-mono font-extrabold text-teal-950 dark:text-teal-200">
              ₹{calculatedInr.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>

      {/* Audit Log Trail */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Security & Access Audit Trail
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {securityLogs.map(log => (
            <div key={log.id} className="py-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 dark:text-slate-200">{log.event}</span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">{log.status}</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                {log.device} • {log.ip} • {log.timestamp}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Reports Export Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Compliance & Tax Statements
        </h3>

        <div className="space-y-2">
          <button
            onClick={() => handleDownloadReport('Form GSTR-2B ITC Statement')}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs text-left"
          >
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">GSTR-2B Input Tax Credit (ITC)</p>
              <p className="text-[10px] text-slate-500">Auto-reconciled with vendor payments</p>
            </div>
            <Download className="w-4 h-4 text-teal-600" />
          </button>

          <button
            onClick={() => handleDownloadReport('Board Statutory Audit Summary')}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs text-left"
          >
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">Statutory Audit Trial Balance</p>
              <p className="text-[10px] text-slate-500">Form 3CD & Companies Act schedule III</p>
            </div>
            <Download className="w-4 h-4 text-teal-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

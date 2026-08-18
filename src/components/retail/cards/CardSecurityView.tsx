import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  History, 
  Smartphone, 
  Settings, 
  PhoneCall, 
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';
import { CreditDebitCard, CardSecurityAlert } from '../../../types/banking';

interface CardSecurityViewProps {
  card: CreditDebitCard;
  alerts: CardSecurityAlert[];
  onBack: () => void;
  onResolveAlert: (alertId: string, isLegit: boolean) => void;
  onReportFraud: () => void;
}

export const CardSecurityView: React.FC<CardSecurityViewProps> = ({
  card,
  alerts,
  onBack,
  onResolveAlert,
  onReportFraud,
}) => {
  const pendingAlerts = alerts.filter(a => a.cardId === card.id && a.status === 'pending_review');
  const resolvedAlerts = alerts.filter(a => a.cardId === card.id && a.status !== 'pending_review');

  return (
    <div className="space-y-5 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>REAL-TIME PROTECTION ON</span>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Security & Fraud Control</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Monitor suspicious activity and manage your card's advanced security parameters.
        </p>
      </div>

      {/* Suspicious Alerts Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Suspicious Activity Flagged
        </h3>

        {pendingAlerts.length > 0 ? (
          pendingAlerts.map(alert => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-sm space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Review Required: Unknown Transaction</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">₹{alert.amount.toLocaleString('en-IN')}</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{alert.merchant} • {alert.location}</p>
                  <p className="text-[10px] text-amber-700 dark:text-amber-400 mt-1 font-semibold">{alert.flagReason}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onResolveAlert(alert.id, false)}
                  className="py-2.5 rounded-xl bg-rose-600 text-white text-[11px] font-bold shadow-xs flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Report Fraud</span>
                </button>
                <button
                  onClick={() => onResolveAlert(alert.id, true)}
                  className="py-2.5 rounded-xl bg-emerald-600 text-white text-[11px] font-bold shadow-xs flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Yes, It Was Me</span>
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-xs font-medium text-emerald-800 dark:text-emerald-200">No suspicious activity detected in the last 48 hours.</p>
          </div>
        )}
      </div>

      {/* Security Hub List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Security Settings
        </h3>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Active Device Sessions</p>
                <p className="text-[10px] text-slate-500">iPhone 15 Pro • Mumbai, India</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Authentication Settings</p>
                <p className="text-[10px] text-slate-500">Biometric & MPIN mandatory for high-value txns</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Security History</p>
                <p className="text-[10px] text-slate-500">Last PIN change: 12 July 2026</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <button
            onClick={onReportFraud}
            className="w-full p-4 flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-600">Report Transaction Fraud</p>
                <p className="text-[10px] text-slate-500">Dispute unrecognized charges immediately</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold tracking-tight">Bharat Bank 24x7 Security Hotline</h4>
            <p className="text-[11px] text-blue-100 mt-1 opacity-90 leading-relaxed">
              If you suspect your card is compromised or lost, call our dedicated security switch instantly.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href="tel:1800226800"
            className="flex-1 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Call 1800-22-6800</span>
          </a>
          <button
            className="flex-1 py-2.5 rounded-xl bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-2"
          >
            <span>Live Agent Chat</span>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Bharat Bank never asks for your PIN, OTP, or passwords over call, SMS, or email. Stay vigilant against phishing.
        </p>
      </div>
    </div>
  );
};

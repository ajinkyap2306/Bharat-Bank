import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  PhoneCall, 
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import { CardReplacementRequest } from '../../../types/banking';

interface CardReplacementTrackerModalProps {
  isOpen: boolean;
  replacement?: CardReplacementRequest;
  onClose: () => void;
}

export const CardReplacementTrackerModal: React.FC<CardReplacementTrackerModalProps> = ({
  isOpen,
  replacement,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !replacement) return null;

  const trackingNum = replacement.trackingNumber || 'EXP-IN-88219034';

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const stages = [
    {
      id: 'processing',
      title: 'Order Verified & Embossed',
      desc: 'Card chip provisioned & personalized with your name.',
      date: `${replacement.requestDate}, 10:30 AM`,
      completed: true,
    },
    {
      id: 'dispatched',
      title: 'Dispatched via BlueDart',
      desc: 'Handed over to courier hub with tamper-evident pouch.',
      date: 'Yesterday, 04:15 PM',
      completed: true,
    },
    {
      id: 'out_for_delivery',
      title: 'Out for Secure Delivery',
      desc: 'Courier executive assigned with OTP delivery verification.',
      date: 'Today by 06:00 PM',
      completed: false,
      active: true,
    },
    {
      id: 'delivered',
      title: 'Card Delivered & Activated',
      desc: 'Delivered to registered cardholder.',
      date: 'Expected in 1-2 Days',
      completed: false,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Track Delivery</h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {replacement.requestId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tracking Number Bar */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Courier Tracking AWB</p>
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5">{trackingNum}</p>
            </div>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy AWB'}</span>
            </button>
          </div>

          {/* Shipment Timeline */}
          <div className="space-y-4 relative pl-2">
            <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-slate-800" />

            {stages.map((stage, idx) => (
              <div key={stage.id} className="flex items-start gap-3.5 relative z-10">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  stage.completed
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : stage.active
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40 animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                }`}>
                  {stage.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold ${stage.completed || stage.active ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                      {stage.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">{stage.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Address */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-xs">
            <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Delivery Destination</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{replacement.deliveryAddress}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Close Tracker
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

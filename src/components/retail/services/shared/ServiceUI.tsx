import React from 'react';
import {
  Wallet, PlusCircle, Link, Star, CreditCard, Pencil, EyeOff, ShieldCheck, Phone, MapPin,
  Users, FileText, TrendingUp, SendHorizontal, UserPlus, QrCode, HandCoins, CalendarClock,
  Receipt, Smartphone, Car, RefreshCw, History, Download, Settings, Sliders, Gauge, KeyRound,
  Ban, RefreshCcw, MapPinned, Building2, Banknote, Landmark, PiggyBank, Layers, CalendarCheck,
  XCircle, FileBadge, Shield, Heart, Briefcase, User, Home, GraduationCap, Calculator, Percent,
  FileStack, IndianRupee, Calendar, Award, PieChart, Repeat, ArrowLeftRight, ArrowDownToLine,
  Building, BadgePercent, HeartPulse, Plane, FileCheck, FileWarning, Search, FileInput,
  FileSpreadsheet, Info, Globe, Coins, Globe2, Luggage, BookOpen, Lock, BarChart3, Gift, Tag,
  FolderOpen, Headphones, HelpCircle, MessageCircle, FilePlus, ListChecks, AlertCircle,
  MessageSquare, AlertOctagon, ChevronRight, Star as StarIcon, LucideIcon,
} from 'lucide-react';
import { ServiceBadge } from '../../../../types/services';

const ICONS: Record<string, LucideIcon> = {
  Wallet, PlusCircle, Link, Star, CreditCard, Pencil, EyeOff, ShieldCheck, Phone, MapPin,
  Users, FileText, TrendingUp, SendHorizontal, UserPlus, QrCode, HandCoins, CalendarClock,
  Receipt, Smartphone, Car, RefreshCw, History, Download, Settings, Sliders, Gauge, KeyRound,
  Ban, RefreshCcw, MapPinned, Building2, Banknote, Landmark, PiggyBank, Layers, CalendarCheck,
  XCircle, FileBadge, Shield, Heart, Briefcase, User, Home, GraduationCap, Calculator, Percent,
  FileStack, IndianRupee, Calendar, Award, PieChart, Repeat, ArrowLeftRight, ArrowDownToLine,
  Building, BadgePercent, HeartPulse, Plane, FileCheck, FileWarning, Search, FileInput,
  FileSpreadsheet, Info, Globe, Coins, Globe2, Luggage, BookOpen, Lock, BarChart3, Gift, Tag,
  FolderOpen, Headphones, HelpCircle, MessageCircle, FilePlus, ListChecks, AlertCircle,
  MessageSquare, AlertOctagon,
};

export const ServiceIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  const Icon = ICONS[name] || FileText;
  return <Icon className={className} />;
};

const BADGE_STYLES: Record<ServiceBadge, string> = {
  Active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  'Due Soon': 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  'Action Required': 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400',
  New: 'bg-congress-blue-50 text-congress-blue-700 dark:bg-congress-blue-950/50 dark:text-congress-blue-400',
  Available: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
};

export const ServiceBadgePill: React.FC<{ badge: ServiceBadge }> = ({ badge }) => (
  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${BADGE_STYLES[badge]}`}>
    {badge}
  </span>
);

export const ServiceGridItem: React.FC<{
  name: string;
  icon: string;
  badge?: ServiceBadge;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick: () => void;
  emergency?: boolean;
}> = ({ name, icon, badge, isFavorite, onToggleFavorite, onClick, emergency }) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex flex-col items-center group text-center active:scale-95 transition-transform py-1 ${
      emergency ? 'col-span-4 flex-row gap-3 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50' : ''
    }`}
  >
    {onToggleFavorite && (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
        className="absolute top-0 right-0 p-1 rounded-lg z-10"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <StarIcon className={`w-3 h-3 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
      </button>
    )}
    {badge && !emergency && (
      <span className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-orange-500 z-10" aria-hidden />
    )}
    <div className={`rounded-2xl flex items-center justify-center shrink-0 ${
      emergency ? 'mb-0' : 'mb-1.5'
    } ${
      emergency
        ? 'w-10 h-10 bg-rose-100 dark:bg-rose-950/50 text-rose-600'
        : 'w-11 h-11 bg-congress-blue-50 dark:bg-congress-blue-950/60 text-congress-blue-700 dark:text-congress-blue-400 shadow-2xs group-hover:bg-congress-blue-700 group-hover:text-white'
    } group-hover:scale-105 transition-transform`}>
      <ServiceIcon name={icon} className="w-5 h-5" />
    </div>
    <span className={`text-[10px] font-bold leading-tight line-clamp-2 w-full px-0.5 ${
      emergency ? 'text-rose-700 dark:text-rose-300 text-left flex-1' : 'text-[#111827] dark:text-slate-200'
    }`}>
      {name}
    </span>
  </button>
);

export const ServiceSectionCard: React.FC<{
  title: string;
  count?: number;
  children: React.ReactNode;
}> = ({ title, count, children }) => (
  <div className="mb-4">
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-xs">
      <div className="flex items-center justify-between pb-3 mb-1 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-[11px] font-bold text-[#667085] dark:text-slate-500 uppercase tracking-wider">
          {title}
        </h3>
        {count !== undefined && (
          <span className="text-[10px] font-bold px-2 py-0.5 bg-congress-blue-50 dark:bg-congress-blue-950/60 text-congress-blue-700 dark:text-congress-blue-400 rounded-full">
            {count}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-1">
        {children}
      </div>
    </div>
  </div>
);

export const ServiceCard: React.FC<{
  name: string;
  description: string;
  icon: string;
  badge?: ServiceBadge;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onClick: () => void;
  emergency?: boolean;
}> = ({ name, description, icon, badge, isFavorite, onToggleFavorite, onClick, emergency }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full min-h-11 flex items-center gap-3 p-3.5 rounded-2xl border text-left active:scale-[0.99] transition-all ${
      emergency
        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50'
        : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-congress-blue-200 dark:hover:border-congress-blue-800'
    }`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
      emergency ? 'bg-rose-100 dark:bg-rose-950/50 text-rose-600' : 'bg-[#F7F9FC] dark:bg-slate-800 text-congress-blue-700 dark:text-congress-blue-400'
    }`}>
      <ServiceIcon name={icon} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 flex-wrap">
        <p className={`text-sm font-semibold leading-tight ${emergency ? 'text-rose-700 dark:text-rose-300' : 'text-[#111827] dark:text-white'}`}>
          {name}
        </p>
        {badge && <ServiceBadgePill badge={badge} />}
      </div>
      <p className="text-[11px] text-[#667085] dark:text-slate-400 leading-snug mt-0.5 line-clamp-2">{description}</p>
    </div>
    <div className="flex items-center gap-1 shrink-0">
      {onToggleFavorite && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <StarIcon className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
        </button>
      )}
      <ChevronRight className="w-4 h-4 text-slate-400" />
    </div>
  </button>
);

export const SectionLabel: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-[11px] font-bold text-[#667085] dark:text-slate-500 uppercase tracking-wider px-1 pt-2 pb-1">
    {title}
  </h2>
);

export const ContextAlertCard: React.FC<{
  tone: 'warning' | 'action' | 'info';
  title: string;
  message: string;
  cta: string;
  onClick: () => void;
}> = ({ tone, title, message, cta, onClick }) => {
  const styles = {
    warning: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40',
    action: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40',
    info: 'bg-congress-blue-50 dark:bg-congress-blue-950/30 border-congress-blue-200 dark:border-congress-blue-900/40',
  };
  return (
    <button type="button" onClick={onClick} className={`w-full p-3.5 rounded-2xl border text-left ${styles[tone]}`}>
      <p className="text-[10px] font-bold uppercase tracking-wide text-[#667085]">{title}</p>
      <p className="text-sm font-semibold text-[#111827] dark:text-white mt-0.5">{message}</p>
      <p className="text-xs font-bold text-congress-blue-700 dark:text-congress-blue-400 mt-1.5">{cta} →</p>
    </button>
  );
};

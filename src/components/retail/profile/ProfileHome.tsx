import React from 'react';
import {
  User,
  ShieldCheck,
  Phone,
  Mail,
  Wallet,
  CreditCard,
  Shield,
  Bell,
  Lock,
  Smartphone,
  FileText,
  Headphones,
  Settings,
  LogOut,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useBanking } from '../../../context/BankingContext';
import { ProfileScreen } from './profileTypes';
import { MenuGroup, MenuItem } from './shared/ProfileUI';

interface ProfileHomeProps {
  onNavigate: (screen: ProfileScreen) => void;
  onLogout: () => void;
}

export const ProfileHome: React.FC<ProfileHomeProps> = ({ onNavigate, onLogout }) => {
  const {
    user,
    personalInfo,
    kycDetails,
    securitySettings,
    accounts,
    cards,
    getPrimaryAccount,
  } = useBanking();

  const primary = getPrimaryAccount();
  const linkedCount = accounts.filter((a) => ['Savings', 'Current'].includes(a.accountType)).length;

  return (
    <div className="pt-1 pb-24 space-y-5">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-br from-congress-blue-700 via-congress-blue-800 to-indigo-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden"
      >
        <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <img
                src={user.avatar}
                alt={personalInfo.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30"
              />
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-congress-blue-900 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 text-white" />
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold truncate">{personalInfo.fullName}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-xs">
                  Verified
                </span>
              </div>
              <p className="text-xs text-blue-200 mt-1">
                Cust ID: <span className="font-mono font-bold text-white">{user.customerNumber}</span>
              </p>
              <p className="text-xs text-blue-200 mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3" /> {personalInfo.mobile}
              </p>
              <p className="text-xs text-blue-200 flex items-center gap-1 truncate">
                <Mail className="w-3 h-3 shrink-0" /> {personalInfo.email}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('personal-info')}
            className="mt-4 w-full py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-sm font-bold transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </motion.div>

      {/* Quick Summary */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Linked Accounts', value: String(linkedCount), icon: Wallet },
          { label: 'Cards', value: String(cards.length), icon: CreditCard },
          {
            label: 'Primary Account',
            value: primary?.maskedNumber?.slice(-4) ? `••••${primary.maskedNumber.slice(-4)}` : '—',
            icon: Building2,
          },
          {
            label: 'KYC Status',
            value: kycDetails.status === 'verified' ? 'Verified' : 'Pending',
            icon: ShieldCheck,
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-3 shadow-xs"
          >
            <item.icon className="w-4 h-4 text-congress-blue-600 mb-1.5" />
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">{item.label}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/50 rounded-2xl p-3 flex items-center gap-3">
        <Shield className="w-5 h-5 text-emerald-600 shrink-0" />
        <div>
          <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
            Security Status: {securitySettings.securityScore}
          </p>
          <p className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80">
            Biometric login enabled • MPIN active
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('security-center')}
          className="ml-auto text-xs font-bold text-emerald-700 dark:text-emerald-400"
        >
          View
        </button>
      </div>

      <MenuGroup title="Account & Preferences">
        <MenuItem
          icon={<User className="w-4 h-4" />}
          label="Personal Information"
          description="Name, DOB, address & KYC"
          onClick={() => onNavigate('personal-info')}
        />
        <MenuItem
          icon={<Wallet className="w-4 h-4" />}
          label="Accounts & Preferences"
          description="Linked accounts, primary & debit defaults"
          onClick={() => onNavigate('accounts-preferences')}
        />
        <MenuItem
          icon={<CreditCard className="w-4 h-4" />}
          label="Cards & Payment Preferences"
          description="Default card, billers & beneficiaries"
          onClick={() => onNavigate('cards-payments')}
        />
      </MenuGroup>

      <MenuGroup title="Security">
        <MenuItem
          icon={<Shield className="w-4 h-4" />}
          label="Security Center"
          description="Password, MPIN & authentication"
          badge={securitySettings.securityScore}
          badgeTone="success"
          onClick={() => onNavigate('security-center')}
        />
        <MenuItem
          icon={<Smartphone className="w-4 h-4" />}
          label="Devices & Sessions"
          description="Trusted devices & active sessions"
          onClick={() => onNavigate('devices-sessions')}
        />
      </MenuGroup>

      <MenuGroup title="Preferences">
        <MenuItem
          icon={<Bell className="w-4 h-4" />}
          label="Notifications"
          description="Transaction, card & security alerts"
          onClick={() => onNavigate('notifications')}
        />
        <MenuItem
          icon={<Lock className="w-4 h-4" />}
          label="Privacy & Consent"
          description="Marketing & data preferences"
          onClick={() => onNavigate('privacy')}
        />
        <MenuItem
          icon={<Settings className="w-4 h-4" />}
          label="App Preferences"
          description="Language, theme & display"
          onClick={() => onNavigate('app-preferences')}
        />
      </MenuGroup>

      <MenuGroup title="Documents & Support">
        <MenuItem
          icon={<FileText className="w-4 h-4" />}
          label="Documents"
          description="Statements, certificates & policies"
          onClick={() => onNavigate('documents')}
        />
        <MenuItem
          icon={<Headphones className="w-4 h-4" />}
          label="Help & Support"
          description="FAQs, service requests & contact"
          onClick={() => onNavigate('help-support')}
        />
        <MenuItem
          icon={<Building2 className="w-4 h-4" />}
          label="Account Management"
          description="KYC update, upgrade & closure"
          onClick={() => onNavigate('account-management')}
        />
      </MenuGroup>

      <button
        type="button"
        onClick={onLogout}
        className="w-full flex items-center justify-between p-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 font-bold text-sm"
      >
        <span className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </span>
        <ChevronRight className="w-4 h-4" />
      </button>

      <p className="text-center text-[10px] text-slate-400 pb-2">
        Bharat Retail Banking v3.5.0 • Secure Session Active
      </p>
    </div>
  );
};

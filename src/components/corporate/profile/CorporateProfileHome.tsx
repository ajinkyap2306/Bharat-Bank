import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  X,
} from 'lucide-react';
import { BottomSheet } from '../../common/BottomSheet';
import { useBanking } from '../../../context/BankingContext';
import { useCorporateProfileView } from '../../../hooks/useCorporateProfileView';
import type { CorporateProfileScreen } from '../../../types/corporateProfile';
import {
  formatProfileCurrency,
  ProfileCard,
  ProfileDetailRow,
  ProfileMenuRow,
  ProfileSection,
} from './shared/ProfileUI';

interface CorporateProfileHomeProps {
  onNavigate: (screen: CorporateProfileScreen) => void;
}

export const CorporateProfileHome: React.FC<CorporateProfileHomeProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { logout, setCorporateTab } = useBanking();
  const { view, company } = useCorporateProfileView();
  const [showSignOut, setShowSignOut] = useState(false);

  if (!view) {
    return (
      <div className="px-4 py-8 text-center text-[13px] text-slate-500 dark:text-slate-400">
        Sign in to view your corporate profile.
      </div>
    );
  }

  const { personal, permissions, approvalSummary, limits, linkedAccounts } = view;

  const handleApprovalCta = () => {
    if (view.role === 'checker') {
      setCorporateTab('approvals');
      navigate(approvalSummary.ctaRoute);
      return;
    }
    setCorporateTab('payments');
    navigate(approvalSummary.ctaRoute);
  };

  return (
    <>
      <div className="pb-8 ">
        {/* Profile Header */}
        <ProfileCard className="mx-4! mt-4 p-5 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-congress-blue-50 dark:bg-congress-blue-950/40 border border-congress-blue-700/20 flex items-center justify-center">
            <span className="text-[20px] font-bold text-congress-blue-700 dark:text-congress-blue-400">{personal.initials}</span>
          </div>
          <h2 className="text-[17px] font-semibold text-slate-900 dark:text-white mt-3">
            {personal.name}
          </h2>
          <p className="text-[13px] text-slate-500 dark:text-slate-400">{personal.role}</p>
          {personal.authorized && (
            <p className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
              Authorized User
            </p>
          )}
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1 text-[12px] text-slate-500 dark:text-slate-400">
            <p className="font-medium text-slate-900 dark:text-white">{company.name}</p>
            <p>
              Corporate ID:{' '}
              <span className="font-mono font-semibold text-slate-900 dark:text-white">
                {company.corporateId}
              </span>
            </p>
          </div>
        </ProfileCard>

        {/* Personal Details */}
        <div className="mt-4">
          <ProfileSection title="Personal Details">
            <ProfileDetailRow label="Name" value={personal.name} />
            <ProfileDetailRow label="Role" value={personal.role} />
            <ProfileDetailRow label="Corporate ID" value={personal.corporateId} mono />
            <ProfileDetailRow label="User ID" value={personal.userId} mono />
            <ProfileDetailRow label="Registered Mobile" value={personal.maskedMobile} mono />
            <ProfileDetailRow label="Email" value={personal.email} />
          </ProfileSection>
        </div>

        {/* Company Information */}
        <div className="mt-5">
          <ProfileSection title="Company">
            <div className="px-4 py-3.5">
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
                {company.name}
              </p>
              {company.verified && (
                <p className="inline-flex items-center gap-1 text-[12px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" aria-hidden />
                  Verified Business
                </p>
              )}
            </div>
            <ProfileDetailRow label="Corporate ID" value={company.corporateId} mono />
            <ProfileDetailRow label="Business Type" value={company.businessType} />
            <ProfileDetailRow label="GSTIN" value={company.gstinMasked} mono />
            <ProfileDetailRow label="Registered Address" value={company.registeredAddressShort} />
            <ProfileMenuRow label="View Company Details" onClick={() => onNavigate('company')} />
          </ProfileSection>
        </div>

        {/* Role & Permissions */}
        <div className="mt-5">
          <ProfileSection title="Role & Permissions">
            <div className="px-4 py-3.5">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Your Role
              </p>
              <p className="text-[15px] font-semibold text-slate-900 dark:text-white mt-1">
                {permissions.roleTitle}
              </p>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-3 mb-2">You can:</p>
              <ul className="space-y-2">
                {permissions.capabilities.map((cap) => (
                  <li key={cap.label} className="flex items-center gap-2 text-[13px]">
                    {cap.allowed ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden />
                    ) : (
                      <X className="w-4 h-4 text-[#98A2B3] shrink-0" aria-hidden />
                    )}
                    <span
                      className={
                        cap.allowed
                          ? 'text-slate-900 dark:text-white font-medium'
                          : 'text-[#98A2B3]'
                      }
                    >
                      {cap.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="px-4 py-3.5 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Approval Authority
              </p>
              <p
                className={`text-[14px] font-semibold mt-1 ${
                  permissions.approvalAuthorityEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {permissions.approvalAuthorityLabel}
              </p>
            </div>
          </ProfileSection>
        </div>

        {/* Role-specific: My Requests / Approval Center */}
        <div className="mt-5 px-4">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
              {approvalSummary.sectionTitle}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {approvalSummary.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-slate-50 dark:bg-slate-950 dark:bg-slate-800/50 px-3 py-2.5"
                >
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-[18px] font-bold text-slate-900 dark:text-white tabular-nums mt-0.5">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleApprovalCta}
              className="mt-4 w-full flex items-center justify-center gap-1 py-2.5 rounded-xl bg-congress-blue-50 dark:bg-congress-blue-950/40 text-congress-blue-700 dark:text-congress-blue-400 text-[13px] font-semibold min-h-10 active:scale-[0.99] transition-transform"
            >
              {approvalSummary.ctaLabel}
              <ChevronRight className="w-4 h-4" aria-hidden />
            </button>
          </div>
        </div>

        {/* Corporate Limits */}
        <div className="mt-5 px-4">
          <button
            type="button"
            onClick={() => onNavigate('limits')}
            className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left active:scale-[0.99] transition-transform shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
                {limits.sectionTitle}
              </p>
              <span className="text-[11px] font-semibold text-congress-blue-700 dark:text-congress-blue-400">View</span>
            </div>
            <div className="mt-3 space-y-2">
              {limits.items.slice(0, 3).map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-[12px]">
                  <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="font-medium text-slate-900 dark:text-white text-right">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* Linked Accounts */}
        <div className="mt-4 px-4">
          <button
            type="button"
            onClick={() => onNavigate('accounts')}
            className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-left active:scale-[0.99] transition-transform shadow-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[14px] font-semibold text-slate-900 dark:text-white">
                Linked Accounts
              </p>
              <span className="text-[11px] font-semibold text-congress-blue-700 dark:text-congress-blue-400">View All</span>
            </div>
            <div className="mt-2 space-y-2.5">
              {linkedAccounts.map((acc) => (
                <div key={acc.id} className="flex items-center justify-between gap-3 text-[12px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {acc.isPrimary && (
                      <span className="text-[#F59E0B] text-[11px]" aria-label="Primary account">
                        ★
                      </span>
                    )}
                    <span className="text-slate-500 dark:text-slate-400 truncate">{acc.name}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono text-slate-900 dark:text-white">{acc.maskedNumber}</p>
                    {acc.balance != null && (
                      <p className="font-semibold text-slate-900 dark:text-white tabular-nums mt-0.5">
                        {formatProfileCurrency(acc.balance)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </button>
        </div>

        {/* Administration */}
        <div className="mt-5">
          <ProfileSection title="Administration">
            <ProfileMenuRow label="User & Access" onClick={() => onNavigate('users')} />
            <ProfileMenuRow label="Authorized Signatories" onClick={() => onNavigate('signatories')} />
            <ProfileMenuRow label="Approval Rules" onClick={() => onNavigate('approval-rules')} />
          </ProfileSection>
        </div>

        {/* Security */}
        <div className="mt-5">
          <ProfileSection title="Security">
            <ProfileMenuRow label="Change MPIN" onClick={() => onNavigate('security')} />
            <ProfileMenuRow label="Biometric Login" onClick={() => onNavigate('security')} />
            <ProfileMenuRow label="Manage Devices" onClick={() => onNavigate('security')} />
            <ProfileMenuRow label="Active Sessions" onClick={() => onNavigate('security')} />
            <ProfileMenuRow label="Login & Security" onClick={() => onNavigate('security')} />
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[12px] text-slate-500 dark:text-slate-400">Last Login</p>
              <p className="text-[13px] font-medium text-slate-900 dark:text-white mt-0.5">
                {view.security.lastLogin}
              </p>
            </div>
          </ProfileSection>
        </div>

        {/* Notifications */}
        <div className="mt-5">
          <ProfileSection title="Notifications">
            <ProfileMenuRow
              label="Notification Preferences"
              onClick={() => onNavigate('notifications')}
            />
          </ProfileSection>
        </div>

        {/* Support */}
        <div className="mt-5">
          <ProfileSection title="Support">
            <ProfileMenuRow
              label="Help & Support"
              onClick={() => onNavigate('support')}
            />
            <ProfileMenuRow
              label="Contact Relationship Manager"
              onClick={() => onNavigate('support')}
            />
            <ProfileMenuRow
              label="Raise Service Request"
              onClick={() => onNavigate('support')}
            />
            <ProfileMenuRow label="Banking Support" onClick={() => onNavigate('support')} />
            <ProfileMenuRow label="Terms & Policies" onClick={() => onNavigate('support')} />
          </ProfileSection>
        </div>

        {/* Sign Out */}
        <div className="px-4 mt-6">
          <button
            type="button"
            onClick={() => setShowSignOut(true)}
            className="w-full py-3.5 rounded-2xl border border-[#FECACA] bg-[#FEF2F2] dark:bg-rose-950/20 text-[#DC2626] text-sm font-semibold min-h-12 active:scale-[0.98] transition-transform"
          >
            Sign Out
          </button>
        </div>
      </div>

      <BottomSheet
        isOpen={showSignOut}
        onClose={() => setShowSignOut(false)}
        title="Sign Out?"
      >
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
          Are you sure you want to sign out?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowSignOut(false)}
            className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-white min-h-11"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              setShowSignOut(false);
              logout();
            }}
            className="flex-1 py-3 rounded-2xl bg-[#DC2626] text-white text-sm font-semibold min-h-11"
          >
            Sign Out
          </button>
        </div>
      </BottomSheet>
    </>
  );
};

export { ProfileScreenHeader } from './ProfileScreenHeader';

import React, { useState } from 'react';
import { useBanking } from '../../../../context/BankingContext';
import { ProfileScreen } from '../profileTypes';
import {
  ProfileLayout,
  InfoCard,
  InfoRow,
  StickyCTA,
  OtpInput,
  SuccessState,
  MenuGroup,
  MenuItem,
} from '../shared/ProfileUI';
import { SecureAuthModal } from '../../../common/SecureAuthModal';
import { ShieldCheck, FileText, MapPin } from 'lucide-react';

interface ScreenProps {
  onNavigate: (screen: ProfileScreen, params?: Record<string, string>) => void;
  onBack: () => void;
  params?: Record<string, string>;
}

export const PersonalInfoScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { personalInfo } = useBanking();
  return (
    <ProfileLayout title="Personal Information" onBack={onBack}>
      <InfoCard>
        <InfoRow label="Full Name" value={personalInfo.fullName} />
        <InfoRow label="Date of Birth" value={personalInfo.dateOfBirth} />
        <InfoRow label="Gender" value={personalInfo.gender} />
        <InfoRow
          label="Registered Mobile"
          value={personalInfo.mobile}
          verified={personalInfo.mobileVerified}
          onEdit={() => onNavigate('edit-mobile')}
        />
        <InfoRow
          label="Email Address"
          value={personalInfo.email}
          verified={personalInfo.emailVerified}
          onEdit={() => onNavigate('edit-email')}
        />
        <InfoRow label="National ID / KYC ID" value={personalInfo.nationalIdMasked} masked />
        <InfoRow
          label="Residential Address"
          value={personalInfo.residentialAddress}
          onEdit={() => onNavigate('edit-address')}
        />
        <InfoRow label="Mailing Address" value={personalInfo.mailingAddress} />
      </InfoCard>
      <InfoCard className="p-3!">
        <button
          type="button"
          onClick={() => onNavigate('contact-details')}
          className="w-full text-left text-sm font-bold text-congress-blue-600"
        >
          Manage Contact Details →
        </button>
      </InfoCard>
      <InfoCard className="p-3!">
        <button
          type="button"
          onClick={() => onNavigate('kyc-details')}
          className="w-full text-left text-sm font-bold text-congress-blue-600"
        >
          View KYC Details →
        </button>
      </InfoCard>
    </ProfileLayout>
  );
};

export const ContactDetailsScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { personalInfo } = useBanking();
  return (
    <ProfileLayout title="Contact Details" subtitle="Manage verified contact information" onBack={onBack}>
      <MenuGroup title="Contact Methods">
        <MenuItem
          icon={<ShieldCheck className="w-4 h-4" />}
          label="Mobile Number"
          description={personalInfo.mobile}
          badge={personalInfo.mobileVerified ? 'Verified' : 'Required'}
          badgeTone={personalInfo.mobileVerified ? 'success' : 'warning'}
          onClick={() => onNavigate('edit-mobile')}
        />
        <MenuItem
          icon={<FileText className="w-4 h-4" />}
          label="Email Address"
          description={personalInfo.email}
          badge={personalInfo.emailVerified ? 'Verified' : 'Required'}
          badgeTone={personalInfo.emailVerified ? 'success' : 'warning'}
          onClick={() => onNavigate('edit-email')}
        />
        <MenuItem
          icon={<MapPin className="w-4 h-4" />}
          label="Residential Address"
          description="Update mailing & residential address"
          onClick={() => onNavigate('edit-address')}
        />
      </MenuGroup>
    </ProfileLayout>
  );
};

export const EditContactScreen: React.FC<
  ScreenProps & { field: 'mobile' | 'email' | 'address' }
> = ({ onNavigate, onBack, field }) => {
  const { personalInfo, updatePersonalInfo } = useBanking();
  const [value, setValue] = useState(
    field === 'mobile' ? personalInfo.mobile : field === 'email' ? personalInfo.email : personalInfo.residentialAddress
  );

  const titles = { mobile: 'Change Mobile Number', email: 'Change Email', address: 'Update Address' };

  return (
    <ProfileLayout title={titles[field]} onBack={onBack}>
      <InfoCard>
        <label className="text-xs font-semibold text-slate-500">
          {field === 'address' ? 'New Address' : field === 'mobile' ? 'New Mobile Number' : 'New Email'}
        </label>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
        />
        <p className="text-[11px] text-slate-500 mt-2">
          OTP verification will be required to confirm this change.
        </p>
      </InfoCard>
      <StickyCTA
        label="Continue"
        onClick={() => {
          if (field === 'address') {
            updatePersonalInfo({ residentialAddress: value, mailingAddress: value });
          }
          onNavigate('otp-verification', { field });
        }}
      />
    </ProfileLayout>
  );
};

export const OtpVerificationScreen: React.FC<ScreenProps> = ({ onNavigate, onBack, params }) => {
  const { updatePersonalInfo, addToast } = useBanking();
  const field = params?.field || 'mobile';

  return (
    <ProfileLayout title="OTP Verification" subtitle="Enter the 6-digit code sent to your registered mobile" onBack={onBack}>
      <InfoCard className="text-center space-y-4">
        <OtpInput
          onComplete={() => {
            if (field === 'mobile') updatePersonalInfo({ mobileVerified: true });
            if (field === 'email') updatePersonalInfo({ emailVerified: true });
            addToast({ type: 'success', title: 'Verified', message: 'Contact details updated successfully.' });
            onNavigate('contact-success');
          }}
        />
        <button type="button" className="text-xs font-bold text-congress-blue-600">
          Resend OTP
        </button>
      </InfoCard>
    </ProfileLayout>
  );
};

export const ContactSuccessScreen: React.FC<ScreenProps> = ({ onNavigate }) => (
  <SuccessState
    title="Updated Successfully"
    message="Your contact details have been updated and verified."
    actionLabel="Done"
    onAction={() => onNavigate('personal-info')}
  />
);

export const KycDetailsScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const { kycDetails } = useBanking();
  const statusLabel =
    kycDetails.status === 'verified' ? 'Verified' : kycDetails.status === 'pending' ? 'Pending' : 'Action Required';

  return (
    <ProfileLayout title="KYC Details" onBack={onBack}>
      <InfoCard>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-900 dark:text-white">KYC Status</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              kycDetails.status === 'verified'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-amber-50 text-amber-700'
            }`}
          >
            {statusLabel}
          </span>
        </div>
        <InfoRow label="Verification Date" value={kycDetails.verificationDate} />
        <InfoRow label="National ID" value={kycDetails.nationalIdMasked} masked />
        <InfoRow
          label="Address Verification"
          value={kycDetails.addressVerified ? 'Verified' : 'Pending'}
        />
        <InfoRow label="Last Updated" value={kycDetails.lastUpdated} />
      </InfoCard>
      <InfoCard>
        <p className="text-xs font-bold text-slate-500 uppercase mb-2">KYC Documents</p>
        {kycDetails.documents.map((doc) => (
          <div key={doc.name} className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
            <span className="text-sm text-slate-800 dark:text-slate-200">{doc.name}</span>
            <span className="text-xs font-bold text-emerald-600">{doc.status}</span>
          </div>
        ))}
      </InfoCard>
      {kycDetails.status !== 'verified' && (
        <StickyCTA label="Update KYC" onClick={() => onNavigate('kyc-update')} />
      )}
    </ProfileLayout>
  );
};

export const KycUpdateScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [showAuth, setShowAuth] = useState(false);
  return (
    <>
      <ProfileLayout title="Update KYC" subtitle="Review and submit updated documents" onBack={onBack}>
        <InfoCard className="space-y-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Upload clear copies of your identity and address proof. Changes are subject to regulatory verification.
          </p>
          {['Aadhaar Card', 'PAN Card', 'Address Proof'].map((doc) => (
            <button
              key={doc}
              type="button"
              className="w-full p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-600"
            >
              Upload {doc}
            </button>
          ))}
        </InfoCard>
        <StickyCTA label="Review & Submit" onClick={() => onNavigate('kyc-review')} />
      </ProfileLayout>
    </>
  );
};

export const KycReviewScreen: React.FC<ScreenProps> = ({ onNavigate, onBack }) => {
  const [showAuth, setShowAuth] = useState(false);
  return (
    <>
      <ProfileLayout title="Review KYC Update" onBack={onBack}>
        <InfoCard>
          <p className="text-sm text-slate-600">All documents uploaded. Authenticate to submit your KYC update request.</p>
        </InfoCard>
        <StickyCTA label="Authenticate & Submit" onClick={() => setShowAuth(true)} />
      </ProfileLayout>
      <SecureAuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={() => {
          setShowAuth(false);
          onNavigate('kyc-submitted');
        }}
        title="Authenticate KYC Submission"
      />
    </>
  );
};

export const KycSubmittedScreen: React.FC<ScreenProps> = ({ onNavigate }) => (
  <SuccessState
    title="KYC Submitted"
    message="Your KYC update request has been submitted. We will notify you once verification is complete."
    actionLabel="View Status"
    onAction={() => onNavigate('kyc-details')}
  />
);

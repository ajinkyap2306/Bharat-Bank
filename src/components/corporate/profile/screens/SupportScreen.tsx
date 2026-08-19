import React, { useState } from 'react';
import { Briefcase, Headphones, Phone, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { useBanking } from '../../../../context/BankingContext';
import { CORPORATE_PROFILE_DATA } from '../../../../data/corporateProfileMock';
import { ProfileCard } from '../shared/ProfileUI';

export const SupportScreen: React.FC = () => {
  const { addToast } = useBanking();
  const { company } = CORPORATE_PROFILE_DATA;
  const [showRm, setShowRm] = useState(false);
  const [showServiceRequest, setShowServiceRequest] = useState(false);
  const [requestNote, setRequestNote] = useState('');

  const items = [
    {
      id: 'help',
      label: 'Help & Support',
      icon: Headphones,
      action: () =>
        addToast({
          type: 'info',
          title: 'Help Centre',
          message: 'Corporate help centre: support@acmetech.in · 1800-CORP-APEX',
        }),
    },
    {
      id: 'rm',
      label: 'Contact Relationship Manager',
      icon: Briefcase,
      action: () => setShowRm(true),
    },
    {
      id: 'request',
      label: 'Raise Service Request',
      icon: Phone,
      action: () => setShowServiceRequest(true),
    },
    {
      id: 'emergency',
      label: 'Emergency Banking Support',
      icon: ShieldAlert,
      action: () =>
        addToast({
          type: 'info',
          title: 'Emergency Support',
          message: '24/7 corporate treasury helpline: 1800-CORP-APEX',
        }),
    },
  ];

  return (
    <div className="py-4">
      <ProfileCard className="divide-y divide-[#E4E7EC] dark:divide-slate-800">
        {items.map(({ id, label, icon: Icon, action }) => (
          <button
            key={id}
            type="button"
            onClick={action}
            className="w-full px-4 py-3.5 flex items-center gap-3 text-left min-h-12 active:bg-[#F7F9FC] dark:active:bg-slate-800/50"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0B5CAB]/8 flex items-center justify-center shrink-0">
              <Icon className="w-4.5 h-4.5 text-[#0B5CAB]" aria-hidden />
            </div>
            <span className="text-[14px] font-medium text-[#111827] dark:text-white">{label}</span>
          </button>
        ))}
      </ProfileCard>

      {showRm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-5 shadow-xl"
          >
            <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white">
              Relationship Manager
            </h3>
            <p className="text-[13px] text-[#667085] mt-1">{company.name}</p>
            <div className="mt-4 p-3 rounded-xl bg-[#F7F9FC] dark:bg-slate-800">
              <p className="text-[14px] font-semibold text-[#111827] dark:text-white">
                {company.relationshipManager}
              </p>
              <p className="text-[13px] font-mono text-[#0B5CAB] mt-1">
                {company.relationshipManagerPhone}
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowRm(false)}
                className="py-2.5 rounded-xl border border-[#E4E7EC] text-sm font-semibold text-[#667085] min-h-11"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRm(false);
                  addToast({
                    type: 'success',
                    title: 'Callback requested',
                    message: 'Your relationship manager will contact you shortly.',
                  });
                }}
                className="py-2.5 rounded-xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-11"
              >
                Request Callback
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showServiceRequest && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 p-5 shadow-xl"
          >
            <h3 className="text-[16px] font-semibold text-[#111827] dark:text-white">
              Raise Service Request
            </h3>
            <p className="text-[13px] text-[#667085] mt-1">
              Describe your request. Our corporate banking team will respond within 1 business day.
            </p>
            <textarea
              value={requestNote}
              onChange={(e) => setRequestNote(e.target.value)}
              rows={4}
              placeholder="e.g. Increase daily payment limit for operating account"
              className="mt-4 w-full rounded-xl border border-[#E4E7EC] dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-[#111827] dark:text-white resize-none"
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowServiceRequest(false);
                  setRequestNote('');
                }}
                className="py-2.5 rounded-xl border border-[#E4E7EC] text-sm font-semibold text-[#667085] min-h-11"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowServiceRequest(false);
                  setRequestNote('');
                  addToast({
                    type: 'success',
                    title: 'Request submitted',
                    message: 'Service request SR-2026-4582 has been logged.',
                  });
                }}
                className="py-2.5 rounded-xl bg-[#0B5CAB] text-white text-sm font-semibold min-h-11"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, User } from 'lucide-react';
import { useBanking } from '../../../../context/BankingContext';
import { fetchApprovalDetail } from '../../../../data/corporateApprovalDetailsMock';
import { ScreenHeader } from '../../../common/ScreenHeader';

const AUDIT_EVENTS = [
  { id: '1', action: 'Request created', actor: 'Rahul Mehta (Maker)', time: '18 Aug 2026, 10:42 AM', note: 'Vendor payment initiated' },
  { id: '2', action: 'Submitted for approval', actor: 'Rahul Mehta (Maker)', time: '18 Aug 2026, 10:45 AM', note: 'Sent to Finance Checker queue' },
  { id: '3', action: 'Comment added', actor: 'Rahul Mehta (Maker)', time: '18 Aug 2026, 10:46 AM', note: 'Invoice INV-4582 attached' },
  { id: '4', action: 'Pending checker review', actor: 'System', time: '18 Aug 2026, 10:46 AM', note: 'Awaiting Priya Sharma' },
];

export const ApprovalAuditTrailScreen: React.FC = () => {
  const { approvalId = '' } = useParams<{ approvalId: string }>();
  const navigate = useNavigate();
  const { setBottomNavHidden } = useBanking();
  const [title, setTitle] = useState(approvalId);

  useEffect(() => {
    fetchApprovalDetail(approvalId).then((detail) => {
      if (detail) setTitle(detail.title);
    });
  }, [approvalId]);

  useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  return (
    <div className="-mx-3 min-h-full bg-[#F7F9FC] dark:bg-slate-950 pb-8">
      <ScreenHeader
        title="Audit Trail"
        subtitle={title}
        onBack={() => navigate(`/corporate/approvals/${approvalId}`)}
        edgeToEdge={false}
      />

      <div className="px-4 pt-2 space-y-3">
        {AUDIT_EVENTS.map((event, index) => (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-[#0B5CAB]/10 text-[#0B5CAB] flex items-center justify-center shrink-0">
                {index === AUDIT_EVENTS.length - 1 ? <Clock className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              {index < AUDIT_EVENTS.length - 1 && <div className="w-px flex-1 bg-[#E4E7EC] dark:bg-slate-800 my-1" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-sm font-semibold text-[#111827] dark:text-white">{event.action}</p>
              <p className="text-[12px] text-[#667085] mt-0.5">{event.actor}</p>
              <p className="text-[11px] text-[#98A2B3] mt-1">{event.time}</p>
              {event.note && <p className="text-[12px] text-[#667085] mt-2 bg-white dark:bg-slate-900 border border-[#E4E7EC] dark:border-slate-800 rounded-xl p-3">{event.note}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

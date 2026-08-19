import React from 'react';
import type { CorporatePaymentTrackingData } from '../../../../types/corporatePaymentTracking';
import { StickyPayCTA } from '../shared/CorporatePaymentsUI';

interface ContextualActionsProps {
  data: CorporatePaymentTrackingData;
  onViewApproval: () => void;
  onViewApprovalDetails: () => void;
  onDownloadReceipt: () => void;
  onShareReceipt: () => void;
  onCreateNewPayment: () => void;
}

export const ContextualActions: React.FC<ContextualActionsProps> = ({
  data,
  onViewApproval,
  onViewApprovalDetails,
  onDownloadReceipt,
  onShareReceipt,
  onCreateNewPayment,
}) => {
  switch (data.status) {
    case 'pending_approval':
    case 'submitted':
      return <StickyPayCTA label="View Approval Status" onClick={onViewApproval} />;
    case 'completed':
      return (
        <StickyPayCTA
          label="Download Receipt"
          onClick={onDownloadReceipt}
          secondaryLabel="Share Receipt"
          onSecondary={onShareReceipt}
        />
      );
    case 'rejected':
      return <StickyPayCTA label="View Approval Details" onClick={onViewApprovalDetails} />;
    case 'failed':
      return <StickyPayCTA label="Create New Payment" onClick={onCreateNewPayment} />;
    default:
      return null;
  }
};

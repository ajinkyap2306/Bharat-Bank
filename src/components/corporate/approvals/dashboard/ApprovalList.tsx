import React from 'react';
import type { CorporateApprovalItem } from '../../../../types/corporateApprovalsDashboard';
import { ApprovalCard } from './ApprovalCard';
import { CorpListCard, CorpListDivider, CorpSectionHeader } from '../../home/shared/CorporateHomeUI';

interface ApprovalListProps {
  items: CorporateApprovalItem[];
  hideAmounts?: boolean;
  onSelect: (approvalId: string) => void;
  title?: string;
  sortLabel?: string;
  onSort?: () => void;
}

export const ApprovalList: React.FC<ApprovalListProps> = ({
  items,
  hideAmounts = false,
  onSelect,
  title = 'Pending Approvals',
  sortLabel,
  onSort,
}) => (
  <section aria-labelledby="pending-approvals-heading">
    <CorpSectionHeader
      title={title}
      badge={String(items.length)}
      action={sortLabel}
      onAction={onSort}
    />
    <CorpListCard>
      {items.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <CorpListDivider />}
          <ApprovalCard
            item={item}
            hideAmounts={hideAmounts}
            onClick={() => onSelect(item.approvalId)}
            compact
          />
        </React.Fragment>
      ))}
    </CorpListCard>
  </section>
);

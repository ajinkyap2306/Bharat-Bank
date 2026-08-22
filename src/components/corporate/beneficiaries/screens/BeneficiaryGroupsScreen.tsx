import React from 'react';
import { ChevronRight } from 'lucide-react';
import { ScreenHeader } from '../../../common/ScreenHeader';
import { CorporateBeneficiaryGroup, CorporateBeneficiaryRecord } from '../../../../types/corporateBeneficiaries';
import { BenCard } from '../shared/CorporateBeneficiaryUI';

interface GroupsScreenProps {
  groups: CorporateBeneficiaryGroup[];
  beneficiaries: CorporateBeneficiaryRecord[];
  onBack: () => void;
  onSelectGroup: (groupId: string) => void;
}

export const BeneficiaryGroupsScreen: React.FC<GroupsScreenProps> = ({
  groups,
  beneficiaries,
  onBack,
  onSelectGroup,
}) => (
  <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
    <ScreenHeader title="Beneficiary Groups" onBack={onBack} edgeToEdge={false} />
    <div className="space-y-2 pt-2">
      {groups.map((g) => {
        const count = g.memberIds.length;
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelectGroup(g.id)}
            className="mx-3 w-[calc(100%-1.5rem)] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 flex justify-between items-center min-h-11"
          >
            <span className="text-sm font-bold text-slate-900 dark:text-white">{g.name}</span>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <span className="text-xs">{count} beneficiaries</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

export const GroupMembersScreen: React.FC<{
  group: CorporateBeneficiaryGroup;
  beneficiaries: CorporateBeneficiaryRecord[];
  onBack: () => void;
  onOpen: (id: string) => void;
}> = ({ group, beneficiaries, onBack, onOpen }) => {
  const members = beneficiaries.filter((b) => group.memberIds.includes(b.id));

  return (
    <div className="-mx-3 bg-slate-50 dark:bg-slate-950 min-h-full pb-6">
      <ScreenHeader title={group.name} subtitle="Beneficiary Group" onBack={onBack} edgeToEdge={false} />
      {members.length === 0 ? (
        <BenCard className="p-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">No beneficiaries in this group yet.</p>
        </BenCard>
      ) : (
        <div className="space-y-2 pt-2">
          {members.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onOpen(b.id)}
              className="mx-3 w-[calc(100%-1.5rem)] p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 flex justify-between items-center min-h-11 text-left"
            >
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{b.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{b.bankName} • {b.maskedAccount}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

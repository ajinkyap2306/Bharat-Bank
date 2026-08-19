import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useBanking } from '../../../context/BankingContext';
import {
  CorporateBeneficiariesScreen,
  CorporateBeneficiaryForm,
  CorporateBeneficiaryRecord,
  CorporateBeneficiaryGroup,
  DEFAULT_BENEFICIARY_FORM,
} from '../../../types/corporateBeneficiaries';
import {
  CORPORATE_BENEFICIARIES,
  CORPORATE_BENEFICIARY_GROUPS,
  getBeneficiaryRole,
} from '../../../data/corporateBeneficiariesMock';
import { BeneficiaryHomeScreen } from './screens/BeneficiaryHomeScreen';
import {
  AddTypeScreen,
  AddBusinessScreen,
  AddBankScreen,
  VerifyScreen,
  DuplicateScreen,
  ReviewScreen,
  AuthScreen,
  SubmittedScreen,
  ActivatedScreen,
} from './screens/AddBeneficiaryScreens';
import {
  BeneficiaryDetailScreen,
  ApproveConfirmScreen,
  RejectReasonScreen,
  ConfirmActionScreen,
} from './screens/BeneficiaryDetailScreens';
import {
  BeneficiaryGroupsScreen,
  GroupMembersScreen,
} from './screens/BeneficiaryGroupsScreen';

const ROOT_SCREENS: CorporateBeneficiariesScreen[] = ['home', 'groups'];

type PendingAuthAction = 'approve' | 'activate' | 'deactivate' | 'submit' | null;

export const CorporateBeneficiariesModule: React.FC = () => {
  const location = useLocation();
  const {
    user,
    addBeneficiary,
    updateBeneficiary,
    toggleBeneficiaryBlock,
    setCorporateTab,
    setBottomNavHidden,
    openDetailFlow,
    closeDetailFlow,
    addToast,
  } = useBanking();

  const [screen, setScreen] = useState<CorporateBeneficiariesScreen>('home');
  const [history, setHistory] = useState<CorporateBeneficiariesScreen[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<CorporateBeneficiaryRecord[]>(CORPORATE_BENEFICIARIES);
  const [groups, setGroups] = useState<CorporateBeneficiaryGroup[]>(CORPORATE_BENEFICIARY_GROUPS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<CorporateBeneficiaryForm>(DEFAULT_BENEFICIARY_FORM);
  const [pendingAction, setPendingAction] = useState<PendingAuthAction>(null);
  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [newBenId, setNewBenId] = useState('');

  const role = getBeneficiaryRole(user.role);
  const isChecker = role === 'checker' || role === 'admin';

  const selected = beneficiaries.find((b) => b.id === selectedId) || null;
  const editGroup = groups.find((g) => g.id === editGroupId) || null;

  const navigate = useCallback((next: CorporateBeneficiariesScreen) => {
    setHistory((h) => [...h, screen]);
    setScreen(next);
  }, [screen]);

  const goBack = useCallback(() => {
    if (history.length === 0) {
      setScreen('home');
      return;
    }
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setScreen(prev);
  }, [history]);

  const resetHome = () => {
    setScreen('home');
    setHistory([]);
    setForm(DEFAULT_BENEFICIARY_FORM);
    setPendingAction(null);
  };

  useEffect(() => {
    setCorporateTab('more');
  }, [setCorporateTab]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/corporate/beneficiaries/add' || path.startsWith('/corporate/beneficiaries/add/')) {
      setScreen('add-type');
      setHistory([]);
      return;
    }
    const detailMatch = path.match(/^\/corporate\/beneficiaries\/([^/]+)\/?$/);
    if (detailMatch && detailMatch[1] !== 'add') {
      setSelectedId(detailMatch[1]);
      setScreen('details');
    }
  }, [location.pathname]);

  useEffect(() => {
    const isRoot = ROOT_SCREENS.includes(screen);
    setBottomNavHidden(!isRoot);
    if (isRoot) closeDetailFlow();
    else openDetailFlow(`corporate-beneficiaries-${screen}`);
    return () => {
      setBottomNavHidden(false);
      closeDetailFlow();
    };
  }, [screen, setBottomNavHidden, openDetailFlow, closeDetailFlow]);

  const handleSubmit = () => {
    const newId = `ben_corp_${Date.now()}`;
    const benId = `BEN-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    setNewBenId(benId);

    if (isChecker) {
      setNewBenId(benId);
      setPendingAction('activate');
      navigate('auth');
      return;
    }
      const record: CorporateBeneficiaryRecord = {
        id: newId,
        beneficiaryId: benId,
        name: form.name,
        type: form.type,
        typeLabel: form.type === 'vendor' ? 'Vendor' : form.type,
        companyName: form.companyName || form.name,
        contactPerson: form.contactPerson,
        mobile: form.mobile,
        email: form.email,
        nickname: form.nickname || form.name,
        bankName: form.bankName,
        maskedAccount: `••••${form.accountNumber.slice(-4)}`,
        accountNumber: form.accountNumber,
        ifsc: form.ifsc,
        accountType: form.accountType,
        status: 'Pending Approval',
        isFavourite: false,
        createdBy: user.name,
        createdRole: 'Finance Maker',
        createdDate: '18 Aug 2026',
        groupIds: [],
      };
      setBeneficiaries((prev) => [record, ...prev]);
      addBeneficiary({
        name: form.name,
        accountNumber: form.accountNumber,
        bankName: form.bankName,
        ifsc: form.ifsc,
        type: 'corporate_vendor',
        transferLimit: 5000000,
        nickname: form.nickname,
        email: form.email,
        phone: form.mobile,
      });
      navigate('submitted');
  };

  const handleAuthComplete = () => {
    if (pendingAction === 'submit' || pendingAction === 'activate') {
      const newId = `ben_corp_${Date.now()}`;
      const record: CorporateBeneficiaryRecord = {
        id: newId,
        beneficiaryId: newBenId || `BEN-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
        name: form.name,
        type: form.type,
        typeLabel: 'Vendor',
        companyName: form.companyName || form.name,
        contactPerson: form.contactPerson,
        mobile: form.mobile,
        email: form.email,
        nickname: form.nickname || form.name,
        bankName: form.bankName,
        maskedAccount: `••••${form.accountNumber.slice(-4)}`,
        accountNumber: form.accountNumber,
        ifsc: form.ifsc,
        accountType: form.accountType,
        status: 'Active',
        isFavourite: false,
        createdBy: user.name,
        approvedBy: user.name,
        createdDate: '18 Aug 2026',
        approvalDate: '18 Aug 2026',
        groupIds: [],
      };
      setBeneficiaries((prev) => [record, ...prev]);
      addBeneficiary({
        name: form.name,
        accountNumber: form.accountNumber,
        bankName: form.bankName,
        ifsc: form.ifsc,
        type: 'corporate_vendor',
        transferLimit: 5000000,
        nickname: form.nickname,
        email: form.email,
        phone: form.mobile,
      });
      setPendingAction(null);
      navigate('activated');
      return;
    }
    if (pendingAction === 'approve' && selected) {
      setBeneficiaries((prev) =>
        prev.map((b) =>
          b.id === selected.id
            ? { ...b, status: 'Active' as const, approvedBy: user.name, approvalDate: '18 Aug 2026' }
            : b
        )
      );
      updateBeneficiary(selected.id, { status: 'active' });
      setPendingAction(null);
      navigate('activated');
      return;
    }
    if (pendingAction === 'deactivate' && selected) {
      setBeneficiaries((prev) =>
        prev.map((b) =>
          b.id === selected.id
            ? {
                ...b,
                status: 'Blocked' as const,
                blockedReason: 'Deactivated by corporate user',
                blockedOn: '18 Aug 2026',
              }
            : b
        )
      );
      toggleBeneficiaryBlock(selected.id);
      setPendingAction(null);
      addToast({ type: 'info', title: 'Beneficiary Deactivated', message: 'Payments to this beneficiary are disabled.' });
      navigate('details');
      return;
    }
  };

  const flowProps = { form, setForm, onBack: goBack, onNext: navigate };

  if (screen === 'home') {
    return (
      <BeneficiaryHomeScreen
        beneficiaries={beneficiaries}
        onAdd={() => navigate('add-type')}
        onOpen={(id) => { setSelectedId(id); navigate('details'); }}
        onGroups={() => navigate('groups')}
      />
    );
  }

  if (screen === 'groups') {
    return (
      <BeneficiaryGroupsScreen
        groups={groups}
        beneficiaries={beneficiaries}
        onBack={goBack}
        onSelectGroup={(id) => { setEditGroupId(id); navigate('group-members'); }}
      />
    );
  }

  if (screen === 'group-members' && editGroup) {
    return (
      <GroupMembersScreen
        group={editGroup}
        beneficiaries={beneficiaries}
        onBack={goBack}
        onOpen={(id) => { setSelectedId(id); navigate('details'); }}
      />
    );
  }

  if (screen === 'add-type') return <AddTypeScreen {...flowProps} />;
  if (screen === 'add-business') return <AddBusinessScreen {...flowProps} />;
  if (screen === 'add-bank') return <AddBankScreen {...flowProps} />;
  if (screen === 'verify') {
    return (
      <VerifyScreen
        {...flowProps}
        onVerified={() => {
          const dup = form.name && form.accountNumber ? true : false;
          if (dup && form.name.toLowerCase().includes('abc')) navigate('duplicate');
          else navigate('review');
        }}
      />
    );
  }
  if (screen === 'duplicate') {
    return (
      <DuplicateScreen
        {...flowProps}
        onViewExisting={(id) => { setSelectedId(id); setScreen('details'); setHistory([]); }}
      />
    );
  }
  if (screen === 'review') return <ReviewScreen {...flowProps} onSubmit={handleSubmit} />;

  if (screen === 'submitted') {
    return (
      <SubmittedScreen
        beneficiaryId={newBenId}
        name={form.name}
        submittedBy={user.name}
        onDone={resetHome}
      />
    );
  }

  if (screen === 'auth') {
    return <AuthScreen title="Authentication Required" onBack={goBack} onConfirm={handleAuthComplete} />;
  }

  if (screen === 'activated') {
    return (
      <ActivatedScreen
        beneficiaryId={newBenId || selected?.beneficiaryId || ''}
        onMakePayment={() => setCorporateTab('payments')}
        onDone={resetHome}
      />
    );
  }

  if (screen === 'details' && selected) {
    return (
      <BeneficiaryDetailScreen
        ben={selected}
        onBack={goBack}
        onEdit={() => navigate('edit')}
        onDeactivate={() => navigate('deactivate-confirm')}
        onApprove={() => navigate('approve-confirm')}
        onReject={() => navigate('reject-reason')}
        onReturn={() => {
          addToast({ type: 'info', title: 'Returned for changes', message: 'Beneficiary sent back to Maker.' });
          goBack();
        }}
        onResubmit={() => { setForm(DEFAULT_BENEFICIARY_FORM); navigate('add-business'); }}
      />
    );
  }

  if (screen === 'approve-confirm' && selected) {
    return (
      <ApproveConfirmScreen
        ben={selected}
        onBack={goBack}
        onConfirm={() => { setPendingAction('approve'); navigate('auth'); }}
      />
    );
  }

  if (screen === 'reject-reason' && selected) {
    return (
      <RejectReasonScreen
        onBack={goBack}
        onConfirm={(reason) => {
          setBeneficiaries((prev) =>
            prev.map((b) =>
              b.id === selected.id
                ? { ...b, status: 'Rejected' as const, rejectedBy: user.name, rejectionReason: reason }
                : b
            )
          );
          addToast({ type: 'warning', title: 'Beneficiary Rejected', message: reason });
          resetHome();
        }}
      />
    );
  }

  if (screen === 'deactivate-confirm' && selected) {
    return (
      <ConfirmActionScreen
        title="Deactivate Beneficiary?"
        message="Payments to this beneficiary will no longer be permitted. This action requires authentication."
        confirmLabel="Deactivate Beneficiary"
        onBack={goBack}
        onConfirm={() => { setPendingAction('deactivate'); navigate('auth'); }}
        danger
      />
    );
  }

  if (screen === 'edit') {
    return <AddBusinessScreen {...flowProps} />;
  }

  return null;
};

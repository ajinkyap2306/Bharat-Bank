import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight,
  ArrowRightLeft, 
  Edit3, 
  Trash2, 
  Ban, 
  History, 
  Shield, 
  Building, 
  User, 
  Star,
  CheckCircle2,
  Clock,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { Beneficiary } from '../../../types/banking';
import { SecureAuthModal } from '../../common/SecureAuthModal';
import { BottomSheet } from '../../common/BottomSheet';

interface BeneficiaryDetailsViewProps {
  beneficiaryId: string;
  onBack: () => void;
  onTransfer: (ben: Beneficiary) => void;
}

const BeneficiaryDetailsView: React.FC<BeneficiaryDetailsViewProps> = ({ beneficiaryId, onBack, onTransfer }) => {
  const { 
    beneficiaries, 
    updateBeneficiary, 
    deleteBeneficiary, 
    toggleBeneficiaryBlock, 
    toggleBeneficiaryFavourite,
    hideBottomNav,
    showBottomNav
  } = useBanking();

  const ben = beneficiaries.find(b => b.id === beneficiaryId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteSheetOpen, setIsDeleteSheetOpen] = useState(false);
  const [isBlockSheetOpen, setIsBlockSheetOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authAction, setAuthAction] = useState<'edit' | 'delete' | 'block' | 'unblock'>('edit');
  
  const [editForm, setEditForm] = useState({
    nickname: ben?.nickname || '',
    phone: ben?.phone || '',
    email: ben?.email || ''
  });

  useEffect(() => {
    hideBottomNav();
    return () => showBottomNav();
  }, []);

  if (!ben) return null;

  const handleAuthSuccess = () => {
    setIsAuthOpen(false);
    if (authAction === 'delete') {
      deleteBeneficiary(ben.id);
      onBack();
    } else if (authAction === 'block' || authAction === 'unblock') {
      toggleBeneficiaryBlock(ben.id);
      setIsBlockSheetOpen(false);
    } else if (authAction === 'edit') {
      updateBeneficiary(ben.id, editForm);
      setIsEditOpen(false);
    }
  };

  const handleAction = (action: typeof authAction) => {
    setAuthAction(action);
    setIsAuthOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 z-20">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Beneficiary Details
        </h1>
        <button
          onClick={() => toggleBeneficiaryFavourite(ben.id)}
          className="p-2"
        >
          <Star className={`w-6 h-6 ${ben.isFavourite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Profile Card */}
        <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 mb-4 shadow-inner">
            <User className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
            {ben.name}
          </h2>
          <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
            <Building className="w-4 h-4" />
            <span>{ben.bankName}</span>
          </div>
          <div className="mt-4 flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              ben.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
              ben.status === 'blocked' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
              'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
            }`}>
              {ben.status === 'pending_approval' ? 'Pending Activation' : ben.status}
            </span>
            {ben.isFavourite && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                Favourite
              </span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nickname</p>
                <p className="font-bold text-slate-900 dark:text-white">{ben.nickname || '-'}</p>
              </div>
              <button onClick={() => setIsEditOpen(true)} className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-y-5">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Number</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 tracking-wider">{ben.maskedAccount}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IFSC Code</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{ben.ifsc}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Added On</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{ben.addedDate || 'Not available'}</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transfer Limit</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">₹{ben.transferLimit.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Action List */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <button
              onClick={() => onTransfer(ben)}
              disabled={ben.status === 'blocked'}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Transfer Money</h4>
                  <p className="text-xs text-slate-500">Quickly send funds to this payee</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
            <div className="h-[1px] bg-slate-100 dark:bg-slate-800 mx-5" />
            <button
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Payment History</h4>
                  <p className="text-xs text-slate-500">View past transfers to this beneficiary</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="space-y-3">
            <button
              onClick={() => setIsBlockSheetOpen(true)}
              className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center space-x-2 text-slate-700 dark:text-slate-300 font-bold"
            >
              <Ban className="w-5 h-5" />
              <span>{ben.status === 'blocked' ? 'Unblock Beneficiary' : 'Block Beneficiary'}</span>
            </button>
            <button
              onClick={() => setIsDeleteSheetOpen(true)}
              className="w-full py-4 bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center justify-center space-x-2 text-red-600 font-bold"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Beneficiary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Nickname Sheet */}
      <BottomSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Beneficiary Details"
      >
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nickname</label>
              <input
                type="text"
                value={editForm.nickname}
                onChange={(e) => setEditForm({ ...editForm, nickname: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
              <input
                type="text"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
          <button
            onClick={() => handleAction('edit')}
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold"
          >
            Confirm Changes
          </button>
        </div>
      </BottomSheet>

      {/* Block Confirmation Sheet */}
      <BottomSheet
        isOpen={isBlockSheetOpen}
        onClose={() => setIsBlockSheetOpen(false)}
        title={ben.status === 'blocked' ? 'Unblock Beneficiary?' : 'Block Beneficiary?'}
      >
        <div className="p-6 flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
            ben.status === 'blocked' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {ben.status === 'blocked' ? <CheckCircle2 className="w-8 h-8" /> : <Ban className="w-8 h-8" />}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {ben.status === 'blocked' ? 'Are you sure you want to unblock?' : 'Are you sure you want to block?'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            {ben.status === 'blocked' 
              ? 'This will restore the ability to transfer funds to this payee.' 
              : 'You will not be able to send money to this beneficiary until they are unblocked.'}
          </p>
          <div className="w-full space-y-3">
            <button
              onClick={() => handleAction(ben.status === 'blocked' ? 'unblock' : 'block')}
              className={`w-full py-4 rounded-2xl font-bold text-white ${
                ben.status === 'blocked' ? 'bg-green-600' : 'bg-amber-600'
              }`}
            >
              Confirm
            </button>
            <button onClick={() => setIsBlockSheetOpen(false)} className="w-full py-3 text-slate-600 font-bold">
              Cancel
            </button>
          </div>
        </div>
      </BottomSheet>

      {/* Delete Confirmation Sheet */}
      <BottomSheet
        isOpen={isDeleteSheetOpen}
        onClose={() => setIsDeleteSheetOpen(false)}
        title="Delete Beneficiary?"
      >
        <div className="p-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Confirm Deletion</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            This action cannot be undone. This beneficiary will be removed from your list instantly.
          </p>
          <div className="w-full space-y-3">
            <button
              onClick={() => handleAction('delete')}
              className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold"
            >
              Delete Permanently
            </button>
            <button onClick={() => setIsDeleteSheetOpen(false)} className="w-full py-3 text-slate-600 font-bold">
              Go Back
            </button>
          </div>
        </div>
      </BottomSheet>

      <SecureAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        actionName={authAction.charAt(0).toUpperCase() + authAction.slice(1) + " Beneficiary"}
        amount={0}
      />
    </div>
  );
};

export default BeneficiaryDetailsView;

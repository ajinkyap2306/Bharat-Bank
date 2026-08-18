import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBanking } from '../../context/BankingContext';
import { CardTransaction, CreditDebitCard } from '../../types/banking';

// Sub-views
import { CardsOverview } from './cards/CardsOverview';
import { CardDetailsView } from './cards/CardDetailsView';
import { CardControlsView } from './cards/CardControlsView';
import { CardLimitsView } from './cards/CardLimitsView';
import { CardTransactionsView } from './cards/CardTransactionsView';
import { CardSecurityView } from './cards/CardSecurityView';

// Modals & Sheets
import { AddCardModal } from './cards/AddCardModal';
import { ChangePinModal } from './cards/ChangePinModal';
import { BlockCardModal } from './cards/BlockCardModal';
import { FreezeCardModal } from './cards/FreezeCardModal';
import { ReplaceCardModal } from './cards/ReplaceCardModal';
import { CardBillPayModal } from './cards/CardBillPayModal';
import { CardReplacementTrackerModal } from './cards/CardReplacementTrackerModal';
import { BottomSheet } from '../common/BottomSheet';
import { History, ShoppingBag, Landmark, Store, CreditCard, ChevronRight, Download, ShieldAlert, FileText } from 'lucide-react';

type CardView = 'overview' | 'details' | 'controls' | 'limits' | 'transactions' | 'security';

export const RetailCards: React.FC = () => {
  const { 
    cards, 
    cardTransactions,
    securityAlerts,
    toggleCardFreeze, 
    blockCard,
    replaceCard,
    addCard,
    changeCardPin,
    payCreditCardBill,
    updateGranularCardLimits, 
    toggleCardFeature, 
    resolveSecurityAlert,
    reportCardTransaction,
    hideBottomNav,
    showBottomNav,
    activeDetailFlow,
    openDetailFlow,
    closeDetailFlow
  } = useBanking();

  const [view, setView] = useState<CardView>('overview');
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0]?.id || '');
  const [selectedTransaction, setSelectedTransaction] = useState<CardTransaction | null>(null);

  // Modal States
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [isReplaceModalOpen, setIsReplaceModalOpen] = useState(false);
  const [isBillPayOpen, setIsBillPayOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);

  const selectedCard = cards.find(c => c.id === selectedCardId) || cards[0];

  // Sync BottomNav visibility with active flows or deep views
  useEffect(() => {
    if (view !== 'overview' || isAddCardOpen || isPinModalOpen || isBlockModalOpen || isFreezeModalOpen || isReplaceModalOpen || isBillPayOpen || isTrackerOpen) {
      hideBottomNav();
    } else {
      showBottomNav();
    }
  }, [view, isAddCardOpen, isPinModalOpen, isBlockModalOpen, isFreezeModalOpen, isReplaceModalOpen, isBillPayOpen, isTrackerOpen]);

  // Transition Helpers
  const navigateTo = (newView: CardView) => {
    setView(newView);
    if (newView !== 'overview') {
      openDetailFlow(`card_${newView}`);
    } else {
      closeDetailFlow();
    }
  };

  const goBack = () => {
    if (view === 'details') {
      navigateTo('overview');
    } else if (view !== 'overview') {
      navigateTo('details');
    }
  };

  const handleSelectCard = (card: CreditDebitCard) => {
    setSelectedCardId(card.id);
  };

  const handleToggleControl = (feature: 'online' | 'contactless' | 'international' | 'atm' | 'pos') => {
    toggleCardFeature(selectedCard.id, feature);
  };

  const handleUpdateLimits = (limits: { atm?: number; pos?: number; online?: number; intl?: number; domestic?: number }) => {
    updateGranularCardLimits(selectedCard.id, limits);
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {view === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <CardsOverview
              cards={cards}
              selectedCard={selectedCard}
              onSelectCard={handleSelectCard}
              onOpenDetails={() => navigateTo('details')}
              onOpenControls={() => navigateTo('controls')}
              onOpenLimits={() => navigateTo('limits')}
              onOpenTransactions={() => navigateTo('transactions')}
              onOpenChangePin={() => setIsPinModalOpen(true)}
              onOpenFreezeModal={() => setIsFreezeModalOpen(true)}
              onOpenAddCard={() => setIsAddCardOpen(true)}
              onOpenBillPay={() => setIsBillPayOpen(true)}
              onOpenSecurity={() => navigateTo('security')}
              onOpenTracker={() => setIsTrackerOpen(true)}
              onSelectTransaction={setSelectedTransaction}
              cardTransactions={cardTransactions}
              securityAlerts={securityAlerts}
            />
          </motion.div>
        )}

        {view === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <CardDetailsView
              card={selectedCard}
              onBack={goBack}
              onOpenControls={() => navigateTo('controls')}
              onOpenLimits={() => navigateTo('limits')}
              onOpenTransactions={() => navigateTo('transactions')}
              onOpenChangePin={() => setIsPinModalOpen(true)}
              onOpenFreezeModal={() => setIsFreezeModalOpen(true)}
              onOpenBlockModal={() => setIsBlockModalOpen(true)}
              onOpenReplaceModal={() => setIsReplaceModalOpen(true)}
              onOpenBillPay={() => setIsBillPayOpen(true)}
              onOpenTracker={() => setIsTrackerOpen(true)}
            />
          </motion.div>
        )}

        {view === 'controls' && (
          <motion.div
            key="controls"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <CardControlsView
              card={selectedCard}
              onBack={goBack}
              onToggleControl={handleToggleControl}
            />
          </motion.div>
        )}

        {view === 'limits' && (
          <motion.div
            key="limits"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <CardLimitsView
              card={selectedCard}
              onBack={goBack}
              onUpdateLimits={handleUpdateLimits}
            />
          </motion.div>
        )}

        {view === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <CardTransactionsView
              card={selectedCard}
              transactions={cardTransactions}
              onBack={goBack}
              onSelectTransaction={setSelectedTransaction}
            />
          </motion.div>
        )}

        {view === 'security' && (
          <motion.div
            key="security"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <CardSecurityView
              card={selectedCard}
              alerts={securityAlerts}
              onBack={goBack}
              onResolveAlert={resolveSecurityAlert}
              onReportFraud={() => setIsBlockModalOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AddCardModal
        isOpen={isAddCardOpen}
        onClose={() => setIsAddCardOpen(false)}
        onAddCard={addCard}
      />

      <ChangePinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onChangePin={(pin) => changeCardPin(selectedCard.id, pin)}
      />

      <BlockCardModal
        isOpen={isBlockModalOpen}
        card={selectedCard}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirmBlock={(reason) => blockCard(selectedCard.id, reason)}
        onOpenReplaceModal={() => setIsReplaceModalOpen(true)}
      />

      <FreezeCardModal
        isOpen={isFreezeModalOpen}
        card={selectedCard}
        onClose={() => setIsFreezeModalOpen(false)}
        onConfirm={() => toggleCardFreeze(selectedCard.id)}
      />

      <ReplaceCardModal
        isOpen={isReplaceModalOpen}
        card={selectedCard}
        onClose={() => setIsReplaceModalOpen(false)}
        onConfirm={(reason, type, address) => replaceCard(selectedCard.id, reason, type, address)}
      />

      <CardBillPayModal
        isOpen={isBillPayOpen}
        card={selectedCard}
        onClose={() => setIsBillPayOpen(false)}
        onPay={(amount, fromAccId) => payCreditCardBill(selectedCard.id, amount, fromAccId)}
      />

      <CardReplacementTrackerModal
        isOpen={isTrackerOpen}
        card={selectedCard}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Transaction Detail Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Transaction Details"
      >
        {selectedTransaction && (
          <div className="space-y-6 pb-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-700 dark:text-slate-300">
                {selectedTransaction.paymentMethod === 'Online' && <ShoppingBag className="w-8 h-8" />}
                {selectedTransaction.paymentMethod === 'POS' && <Store className="w-8 h-8" />}
                {selectedTransaction.paymentMethod === 'ATM' && <Landmark className="w-8 h-8" />}
                {!['Online', 'POS', 'ATM'].includes(selectedTransaction.paymentMethod) && <CreditCard className="w-8 h-8" />}
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{selectedTransaction.merchant}</h4>
                <p className="text-xs text-slate-500">{selectedTransaction.merchantCategory}</p>
              </div>
              <p className={`text-3xl font-mono font-bold ${
                selectedTransaction.type === 'credit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'
              }`}>
                {selectedTransaction.type === 'credit' ? '+' : '-'}₹{selectedTransaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{selectedTransaction.status}</span>
              </div>
            </div>

            <div className="space-y-3 px-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Date & Time</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedTransaction.date}, {selectedTransaction.time}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Method</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">{selectedTransaction.paymentMethod}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Reference Number</p>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{selectedTransaction.referenceNumber}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Auth Code</p>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">{selectedTransaction.authCode}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Location</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{selectedTransaction.city || 'Mumbai'}, India</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => reportCardTransaction(selectedTransaction.id, 'Unrecognized transaction')}
                className="py-3 rounded-xl border border-rose-200 text-rose-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-rose-50"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Report Fraud</span>
              </button>
              <button
                onClick={() => alert('Receipt downloaded to your device.')}
                className="py-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Get Receipt</span>
              </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

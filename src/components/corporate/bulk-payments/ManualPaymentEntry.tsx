import React, { useState } from 'react';
import { BottomSheet } from '../../common/BottomSheet';

interface ManualPaymentEntryProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payment: {
    beneficiary: string;
    maskedAccount: string;
    bank: string;
    amount: number;
    reference: string;
    paymentMethod: string;
  }) => void;
}

export const ManualPaymentEntry: React.FC<ManualPaymentEntryProps> = ({ isOpen, onClose, onSave }) => {
  const [beneficiary, setBeneficiary] = useState('');
  const [account, setAccount] = useState('');
  const [bank, setBank] = useState('');
  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [method, setMethod] = useState('NEFT');

  const handleSave = () => {
    const parsed = Number(amount.replace(/,/g, ''));
    if (!beneficiary || !account || !bank || !parsed) return;
    const masked = account.length > 4 ? `•••• ${account.slice(-4)}` : account;
    onSave({
      beneficiary,
      maskedAccount: masked,
      bank,
      amount: parsed,
      reference,
      paymentMethod: method,
    });
    setBeneficiary('');
    setAccount('');
    setBank('');
    setAmount('');
    setReference('');
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add Payment Manually" subtitle="Enter payment details">
      <div className="px-4 pb-6 space-y-3 max-h-[70vh] overflow-y-auto">
        {[
          { label: 'Beneficiary', value: beneficiary, set: setBeneficiary, placeholder: 'ABC Suppliers Ltd.' },
          { label: 'Account', value: account, set: setAccount, placeholder: 'Last 4 digits or masked' },
          { label: 'Bank', value: bank, set: setBank, placeholder: 'HDFC Bank' },
          { label: 'Amount', value: amount, set: setAmount, placeholder: '250000', type: 'number' },
          { label: 'Reference', value: reference, set: setReference, placeholder: 'INV-4582' },
        ].map((field) => (
          <label key={field.label} className="block">
            <span className="text-[12px] text-[#667085]">{field.label}</span>
            <input
              type={field.type ?? 'text'}
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              placeholder={field.placeholder}
              className="mt-1 w-full px-3 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 text-[14px] min-h-11"
            />
          </label>
        ))}
        <label className="block">
          <span className="text-[12px] text-[#667085]">Payment Method</span>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1 w-full px-3 py-3 rounded-xl border border-[#E4E7EC] dark:border-slate-700 text-[14px] min-h-11"
          >
            <option value="NEFT">NEFT</option>
            <option value="RTGS">RTGS</option>
            <option value="IMPS">IMPS</option>
          </select>
        </label>
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3.5 rounded-2xl bg-[#0B5CAB] text-white font-bold text-sm min-h-11 mt-2"
        >
          Add to Batch
        </button>
      </div>
    </BottomSheet>
  );
};

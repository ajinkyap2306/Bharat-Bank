import React, { useMemo, useState } from 'react';
import { ChevronRight, Contact, Search, Smartphone } from 'lucide-react';
import {
  BharatPhoneContact,
  getBharatBankPhoneContacts,
  resolveBharatBankPhoneContact,
} from '../../../data/level3Mock';

interface ContactTransferPickerProps {
  onSelect: (contact: BharatPhoneContact) => void;
  onInvalidContact?: (message: string) => void;
}

export const ContactTransferPicker: React.FC<ContactTransferPickerProps> = ({
  onSelect,
  onInvalidContact,
}) => {
  const [search, setSearch] = useState('');
  const [picking, setPicking] = useState(false);
  const contacts = useMemo(() => getBharatBankPhoneContacts(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) => c.name.toLowerCase().includes(q) || c.mobile.includes(q.replace(/\D/g, ''))
    );
  }, [contacts, search]);

  const pickFromDevice = async () => {
    setPicking(true);
    try {
      const contactsApi = (
        navigator as Navigator & {
          contacts?: {
            select: (
              props: string[],
              opts?: { multiple?: boolean }
            ) => Promise<Array<{ name?: string[]; tel?: string[] }>>;
          };
        }
      ).contacts;

      if (!contactsApi?.select) {
        onInvalidContact?.('Contact picker is not supported on this device. Choose from the list below.');
        return;
      }

      const picked = await contactsApi.select(['name', 'tel'], { multiple: false });
      const entry = picked[0];
      const mobile = entry?.tel?.[0] ?? '';
      const name = entry?.name?.[0] ?? 'Contact';
      const resolved = resolveBharatBankPhoneContact(mobile, name);

      if (!resolved) {
        onInvalidContact?.(
          'This contact is not registered with Bharat Co-operative Bank. Only Bharat Bank customers can be paid here.'
        );
        return;
      }

      onSelect(resolved);
    } catch {
      onInvalidContact?.('Could not access phone contacts. Choose from the list below.');
    } finally {
      setPicking(false);
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500 px-1">
        Bharat Bank customers from your saved phone contacts are shown below.
      </p>

      <button
        type="button"
        onClick={pickFromDevice}
        disabled={picking}
        className="w-full flex items-center gap-3 p-4 rounded-2xl bg-congress-blue-50 dark:bg-congress-blue-950/30 border border-congress-blue-200 dark:border-congress-blue-800 text-left active:scale-[0.99] transition-transform disabled:opacity-60"
      >
        <span className="w-10 h-10 rounded-full bg-congress-blue-100 dark:bg-congress-blue-900 text-congress-blue-700 flex items-center justify-center shrink-0">
          <Smartphone className="w-5 h-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            {picking ? 'Opening contacts…' : 'Pick from Phone Contacts'}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Only Bharat Bank customers can be paid</p>
        </div>
        <ChevronRight className="w-4 h-4 text-congress-blue-600 shrink-0" />
      </button>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Bharat Bank contacts"
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm outline-none focus:border-congress-blue-500"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((contact) => (
          <button
            key={contact.id}
            type="button"
            onClick={() => onSelect(contact)}
            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left active:scale-[0.99] transition-transform"
          >
            <span className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center shrink-0">
              <Contact className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 dark:text-white">{contact.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">
                +91 {contact.mobile} · {contact.bankName}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-slate-500 text-center py-6 px-4">
          No Bharat Bank contacts match your search. Try another name or number.
        </p>
      )}
    </div>
  );
};

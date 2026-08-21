import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { BottomSheet } from '../common/BottomSheet';

export type LoginDemoPersona = 'retail' | 'rahul' | 'amit' | 'maker' | 'checker';

const DEMO_PERSONAS: {
  id: LoginDemoPersona;
  title: string;
  customerId: string;
  activeClass: string;
  idleClass: string;
}[] = [
  {
    id: 'rahul',
    title: 'Rahul — Initiator',
    customerId: 'RB-RAHUL01',
    activeClass: 'bg-blue-600 border-blue-600 text-white shadow-sm',
    idleClass:
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'amit',
    title: 'Amit — Approver',
    customerId: 'RB-AMIT01',
    activeClass: 'bg-indigo-600 border-indigo-600 text-white shadow-sm',
    idleClass:
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-indigo-700 dark:text-indigo-300',
  },
  {
    id: 'retail',
    title: 'Retail',
    customerId: 'RB-123456',
    activeClass: 'bg-slate-700 border-slate-700 text-white shadow-sm',
    idleClass:
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300',
  },
  {
    id: 'maker',
    title: 'Maker',
    customerId: 'C001',
    activeClass: 'bg-teal-600 border-teal-600 text-white shadow-sm',
    idleClass:
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-teal-700 dark:text-teal-300',
  },
  {
    id: 'checker',
    title: 'Checker',
    customerId: 'C002',
    activeClass: 'bg-amber-600 border-amber-600 text-white shadow-sm',
    idleClass:
      'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-amber-800 dark:text-amber-300',
  },
];

interface LoginDemoPickerProps {
  activePersona: LoginDemoPersona;
  onSelect: (persona: LoginDemoPersona) => void;
}

export const LoginDemoPicker: React.FC<LoginDemoPickerProps> = ({ activePersona, onSelect }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (persona: LoginDemoPersona) => {
    onSelect(persona);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-4 z-30 flex items-center gap-2 pl-3 pr-4 py-2.5 rounded-full bg-slate-900/95 text-white shadow-xl border border-slate-700 backdrop-blur-md active:scale-95 transition-transform safe-bottom"
        aria-label="Open quick demo login options"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <Sparkles className="w-4 h-4 text-amber-400" aria-hidden />
        <span className="text-xs font-bold">Demo</span>
      </button>

      <BottomSheet
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Quick Demo Login"
        subtitle="Select a persona to fill demo credentials"
      >
        <div className="space-y-2 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {DEMO_PERSONAS.slice(0, 2).map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => handleSelect(persona.id)}
                className={`py-2.5 px-2 rounded-xl text-[10px] font-bold border transition-all ${
                  activePersona === persona.id ? persona.activeClass : persona.idleClass
                }`}
              >
                <span className="block">{persona.title}</span>
                <span className="block font-mono text-[9px] mt-0.5 opacity-90">{persona.customerId}</span>
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_PERSONAS.slice(2).map((persona) => (
              <button
                key={persona.id}
                type="button"
                onClick={() => handleSelect(persona.id)}
                className={`py-2.5 px-2 rounded-xl text-[10px] font-bold border transition-all ${
                  activePersona === persona.id ? persona.activeClass : persona.idleClass
                }`}
              >
                <span className="block">{persona.title}</span>
                <span className="block font-mono text-[9px] mt-0.5 opacity-90">{persona.customerId}</span>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 text-center pt-2">
            MPIN varies by persona · Default demo MPIN: 123456
          </p>
        </div>
      </BottomSheet>
    </>
  );
};

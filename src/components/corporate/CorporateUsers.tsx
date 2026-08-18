import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  KeyRound, 
  Plus, 
  CheckCircle2, 
  Lock, 
  Smartphone, 
  UserCheck, 
  AlertCircle,
  Clock,
  Shield,
  Search
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { CorporateUser } from '../../types/banking';
import { motion } from 'motion/react';

export const CorporateUsers: React.FC = () => {
  const { corporateUsers, addToast, setBottomNavHidden } = useBanking();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Bottom Navigation visibility: HIDDEN during Add Signatory form
  useEffect(() => {
    if (showAddUserModal) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [showAddUserModal, setBottomNavHidden]);

  const filteredUsers = corporateUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 pb-28 max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-teal-800/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Identity & Access Management
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Authorized Signatories</h2>
            <p className="text-xs text-slate-300">
              Multi-role governance: Maker, Checker, Admin and Auditor controls
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search signatories or roles..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-teal-600 shadow-xs"
          />
        </div>

        <button
          onClick={() => addToast({ type: 'info', title: 'Corporate Board Resolution', message: 'Adding signatories requires Board Resolution Doc Form 12.' })}
          className="px-3.5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New User</span>
        </button>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map(u => (
          <div
            key={u.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{u.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    u.role === 'Administrator' 
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                      : u.role === 'Checker / Approver'
                      ? 'bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300'
                      : u.role === 'Maker / Initiator'
                      ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}>
                    {u.role}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{u.email}</p>
                <p className="text-[10px] text-slate-400">{u.department}</p>
              </div>

              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {u.lastActive}
              </span>
            </div>

            {/* Permissions list */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Authorized Scopes
              </p>
              <div className="flex flex-wrap gap-1">
                {u.permissions.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

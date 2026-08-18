import React, { useState, useEffect } from 'react';
import { 
  Users, 
  SendHorizontal, 
  Download, 
  CheckCircle2, 
  Building2, 
  Upload, 
  Search, 
  Filter, 
  FileText, 
  ShieldCheck, 
  CheckCheck,
  Briefcase
} from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

export const CorporatePayroll: React.FC = () => {
  const { employees, processPayrollBatch, addToast, setBottomNavHidden } = useBanking();
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Bottom Navigation visibility: HIDDEN during Run Payroll confirmation dialog
  useEffect(() => {
    if (showConfirmation) {
      setBottomNavHidden(true);
    } else {
      setBottomNavHidden(false);
    }
    return () => setBottomNavHidden(false);
  }, [showConfirmation, setBottomNavHidden]);

  const departments = ['all', 'Engineering', 'Product & Design', 'Sales & Growth', 'Finance & Legal'];

  const filteredEmployees = employees.filter(emp => {
    const matchesDept = selectedDept === 'all' ? true : emp.department === selectedDept;
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const totalPayroll = filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0);

  const handleDisbursePayroll = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    processPayrollBatch(selectedDept === 'all' ? undefined : selectedDept);
    setShowConfirmation(false);
  };

  return (
    <div className="p-4 space-y-4 pb-28 max-w-lg mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 text-white rounded-3xl p-5 shadow-xl border border-indigo-800/40">
        <div className="flex items-center justify-between">
          <div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Disbursement Engine
            </span>
            <h2 className="text-xl font-bold text-white mt-1">Corporate Payroll</h2>
            <p className="text-xs text-slate-300">
              Bulk salaries, bonuses & contractor payments with PF/TDS compliance
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Salary Summary Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Monthly Disbursement</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-0.5">
              ₹{totalPayroll.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {filteredEmployees.length} Payees
            </span>
            <p className="text-[10px] text-slate-500">Status: Ready</p>
          </div>
        </div>

        <button
          onClick={() => setShowConfirmation(true)}
          className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <SendHorizontal className="w-4 h-4" />
          <span>Execute Salary Disbursement Batch</span>
        </button>
      </div>

      {/* Department Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDept(dept)}
            className={`shrink-0 px-3 py-2 rounded-xl transition-all capitalize ${
              selectedDept === dept
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {dept === 'all' ? 'All Teams' : dept}
          </button>
        ))}
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by employee name or ID..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-indigo-600 shadow-xs"
        />
      </div>

      {/* Employee Roster */}
      <div className="space-y-2.5">
        {filteredEmployees.map(emp => (
          <div
            key={emp.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-3.5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-900 dark:text-white truncate">{emp.name}</span>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.2 rounded">
                  {emp.empId}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                {emp.designation} • {emp.department}
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                {emp.accountNumber} ({emp.ifsc})
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                ₹{emp.salary.toLocaleString('en-IN')}
              </p>
              <span className="text-[9px] font-bold text-emerald-600 uppercase">Verified</span>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4"
          >
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center mx-auto">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Authorize Payroll Batch</h3>
              <p className="text-xs text-slate-500">
                Debit from Corporate Payroll Account (•••• 2002)
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-center space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-600">Total Net Amount</span>
              <p className="text-2xl font-black text-indigo-950 dark:text-indigo-200 font-mono">
                ₹{totalPayroll.toLocaleString('en-IN')}
              </p>
              <p className="text-[10px] text-slate-500">
                {filteredEmployees.length} Employee Accounts Scheduled
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDisbursePayroll}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
              >
                Sign & Disburse Batch
              </button>
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

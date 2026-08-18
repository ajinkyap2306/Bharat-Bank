import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Briefcase, 
  Building2, 
  IndianRupee, 
  BadgePercent, 
  Clock, 
  Landmark,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LoanApplicationState, ApplicantEmploymentDetails } from './LoanFlowData';

interface LoanEmploymentStepProps {
  appState: LoanApplicationState;
  onUpdateEmployment: (employment: ApplicantEmploymentDetails) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const LoanEmploymentStep: React.FC<LoanEmploymentStepProps> = ({
  appState,
  onUpdateEmployment,
  onContinue,
  onBack
}) => {
  const [form, setForm] = useState<ApplicantEmploymentDetails>(appState.employment);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const popularEmployers = ['Google India', 'Tata Consultancy Services', 'Infosys', 'Microsoft', 'HDFC Bank', 'Reliance Industries', 'Bharat Forge'];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.employerName.trim()) errs.employerName = 'Employer/Business name is required';
    if (!form.designation.trim()) errs.designation = 'Designation/Role is required';
    if (form.monthlyNetIncome < 15000) errs.monthlyNetIncome = 'Monthly income must be at least ₹15,000';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceed = () => {
    if (validate()) {
      onUpdateEmployment(form);
      onContinue();
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Header & Step Indicator */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
            Step 2 of 6: Employment & Income
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Work & Financial Profile
          </h2>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
        <div className="bg-blue-600 h-full w-2/6 rounded-full transition-all duration-300" />
      </div>

      {/* Form Container */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        {/* Employment Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Employment Category
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Salaried', 'Self-Employed Professional', 'Business Owner'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setForm({ ...form, employmentType: type })}
                className={`p-2.5 rounded-xl text-center border text-xs font-bold transition-all ${
                  form.employmentType === type
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {type === 'Self-Employed Professional' ? 'Professional' : type}
              </button>
            ))}
          </div>
        </div>

        {/* Employer / Business Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-600" /> Employer / Registered Company
          </label>
          <input
            type="text"
            value={form.employerName}
            onChange={(e) => setForm({ ...form, employerName: e.target.value })}
            placeholder="e.g. Google India Pvt Ltd"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
          {errors.employerName && <p className="text-[10px] text-red-500">{errors.employerName}</p>}

          {/* Quick select employer tags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {popularEmployers.map((emp) => (
              <button
                key={emp}
                type="button"
                onClick={() => setForm({ ...form, employerName: emp })}
                className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              >
                + {emp}
              </button>
            ))}
          </div>
        </div>

        {/* Designation */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Official Designation / Job Title
          </label>
          <input
            type="text"
            value={form.designation}
            onChange={(e) => setForm({ ...form, designation: e.target.value })}
            placeholder="e.g. Senior Lead Engineer"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
          />
          {errors.designation && <p className="text-[10px] text-red-500">{errors.designation}</p>}
        </div>

        {/* Monthly Net In-Hand Income */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <IndianRupee className="w-3.5 h-3.5 text-blue-600" /> Monthly Net In-Hand Salary
            </span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400">
              ₹{form.monthlyNetIncome.toLocaleString('en-IN')}
            </span>
          </div>
          <input
            type="range"
            min={15000}
            max={500000}
            step={5000}
            value={form.monthlyNetIncome}
            onChange={(e) => setForm({ ...form, monthlyNetIncome: Number(e.target.value) })}
            className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
          />
        </div>

        {/* Total Experience & Current Company Experience */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> Total Experience
            </label>
            <select
              value={form.totalWorkExperienceYears}
              onChange={(e) => setForm({ ...form, totalWorkExperienceYears: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
            >
              <option value={1}>1 Year</option>
              <option value={2}>2 Years</option>
              <option value={4}>4 Years</option>
              <option value={8}>8+ Years</option>
              <option value={12}>12+ Years</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> At Present Org
            </label>
            <select
              value={form.currentCompanyExperienceYears}
              onChange={(e) => setForm({ ...form, currentCompanyExperienceYears: Number(e.target.value) })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
            >
              <option value={1}>6 - 12 Months</option>
              <option value={2}>2 Years</option>
              <option value={3}>3+ Years</option>
              <option value={5}>5+ Years</option>
            </select>
          </div>
        </div>

        {/* Existing Obligations & Salary Bank */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Existing Monthly EMIs
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={form.existingMonthlyEmis}
                onChange={(e) => setForm({ ...form, existingMonthlyEmis: Number(e.target.value) })}
                className="w-full pl-7 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Landmark className="w-3 h-3 text-blue-600" /> Salary Account Bank
            </label>
            <select
              value={form.salaryBank}
              onChange={(e) => setForm({ ...form, salaryBank: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-hidden"
            >
              <option value="Bharat Co-operative Bank">Bharat Co-operative Bank (Instant Auto-Verify)</option>
              <option value="HDFC Bank">HDFC Bank</option>
              <option value="ICICI Bank">ICICI Bank</option>
              <option value="State Bank of India">State Bank of India</option>
              <option value="Axis Bank">Axis Bank</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-30 max-w-xl mx-auto flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="w-1/3 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleProceed}
          className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-all"
        >
          <span>Continue to Documents</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

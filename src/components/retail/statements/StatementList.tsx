import React from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Download, 
  Share2, 
  ChevronRight, 
  Calendar,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { Statement } from '../../../types/banking';

interface StatementListProps {
  accountId?: string;
  onPreview: (stmt: Statement) => void;
}

const StatementList: React.FC<StatementListProps> = ({ accountId, onPreview }) => {
  const { statements, accounts, addToast } = useBanking();
  
  const selectedAccount = accountId ? accounts.find(a => a.id === accountId) : accounts[0];
  const filteredStatements = statements.filter(s => s.accountId === selectedAccount?.id);

  const handleDownload = (e: React.MouseEvent, stmt: Statement, format: 'pdf' | 'csv') => {
    e.stopPropagation();
    addToast({
      type: 'success',
      title: 'Download Started',
      message: `${format.toUpperCase()} Statement for ${stmt.period} is downloading.`,
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 px-4 py-4 space-y-6">
      <div>
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
          Available Statements
        </h3>
        <div className="space-y-3">
          {filteredStatements.length > 0 ? (
            filteredStatements.map((stmt) => (
              <motion.div
                key={stmt.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPreview(stmt)}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {stmt.period}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {stmt.startDate} - {stmt.endDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => handleDownload(e, stmt, 'pdf')}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToast({ type: 'info', title: 'Shared', message: 'Statement link copied to clipboard.' });
                    }}
                    className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-slate-300 ml-1" />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 dark:text-slate-400">No statements found for this account.</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-600/20">
        <div className="flex items-center space-x-3 mb-4">
          <Calendar className="w-6 h-6" />
          <h3 className="font-bold text-lg">Custom Statement</h3>
        </div>
        <p className="text-blue-100 text-sm mb-6 leading-relaxed">
          Need transactions for a specific period? Generate a custom statement in PDF or CSV format instantly.
        </p>
        <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-bold active:scale-95 transition-transform">
          Generate Now
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Statement Formats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">PDF Format</span>
            <p className="text-[10px] text-slate-500 mt-1">Ideal for printing & records</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-2">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">CSV Format</span>
            <p className="text-[10px] text-slate-500 mt-1">Best for data analysis</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatementList;

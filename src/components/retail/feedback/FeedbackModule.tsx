import React, { useState } from 'react';
import { MessageSquare, CheckCircle2, Star } from 'lucide-react';
import { useBanking } from '../../../context/BankingContext';
import { ScreenHeader } from '../../common/ScreenHeader';
import { FEEDBACK_CATEGORIES } from '../../../data/level6Mock';

export const FeedbackModule: React.FC = () => {
  const { feedbackSubmissions, submitFeedback, addToast, setRetailTab, setBottomNavHidden } = useBanking();
  const [category, setCategory] = useState(FEEDBACK_CATEGORIES[0]);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [done, setDone] = useState(false);
  const [ref, setRef] = useState('');

  React.useEffect(() => {
    setBottomNavHidden(true);
    return () => setBottomNavHidden(false);
  }, [setBottomNavHidden]);

  if (done) {
    return (
      <div className="flex flex-col items-center text-center px-4 pt-16 pb-24 -mx-3 bg-slate-50 dark:bg-slate-950 min-h-full">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
        <h2 className="text-xl font-extrabold">Thank You!</h2>
        <p className="text-xs text-slate-500 mt-2">Reference: <span className="font-mono font-bold">{ref}</span></p>
        <p className="text-xs text-slate-500 mt-1">We appreciate your feedback and will review it shortly.</p>
        <button type="button" onClick={() => setRetailTab('services')} className="mt-8 w-full py-3.5 bg-blue-600 text-white font-bold rounded-2xl">Done</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full -mx-3 px-3 bg-slate-50 dark:bg-slate-950 min-h-full">
      <ScreenHeader title="Feedback" subtitle="Help us improve" onBack={() => setRetailTab('services')} />

      <div className="pt-3 pb-6 space-y-4">
        <div className="p-4 rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200/60 flex gap-3">
          <MessageSquare className="w-8 h-8 text-violet-600 shrink-0" />
          <p className="text-xs text-slate-600">Share your experience about our app, branch, or services. Your feedback helps us serve you better.</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm">
            {FEEDBACK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <div>
            <p className="text-xs font-bold text-slate-500 mb-2">Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} className="p-1">
                  <Star className={`w-7 h-7 ${n <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us more (optional)"
            rows={4}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-sm resize-none"
          />

          <button
            type="button"
            onClick={() => {
              if (rating === 0) {
                addToast({ type: 'error', title: 'Rating required', message: 'Please select a star rating.' });
                return;
              }
              const reference = submitFeedback({ category, rating, message });
              setRef(reference);
              setDone(true);
            }}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-2xl"
          >
            Submit Feedback
          </button>
        </div>

        {feedbackSubmissions.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase px-1">Past Feedback</p>
            {feedbackSubmissions.map((f) => (
              <div key={f.id} className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between">
                  <p className="text-sm font-bold">{f.category}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: f.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                {f.message && <p className="text-xs text-slate-500 mt-1">{f.message}</p>}
                <p className="text-[10px] text-slate-400 mt-1">{f.reference} • {f.submittedOn}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

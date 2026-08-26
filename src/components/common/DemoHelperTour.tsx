import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Sparkles, X } from 'lucide-react';
import { useBanking } from '../../context/BankingContext';
import {
  getCorporateDemoTourSteps,
  getDemoTourStorageKey,
  getRetailDemoTourSteps,
  hasCompletedDemoTour,
  markDemoTourFinished,
  type DemoTourStep,
} from '../../data/demoTourMock';

const TOUR_START_DELAY_MS = 900;

function getTooltipStyle(
  step: DemoTourStep,
  targetRect: DOMRect | null
): React.CSSProperties {
  if (step.placement === 'center') {
    return {
      top: '28%',
      left: '16px',
      right: '16px',
      maxWidth: '28rem',
      margin: '0 auto',
    };
  }

  if (step.placement === 'above-nav') {
    return {
      bottom: '5.75rem',
      left: '16px',
      right: '16px',
      maxWidth: '28rem',
      margin: '0 auto',
    };
  }

  if (step.placement === 'below-target' && targetRect) {
    const top = Math.min(targetRect.bottom + 12, window.innerHeight - 220);
    return {
      top: `${top}px`,
      left: '16px',
      right: '16px',
      maxWidth: '28rem',
      margin: '0 auto',
    };
  }

  return {
    top: '28%',
    left: '16px',
    right: '16px',
    maxWidth: '28rem',
    margin: '0 auto',
  };
}

export const DemoHelperTour: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    bankingType,
    retailActiveUserId,
    corporateSession,
    hasRetailJointApprovalAccess,
    setRetailTab,
    setCorporateTab,
  } = useBanking();

  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const tourKey = useMemo(
    () =>
      getDemoTourStorageKey(
        bankingType,
        retailActiveUserId,
        corporateSession?.role
      ),
    [bankingType, retailActiveUserId, corporateSession?.role]
  );

  const steps = useMemo(
    () =>
      bankingType === 'retail'
        ? getRetailDemoTourSteps(hasRetailJointApprovalAccess)
        : getCorporateDemoTourSteps(),
    [bankingType, hasRetailJointApprovalAccess]
  );

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex >= steps.length - 1;

  const ensureHomeContext = useCallback(() => {
    if (bankingType === 'retail') {
      setRetailTab('home');
      navigate('/');
    } else {
      setCorporateTab('home');
      navigate('/corporate/home');
    }
  }, [bankingType, setRetailTab, setCorporateTab, navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      setActive(false);
      setStepIndex(0);
      return;
    }

    if (hasCompletedDemoTour(tourKey)) return;

    const timer = window.setTimeout(() => {
      ensureHomeContext();
      setStepIndex(0);
      setActive(true);
    }, TOUR_START_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [isAuthenticated, tourKey, ensureHomeContext]);

  useEffect(() => {
    if (!active || !currentStep?.target) {
      setTargetRect(null);
      return;
    }

    const updateRect = () => {
      const element = document.querySelector(`[data-tour="${currentStep.target}"]`);
      if (!element) {
        setTargetRect(null);
        return;
      }
      setTargetRect(element.getBoundingClientRect());
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    window.addEventListener('scroll', updateRect, true);
    const interval = window.setInterval(updateRect, 250);

    return () => {
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect, true);
      window.clearInterval(interval);
    };
  }, [active, currentStep]);

  const finishTour = (skipped: boolean) => {
    markDemoTourFinished(tourKey, skipped);
    setActive(false);
    setStepIndex(0);
    setTargetRect(null);
  };

  const handleSkip = () => finishTour(true);

  const handleNext = () => {
    if (isLastStep) {
      finishTour(false);
      return;
    }
    setStepIndex((prev) => prev + 1);
  };

  if (!active || !currentStep) return null;

  const tooltipStyle = getTooltipStyle(currentStep, targetRect);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] pointer-events-none" aria-live="polite">
        {!targetRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-[2px] pointer-events-auto"
            aria-hidden
          />
        )}

        {targetRect && (
          <div
            className="fixed inset-0 bg-transparent pointer-events-auto"
            aria-hidden
          />
        )}

        {targetRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed pointer-events-none rounded-2xl ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950/80 shadow-[0_0_0_9999px_rgba(2,6,23,0.55)]"
            style={{
              top: targetRect.top - 6,
              left: targetRect.left - 6,
              width: targetRect.width + 12,
              height: targetRect.height + 12,
            }}
          />
        )}

        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          className="fixed pointer-events-auto"
          style={tooltipStyle}
        >
          <div className="rounded-2xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
            <div className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 py-3 text-white flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide opacity-90">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden />
                  Demo helper
                </div>
                <h3 className="text-base font-extrabold mt-0.5 leading-snug">{currentStep.title}</h3>
              </div>
              <button
                type="button"
                onClick={handleSkip}
                className="shrink-0 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
                aria-label="Skip tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-4 py-3.5">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentStep.message}
              </p>

              <div className="flex items-center justify-between gap-3 mt-4">
                <div className="flex items-center gap-1">
                  {steps.map((step, index) => (
                    <span
                      key={step.id}
                      className={`h-1.5 rounded-full transition-all ${
                        index === stepIndex
                          ? 'w-5 bg-blue-600'
                          : index < stepIndex
                            ? 'w-1.5 bg-blue-400'
                            : 'w-1.5 bg-slate-300 dark:bg-slate-600'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="px-3 py-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    Skip
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-sm active:scale-[0.98] transition-all"
                  >
                    {isLastStep ? 'Got it' : 'Next'}
                    {!isLastStep && <ChevronRight className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-3">
                Step {stepIndex + 1} of {steps.length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

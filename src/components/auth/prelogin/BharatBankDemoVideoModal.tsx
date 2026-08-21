import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Pause, Play, PlayCircle, X } from 'lucide-react';
import { BHARAT_BANK_OFFICIAL_DEMO } from '../../../data/preLoginMock';
import { BharatBankLogo } from '../../common/BharatBankLogo';

interface BharatBankDemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo: () => void;
  startLabel?: string;
}

const DemoReel: React.FC<{ isPlaying: boolean; onTogglePlay: () => void }> = ({
  isPlaying,
  onTogglePlay,
}) => {
  const { slides, slideDurationMs } = BHARAT_BANK_OFFICIAL_DEMO;
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    setProgress(0);
    const startedAt = Date.now();
    const tick = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const pct = Math.min(100, (elapsed / slideDurationMs) * 100);
      setProgress(pct);
      if (elapsed >= slideDurationMs) {
        setActiveIndex((prev) => (prev + 1) % slides.length);
        setProgress(0);
      }
    }, 50);

    return () => window.clearInterval(tick);
  }, [isPlaying, activeIndex, slideDurationMs, slides.length]);

  const slide = slides[activeIndex];

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 shadow-inner">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className={`absolute inset-0 bg-linear-to-br ${slide.accent} flex flex-col items-center justify-center px-6 text-center text-white`}
        >
          <BharatBankLogo variant="compact" size="sm" className="mb-4 opacity-95" />
          <h3 className="text-lg sm:text-xl font-black tracking-tight">{slide.title}</h3>
          <p className="text-[11px] sm:text-xs text-white/85 mt-2 max-w-sm leading-relaxed">
            {slide.subtitle}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-x-0 bottom-0 p-3 bg-linear-to-t from-black/70 to-transparent">
        <div className="h-1 rounded-full bg-white/20 overflow-hidden mb-2">
          <div
            className="h-full bg-white rounded-full transition-[width] duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onTogglePlay}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white"
            aria-label={isPlaying ? 'Pause overview' : 'Play overview'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <p className="text-[10px] text-white/80 font-semibold truncate">
            Official product overview · {activeIndex + 1}/{slides.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export const BharatBankDemoVideoModal: React.FC<BharatBankDemoVideoModalProps> = ({
  isOpen,
  onClose,
  onStartDemo,
  startLabel = 'Start Interactive Demo',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [useReel, setUseReel] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setIsPlaying(true);
    let cancelled = false;

    fetch(BHARAT_BANK_OFFICIAL_DEMO.videoSrc, { method: 'HEAD' })
      .then((response) => {
        if (!cancelled) {
          setUseReel(!response.ok);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUseReel(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleVideoError = useCallback(() => {
    setUseReel(true);
  }, []);

  const handleStartDemo = () => {
    videoRef.current?.pause();
    onStartDemo();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            aria-label="Close demo video"
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {BHARAT_BANK_OFFICIAL_DEMO.bankName}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">{BHARAT_BANK_OFFICIAL_DEMO.tagline}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {!useReel ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    poster={BHARAT_BANK_OFFICIAL_DEMO.posterSrc}
                    controls
                    playsInline
                    autoPlay
                    muted
                    onError={handleVideoError}
                  >
                    <source src={BHARAT_BANK_OFFICIAL_DEMO.videoSrc} type="video/mp4" />
                  </video>
                </div>
              ) : (
                <DemoReel isPlaying={isPlaying} onTogglePlay={() => setIsPlaying((prev) => !prev)} />
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed text-center">
                Official Bharat Co-operative Bank digital banking overview. Continue to explore the live
                interactive retail demo.
              </p>

              <button
                type="button"
                onClick={handleStartDemo}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-sm shadow-blue-600/20 active:scale-[0.98] transition-all"
              >
                <PlayCircle className="w-4 h-4" />
                {startLabel}
              </button>

              <div className="flex items-center justify-center gap-3">
                <a
                  href={BHARAT_BANK_OFFICIAL_DEMO.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 hover:text-blue-600"
                >
                  Official website
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-[10px] font-semibold text-slate-500 hover:text-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

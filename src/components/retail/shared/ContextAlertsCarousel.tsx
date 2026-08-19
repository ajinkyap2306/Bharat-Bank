import React, { useCallback, useRef, useState } from 'react';
import { ContextAlertCard, type ContextAlertItem } from '../services/shared/ServiceUI';

interface ContextAlertsCarouselProps {
  items: ContextAlertItem[];
  className?: string;
}

export const ContextAlertsCarousel: React.FC<ContextAlertsCarouselProps> = ({ items, className = '' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || items.length === 0) return;
    const cardWidth = el.scrollWidth / items.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(index, 0), items.length - 1));
  }, [items.length]);

  if (items.length === 0) return null;

  return (
    <section className={className} aria-label="Actionable alerts" aria-roledescription="carousel">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-3 px-3 pb-1"
      >
        {items.map((item) => (
          <div key={item.id} className="min-w-full snap-center shrink-0">
            <ContextAlertCard
              tone={item.tone}
              title={item.title}
              message={item.message}
              cta={item.cta}
              onClick={item.onClick}
            />
          </div>
        ))}
      </div>

      {items.length > 1 && (
        <div
          className="flex items-center justify-center gap-1.5 mt-2.5"
          role="tablist"
          aria-label="Alerts carousel pagination"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${item.title}, slide ${index + 1} of ${items.length}`}
              onClick={() => {
                const el = scrollRef.current;
                if (!el) return;
                const cardWidth = el.scrollWidth / items.length;
                el.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
                setActiveIndex(index);
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex
                  ? 'w-4 bg-congress-blue-700 dark:bg-congress-blue-400'
                  : 'w-1.5 bg-slate-300 dark:bg-slate-600'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

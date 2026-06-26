import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LIVE_ACTIVITIES } from '../data/mockData';

const LiveActivity = () => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % LIVE_ACTIVITIES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-brand-surface border-y border-gray-100 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center text-center">
        <div className="inline-flex flex-row flex-wrap items-center justify-center gap-3 md:gap-5">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.28em] text-text-muted whitespace-nowrap">
            Live Activity
          </span>
        </div>
        <div className="h-8 flex items-center justify-center overflow-hidden relative min-w-[280px] sm:min-w-[420px] md:min-w-[520px] max-w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute w-full flex items-center justify-center"
            >
              <p className="text-sm md:text-base text-text-secondary font-semibold leading-snug">
                {LIVE_ACTIVITIES[index]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LiveActivity;

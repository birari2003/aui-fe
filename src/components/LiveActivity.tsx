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
    <div className="bg-brand-surface border-y border-gray-100 py-4 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted whitespace-nowrap">
            Live Activity
          </span>
        </div>
        <div className="h-6 flex items-center overflow-hidden relative w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="absolute w-full flex items-center justify-center md:justify-start"
            >
              <p className="text-[11px] text-text-secondary font-medium tracking-tight">
                {LIVE_ACTIVITIES[index]}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default LiveActivity;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlipNumberProps {
  value: number;
  theme: 'dark' | 'light';
}

const FlipNumber: React.FC<FlipNumberProps> = ({ value, theme }) => {
  return (
    <div className="relative w-16 h-[45px]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ rotateX: -90, y: 20, opacity: 0 }}
          animate={{ rotateX: 0, y: 0, opacity: 1 }}
          exit={{ rotateX: 90, y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`absolute inset-0 flex items-center justify-center text-4xl font-bold rounded-lg ${
            theme === 'dark' 
              ? 'bg-slate-800 text-white' 
              : 'bg-slate-100 text-slate-900'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {String(value).padStart(2, '0')}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default FlipNumber;
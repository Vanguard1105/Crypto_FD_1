import React from 'react';
import { motion } from 'framer-motion';

interface GemAnimationProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onComplete: () => void;
  theme: 'dark' | 'light';
}

const GemAnimation: React.FC<GemAnimationProps> = ({ startX, startY, endX, endY, onComplete, theme }) => {
  // Calculate control points for a slightly right-curved path
  const controlPoints = {
    x1: startX + (endX - startX) * 0.2, // Move first control point slightly to the right
    y1: startY - Math.abs(endY - startY) * 0.3, // Reduce the curve height
    x2: endX + 20, // Move second control point to the right
    y2: endY + Math.abs(endY - startY) * 0.1 // Reduce the curve at the end
  };

  const pathD = `M ${startX} ${startY} C ${controlPoints.x1} ${controlPoints.y1}, ${controlPoints.x2} ${controlPoints.y2}, ${endX} ${endY}`;

  return (
    <motion.div
      style={{
        position: 'fixed',
        zIndex: 50,
        left: 0,
        top: 0,
        width: '20px', // Slightly smaller for tighter grouping
        height: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        offsetPath: `path("${pathD}")`,
        offsetRotate: "0deg"
      }}
      initial={{ scale: 1 }}
      animate={{
        scale: [1, 1.1, 0.9],
        offsetDistance: "100%",
        opacity: [1, 1, 0]
      }}
      transition={{
        duration: 0.6, // Slightly faster animation
        ease: "easeOut",
        times: [0, 0.7, 1]
      }}
      onAnimationComplete={onComplete}
    >
      <img 
        src="https://s2.coinmarketcap.com/static/cloud/img/loyalty-program/diamond-icon.svg"
        className={`w-5 h-5 ${theme === 'dark' ? 'brightness-110' : 'brightness-100'}`}
        style={{
          filter: `drop-shadow(0 0 3px ${theme === 'dark' ? 'rgba(147, 197, 253, 0.3)' : 'rgba(59, 130, 246, 0.3)'})`
        }}
      />
    </motion.div>
  );
};

export default GemAnimation;
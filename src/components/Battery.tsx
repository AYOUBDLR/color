import React from 'react';
import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface BatteryProps {
  variant?: 'landing' | 'verifying' | 'error' | 'custom';
  percentage?: number;
  charging?: boolean;
  customColors?: {
    start: string;
    end: string;
  };
  glowIntensity?: number;
}

export default function Battery({
  variant = 'landing',
  percentage = 80,
  charging = false,
  customColors,
  glowIntensity = 1,
}: BatteryProps) {
  // Determine gradient colors based on variant
  let gradientId = 'battery-grad-landing';
  let startColor = '#22c55e'; // green-500
  let endColor = '#eab308'; // yellow-500
  let glowColor = 'rgba(34, 197, 94, 0.4)'; // green glow
  let displayPercentage = percentage;

  if (variant === 'verifying') {
    gradientId = 'battery-grad-verifying';
    startColor = '#06b6d4'; // cyan-500
    endColor = '#22c55e'; // green-500
    glowColor = 'rgba(6, 182, 212, 0.4)';
    displayPercentage = 80;
  } else if (variant === 'error') {
    gradientId = 'battery-grad-error';
    startColor = '#f43f5e'; // rose-500
    endColor = '#ec4899'; // pink-500
    glowColor = 'rgba(244, 63, 94, 0.4)';
    displayPercentage = 100;
  } else if (variant === 'custom' && customColors) {
    gradientId = 'battery-grad-custom';
    startColor = customColors.start;
    endColor = customColors.end;
    glowColor = `${startColor}66`; // 40% opacity hex
    displayPercentage = percentage;
  }

  return (
    <div className="relative flex flex-col items-center justify-center py-6" id="battery-container">
      {/* Dynamic Background Glow Behind the Battery */}
      <motion.div
        className="absolute w-64 h-32 rounded-full blur-3xl pointer-events-none opacity-40 mix-blend-screen"
        style={{ backgroundColor: startColor }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        id="battery-glow"
      />

      {/* Main Battery Wrapper */}
      <div className="relative flex items-center" id="battery-body-wrapper">
        {/* Battery Outermost Frame */}
        <motion.div
          className="relative w-48 h-20 bg-[#161618]/90 border-[3.5px] border-neutral-600/75 rounded-[1.4rem] p-1.5 flex items-center overflow-hidden shadow-2xl backdrop-blur-md"
          style={{
            boxShadow: `0 0 ${25 * glowIntensity}px ${glowColor}, inset 0 2px 4px rgba(255,255,255,0.05)`,
          }}
          layoutId="battery-frame"
          id="battery-outer-frame"
        >
          {/* Active Liquid Charge Level */}
          <motion.div
            className="h-full rounded-[0.95rem] relative flex items-center justify-center overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: `${displayPercentage}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 15 }}
            style={{
              background: `linear-gradient(to right, ${startColor}, ${endColor})`,
              boxShadow: `0 0 15px ${startColor}88`,
            }}
            id="battery-charge-fill"
          >
            {/* Subtle gloss/highlight on the charge level */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

            {/* Glowing Flowing Wave Effect for charging or premium look */}
            {variant !== 'error' && (
              <motion.div
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: variant === 'verifying' ? 1.5 : 2.5,
                  ease: 'easeInOut',
                }}
              />
            )}

            {/* Lightning charging bolt */}
            {charging && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                id="battery-charging-indicator"
              >
                <Zap className="w-6 h-6 text-white fill-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-pulse" />
              </motion.div>
            )}
          </motion.div>
        </motion.div>

        {/* Battery Terminal Tip */}
        <motion.div
          className="w-2.5 h-7 bg-neutral-600/75 border-y-[3.5px] border-r-[3.5px] border-neutral-600/75 rounded-r-[0.35rem] ml-[-1px]"
          animate={{
            borderColor: startColor === '#f43f5e' ? '#f43f5e' : '#525252',
          }}
          id="battery-terminal-tip"
        />
      </div>

      {/* Small percentage text badge if custom */}
      {variant === 'custom' && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 font-mono text-xs text-neutral-400 font-semibold bg-neutral-900/60 border border-neutral-800 px-2 py-0.5 rounded-full backdrop-blur-sm"
          id="battery-percentage-badge"
        >
          {percentage}% {charging && '• Charging'}
        </motion.div>
      )}
    </div>
  );
}

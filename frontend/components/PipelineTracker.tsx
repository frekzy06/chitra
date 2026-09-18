'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, XCircle, CheckCircle2 } from 'lucide-react';

interface PipelineTrackerProps {
  currentStage: number; // 0: Idle, 1..4: In progress, 5: Complete
  estimatedTimeSec?: number;
  onCancel?: () => void;
}

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  currentStage,
  estimatedTimeSec = 10,
  onCancel,
}) => {
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [finalTime, setFinalTime] = useState<string | null>(null);

  useEffect(() => {
    if (currentStage === 0) {
      setProgress(0);
      setStartTime(null);
      setElapsedTime(0);
      setFinalTime(null);
      return;
    }

    if (currentStage > 0 && currentStage < 5) {
      if (!startTime) {
        setStartTime(Date.now());
      }

      const timer = setInterval(() => {
        if (startTime) {
          const currentElapsed = (Date.now() - startTime) / 1000;
          setElapsedTime(currentElapsed);
        }

        // Increment progress smoothly towards 95% while processing
        setProgress((prev) => {
          if (prev < 92) {
            return Math.min(95, prev + Math.random() * 8 + 3);
          }
          return prev;
        });
      }, 350);

      return () => clearInterval(timer);
    }

    if (currentStage === 5) {
      setProgress(100);
      if (startTime && !finalTime) {
        const total = ((Date.now() - startTime) / 1000).toFixed(1);
        setFinalTime(total);
      } else if (!finalTime) {
        setFinalTime('4.2');
      }
    }
  }, [currentStage, startTime, finalTime]);

  if (currentStage === 0) return null;

  const remainingSeconds = Math.max(
    0,
    Math.ceil(estimatedTimeSec - elapsedTime)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-[95vw] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto my-6"
    >
      {/* Window Container - Clean White with #7A3E48 Border */}
      <div className="w-full bg-white rounded-3xl p-6 sm:p-9 shadow-figma-card border-2 border-[#7A3E48]">
        
        {/* Execution Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-[#7A3E48]/20 gap-3">
          <div>
            <h3 className="font-extrabold text-[#7A3E48] text-base sm:text-lg font-heading tracking-tight">
              {currentStage === 5 ? 'Processing Complete' : 'Executing Synthesis'}
            </h3>
            <p className="text-xs sm:text-sm text-[#7A3E48]/80 font-sans mt-0.5">
              {currentStage === 5
                ? 'Deliverables generated successfully.'
                : 'Analyzing document context and synthesizing assets...'}
            </p>
          </div>

          {/* Time Predictor / Completion Badge & Interactive Cancel Button */}
          <div className="flex items-center space-x-2.5">
            {currentStage === 5 ? (
              <div className="px-3.5 py-1.5 rounded-xl bg-rose-50/80 border border-[#7A3E48]/30 text-[#7A3E48] font-bold text-xs flex items-center space-x-1.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Completed in {finalTime || '4.2'} seconds</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <div className="px-3.5 py-1.5 rounded-xl bg-rose-50/80 border border-[#7A3E48]/30 text-[#7A3E48] font-bold text-xs flex items-center space-x-1.5 shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-[#7A3E48]" />
                  <span>Predicted: ~{estimatedTimeSec}s ({remainingSeconds}s remaining)</span>
                </div>

                {onCancel && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onCancel();
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 active:scale-95 text-[#7A3E48] text-xs font-bold border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                    title="Cancel processing"
                  >
                    <XCircle className="w-4 h-4 text-[#7A3E48]" />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center text-xs font-bold text-[#7A3E48]">
            <span>Progress Status</span>
            <span className="font-mono text-xs text-[#7A3E48] font-extrabold">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Clean progress track */}
          <div className="w-full bg-rose-100/70 h-3.5 rounded-full overflow-hidden border border-[#7A3E48]/20">
            <div
              className="h-full bg-[#7A3E48] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

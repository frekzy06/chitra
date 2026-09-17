'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Database, BrainCircuit, Printer, CheckCircle, Loader2 } from 'lucide-react';

interface PipelineTrackerProps {
  currentStage: number; // 0: Idle, 1: Reading Room, 2: Factory Floor, 3: The Brain, 4: Printing Press, 5: Complete
}

const STAGES = [
  {
    id: 1,
    name: 'Reading Room',
    icon: BookOpen,
  },
  {
    id: 2,
    name: 'Factory Floor',
    icon: Database,
  },
  {
    id: 3,
    name: 'The Brain',
    icon: BrainCircuit,
  },
  {
    id: 4,
    name: 'Printing Press',
    icon: Printer,
  },
];

export const PipelineTracker: React.FC<PipelineTrackerProps> = ({
  currentStage,
}) => {
  if (currentStage === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-8"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-figma-card border border-rose-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base font-heading">
              Execution
            </h3>
          </div>
        </div>

        {/* 4 Stages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isDone = currentStage > stage.id || currentStage === 5;
            const isActive = currentStage === stage.id;

            return (
              <div
                key={stage.id}
                className={`relative p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                  isDone
                    ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                    : isActive
                    ? 'bg-rose-50 border-[#7A3E48] ring-2 ring-[#7A3E48]/20 shadow-sm'
                    : 'bg-slate-50/70 border-slate-200 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-700'
                        : isActive
                        ? 'bg-[#7A3E48] text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {isDone ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ) : isActive ? (
                    <Loader2 className="w-4 h-4 text-[#7A3E48] animate-spin" />
                  ) : (
                    <span className="text-[10px] font-mono text-slate-400">0{stage.id}</span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                    {stage.name}
                  </h4>
                </div>

                {/* Active progress bar indicator */}
                {isActive && (
                  <motion.div
                    className="h-1 bg-[#7A3E48] rounded-full mt-3 overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                  />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </motion.div>
  );
};

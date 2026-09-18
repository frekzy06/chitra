'use client';

import React from 'react';
import { Info } from 'lucide-react';

interface HeaderProps {
  onOpenInfo?: () => void;
  modelMode: 'offline' | 'online';
  onModelModeChange: (mode: 'offline' | 'online') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInfo,
  modelMode,
  onModelModeChange,
}) => {
  return (
    <header className="w-full bg-[#7A3E48] text-white shadow-md relative z-30 transition-colors duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Left spacer for symmetry */}
        <div className="hidden sm:block sm:w-10" />

        {/* Center: Brand Title + Offline/Online Toggle Pill */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-[0.25em] text-white font-heading shrink-0">
            CHITRA
          </h1>

          {/* Offline / Online Model Pill Selector (No Icons, matching Prompt/Upload Pill) */}
          <div className="bg-[#5E2E36]/90 p-1 rounded-2xl flex items-center space-x-1 border border-white/20 shadow-xs">
            <button
              type="button"
              onClick={() => onModelModeChange('offline')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                modelMode === 'offline'
                  ? 'bg-[#FEEAEA] text-[#5E2E36] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Offline Model
            </button>

            <button
              type="button"
              onClick={() => onModelModeChange('online')}
              className={`px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                modelMode === 'online'
                  ? 'bg-[#FEEAEA] text-[#5E2E36] shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              Online Model
            </button>
          </div>
        </div>

        {/* Right: Info Modal Toggle */}
        <div className="flex items-center">
          {onOpenInfo && (
            <button
              onClick={onOpenInfo}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white/90 hover:text-white"
              title="Information"
            >
              <Info className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

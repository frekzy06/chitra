'use client';

import React from 'react';
import { Info } from 'lucide-react';

interface HeaderProps {
  onOpenInfo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenInfo }) => {
  return (
    <header className="w-full bg-[#7A3E48] text-white shadow-md relative z-30 transition-colors duration-300">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Left spacer for symmetry */}
        <div className="w-8" />

        {/* Center: Brand Title */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-[0.25em] text-white font-heading">
            CHITRA
          </h1>
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

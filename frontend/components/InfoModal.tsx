'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-[#7A3E48] text-white flex items-center justify-between">
            <h3 className="font-bold text-base font-heading tracking-wider">
              CHITRA (Team NiTRO+)
            </h3>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-8 text-center">
            <div className="text-2xl font-extrabold text-slate-800 tracking-wider">
              AMRATANSH
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>CHITRA - BY TEAM NiTRO+</span>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-[#7A3E48] text-white text-xs font-bold hover:bg-[#5E2E36] transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


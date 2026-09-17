'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { downloadPdfAdvisory } from '@/utils/downloadHelper';

interface AdvisoryData {
  advisory_id: string;
  title: string;
  severity: string;
  classification_tier: string;
  affected_systems: string[];
  threat_overview: string;
  indicators_of_compromise: string[];
  mitigation_steps: string[];
  published_date?: string;
}

interface AdvisoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  advisory: AdvisoryData | null;
  downloadUrl?: string | null;
}

export const AdvisoryViewerModal: React.FC<AdvisoryViewerModalProps> = ({
  isOpen,
  onClose,
  advisory,
  downloadUrl,
}) => {
  if (!isOpen || !advisory) return null;

  const handleDownload = () => {
    downloadPdfAdvisory(advisory, downloadUrl);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="px-6 py-4 bg-[#7A3E48] text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-rose-200" />
              <div>
                <h3 className="text-base font-bold text-white font-heading">
                  Security Advisory
                </h3>
                <p className="text-xs text-rose-200/80 font-mono">
                  {advisory.advisory_id || 'CHITRA'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .pdf</span>
              </button>
              
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Advisory Content (Clear and simple for everyday users) */}
          <div className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800">
            
            {/* Title & Severity Banner */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {advisory.title}
              </h2>
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-red-100 text-red-700 border border-red-300 shrink-0">
                {advisory.severity || 'Urgent'}
              </span>
            </div>

            {/* 1. What Happened */}
            <section>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A3E48] mb-1.5 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-[#7A3E48]" />
                <span>1. What Happened (Summary)</span>
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                {advisory.threat_overview}
              </p>
            </section>

            {/* 2. Who / What Is Affected */}
            <section>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A3E48] mb-1.5">
                2. Who & What Is Affected
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {advisory.affected_systems.map((sys, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-xs sm:text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>{sys}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Signs To Watch Out For */}
            <section>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A3E48] mb-1.5">
                3. Signs To Watch Out For
              </h4>
              <div className="space-y-1.5 bg-slate-900 p-4 rounded-xl text-emerald-400 font-mono text-xs">
                {advisory.indicators_of_compromise.map((ioc, idx) => (
                  <div key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{ioc}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Simple Steps To Stay Safe */}
            <section>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7A3E48] mb-1.5 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>4. Simple Action Steps To Stay Safe</span>
              </h4>
              <div className="space-y-2">
                {advisory.mitigation_steps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>CHITRA — Team NiTRO+</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 text-white font-semibold hover:bg-slate-900 transition-colors"
            >
              Close
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};


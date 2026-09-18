'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Presentation, Download, MessageSquare, Copy, Check } from 'lucide-react';

interface SlideData {
  slide_number: number;
  title: string;
  layout_type?: string;
  header?: string;
  bullet_points: string[];
  key_metric?: string;
  metric_label?: string;
  speaker_notes?: string;
}

interface PresentationData {
  deck_title: string;
  target_audience: string;
  classification_tier: string;
  summary_takeaway?: string;
  slides: SlideData[];
}

interface SlideViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: PresentationData | null;
  downloadUrl?: string | null;
}

export const SlideViewerModal: React.FC<SlideViewerModalProps> = ({
  isOpen,
  onClose,
  deck,
  downloadUrl,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [copiedNotes, setCopiedNotes] = useState(false);

  if (!isOpen || !deck) return null;

  const slides = deck.slides || [];
  const currentSlide = slides[currentSlideIndex];

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  const handleCopyNotes = () => {
    if (currentSlide?.speaker_notes) {
      navigator.clipboard.writeText(currentSlide.speaker_notes);
      setCopiedNotes(true);
      setTimeout(() => setCopiedNotes(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
        
        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-700 flex flex-col max-h-[92vh]"
        >
          {/* Top Control Bar */}
          <div className="px-6 py-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#7A3E48] text-white">
                <Presentation className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white font-heading truncate max-w-md">
                  {deck.deck_title}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <span className="text-rose-300 font-bold uppercase">{deck.classification_tier}</span>
                  <span>•</span>
                  <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#7A3E48] hover:bg-[#5E2E36] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .pptx</span>
                </a>
              )}

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 16:9 Slide Canvas */}
          <div className="flex-1 p-5 sm:p-8 flex flex-col items-center justify-center bg-slate-950 overflow-y-auto">
            <div className="w-full aspect-[16/9] max-w-4xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative border border-slate-200">
              
              {/* Header Chip & Title */}
              <div>
                {currentSlide?.header && (
                  <span className="inline-block px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-bold text-[10px] sm:text-xs rounded-md tracking-wider mb-1.5 border border-indigo-200 uppercase">
                    {currentSlide.header}
                  </span>
                )}
                
                <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 leading-tight font-heading">
                  {currentSlide?.title || 'Slide Title'}
                </h2>
              </div>

              {/* Main Slide Content (Grid: Bullets left, Metric card right) */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 my-3 items-center">
                
                {/* Bullets List */}
                <div className={currentSlide?.key_metric ? 'md:col-span-8' : 'md:col-span-12'}>
                  <ul className="space-y-2.5">
                    {currentSlide?.bullet_points.map((point, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-slate-700 text-xs sm:text-sm leading-relaxed">
                        <span className="text-[#7A3E48] font-bold text-base leading-none">▸</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Metric Card */}
                {currentSlide?.key_metric && (
                  <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-xs">
                    <span className="text-xl sm:text-3xl font-extrabold text-blue-600 font-heading">
                      {currentSlide.key_metric}
                    </span>
                    <span className="text-xs text-slate-500 font-medium mt-0.5">
                      {currentSlide.metric_label || 'Primary Indicator'}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer Clearance Strip */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 uppercase font-mono">
                <span>{deck.classification_tier} // CHITRA</span>
                <span>Slide {currentSlideIndex + 1} / {slides.length}</span>
              </div>
            </div>

            {/* Speaker Notes Box */}
            {currentSlide?.speaker_notes && (
              <div className="w-full max-w-4xl mt-3 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start justify-between gap-3 text-left">
                <div className="flex items-start space-x-2.5">
                  <MessageSquare className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                      Speaker Notes
                    </span>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed font-sans">
                      {currentSlide.speaker_notes}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyNotes}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0"
                  title="Copy Speaker Notes"
                >
                  {copiedNotes ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* Bottom Slide Navigation Bar */}
          <div className="px-6 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Slide Dots */}
            <div className="flex items-center space-x-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === currentSlideIndex
                      ? 'bg-rose-500 w-5'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

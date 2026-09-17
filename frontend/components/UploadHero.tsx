'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UploadCloud, FileUp, Sparkles, SlidersHorizontal, ArrowRight, ShieldAlert } from 'lucide-react';
import { DocumentGrid, DocItem } from './DocumentGrid';

interface UploadHeroProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  documents: DocItem[];
  selectedDoc: DocItem | null;
  onSelectDoc: (doc: DocItem) => void;
  onAddFiles: (files: FileList | File[]) => void;
  onDeleteDoc: (id: string) => void;
  onPreviewDoc: (doc: DocItem) => void;
  onOpenConfig: () => void;
  onStartSynthesis: () => void;
  isProcessing: boolean;
}

export const UploadHero: React.FC<UploadHeroProps> = ({
  isExpanded,
  onToggleExpand,
  documents,
  selectedDoc,
  onSelectDoc,
  onAddFiles,
  onDeleteDoc,
  onPreviewDoc,
  onOpenConfig,
  onStartSynthesis,
  isProcessing,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
      if (!isExpanded) {
        onToggleExpand();
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      if (!isExpanded) {
        onToggleExpand();
      }
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 transition-all duration-300 relative ${
        isDragOver ? 'scale-[1.01]' : ''
      }`}
    >
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept=".pdf,.docx,.doc,.txt,.md"
        className="hidden"
      />

      {/* Hero Heading Section */}
      <motion.div
        layout
        className="text-center mb-6 sm:mb-8"
      >
        <motion.h2
          layout
          className="text-2xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight font-heading uppercase"
        >
          UPLOAD YOUR DOCUMENTS
        </motion.h2>
        <motion.p
          layout
          className="text-xs sm:text-sm text-slate-600 font-medium mt-1 tracking-[0.25em] uppercase text-rose-900/70"
        >
          P D F &nbsp;|&nbsp; D O C X &nbsp;|&nbsp; T E X T
        </motion.p>
      </motion.div>

      {/* Main Interactive Stage Container */}
      <div className="relative flex flex-col items-center">
        
        {/* Animated Plus Button (Glides from Center to Top Anchor) */}
        <motion.button
          layout
          onClick={() => {
            onToggleExpand();
          }}
          whileHover={{ scale: 1.08, rotate: isExpanded ? 45 : 0 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-b from-[#8B4752] to-[#6A323B] text-white shadow-figma-btn flex items-center justify-center border-4 border-[#FEEAEA] transition-shadow duration-300 ${
            isDragOver ? 'ring-4 ring-rose-400 ring-offset-2 animate-bounce' : ''
          }`}
          title={isExpanded ? "Close Document Repository" : "Open Document Repository"}
        >
          <Plus className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2.5]" />
        </motion.button>

        {/* Drag & Drop Overlay Indicator during drag */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-30 bg-[#7A3E48]/90 backdrop-blur-sm rounded-3xl border-4 border-dashed border-white flex flex-col items-center justify-center text-white p-8 text-center"
            >
              <UploadCloud className="w-16 h-16 mb-3 animate-pulse" />
              <h3 className="text-2xl font-bold font-heading">DROP DOCUMENTS HERE</h3>
              <p className="text-rose-100 text-sm mt-1">Automatic text parsing & analysis</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unfolded Container Card (State 2) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="w-full bg-[#C69A9E]/90 backdrop-blur-md rounded-3xl p-5 sm:p-7 shadow-figma-card border border-white/40 -mt-8 sm:-mt-10 pt-12 sm:pt-14 relative z-10"
            >
              {/* Document Grid Display */}
              <DocumentGrid
                documents={documents}
                selectedId={selectedDoc?.id || null}
                onSelect={onSelectDoc}
                onDelete={onDeleteDoc}
                onPreview={onPreviewDoc}
                onUploadClick={() => fileInputRef.current?.click()}
              />

              {/* Bottom Control Strip */}
              <div className="mt-6 pt-4 border-t border-rose-900/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Left: Upload file trigger + Selection status */}
                <div className="flex items-center space-x-3 text-xs text-rose-950 font-medium">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-800 transition-colors shadow-sm font-semibold"
                  >
                    <FileUp className="w-4 h-4 text-[#7A3E48]" />
                    <span>Upload Local File</span>
                  </button>

                  {selectedDoc && (
                    <span className="truncate max-w-[200px] sm:max-w-xs">
                      Selected: <strong className="font-bold">{selectedDoc.title}</strong>
                    </span>
                  )}
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={onOpenConfig}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 transition-all font-semibold text-xs sm:text-sm shadow-sm"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#7A3E48]" />
                    <span>Parameters</span>
                  </button>

                  <button
                    type="button"
                    disabled={!selectedDoc || isProcessing}
                    onClick={onStartSynthesis}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                      !selectedDoc || isProcessing
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-[#7A3E48] hover:bg-[#5E2E36] text-white hover:shadow-lg active:scale-98'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Proceed</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

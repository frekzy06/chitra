'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, UploadCloud, FileUp, SlidersHorizontal, FileText, MessageSquare } from 'lucide-react';
import { DocumentGrid, DocItem } from './DocumentGrid';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';

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
  onStartSynthesis: (prompt?: string) => void;
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
  const [inputMode, setInputMode] = useState<'upload' | 'prompt'>('upload');
  const [freeformPrompt, setFreeformPrompt] = useState('');
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

  const handleProceed = () => {
    if (inputMode === 'prompt' && freeformPrompt.trim()) {
      onStartSynthesis(freeformPrompt);
    } else {
      onStartSynthesis();
    }
  };

  const canProceed = inputMode === 'prompt' ? freeformPrompt.trim().length > 0 : !!selectedDoc;

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full max-w-[95vw] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-2 sm:px-4 py-2 transition-all duration-300 relative ${
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
        className="text-center mb-5 sm:mb-7"
      >
        <motion.h2
          layout
          className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#7A3E48] tracking-tight font-heading uppercase"
        >
          UPLOAD YOUR DOCUMENTS
        </motion.h2>
        <motion.p
          layout
          className="text-xs sm:text-sm text-[#7A3E48]/80 font-bold mt-1 tracking-widest uppercase font-sans"
        >
          PDF | DOCX | TEXT
        </motion.p>
      </motion.div>

      {/* Main Interactive Stage Container */}
      <div className="relative flex flex-col items-center w-full">
        
        {/* Animated Plus Button */}
        <motion.button
          layout
          onClick={() => {
            onToggleExpand();
          }}
          whileHover={{ scale: 1.08, rotate: isExpanded ? 45 : 0 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className={`z-20 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-b from-[#7A3E48] to-[#5E2E36] text-white shadow-figma-btn flex items-center justify-center border-4 border-white transition-shadow duration-300 ${
            isDragOver ? 'ring-4 ring-[#7A3E48] ring-offset-2 animate-bounce' : ''
          }`}
          title={isExpanded ? "Close" : "Open"}
        >
          <Plus className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.5]" />
        </motion.button>

        {/* Drag & Drop Overlay Indicator during drag */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 z-30 bg-[#7A3E48]/95 backdrop-blur-sm rounded-3xl border-2 border-dashed border-white flex flex-col items-center justify-center text-white p-8 text-center"
            >
              <UploadCloud className="w-16 h-16 mb-3 animate-pulse" />
              <h3 className="text-xl font-bold font-heading">DROP DOCUMENTS HERE</h3>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unfolded Container Card (Clean White with #7A3E48 border) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              className="w-full bg-white rounded-3xl p-6 sm:p-9 lg:p-10 shadow-figma-card border-2 border-[#7A3E48] -mt-7 sm:-mt-8 pt-10 sm:pt-12 relative z-10"
            >
              {/* Top Mode Selector Pill */}
              <div className="flex items-center justify-between mb-5 border-b border-[#7A3E48]/20 pb-4">
                <div className="bg-rose-50/80 p-1 rounded-2xl flex items-center space-x-1 border border-[#7A3E48]/30">
                  <button
                    type="button"
                    onClick={() => setInputMode('upload')}
                    className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inputMode === 'upload'
                        ? 'bg-[#7A3E48] text-white shadow-xs'
                        : 'text-[#7A3E48] hover:bg-rose-100/60'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Upload Documents</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInputMode('prompt')}
                    className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      inputMode === 'prompt'
                        ? 'bg-[#7A3E48] text-white shadow-xs'
                        : 'text-[#7A3E48] hover:bg-rose-100/60'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Text Prompt</span>
                  </button>
                </div>

                <span className="hidden sm:inline-block text-xs font-bold text-[#7A3E48]/90">
                  {inputMode === 'upload' ? 'Select files to process' : 'Type prompt instructions directly'}
                </span>
              </div>

              {/* Main Center Area with proportional height */}
              {inputMode === 'upload' ? (
                <div className="w-full space-y-4">
                  <div className="p-4 sm:p-6 rounded-2xl bg-[#FDF8F8] border-2 border-[#7A3E48]/20 shadow-xs min-h-[200px] sm:min-h-[240px] flex flex-col justify-center">
                    <DocumentGrid
                      documents={documents}
                      selectedId={selectedDoc?.id || null}
                      onSelect={onSelectDoc}
                      onDelete={onDeleteDoc}
                      onPreview={onPreviewDoc}
                      onUploadClick={() => fileInputRef.current?.click()}
                    />
                  </div>

                  {/* Additional Prompt overlay */}
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-[#7A3E48] font-heading uppercase tracking-wider mb-1.5">
                      Additional Prompt Instructions (Optional):
                    </label>
                    <textarea
                      value={freeformPrompt}
                      onChange={(e) => setFreeformPrompt(e.target.value)}
                      placeholder="Add specific instructions for processing..."
                      rows={3}
                      className="w-full p-3.5 rounded-2xl bg-[#FDF8F8] border-2 border-[#7A3E48]/25 text-[#7A3E48] text-xs sm:text-sm placeholder-[#7A3E48]/50 focus:outline-none focus:ring-2 focus:ring-[#7A3E48]/20 focus:border-[#7A3E48] transition-all resize-none font-sans"
                    />
                  </div>
                </div>
              ) : (
                /* Mode 2: Free-form Prompt / Text Area with ample height */
                <div className="w-full space-y-2">
                  <label className="block text-xs font-bold text-[#7A3E48] font-heading uppercase tracking-wider">
                    Prompt Text:
                  </label>
                  <textarea
                    value={freeformPrompt}
                    onChange={(e) => setFreeformPrompt(e.target.value)}
                    placeholder="Enter or paste text content or prompt instructions here..."
                    rows={9}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-[#FDF8F8] border-2 border-[#7A3E48]/25 text-[#7A3E48] text-xs sm:text-sm placeholder-[#7A3E48]/50 focus:outline-none focus:ring-2 focus:ring-[#7A3E48]/20 focus:border-[#7A3E48] transition-all resize-none font-sans min-h-[220px]"
                  />
                </div>
              )}

              {/* Bottom Control Strip */}
              <div className="mt-5 pt-4 border-t border-[#7A3E48]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Left: Upload file trigger + Selection status inside box with 2nd line support and ellipsis */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#7A3E48] font-medium w-full sm:w-auto">
                  {inputMode === 'upload' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-[#7A3E48] transition-colors border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 font-bold text-xs shadow-xs shrink-0"
                      >
                        <FileUp className="w-3.5 h-3.5 text-[#7A3E48]" />
                        <span>Upload File</span>
                      </button>

                      {selectedDoc && (
                        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-rose-50/80 border border-[#7A3E48]/30 max-w-[240px] sm:max-w-xs md:max-w-md shadow-2xs overflow-hidden">
                          <FileText className="w-3.5 h-3.5 text-[#7A3E48] shrink-0" />
                          <div className="flex flex-col min-w-0 overflow-hidden text-left">
                            <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#7A3E48]/70 leading-none">
                              Selected Document:
                            </span>
                            <span
                              className="truncate text-xs font-bold text-[#7A3E48] leading-tight block"
                              title={selectedDoc.title}
                            >
                              {selectedDoc.title}
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-rose-50/80 border border-[#7A3E48]/30 text-xs text-[#7A3E48] font-bold">
                      {freeformPrompt.trim().length > 0
                        ? `${freeformPrompt.trim().split(/\s+/).length} words entered`
                        : 'Enter text prompt to proceed'}
                    </div>
                  )}
                </div>

                {/* Right: Symmetrical Action Buttons with matched background color and inner stroke */}
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-end shrink-0">
                  <button
                    type="button"
                    onClick={onOpenConfig}
                    className="h-[36px] flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-[#7A3E48] transition-all font-bold text-xs border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 shadow-xs"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#7A3E48]" />
                    <span>Parameters</span>
                  </button>

                  <InteractiveHoverButton
                    type="button"
                    disabled={!canProceed || isProcessing}
                    onClick={handleProceed}
                    text={isProcessing ? "Processing..." : "Proceed"}
                    className={
                      !canProceed || isProcessing
                        ? "h-[36px] bg-white/50 text-[#7A3E48]/40 border border-[#7A3E48]/30 ring-1 ring-inset ring-[#7A3E48]/10 opacity-60 cursor-not-allowed hover:shadow-none text-xs"
                        : "h-[36px] text-xs font-bold px-4 border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/25 bg-white text-[#7A3E48] hover:bg-rose-50/50"
                    }
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

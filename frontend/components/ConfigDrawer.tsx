'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Shield, Users, Mic, Layers, FileType } from 'lucide-react';

export interface TransformationConfig {
  tone: string;
  targetAudience: string;
  classificationTier: string;
  documentType: string;
  deliverableFormats: string[]; // e.g. ['presentation', 'advisory', 'executive_summary', 'infographic', 'linkedin', 'twitter', 'visual']
}

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: TransformationConfig;
  onChangeConfig: (newConfig: TransformationConfig) => void;
}

const AVAILABLE_FORMATS = [
  { id: 'presentation', label: 'Presentation (Slides + Notes)' },
  { id: 'advisory', label: 'Security Advisory (PDF)' },
  { id: 'executive_summary', label: 'Executive Summary' },
  { id: 'infographic', label: 'Infographic & Metrics' },
  { id: 'linkedin', label: 'LinkedIn Post' },
  { id: 'twitter', label: 'Twitter / X Post' },
  { id: 'visual', label: 'Threat Visual Graphic' },
];

const DOCUMENT_TYPES = [
  'Auto-Detect (AI)',
  'News Article',
  'Security Advisory',
  'Threat Intelligence',
  'Policy Document',
  'Research Paper',
  'Incident Report',
  'Announcement',
  'Free-form Prompt',
];

export const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  const toggleFormat = (id: string) => {
    const exists = config.deliverableFormats.includes(id);
    let updated: string[];
    if (exists) {
      updated = config.deliverableFormats.filter((f) => f !== id);
      if (updated.length === 0) updated = [id]; // Keep at least one
    } else {
      updated = [...config.deliverableFormats, id];
    }
    onChangeConfig({ ...config, deliverableFormats: updated });
  };

  const handleSelectAllFormats = () => {
    if (config.deliverableFormats.length === AVAILABLE_FORMATS.length) {
      onChangeConfig({ ...config, deliverableFormats: ['presentation'] });
    } else {
      onChangeConfig({ ...config, deliverableFormats: AVAILABLE_FORMATS.map((f) => f.id) });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-rose-50 text-[#7A3E48]">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Parameters
                    </h3>
                    <p className="text-xs text-slate-500">Fine-tune generation targets</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-5">
                
                {/* Deliverable Outputs (Multi-select) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-[#7A3E48]" />
                      <span>Deliverables ({config.deliverableFormats.length})</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleSelectAllFormats}
                      className="text-xs text-[#7A3E48] font-bold hover:underline"
                    >
                      {config.deliverableFormats.length === AVAILABLE_FORMATS.length ? 'Reset' : 'Select All'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {AVAILABLE_FORMATS.map((fmt) => {
                      const isSelected = config.deliverableFormats.includes(fmt.id);
                      return (
                        <button
                          key={fmt.id}
                          type="button"
                          onClick={() => toggleFormat(fmt.id)}
                          className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            isSelected
                              ? 'border-[#7A3E48] bg-rose-50/80 text-[#7A3E48] font-bold shadow-xs'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <span>{fmt.label}</span>
                          <span
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[10px] ${
                              isSelected
                                ? 'bg-[#7A3E48] text-white border-[#7A3E48]'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && '✓'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Document Type */}
                <div>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <FileType className="w-4 h-4 text-[#7A3E48]" />
                    <span>Document Type</span>
                  </label>
                  <select
                    value={config.documentType}
                    onChange={(e) => onChangeConfig({ ...config, documentType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7A3E48]"
                  >
                    {DOCUMENT_TYPES.map((dt) => (
                      <option key={dt} value={dt}>
                        {dt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Briefing Tone */}
                <div>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Mic className="w-4 h-4 text-[#7A3E48]" />
                    <span>Tone</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Executive Briefing', 'Technical Analysis', 'Public Alert', 'Plain Language'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => onChangeConfig({ ...config, tone: t })}
                        className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                          config.tone === t
                            ? 'border-[#7A3E48] bg-rose-50 text-[#7A3E48] font-bold'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Users className="w-4 h-4 text-[#7A3E48]" />
                    <span>Target Audience</span>
                  </label>
                  <select
                    value={config.targetAudience}
                    onChange={(e) => onChangeConfig({ ...config, targetAudience: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7A3E48]"
                  >
                    <option value="Common Public">Common Public</option>
                    <option value="Educated People">Educated People</option>
                    <option value="Kids">Kids</option>
                    <option value="GenZ">GenZ</option>
                    <option value="Leadership / Executives">Leadership / Executives</option>
                  </select>
                </div>

                {/* Classification Tier */}
                <div>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Shield className="w-4 h-4 text-[#7A3E48]" />
                    <span>Classification</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['RESTRICTED', 'CONFIDENTIAL', 'PUBLIC'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => onChangeConfig({ ...config, classificationTier: tier })}
                        className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          config.classificationTier === tier
                            ? tier === 'RESTRICTED'
                              ? 'bg-red-600 text-white border-red-700'
                              : 'bg-indigo-600 text-white border-indigo-700'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Apply & Close */}
            <div className="pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-[#7A3E48] hover:bg-[#5E2E36] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                Apply Parameters
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

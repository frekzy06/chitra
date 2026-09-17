'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sliders, Shield, Users, Mic, FileCode2 } from 'lucide-react';

export interface TransformationConfig {
  tone: string;
  targetAudience: string;
  classificationTier: string;
  deliverableFormat: string;
}

interface ConfigDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  config: TransformationConfig;
  onChangeConfig: (newConfig: TransformationConfig) => void;
}

export const ConfigDrawer: React.FC<ConfigDrawerProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer Sidebar */}
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
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-rose-50 text-[#7A3E48]">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 font-heading">
                      Intelligence Parameters
                    </h3>
                    <p className="text-xs text-slate-500">Fine-tune the generative synthesis target</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Options */}
              <div className="mt-6 space-y-6">
                
                {/* Tone Option */}
                <div>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Mic className="w-4 h-4 text-[#7A3E48]" />
                    <span>Briefing Tone</span>
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'Executive Briefing', desc: 'High-level strategic takeaway for decision makers' },
                      { id: 'Technical Analysis', desc: 'Detailed IoCs, CVEs, and deep remediation vectors' },
                      { id: 'Public Alert', desc: 'Clear, actionable language for broad distribution' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onChangeConfig({ ...config, tone: item.id })}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          config.tone === item.id
                            ? 'border-[#7A3E48] bg-rose-50/70 ring-2 ring-[#7A3E48]/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="text-sm font-semibold text-slate-900">{item.id}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
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
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#7A3E48]"
                  >
                    <option value="Common Public">Common Public</option>
                    <option value="Educated People">Educated People</option>
                    <option value="Kids">Kids</option>
                    <option value="GenZ">GenZ</option>
                  </select>
                </div>

                {/* Classification Tier */}
                <div>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <Shield className="w-4 h-4 text-[#7A3E48]" />
                    <span>Classification Tier</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['RESTRICTED', 'CONFIDENTIAL', 'PUBLIC'].map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => onChangeConfig({ ...config, classificationTier: tier })}
                        className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                          config.classificationTier === tier
                            ? tier === 'RESTRICTED'
                              ? 'bg-red-600 text-white border-red-700 shadow-sm'
                              : 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deliverable Outputs */}
                <div>
                  <label className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    <FileCode2 className="w-4 h-4 text-[#7A3E48]" />
                    <span>Deliverable Formats</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'all', label: 'All Formats' },
                      { id: 'social_text', label: 'Social Text (Insta, LinkedIn, Twitter)' },
                      { id: 'pptx', label: 'Slide Deck (.pptx)' },
                      { id: 'pdf', label: 'Advisory (.pdf)' },
                    ].map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => onChangeConfig({ ...config, deliverableFormat: fmt.id })}
                        className={`py-2 px-2 text-center rounded-lg text-xs font-semibold transition-all border ${
                          config.deliverableFormat === fmt.id
                            ? 'bg-[#7A3E48] text-white border-[#5E2E36] shadow-sm'
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                        }`}
                      >
                        {fmt.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Apply & Close */}
            <div className="pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#7A3E48] hover:bg-[#5E2E36] text-white font-bold text-sm shadow-md transition-all"
              >
                Save & Apply Settings
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

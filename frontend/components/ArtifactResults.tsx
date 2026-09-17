'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Presentation, FileText, Download, Eye, Copy, Check, Sparkles, Instagram, Linkedin, Twitter, Share2 } from 'lucide-react';
import { downloadPdfAdvisory, downloadPptxDeck } from '@/utils/downloadHelper';

interface SocialPosts {
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}

interface ArtifactResultsProps {
  data: {
    status: string;
    title: string;
    slide_count: number;
    classification_tier: string;
    pptx_download_url?: string | null;
    pdf_download_url?: string | null;
    deck_structure?: any;
    advisory_structure?: any;
    social_posts?: SocialPosts | null;
    processing_time_seconds?: number;
  };
  onPreviewSlides: () => void;
  onPreviewAdvisory?: () => void;
}

export const ArtifactResults: React.FC<ArtifactResultsProps> = ({
  data,
  onPreviewSlides,
  onPreviewAdvisory,
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedSocial, setCopiedSocial] = useState<string | null>(null);

  const handleCopySummary = () => {
    const summary = data.deck_structure?.summary_takeaway || data.advisory_structure?.threat_overview || data.title;
    navigator.clipboard.writeText(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSocial(key);
    setTimeout(() => setCopiedSocial(null), 2000);
  };

  const handleDownloadPdf = () => {
    downloadPdfAdvisory(data.advisory_structure, data.pdf_download_url);
  };

  const handleDownloadPptx = () => {
    downloadPptxDeck(data.title, data.pptx_download_url);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 my-10"
    >
      {/* Container Card */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-figma-card border border-rose-200">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                Ready
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              {data.title}
            </h3>
          </div>
        </div>

        {/* Executive Takeaway Summary Strip */}
        {data.deck_structure?.summary_takeaway && (
          <div className="my-5 p-4 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3">
              <Sparkles className="w-5 h-5 text-[#7A3E48] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#7A3E48] uppercase tracking-wider">Summary Overview</h4>
                <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">
                  {data.deck_structure.summary_takeaway}
                </p>
              </div>
            </div>

            <button
              onClick={handleCopySummary}
              className="p-1.5 rounded-lg bg-white hover:bg-rose-100 text-slate-600 transition-colors shadow-sm shrink-0"
              title="Copy Summary"
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Artifact Cards Grid (PPTX + PDF) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          
          {/* PPTX Presentation Card */}
          {data.deck_structure && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                    <Presentation className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {data.slide_count || data.deck_structure.slides?.length || 4} SLIDES (16:9)
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 font-heading">
                  Presentation Deck
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Structured briefing slides customized for your chosen audience.
                </p>
              </div>

              <div className="flex items-center space-x-2.5 mt-5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onPreviewSlides}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-sm transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Deck</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPptx}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#7A3E48] hover:bg-[#5E2E36] text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .pptx</span>
                </button>
              </div>
            </div>
          )}

          {/* PDF Security Advisory Card */}
          {data.advisory_structure && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-rose-100 text-[#7A3E48]">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase">
                    {data.advisory_structure.severity || 'ALERT'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 font-heading">
                  Security Advisory (PDF)
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Clear, easy-to-read advisory format with safety guidelines and action steps.
                </p>
              </div>

              <div className="flex items-center space-x-2.5 mt-5 pt-4 border-t border-slate-200">
                {onPreviewAdvisory && (
                  <button
                    type="button"
                    onClick={onPreviewAdvisory}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 shadow-sm transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Advisory</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .pdf</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Social Media Deliverable Formats Section (Insta, LinkedIn, Twitter) */}
        {data.social_posts && (
          <div className="mt-8 pt-6 border-t border-slate-200">
            <div className="flex items-center space-x-2 mb-4">
              <Share2 className="w-5 h-5 text-[#7A3E48]" />
              <h4 className="text-base font-bold text-slate-900 font-heading">
                Social Media Deliverables
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Instagram Post */}
              {data.social_posts.instagram && (
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200/80 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5 text-pink-700 font-bold text-xs">
                        <Instagram className="w-4 h-4" />
                        <span>Instagram</span>
                      </div>
                      <button
                        onClick={() => handleCopyText(data.social_posts?.instagram || '', 'insta')}
                        className="p-1 rounded-md bg-white hover:bg-pink-100 text-pink-700 transition-colors shadow-xs"
                        title="Copy Instagram Caption"
                      >
                        {copiedSocial === 'insta' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed line-clamp-6 bg-white/70 p-2.5 rounded-xl border border-pink-100">
                      {data.social_posts.instagram}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyText(data.social_posts?.instagram || '', 'insta')}
                    className="mt-3 w-full py-1.5 rounded-lg bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors"
                  >
                    {copiedSocial === 'insta' ? 'Copied!' : 'Copy Instagram Post'}
                  </button>
                </div>
              )}

              {/* LinkedIn Post */}
              {data.social_posts.linkedin && (
                <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5 text-blue-800 font-bold text-xs">
                        <Linkedin className="w-4 h-4" />
                        <span>LinkedIn</span>
                      </div>
                      <button
                        onClick={() => handleCopyText(data.social_posts?.linkedin || '', 'linkedin')}
                        className="p-1 rounded-md bg-white hover:bg-blue-100 text-blue-800 transition-colors shadow-xs"
                        title="Copy LinkedIn Post"
                      >
                        {copiedSocial === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed line-clamp-6 bg-white/70 p-2.5 rounded-xl border border-blue-100">
                      {data.social_posts.linkedin}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyText(data.social_posts?.linkedin || '', 'linkedin')}
                    className="mt-3 w-full py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-colors"
                  >
                    {copiedSocial === 'linkedin' ? 'Copied!' : 'Copy LinkedIn Post'}
                  </button>
                </div>
              )}

              {/* Twitter / X Post */}
              {data.social_posts.twitter && (
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-300/80 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1.5 text-slate-900 font-bold text-xs">
                        <Twitter className="w-4 h-4" />
                        <span>Twitter / X</span>
                      </div>
                      <button
                        onClick={() => handleCopyText(data.social_posts?.twitter || '', 'twitter')}
                        className="p-1 rounded-md bg-white hover:bg-slate-200 text-slate-900 transition-colors shadow-xs"
                        title="Copy Twitter Post"
                      >
                        {copiedSocial === 'twitter' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed line-clamp-6 bg-white/70 p-2.5 rounded-xl border border-slate-200">
                      {data.social_posts.twitter}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyText(data.social_posts?.twitter || '', 'twitter')}
                    className="mt-3 w-full py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition-colors"
                  >
                    {copiedSocial === 'twitter' ? 'Copied!' : 'Copy Twitter / X Post'}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </motion.section>
  );
};


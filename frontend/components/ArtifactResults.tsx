'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Presentation,
  FileText,
  Download,
  Eye,
  Copy,
  Check,
  Linkedin,
  Twitter,
  BarChart3,
  Image as ImageIcon,
  Briefcase,
  Code
} from 'lucide-react';
import { downloadPdfAdvisory, downloadPptxDeck } from '@/utils/downloadHelper';

interface SocialPosts {
  linkedin?: string;
  twitter?: string;
}

interface InfographicMetric {
  label: string;
  value: string;
  context?: string;
}

interface InfographicSection {
  step_number: number;
  title: string;
  description: string;
}

interface InfographicData {
  headline: string;
  summary: string;
  metrics: InfographicMetric[];
  sections: InfographicSection[];
  layout_recommendation?: string;
  key_message?: string;
  call_to_action?: string;
  svg_code?: string;
  image_prompt?: string;
}

interface ExecutiveSummaryData {
  title: string;
  headline: string;
  strategic_context: string;
  operational_impact: string;
  key_findings: string[];
  recommendations: string[];
  next_steps: string[];
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
    executive_summary?: ExecutiveSummaryData | null;
    infographic?: InfographicData | null;
    social_posts?: SocialPosts | null;
    processing_time_seconds?: number;
    model_used?: string | null;
    model_mode?: string | null;
  };
  onPreviewSlides: () => void;
  onPreviewAdvisory?: () => void;
}

export const ArtifactResults: React.FC<ArtifactResultsProps> = ({
  data,
  onPreviewSlides,
  onPreviewAdvisory,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadPdf = () => {
    downloadPdfAdvisory(data.advisory_structure, data.pdf_download_url);
  };

  const handleDownloadPptx = () => {
    downloadPptxDeck(data.title, data.pptx_download_url);
  };

  const handleDownloadSvg = () => {
    if (!data.infographic?.svg_code) return;
    const blob = new Blob([data.infographic.svg_code], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threat_infographic_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.section
      id="artifact-results-section"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[95vw] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto my-8"
    >
      <div className="bg-white rounded-3xl p-6 sm:p-9 lg:p-10 shadow-figma-card border-2 border-[#7A3E48]">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#7A3E48]/20">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50/80 text-emerald-800 border border-[#7A3E48]/30 shadow-xs">
                Synthesis Complete
              </span>
              {data.model_used && (
                <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-50/80 text-[#7A3E48] border border-[#7A3E48]/30 shadow-xs">
                  {data.model_mode === 'online' ? `Online: ${data.model_used}` : `Offline: ${data.model_used}`}
                </span>
              )}
              <span className="text-xs text-[#7A3E48] font-mono font-extrabold">
                {data.classification_tier}
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#7A3E48] font-heading">
              {data.title}
            </h3>
          </div>
        </div>

        {/* Executive Summary */}
        {data.executive_summary && (
          <div className="my-6 p-6 sm:p-7 rounded-2xl bg-[#FDF8F8] border-2 border-[#7A3E48]/25 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#7A3E48]/20 mb-3">
              <div className="flex items-center space-x-2 text-[#7A3E48] font-extrabold text-sm">
                <Briefcase className="w-4 h-4 text-[#7A3E48]" />
                <span>Executive Summary</span>
              </div>
              <button
                onClick={() =>
                  handleCopy(
                    `${data.executive_summary?.headline}\n\n${data.executive_summary?.strategic_context}\n\nKey Findings:\n${data.executive_summary?.key_findings.map((f) => `• ${f}`).join('\n')}`,
                    'exec'
                  )
                }
                className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 text-xs font-bold text-[#7A3E48] hover:bg-rose-50 transition-colors shadow-xs"
              >
                {copiedKey === 'exec' ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-[#7A3E48]" />}
                <span>{copiedKey === 'exec' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <h4 className="text-base font-extrabold text-[#7A3E48] mb-2">
              {data.executive_summary.headline}
            </h4>
            <p className="text-xs sm:text-sm text-[#7A3E48]/90 leading-relaxed mb-4">
              {data.executive_summary.strategic_context}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#7A3E48]/20">
              <div>
                <span className="text-xs font-extrabold text-[#7A3E48] uppercase tracking-wider block mb-2 font-heading">
                  Key Findings
                </span>
                <ul className="space-y-2">
                  {data.executive_summary.key_findings.map((finding, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-[#7A3E48] flex items-start space-x-2">
                      <span className="text-[#7A3E48] font-bold">▸</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-xs font-extrabold text-[#7A3E48] uppercase tracking-wider block mb-2 font-heading">
                  Recommended Actions
                </span>
                <ul className="space-y-2">
                  {data.executive_summary.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-[#7A3E48] flex items-start space-x-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Presentation & Advisory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-6">
          
          {data.deck_structure && (
            <div className="bg-[#FDF8F8] border-2 border-[#7A3E48]/25 rounded-2xl p-6 flex flex-col justify-between hover:border-[#7A3E48] hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-[#7A3E48] text-white">
                    <Presentation className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-rose-50/80 text-[#7A3E48] border border-[#7A3E48]/30">
                    {data.slide_count || data.deck_structure.slides?.length || 4} SLIDES
                  </span>
                </div>

                <h4 className="text-lg font-extrabold text-[#7A3E48] font-heading">
                  Presentation Deck
                </h4>
                <p className="text-xs sm:text-sm text-[#7A3E48]/80 mt-1 leading-relaxed">
                  Briefing deck with structured slides, metrics, and integrated notes.
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-[#7A3E48]/20">
                <button
                  type="button"
                  onClick={onPreviewSlides}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-[#7A3E48] text-xs font-bold border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#7A3E48]" />
                  <span>Preview Deck</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPptx}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-[#7A3E48] hover:bg-[#5E2E36] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .pptx</span>
                </button>
              </div>
            </div>
          )}

          {data.advisory_structure && (
            <div className="bg-[#FDF8F8] border-2 border-[#7A3E48]/25 rounded-2xl p-6 flex flex-col justify-between hover:border-[#7A3E48] hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-[#7A3E48] text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold bg-rose-50/80 text-[#7A3E48] border border-[#7A3E48]/30">
                    OFFICIAL PDF
                  </span>
                </div>

                <h4 className="text-lg font-extrabold text-[#7A3E48] font-heading">
                  Policy Advisory PDF
                </h4>
                <p className="text-xs sm:text-sm text-[#7A3E48]/80 mt-1 leading-relaxed">
                  Compliance-ready advisory document formatted for official distribution.
                </p>
              </div>

              <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-[#7A3E48]/20">
                {onPreviewAdvisory && (
                  <button
                    type="button"
                    onClick={onPreviewAdvisory}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-white hover:bg-rose-50 text-[#7A3E48] text-xs font-bold border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 shadow-xs transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#7A3E48]" />
                    <span>Preview PDF</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-[#7A3E48] hover:bg-[#5E2E36] text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Deliverable: Offline LLM Image Generation (SVG Vector Graphic) */}
        {data.infographic && (
          <div className="my-6 p-6 sm:p-7 rounded-2xl bg-[#FDF8F8] border-2 border-[#7A3E48]/25 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#7A3E48]/20">
              <div className="flex items-center space-x-2 text-[#7A3E48] font-extrabold text-sm">
                <ImageIcon className="w-4 h-4 text-[#7A3E48]" />
                <span>Vector Graphic & Infographic (SVG)</span>
              </div>
              
              <div className="flex items-center space-x-2">
                {data.infographic.svg_code && (
                  <button
                    onClick={handleDownloadSvg}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-white border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 text-xs font-bold text-[#7A3E48] hover:bg-rose-50 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-[#7A3E48]" />
                    <span>Download SVG</span>
                  </button>
                )}
              </div>
            </div>

            {/* Render SVG Graphic */}
            {data.infographic.svg_code ? (
              <div
                className="w-full rounded-xl overflow-hidden border border-[#7A3E48]/30 bg-slate-950 shadow-inner p-4 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: data.infographic.svg_code }}
              />
            ) : (
              <div className="rounded-xl overflow-hidden border border-[#7A3E48]/30 shadow-xs">
                <img
                  src="/infographic_preview.jpg"
                  alt="Infographic Asset"
                  className="w-full object-cover max-h-72"
                />
              </div>
            )}

            {/* Diffusion Prompt */}
            {data.infographic.image_prompt && (
              <div className="mt-4 p-4 rounded-xl bg-rose-50/70 border border-[#7A3E48]/25">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-[#7A3E48] uppercase flex items-center space-x-1 font-heading">
                    <Code className="w-3.5 h-3.5" />
                    <span>Diffusion Image Prompt</span>
                  </span>
                  <button
                    onClick={() => handleCopy(data.infographic?.image_prompt || '', 'imgprompt')}
                    className="text-xs text-[#7A3E48] font-extrabold hover:underline flex items-center space-x-1"
                  >
                    {copiedKey === 'imgprompt' ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'imgprompt' ? 'Copied' : 'Copy Prompt'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#7A3E48] font-mono bg-white p-3 rounded-lg border border-[#7A3E48]/20 leading-relaxed">
                  {data.infographic.image_prompt}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Infographic Metrics Strip */}
        {data.infographic && data.infographic.metrics && (
          <div className="my-6 p-6 sm:p-7 rounded-2xl bg-[#FDF8F8] border-2 border-[#7A3E48]/25 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#7A3E48]/20 mb-4">
              <div className="flex items-center space-x-2 text-[#7A3E48]">
                <BarChart3 className="w-4 h-4 text-[#7A3E48]" />
                <span className="text-sm font-extrabold font-heading">Key Metrics</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-2">
              {data.infographic.metrics.map((metric, idx) => (
                <div key={idx} className="bg-rose-50/80 p-4 rounded-xl border border-[#7A3E48]/25 text-center shadow-xs">
                  <div className="text-xl sm:text-2xl font-extrabold text-[#7A3E48] font-heading">
                    {metric.value}
                  </div>
                  <div className="text-xs font-bold text-[#7A3E48]/85 mt-1">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Media Deliverables */}
        {data.social_posts && (data.social_posts.linkedin || data.social_posts.twitter) && (
          <div className="mt-6 pt-5 border-t border-[#7A3E48]/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.social_posts.linkedin && (
                <div className="bg-[#FDF8F8] border-2 border-[#7A3E48]/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#7A3E48]/20">
                      <div className="flex items-center space-x-1.5 text-blue-950 font-extrabold text-xs">
                        <Linkedin className="w-4 h-4 text-blue-800" />
                        <span>LinkedIn</span>
                      </div>
                      <button
                        onClick={() => handleCopy(data.social_posts?.linkedin || '', 'linkedin')}
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-blue-950 transition-colors border border-[#7A3E48]/30 ring-1 ring-inset ring-[#7A3E48]/15"
                      >
                        {copiedKey === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-[#7A3E48]" />}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[#7A3E48] whitespace-pre-wrap leading-relaxed line-clamp-6 bg-white p-3.5 rounded-xl border border-[#7A3E48]/20 font-sans">
                      {data.social_posts.linkedin}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(data.social_posts?.linkedin || '', 'linkedin')}
                    className="mt-4 w-full py-2.5 rounded-xl bg-[#7A3E48] hover:bg-[#5E2E36] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    {copiedKey === 'linkedin' ? 'Copied' : 'Copy Post'}
                  </button>
                </div>
              )}

              {data.social_posts.twitter && (
                <div className="bg-[#FDF8F8] border-2 border-[#7A3E48]/25 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs">
                  <div>
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#7A3E48]/20">
                      <div className="flex items-center space-x-1.5 text-[#7A3E48] font-extrabold text-xs">
                        <Twitter className="w-4 h-4 text-[#7A3E48]" />
                        <span>Twitter / X</span>
                      </div>
                      <button
                        onClick={() => handleCopy(data.social_posts?.twitter || '', 'twitter')}
                        className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-[#7A3E48] transition-colors border border-[#7A3E48]/30 ring-1 ring-inset ring-[#7A3E48]/15"
                      >
                        {copiedKey === 'twitter' ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Copy className="w-3.5 h-3.5 text-[#7A3E48]" />}
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm text-[#7A3E48] whitespace-pre-wrap leading-relaxed line-clamp-6 bg-white p-3.5 rounded-xl border border-[#7A3E48]/20 font-sans">
                      {data.social_posts.twitter}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(data.social_posts?.twitter || '', 'twitter')}
                    className="mt-4 w-full py-2.5 rounded-xl bg-[#7A3E48] hover:bg-[#5E2E36] text-white text-xs font-bold transition-colors shadow-xs"
                  >
                    {copiedKey === 'twitter' ? 'Copied' : 'Copy Thread'}
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

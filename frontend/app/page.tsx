'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, X, Sparkles } from 'lucide-react';
import { Header } from '@/components/Header';
import { UploadHero } from '@/components/UploadHero';
import { DocItem } from '@/components/DocumentGrid';
import { ConfigDrawer, TransformationConfig } from '@/components/ConfigDrawer';
import { PipelineTracker } from '@/components/PipelineTracker';
import { ArtifactResults } from '@/components/ArtifactResults';
import { SlideViewerModal } from '@/components/SlideViewerModal';
import { AdvisoryViewerModal } from '@/components/AdvisoryViewerModal';
import { InfoModal } from '@/components/InfoModal';

import FramerCarousel, { CarouselItem } from '@/components/ui/framer-normal-carousel';

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modelMode, setModelMode] = useState<'offline' | 'online'>('offline');


  const [config, setConfig] = useState<TransformationConfig>({
    tone: 'Executive Briefing',
    targetAudience: 'Common Public',
    classificationTier: 'PUBLIC',
    documentType: 'Auto-Detect (AI)',
    deliverableFormats: [
      'presentation',
      'advisory',
      'executive_summary',
      'infographic',
      'linkedin',
      'twitter',
      'visual',
    ],
  });

  const [pipelineStage, setPipelineStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultsData, setResultsData] = useState<any>(null);

  const [isSlideViewerOpen, setIsSlideViewerOpen] = useState(false);
  const [isAdvisoryViewerOpen, setIsAdvisoryViewerOpen] = useState(false);

  // References for aborting requests and auto-scrolling to carousel
  const abortControllerRef = useRef<AbortController | null>(null);
  const carouselSectionRef = useRef<HTMLDivElement>(null);

  // Cancel any active synthesis pipeline immediately
  const cancelProcessing = (reason?: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
    setPipelineStage(0);
    setResultsData(null);
    if (reason) {
      setErrorMessage(reason);
    }
  };

  // Handle local file uploads (Cancels processing if ongoing)
  const handleAddFiles = (files: FileList | File[]) => {
    if (isProcessing) {
      cancelProcessing('Synthesis cancelled because new files were added.');
    }

    const newDocs: DocItem[] = Array.from(files).map((file, idx) => ({
      id: `uploaded-${Date.now()}-${idx}`,
      title: file.name,
      category: 'Uploaded Document',
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      file: file,
      isCustom: true,
    }));

    setDocuments((prev) => [...newDocs, ...prev]);
    setSelectedDoc(newDocs[0]);
    setErrorMessage(null);
  };

  // Handle file deletion (Cancels processing if ongoing)
  const handleDeleteDoc = (id: string) => {
    if (isProcessing) {
      cancelProcessing('Synthesis cancelled because a document was removed.');
    }

    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (selectedDoc?.id === id) {
      setSelectedDoc(documents.find((d) => d.id !== id) || null);
    }
  };

  const handlePreviewDoc = (doc: DocItem) => {
    setSelectedDoc(doc);
  };

  // Handle model mode switch (Cancels processing if ongoing)
  const handleModelModeChange = (newMode: 'offline' | 'online') => {
    if (isProcessing) {
      cancelProcessing('Synthesis cancelled because model mode was switched.');
    }
    setModelMode(newMode);
  };


  // Trigger transformation pipeline
  const handleStartSynthesis = async (rawPrompt?: string) => {
    if (!selectedDoc && !rawPrompt) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsProcessing(true);
    setResultsData(null);
    setErrorMessage(null);
    setPipelineStage(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    try {
      const t1 = setTimeout(() => {
        if (!controller.signal.aborted) setPipelineStage(2);
      }, 600);

      const formData = new FormData();
      if (selectedDoc?.file) {
        formData.append('file', selectedDoc.file);
      }
      if (rawPrompt) {
        formData.append('prompt_text', rawPrompt);
      }
      formData.append('model_mode', modelMode);
      formData.append('document_type', config.documentType);
      formData.append('tone', config.tone);
      formData.append('target_audience', config.targetAudience);
      formData.append('classification_tier', config.classificationTier);
      formData.append('deliverable_formats', config.deliverableFormats.join(','));


      const t2 = setTimeout(() => {
        if (!controller.signal.aborted) setPipelineStage(3);
      }, 1500);

      const res = await fetch(`${API_URL}/api/v1/transform`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(t1);
      clearTimeout(t2);

      if (!res.ok) {
        let errDetail = 'Backend synthesis failed.';
        try {
          const errJson = await res.json();
          if (errJson?.detail) errDetail = errJson.detail;
        } catch {
          // ignore
        }
        throw new Error(errDetail);
      }

      setPipelineStage(4);
      const responseData = await res.json();

      if (!controller.signal.aborted) {
        setResultsData(responseData);
        setPipelineStage(5);
        setIsProcessing(false);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Synthesis cancelled by user.');
        setIsProcessing(false);
        setPipelineStage(0);
        return;
      }
      console.error('Synthesis Error:', err);
      setIsProcessing(false);
      setPipelineStage(0);
      setResultsData(null);
      setErrorMessage(err.message || 'Backend connection failed at http://localhost:8000.');
    }
  };

  // Build dynamic deliverables carousel items based ONLY on what is generated
  const buildGeneratedDeliverableItems = (): CarouselItem[] => {
    if (!resultsData) return [];

    const itemsList: CarouselItem[] = [];
    let counter = 1;

    // 1 - Executive Summary
    if (resultsData.executive_summary) {
      itemsList.push({
        id: 'item-summary',
        heading: `${counter++} - Summary`,
        title:
          resultsData.executive_summary.title ||
          resultsData.executive_summary.headline ||
          'Executive Intelligence Summary',
        description:
          resultsData.executive_summary.strategic_context ||
          resultsData.executive_summary.headline ||
          'High-level strategic takeaway, operational impact, and recommendations.',
        badge: 'Executive Briefing',
        type: 'summary',
        actionText: 'View Full Summary',
        onAction: () => {
          const el = document.getElementById('artifact-results-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        },
      });
    }

    // 2 - Presentation Deck
    if (resultsData.deck_structure || resultsData.pptx_download_url) {
      const slideCount =
        resultsData.deck_structure?.slides?.length || resultsData.slide_count || 10;
      itemsList.push({
        id: 'item-presentation',
        heading: `${counter++} - Presentation`,
        title:
          resultsData.deck_structure?.title || resultsData.title || 'Executive Slide Deck',
        description: `${slideCount} Slides interactive briefing presentation ready for leadership review.`,
        badge: `${slideCount} Slides Deck`,
        type: 'presentation',
        actionText: 'Preview Slide Deck',
        onAction: () => setIsSlideViewerOpen(true),
      });
    }

    // 3 - Formal PDF Advisory
    if (resultsData.advisory_structure || resultsData.pdf_download_url) {
      itemsList.push({
        id: 'item-pdf',
        heading: `${counter++} - PDF Advisory`,
        title:
          resultsData.advisory_structure?.title || 'Formal Policy Advisory PDF',
        description:
          resultsData.advisory_structure?.executive_summary ||
          'Compliance-ready official advisory document formatted with executive mandate and seal.',
        badge: 'Official PDF Document',
        type: 'pdf',
        actionText: 'Preview PDF Advisory',
        onAction: () => setIsAdvisoryViewerOpen(true),
      });
    }

    // 4 - Visual Diagram / Infographic
    if (resultsData.infographic) {
      itemsList.push({
        id: 'item-image',
        heading: `${counter++} - Visual / Image`,
        title:
          resultsData.infographic.headline || 'Visual Threat Diagram & Infographic',
        description:
          resultsData.infographic.summary ||
          resultsData.infographic.key_message ||
          'Vector graphics, metrics, and visual infographic layout.',
        badge: 'Infographic HD',
        type: 'image',
        actionText: 'Explore Infographic Asset',
        onAction: () => {
          const el = document.getElementById('artifact-results-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        },
      });
    }

    // 5 - Social Media Broadcasts
    if (resultsData.social_posts?.linkedin || resultsData.social_posts?.twitter) {
      itemsList.push({
        id: 'item-social',
        heading: `${counter++} - Social Media Campaign`,
        title: 'Multi-Channel Social Broadcasts',
        description:
          'LinkedIn executive post & Twitter/X thread ready for multi-channel distribution.',
        badge: 'Social Media Pack',
        type: 'social',
        actionText: 'View Social Broadcasts',
        onAction: () => {
          const el = document.getElementById('artifact-results-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        },
      });
    }

    return itemsList;
  };

  const generatedDeliverableItems = buildGeneratedDeliverableItems();

  // Auto-scroll animation to carousel as soon as generated
  useEffect(() => {
    if (resultsData && carouselSectionRef.current) {
      const scrollTimer = setTimeout(() => {
        carouselSectionRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 200);

      return () => clearTimeout(scrollTimer);
    }
  }, [resultsData]);

  return (
    <main className="min-h-screen bg-[#FCE4E4] flex flex-col justify-between selection:bg-[#5E2E36] selection:text-white">
      
      {/* Top Header Bar */}
      <Header
        onOpenInfo={() => setIsInfoOpen(true)}
        modelMode={modelMode}
        onModelModeChange={handleModelModeChange}
      />



      {/* Main Content Area - Stretched to Wide Screen & Proportional Layout */}
      <div className="flex-1 w-full max-w-[95vw] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-28 sm:pb-36 lg:pb-44 space-y-8">
        
        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full p-4 rounded-2xl bg-red-950/90 border-2 border-red-500/60 flex items-start justify-between gap-3 text-red-100 shadow-md animate-in fade-in">
            <div className="flex items-center space-x-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-xs sm:text-sm font-semibold text-red-100 font-sans">
                <span className="font-extrabold text-red-400 font-heading">Error: </span>
                {errorMessage}
              </p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-lg hover:bg-red-900/60 text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Hero & Document Stage (Window 1) */}
        <UploadHero
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded(!isExpanded)}
          documents={documents}
          selectedDoc={selectedDoc}
          onSelectDoc={setSelectedDoc}
          onAddFiles={handleAddFiles}
          onDeleteDoc={handleDeleteDoc}
          onPreviewDoc={handlePreviewDoc}
          onOpenConfig={() => setIsConfigOpen(true)}
          onStartSynthesis={handleStartSynthesis}
          isProcessing={isProcessing}
        />

        {/* Live Pipeline Tracker Execution Section (Window 2) */}
        <PipelineTracker
          currentStage={pipelineStage}
          onCancel={() => cancelProcessing()}
        />

        {/* Carousel for Generated Deliverables (Window 3) - Near Full Screen */}
        {resultsData && generatedDeliverableItems.length > 0 && (
          <div
            ref={carouselSectionRef}
            className="w-full my-8 scroll-mt-6 animate-in fade-in slide-in-from-bottom-8 duration-700"
          >
            <div className="flex items-center justify-between px-2 mb-4">
              <div className="flex items-center space-x-2.5">
                <span className="p-2 rounded-xl bg-[#7A3E48] text-white shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </span>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#7A3E48] font-heading tracking-tight uppercase">
                  GENERATED DELIVERABLES
                </h3>
              </div>

              <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-white text-[#7A3E48] border border-[#7A3E48]/30 shadow-xs">
                {generatedDeliverableItems.length} Deliverables Ready
              </span>
            </div>

            <FramerCarousel carouselItems={generatedDeliverableItems} />
          </div>
        )}

        {/* Generated Deliverables Detailed Artifact Results */}
        {resultsData && (
          <ArtifactResults
            data={resultsData}
            onPreviewSlides={() => setIsSlideViewerOpen(true)}
            onPreviewAdvisory={() => setIsAdvisoryViewerOpen(true)}
          />
        )}

      </div>

      {/* Slide Deck Carousel Preview Modal */}
      <SlideViewerModal
        isOpen={isSlideViewerOpen}
        onClose={() => setIsSlideViewerOpen(false)}
        deck={resultsData?.deck_structure || null}
        downloadUrl={resultsData?.pptx_download_url}
      />

      {/* Formal PDF Advisory Preview Modal */}
      <AdvisoryViewerModal
        isOpen={isAdvisoryViewerOpen}
        onClose={() => setIsAdvisoryViewerOpen(false)}
        advisory={resultsData?.advisory_structure || null}
        downloadUrl={resultsData?.pdf_download_url}
      />

      {/* Configuration Parameter Drawer */}
      <ConfigDrawer
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onChangeConfig={setConfig}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />

      {/* Footer with ample breathing room */}
      <footer className="mt-auto mb-8 text-center text-xs text-[#7A3E48]/80 font-extrabold tracking-wider">
        <p>CHITRA - BY TEAM NiTRO+</p>
      </footer>

    </main>
  );
}

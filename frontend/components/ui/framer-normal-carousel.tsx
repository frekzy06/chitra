'use client';

import { animate, motion, useMotionValue } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';

export interface CarouselItem {
  id: number | string;
  title: string;
  heading?: string;
  url?: string;
  description?: string;
  badge?: string;
  type?: 'summary' | 'presentation' | 'pdf' | 'image' | string;
  contentSnippet?: string;
  actionText?: string;
  onAction?: () => void;
}

export const items: CarouselItem[] = [
  {
    id: 1,
    heading: '1 - Summary',
    title: 'Executive Intelligence Summary',
    description: 'High-level strategic takeaway, operational impact, and recommendations.',
    badge: 'Executive Briefing',
    type: 'summary',
  },
  {
    id: 2,
    heading: '2 - Presentation',
    title: 'Slide Deck Briefing',
    description: 'Interactive presentation deck structured for leadership review.',
    badge: 'Presentation Deck',
    type: 'presentation',
  },
  {
    id: 3,
    heading: '3 - PDF Advisory',
    title: 'Formal Policy Advisory PDF',
    description: 'Official policy advisory document formatted for distribution.',
    badge: 'Official Document',
    type: 'pdf',
  },
  {
    id: 4,
    heading: '4 - Visual / Image',
    title: 'Visual Diagram & Infographic',
    description: 'Vector graphics, architecture flow, and telemetry metrics.',
    badge: 'Infographic HD',
    type: 'image',
  },
];

interface FramerCarouselProps {
  carouselItems?: CarouselItem[];
  onItemSelect?: (item: CarouselItem) => void;
}

export default function FramerCarousel({ carouselItems = items, onItemSelect }: FramerCarouselProps) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x, carouselItems]);

  // Keep index in bounds if carouselItems length changes
  useEffect(() => {
    if (index >= carouselItems.length && carouselItems.length > 0) {
      setIndex(carouselItems.length - 1);
    }
  }, [carouselItems.length, index]);

  const displayItems = carouselItems && carouselItems.length > 0 ? carouselItems : items;

  return (
    <div className='w-full max-w-[95vw] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto'>
      <div className='flex flex-col gap-3'>
        {/* Generated Window (Clean White background with #7A3E48 border) */}
        <div
          className='relative overflow-hidden rounded-3xl border-2 border-[#7A3E48] shadow-figma-card bg-white'
          ref={containerRef}
        >
          <motion.div className='flex' style={{ x }}>
            {displayItems.map((item, idx) => (
              <div
                key={item.id ?? idx}
                className='shrink-0 w-full min-h-[460px] sm:min-h-[540px] lg:min-h-[600px] p-6 sm:p-9 lg:p-11 flex flex-col justify-between relative'
              >
                {/* Top Heading Strip */}
                <div className="flex items-center justify-between z-10 pb-4 border-b border-[#7A3E48]/20">
                  <div className="flex items-center space-x-2.5 sm:space-x-3">
                    <span className="px-4 py-1.5 rounded-full bg-[#7A3E48] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-xs">
                      {item.heading || `${idx + 1} - ${item.type || 'Deliverable'}`}
                    </span>
                    {item.badge && (
                      <span className="px-3 py-1 rounded-full bg-rose-50/80 border border-[#7A3E48]/30 text-[#7A3E48] text-xs font-bold shadow-xs">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#7A3E48] bg-rose-50/80 border border-[#7A3E48]/30 px-3 py-1 rounded-lg shadow-xs">
                    {idx + 1} / {displayItems.length}
                  </span>
                </div>

                {/* Middle / Main Content Box */}
                <div className="my-6 p-6 sm:p-9 lg:p-10 rounded-2xl bg-[#FDF8F8] border-2 border-[#7A3E48]/25 shadow-xs flex-1 flex flex-col justify-center">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#7A3E48] font-heading tracking-tight mb-3">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm sm:text-base lg:text-lg text-[#7A3E48]/90 line-clamp-4 leading-relaxed font-sans mb-4 max-w-4xl">
                      {item.description}
                    </p>
                  )}
                  {item.contentSnippet && (
                    <div className="p-4 rounded-xl bg-slate-900 border border-[#7A3E48]/30 text-xs font-mono text-emerald-300 max-h-32 overflow-y-auto">
                      {item.contentSnippet}
                    </div>
                  )}
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between z-10 pt-4 border-t border-[#7A3E48]/20">
                  <div className="text-xs text-[#7A3E48] font-bold hidden sm:block">
                    Status: <span className="text-emerald-700 font-extrabold">Ready for Distribution</span>
                  </div>

                  {item.onAction ? (
                    <button
                      type="button"
                      onClick={item.onAction}
                      className="px-6 py-2.5 rounded-xl bg-[#7A3E48] hover:bg-[#5E2E36] text-white text-xs sm:text-sm font-bold shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
                    >
                      <span>{item.actionText || 'View Deliverable'}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onItemSelect?.(item)}
                      className="px-6 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-[#7A3E48] border border-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 text-xs sm:text-sm font-bold shadow-xs transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
                    >
                      <span>Explore {item.title}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          {displayItems.length > 1 && (
            <>
              <motion.button
                disabled={index === 0}
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
                className={`absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md border-2 border-[#7A3E48] transition-transform z-20
                  ${
                    index === 0
                      ? 'opacity-30 cursor-not-allowed bg-white text-[#7A3E48]/40'
                      : 'bg-white text-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 hover:bg-rose-50 hover:scale-110 opacity-95 hover:opacity-100'
                  }`}
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2.5}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </motion.button>

              <motion.button
                disabled={index === displayItems.length - 1}
                onClick={() => setIndex((i) => Math.min(displayItems.length - 1, i + 1))}
                className={`absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md border-2 border-[#7A3E48] transition-transform z-20
                  ${
                    index === displayItems.length - 1
                      ? 'opacity-30 cursor-not-allowed bg-white text-[#7A3E48]/40'
                      : 'bg-white text-[#7A3E48] ring-1 ring-inset ring-[#7A3E48]/20 hover:bg-rose-50 hover:scale-110 opacity-95 hover:opacity-100'
                  }`}
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M9 5l7 7-7 7' />
                </svg>
              </motion.button>

              {/* Progress Indicator Dots */}
              <div className='absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2 z-20'>
                {displayItems.map((item, i) => (
                  <button
                    key={item?.id ?? `dot-${i}`}
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === index ? 'w-9 bg-[#7A3E48]' : 'w-2.5 bg-[#7A3E48]/25'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

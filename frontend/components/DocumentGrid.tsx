'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Eye, Trash2 } from 'lucide-react';

export interface DocItem {
  id: string;
  title: string;
  category?: string;
  size?: string;
  file?: File;
  isCustom?: boolean;
}

interface DocumentGridProps {
  documents: DocItem[];
  selectedId: string | null;
  onSelect: (doc: DocItem) => void;
  onDelete?: (id: string) => void;
  onPreview?: (doc: DocItem) => void;
  onUploadClick?: () => void;
}

export const DocumentGrid: React.FC<DocumentGridProps> = ({
  documents,
  selectedId,
  onSelect,
  onDelete,
  onPreview,
  onUploadClick,
}) => {
  if (documents.length === 0) {
    return (
      <div
        onClick={onUploadClick}
        className="cursor-pointer border-2 border-dashed border-rose-900/30 hover:border-[#7A3E48] rounded-2xl p-8 text-center bg-white/40 hover:bg-white/60 transition-all flex flex-col items-center justify-center my-2"
      >
        <FileText className="w-10 h-10 text-[#7A3E48] mb-2 opacity-80" />
        <h4 className="font-bold text-sm text-slate-800">No Documents Ingested Yet</h4>
        <p className="text-xs text-slate-600 mt-1">
          Click here or use the button below to upload your PDF, DOCX, or TXT document
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 py-2">
      {documents.map((doc, idx) => {
        const isSelected = selectedId === doc.id;
        return (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -4, scale: 1.03 }}
            onClick={() => onSelect(doc)}
            className={`relative group cursor-pointer bg-white/95 rounded-2xl p-4 sm:p-5 shadow-sm border-2 transition-all duration-200 flex flex-col items-center text-center ${
              isSelected
                ? 'border-[#7A3E48] ring-4 ring-[#7A3E48]/20 shadow-md'
                : 'border-white/80 hover:border-[#7A3E48]/40 hover:shadow-md'
            }`}
          >
            {/* Selection Checkmark */}
            {isSelected && (
              <div className="absolute top-2 right-2 text-[#7A3E48] bg-white rounded-full">
                <CheckCircle2 className="w-5 h-5 fill-rose-100" />
              </div>
            )}

            {/* Figma-Style PDF Document Icon with Red Badge */}
            <div className="relative mb-3 flex items-center justify-center">
              {/* Document Paper Sheet */}
              <div className="w-14 h-18 sm:w-16 sm:h-20 bg-slate-100 border border-slate-300 rounded-lg shadow-sm relative overflow-hidden flex flex-col justify-end p-1">
                {/* Paper Fold Top-Right Corner */}
                <div className="absolute top-0 right-0 w-4 h-4 bg-slate-200 border-l border-b border-slate-300 rounded-bl-sm"></div>
                {/* Document Subtle Lines */}
                <div className="w-full space-y-1 px-1 mb-2">
                  <div className="h-1 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-1 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-1 bg-slate-200 rounded w-2/3"></div>
                </div>

                {/* Prominent Red PDF Label Badge (Exact Figma look) */}
                <div className="w-full bg-[#E02424] text-white font-extrabold text-[10px] sm:text-xs tracking-wider rounded py-0.5 text-center shadow-sm">
                  PDF
                </div>
              </div>
            </div>

            {/* Document Title */}
            <h4 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 leading-tight mb-1">
              {doc.title}
            </h4>

            {/* Subtext info */}
            <p className="text-[11px] text-slate-500 font-medium">
              {doc.category || doc.size || 'Threat Advisory'}
            </p>

            {/* Quick Actions Hover Bar */}
            <div className="absolute inset-x-2 bottom-2 pt-2 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(doc);
                  }}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-[#7A3E48] hover:text-white text-slate-600 transition-colors shadow-sm"
                  title="Preview Source Context"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              )}
              {doc.isCustom && onDelete && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(doc.id);
                  }}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors shadow-sm"
                  title="Remove File"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

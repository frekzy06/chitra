'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle2, Eye, Trash2, FileText } from 'lucide-react';

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
        className="cursor-pointer border-2 border-dashed border-[#7A3E48]/30 hover:border-[#7A3E48] rounded-2xl p-8 sm:p-12 text-center bg-white hover:bg-rose-50/40 transition-all flex flex-col items-center justify-center min-h-[180px]"
      >
        <UploadCloud className="w-12 h-12 text-[#7A3E48] mb-3 animate-pulse" />
        <span className="font-extrabold text-sm sm:text-base text-[#7A3E48] font-heading">
          Upload a file (PDF | DOCX | TXT | MD)
        </span>
        <span className="text-xs text-[#7A3E48]/70 mt-1 font-medium">
          Drag and drop files here or click to browse
        </span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 py-1">
      {documents.map((doc, idx) => {
        const isSelected = selectedId === doc.id;
        return (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            whileHover={{ y: -3, scale: 1.02 }}
            onClick={() => onSelect(doc)}
            className={`relative group cursor-pointer bg-white rounded-2xl p-3.5 sm:p-4 border-2 transition-all duration-200 flex flex-col items-center text-center overflow-hidden ${
              isSelected
                ? 'border-[#7A3E48] ring-2 ring-[#7A3E48]/30 shadow-md bg-rose-50/30'
                : 'border-[#7A3E48]/25 hover:border-[#7A3E48] hover:bg-rose-50/20 hover:shadow-sm'
            }`}
          >
            {/* Selection Checkmark */}
            {isSelected && (
              <div className="absolute top-2 right-2 text-[#7A3E48] z-10">
                <CheckCircle2 className="w-5 h-5 fill-[#7A3E48] text-white" />
              </div>
            )}

            {/* Reverted Classic Document Sheet Icon with Red PDF Badge */}
            <div className="relative mb-2.5 flex items-center justify-center shrink-0">
              <div className="w-12 h-15 sm:w-13 sm:h-16 bg-slate-50 border border-slate-300 rounded-lg shadow-xs relative overflow-hidden flex flex-col justify-end p-1">
                {/* Paper Fold Top-Right Corner */}
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-slate-200 border-l border-b border-slate-300 rounded-bl-sm"></div>
                {/* Document Content Lines */}
                <div className="w-full space-y-1 px-0.5 mb-2">
                  <div className="h-0.5 bg-slate-300 rounded w-3/4"></div>
                  <div className="h-0.5 bg-slate-300 rounded w-1/2"></div>
                  <div className="h-0.5 bg-slate-300 rounded w-2/3"></div>
                </div>

                {/* Red PDF Badge */}
                <div className="w-full bg-[#E02424] text-white font-extrabold text-[9px] tracking-wider rounded py-0.5 text-center shadow-xs">
                  PDF
                </div>
              </div>
            </div>

            {/* Document Title & Size bounded strictly inside box */}
            <div className="w-full max-w-full overflow-hidden text-center px-0.5">
              <h4
                className="text-xs font-bold text-[#7A3E48] line-clamp-2 leading-snug break-words overflow-hidden text-ellipsis min-h-[2.4em] flex items-center justify-center"
                title={doc.title}
              >
                {doc.title}
              </h4>

              {/* Subtext info in 2nd section */}
              <p className="text-[11px] text-[#7A3E48]/70 font-medium truncate mt-0.5">
                {doc.size || 'Document'}
              </p>
            </div>

            {/* Quick Actions Hover Bar */}
            <div className="absolute inset-x-2 bottom-2 pt-1 flex items-center justify-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 rounded-lg py-1 shadow-xs border border-[#7A3E48]/20">
              {onPreview && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(doc);
                  }}
                  className="p-1.5 rounded-lg bg-white hover:bg-[#7A3E48] hover:text-white text-[#7A3E48] border border-[#7A3E48]/30 transition-colors shadow-xs"
                  title="Preview Context"
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
                  className="p-1.5 rounded-lg bg-white hover:bg-red-700 hover:text-white text-red-700 border border-red-300 transition-colors shadow-xs"
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

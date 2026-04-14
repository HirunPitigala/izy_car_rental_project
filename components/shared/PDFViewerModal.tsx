"use client";

import { X, ExternalLink, Download, FileText, Loader2, Maximize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getBrowserViewableUrl } from "@/lib/utils/pdfUtils";

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string | null | undefined;
  title?: string;
}

export default function PDFViewerModal({
  isOpen,
  onClose,
  url,
  title = "Document Viewer",
}: PDFViewerModalProps) {
  const [loading, setLoading] = useState(true);
  const [viewUrl, setViewUrl] = useState<string>("");

  useEffect(() => {
    if (isOpen && url) {
      setViewUrl(getBrowserViewableUrl(url));
      setLoading(true);
    }
  }, [isOpen, url]);

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-primary/80 backdrop-blur-md" 
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-full flex flex-col bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Modern Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-primary uppercase tracking-tight leading-none">{title}</h2>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Secure Vault Document</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 h-10 px-4 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-red-600 hover:border-red-100 transition-all"
              title="Open in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Full Screen
            </a>
            
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:border-red-100 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 relative bg-gray-100/50">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm z-10 gap-4">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hydrating Document Viewer...</p>
            </div>
          )}
          
          {viewUrl ? (
            <iframe
              src={viewUrl}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              title={title}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center space-y-4">
                <FileText className="w-16 h-16 text-gray-200 mx-auto" />
                <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">No document source found</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile-only footer actions */}
        <div className="sm:hidden p-4 bg-white border-t border-gray-100 flex justify-center">
            <a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 h-12 px-8 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              <ExternalLink className="w-4 h-4" /> Open Full Screen
            </a>
        </div>
      </div>
    </div>
  );
}

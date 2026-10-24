'use client';

import React from 'react';
import { X, FileText, CheckCircle, Copy, Sparkles } from 'lucide-react';
import { SAMPLE_TIER3_RESUME_TEXT } from '@/lib/sample-data';

interface SampleResumePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAndRoast: () => void;
}

export function SampleResumePreviewModal({
  isOpen,
  onClose,
  onSelectAndRoast,
}: SampleResumePreviewModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SAMPLE_TIER3_RESUME_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Rahul Sharma - Sample Tier-3 Resume
              </h3>
              <p className="text-xs text-zinc-400">
                The quintessential Indian CS student engineering resume
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/80 hover:bg-zinc-800 transition text-xs flex items-center gap-1.5"
              title="Copy resume text"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white rounded-xl bg-zinc-800/80 hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap bg-zinc-950/60 selection:bg-orange-500/30">
          {SAMPLE_TIER3_RESUME_TEXT}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Classic Indian tech placement tropes included</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onSelectAndRoast();
            }}
            className="px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
          >
            Roast This Sample
          </button>
        </div>
      </div>
    </div>
  );
}

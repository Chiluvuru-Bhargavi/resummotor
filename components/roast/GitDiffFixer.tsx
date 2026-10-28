'use client';

import React, { useState } from 'react';
import { BulletFix } from '@/lib/types';
import {
  FileCode2,
  GitPullRequest,
  Check,
  Copy,
  Sparkles,
} from 'lucide-react';

interface GitDiffFixerProps {
  bulletFixes: BulletFix[];
}

export default function GitDiffFixer({ bulletFixes }: GitDiffFixerProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyRewrite = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div>
          <h3 className="text-xl font-extrabold font-['Inter'] text-neutral-50 leading-tight">
            🛠️ Okay, Stop Crying. Here is How to Un-Cook Your Resume:
          </h3>
          <p className="text-xs font-['IBM_Plex_Mono'] text-zinc-400 mt-1">
            Pull Request: <span className="text-emerald-400 font-bold">Fix/ATS-Optimization</span> into <code className="text-neutral-300">main</code>
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-['IBM_Plex_Mono'] px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 self-start sm:self-auto">
          <GitPullRequest className="size-3.5 text-emerald-400" />
          <span>{bulletFixes.length} fixes suggested</span>
        </div>
      </div>

      {/* 3 Git Diff Cards */}
      <div className="space-y-4">
        {bulletFixes.map((item, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-950 border-b border-zinc-800 font-['IBM_Plex_Mono'] text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <FileCode2 className="size-3.5 text-orange-500" />
                <span className="text-neutral-200 font-medium">
                  experience_bullet_{idx + 1}.tex
                </span>
                <span className="text-[10px] text-zinc-600 hidden sm:inline">
                  @@ -1,1 +1,1 @@
                </span>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                STAR METRIC ENHANCED
              </span>
            </div>

            {/* Top Half: Red Tint (weakOriginal) */}
            <div className="p-3.5 bg-red-950/30 border-l-2 border-red-500 font-['IBM_Plex_Mono'] text-xs text-red-200 flex items-start gap-2.5">
              <span className="text-red-500 font-bold select-none">-</span>
              <div className="line-through opacity-85 leading-relaxed">
                {item.weakOriginal}
              </div>
            </div>

            {/* Bottom Half: Green Tint (strongRewrite) */}
            <div className="p-3.5 bg-emerald-950/30 border-l-2 border-emerald-500 font-['IBM_Plex_Mono'] text-xs text-emerald-200 flex items-start justify-between gap-3 border-t border-zinc-800/80">
              <div className="flex items-start gap-2.5 flex-1">
                <span className="text-emerald-400 font-bold select-none">+</span>
                <div className="font-semibold leading-relaxed text-emerald-100">
                  {item.strongRewrite}
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={() => handleCopyRewrite(item.strongRewrite, idx)}
                className="p-1 sm:px-2 sm:py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-['IBM_Plex_Mono'] flex items-center gap-1 shrink-0 transition cursor-pointer"
                title="Copy rewrite"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="size-3 text-emerald-400" />
                    <span className="hidden sm:inline">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Reason Explanation */}
            <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-[11px] font-['IBM_Plex_Mono'] text-zinc-400 flex items-start gap-2">
              <Sparkles className="size-3.5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-neutral-200">Why this gets you hired: </strong>
                {item.reason}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { GitDiffFixer };

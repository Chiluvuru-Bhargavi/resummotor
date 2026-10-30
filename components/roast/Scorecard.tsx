'use client';

import React, { useState } from 'react';
import { RoastResult, PersonaId } from '@/lib/types';
import { PERSONAS } from '@/lib/personas';
import {
  Flame,
  Download,
  Share2,
  MessageCircle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { TwitterXIcon } from '@/components/BrandIcons';
import { generateScorecardCanvasPng } from '@/lib/canvas-scorecard';
import dynamic from 'next/dynamic';

const GitDiffFixer = dynamic(() => import('./GitDiffFixer'), { ssr: false });

interface ScorecardProps {
  roast: RoastResult;
  onReRoastWithPersona: (personaId: PersonaId) => void;
  onReset: () => void;
}

export default function Scorecard({
  roast,
  onReRoastWithPersona,
  onReset,
}: ScorecardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const currentPersona = PERSONAS[roast.personaId || 'mass-recruiter'];

  // SVG Progress Ring calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roast.cookedPercentage / 100) * circumference;

  // Native HTML5 Canvas Scorecard Download (1080x1350)
  const handleDownloadCanvasPng = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await generateScorecardCanvasPng(
        roast,
        currentPersona.name,
        roast.targetName || 'Desi Candidate'
      );

      const link = document.createElement('a');
      link.download = `CookedScorecard-${roast.targetName || 'Roast'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Canvas export error:', err);
      alert('Could not generate canvas image. Please try taking a screenshot.');
    } finally {
      setIsExporting(false);
    }
  };

  const shareText = `My tech resume is ${roast.cookedPercentage}% COOKED! 🔥\nVerdict: "${roast.verdictBadge || roast.verdictTitle}"\nPredicted CTC: ${roast.predictedCTC || roast.predictedPackage}\nDelusion Level: ${roast.delusionLevel}\nCheck yours at: https://cookedresume.in`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const handleShareReddit = () => {
    const title = `My resume is ${roast.cookedPercentage}% COOKED according to CookedResume.in (${roast.verdictBadge || roast.verdictTitle})`;
    window.open(`https://reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent('https://cookedresume.in')}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const bulletItems = roast.bulletFixes && roast.bulletFixes.length > 0
    ? roast.bulletFixes
    : (roast.bulletRewrites || []).map(b => ({
        weakOriginal: b.original,
        strongRewrite: b.fixed,
        reason: b.whyItWorks,
      }));

  return (
    <div className="w-full flex flex-col gap-8">
      {/* 03 / DAMAGE REPORT HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-4">
        <div>
          <div className="text-orange-500 text-xs font-normal font-['IBM_Plex_Mono'] uppercase tracking-widest mb-1">
            03 / DAMAGE REPORT
          </div>
          <h2 className="text-neutral-50 text-2xl font-extrabold font-['Inter']">
            Your Tech Career Reality Check
          </h2>
          <p className="text-zinc-400 text-xs font-['Inter'] mt-0.5">
            The verdict is in. Here is how badly you are cooked and how to fix it.
          </p>
        </div>

        {/* Persona quick switch */}
        <div className="flex items-center gap-1.5 font-['IBM_Plex_Mono'] text-xs">
          <span className="text-zinc-500 hidden md:inline">Re-roast with:</span>
          {(Object.keys(PERSONAS) as PersonaId[]).map((pid) => {
            const p = PERSONAS[pid];
            const isCurrent = roast.personaId === pid;
            return (
              <button
                key={pid}
                onClick={() => onReRoastWithPersona(pid)}
                disabled={isCurrent}
                className={`px-2 py-1 rounded text-[11px] transition cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 cursor-default'
                    : 'bg-zinc-900 text-zinc-400 hover:text-neutral-50 border border-zinc-800'
                }`}
              >
                {p.avatarEmoji} <span className="hidden lg:inline">{p.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: THE VIRAL SCORECARD */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div
            id="cooked-scorecard-element"
            className="w-full bg-zinc-900 outline outline-1 outline-orange-500/80 rounded-lg p-6 shadow-[0px_0px_35px_0px_rgba(249,115,22,0.15)] flex flex-col gap-5 relative overflow-hidden"
          >
            {/* Top row: Name + Persona Badge */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-xs">
                  {currentPersona.avatarEmoji}
                </div>
                <div>
                  <div className="text-xs font-['IBM_Plex_Mono'] font-bold text-neutral-100 truncate max-w-[150px]">
                    {roast.targetName || 'Desi Candidate'}
                  </div>
                  <div className="text-[10px] font-['IBM_Plex_Mono'] text-zinc-500">
                    SUBJECT PROFILE
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-['IBM_Plex_Mono'] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 px-2 py-0.5 rounded-xs uppercase">
                  {currentPersona.name}
                </span>
                <div className="text-[9px] font-['IBM_Plex_Mono'] text-zinc-500 mt-0.5">
                  {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Circular Progress Ring Centerpiece */}
            <div className="flex flex-col items-center justify-center text-center my-1">
              <div className="relative flex items-center justify-center">
                <svg className="size-36 transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="#27272a"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="url(#scorecardFigmaGradient)"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="scorecardFigmaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F97316" />
                      <stop offset="100%" stopColor="#EF4444" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold font-['IBM_Plex_Mono'] text-neutral-50 tracking-tighter">
                    {roast.cookedPercentage}%
                  </span>
                  <span className="text-[10px] font-bold font-['IBM_Plex_Mono'] uppercase tracking-widest text-orange-500 flex items-center gap-0.5">
                    <Flame className="size-2.5 fill-orange-500 text-orange-500" />
                    COOKED
                  </span>
                </div>
              </div>

              {/* Bold Verdict Badge */}
              <div className="mt-3 px-3 py-1.5 rounded-md bg-zinc-950 border border-zinc-700/80 shadow-md">
                <span className="text-xs font-extrabold font-['Inter'] tracking-tight text-neutral-50">
                  &ldquo;{roast.verdictBadge || roast.verdictTitle}&rdquo;
                </span>
              </div>
            </div>

            {/* Metric Box: 2-Column Monospace Grid */}
            <div className="grid grid-cols-2 gap-2.5 font-['IBM_Plex_Mono']">
              <div className="p-3 rounded-md bg-zinc-950 border border-zinc-800">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-0.5">
                  PREDICTED CTC
                </span>
                <span className="text-xs font-bold text-orange-400 block truncate">
                  {roast.predictedCTC || roast.predictedPackage}
                </span>
              </div>

              <div className="p-3 rounded-md bg-zinc-950 border border-zinc-800">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500 block mb-0.5">
                  DELUSION LEVEL
                </span>
                <span className="text-xs font-bold text-red-400 block truncate">
                  {roast.delusionLevel}
                </span>
              </div>
            </div>

            {/* Roast Paragraph */}
            <p className="p-3.5 rounded-md bg-zinc-950/70 border border-zinc-800 text-xs italic font-normal font-['Inter'] text-zinc-300 leading-relaxed">
              &ldquo;{roast.roastParagraph || roast.roastSummary}&rdquo;
            </p>

            {/* Red Flags List */}
            <div className="space-y-2">
              <div className="text-[10px] font-['IBM_Plex_Mono'] uppercase font-bold text-zinc-400 tracking-wider">
                CRITICAL RED FLAGS (03)
              </div>
              {roast.redFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2 rounded bg-zinc-950 border border-red-500/20 text-xs font-['Inter'] text-zinc-300"
                >
                  <span className="text-red-500 text-xs shrink-0 select-none">❌</span>
                  <span className="text-[11px] leading-snug">{flag}</span>
                </div>
              ))}
            </div>

            {/* Watermark Footer inside the card */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] font-['IBM_Plex_Mono'] text-zinc-500">
              <span className="font-bold text-zinc-400">cookedresume.in</span>
              <span>Roast Your Tech Resume</span>
            </div>
          </div>

          {/* BELOW CARD ACTIONS */}
          <div className="flex flex-col gap-2.5">
            {/* Download Button using Native Canvas */}
            <button
              onClick={handleDownloadCanvasPng}
              disabled={isExporting}
              className="w-full py-3.5 px-4 rounded-md font-['IBM_Plex_Mono'] text-xs font-bold uppercase tracking-wider text-zinc-950 bg-orange-500 hover:bg-orange-600 transition flex items-center justify-center gap-2 shadow-[0px_0px_20px_0px_rgba(249,115,22,0.3)] cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Rendering 1080x1350 Canvas...</span>
                </>
              ) : (
                <>
                  <Download className="size-4 text-zinc-950" />
                  <span>📸 Download Scorecard PNG</span>
                </>
              )}
            </button>

            {/* Social Share Grid */}
            <div className="grid grid-cols-3 gap-2 font-['IBM_Plex_Mono'] text-xs">
              <button
                onClick={handleShareWhatsApp}
                className="py-2.5 px-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/50 text-zinc-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="size-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleShareReddit}
                className="py-2.5 px-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/50 text-zinc-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="size-3.5 text-orange-400" />
                <span>Reddit</span>
              </button>

              <button
                onClick={handleShareTwitter}
                className="py-2.5 px-2 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <TwitterXIcon className="size-3 text-neutral-100" />
                <span>Post to X</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GITHUB-PR STYLE RESUME FIXER COMPONENT */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <GitDiffFixer bulletFixes={bulletItems} />

          {/* Reset / Upload Another */}
          <div className="pt-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-neutral-50 border border-zinc-800 hover:border-zinc-700 text-xs font-['IBM_Plex_Mono'] font-medium transition cursor-pointer"
            >
              <RefreshCw className="size-3.5 text-orange-500" />
              <span>Roast Another Resume / GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Scorecard };

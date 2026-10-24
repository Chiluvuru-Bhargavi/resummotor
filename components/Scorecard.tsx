'use client';

import React, { useRef, useState, useEffect } from 'react';
import { RoastResult, PersonaId } from '@/lib/types';
import { PERSONAS } from '@/lib/personas';
import {
  Flame,
  Download,
  Share2,
  Copy,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  RefreshCw,
  BadgeAlert,
  Building2,
  Zap,
  Trophy,
  GraduationCap,
  TrendingUp,
  FileCheck2,
  Loader2,
} from 'lucide-react';
import { TwitterXIcon } from '@/components/BrandIcons';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';

interface ScorecardProps {
  roast: RoastResult;
  onReRoastWithPersona: (personaId: PersonaId) => void;
  onReset: () => void;
}

export function Scorecard({ roast, onReRoastWithPersona, onReset }: ScorecardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'rewrites'>('overview');

  const currentPersona = PERSONAS[roast.personaId || 'mass-recruiter'];

  // Fire celebratory / sizzling particles when mounted
  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f97316', '#e11d48', '#f59e0b', '#06b6d4'],
      });
    } catch {
      // Ignore if canvas-confetti fails
    }
  }, [roast]);

  // Export card as high-res PNG image
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      // Wait a frame for any fonts / styles
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#090a10',
      });

      const link = document.createElement('a');
      const filename = `CookedResume-${roast.targetName || 'Roast'}-${roast.personaId || 'desi'}.png`;
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export scorecard PNG:', err);
      alert('Could not export image. Please try taking a screenshot or try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Copy share text
  const handleCopySummary = () => {
    const text = `🔥 CookedResume.in Roast for ${roast.targetName || 'my profile'}:
Score: ${roast.cookedPercentage}% Cooked
Verdict: "${roast.verdictTitle}"
Predicted CTC: ${roast.predictedPackage}
Roasted by: ${currentPersona.name}
Check your resume at: https://cookedresume.in`;

    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Share to Twitter/X
  const handleShareTwitter = () => {
    const tweet = encodeURIComponent(
      `I just got roasted on CookedResume.in! 🔥\n\nCooked Score: ${roast.cookedPercentage}% (${roast.verdictTitle})\nPredicted Package: ${roast.predictedPackage}\n\nRoast yours here:`
    );
    const url = encodeURIComponent('https://cookedresume.in');
    window.open(`https://twitter.com/intent/tweet?text=${tweet}&url=${url}`, '_blank');
  };

  const getCookedStatus = (pct: number) => {
    if (pct >= 90) return { label: 'DEEP FRIED & CHARRED', color: 'text-rose-500', bg: 'bg-rose-500/10 border-rose-500/30' };
    if (pct >= 80) return { label: 'CRITICALLY COOKED', color: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/30' };
    if (pct >= 65) return { label: 'MEDIUM ROASTED', color: 'text-amber-500', bg: 'bg-amber-500/10 border-amber-500/30' };
    return { label: 'SURVIVED THE GRILL', color: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' };
  };

  const cookedStatus = getCookedStatus(roast.cookedPercentage);

  return (
    <div className="w-full space-y-6 animate-in fade-in zoom-in-95 duration-300">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: currentPersona.accentColor }}
          />
          <span className="text-xs font-semibold text-zinc-300">
            Roast Complete! Share your scorecard or fix your bullet points below.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-md shadow-orange-500/20 transition disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Generating PNG...
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                Download Scorecard Image
              </>
            )}
          </button>

          <button
            onClick={handleShareTwitter}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition"
          >
            <TwitterXIcon className="w-3.5 h-3.5 text-zinc-100" />
            Share on X
          </button>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition"
          >
            {copiedLink ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copiedLink ? 'Copied!' : 'Copy Summary'}
          </button>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Roast Another
          </button>
        </div>
      </div>

      {/* Re-Roast with Another Persona Quick Switcher */}
      <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <span className="text-xs font-bold text-zinc-400 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          Re-roast with another persona:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(PERSONAS) as PersonaId[]).map((pid) => {
            const p = PERSONAS[pid];
            const isCurrent = roast.personaId === pid;
            return (
              <button
                key={pid}
                onClick={() => onReRoastWithPersona(pid)}
                disabled={isCurrent}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  isCurrent
                    ? 'bg-zinc-800 text-white border border-zinc-700 cursor-default'
                    : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                <span>{p.avatarEmoji}</span>
                <span className="hidden md:inline">{p.name.split(' ')[0]}</span>
                {isCurrent && <span className="text-[10px] text-orange-400 font-bold">(Current)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs between Card Overview & Detailed Rewrites */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'overview'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          The Viral Scorecard
        </button>
        <button
          onClick={() => setActiveTab('rewrites')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'rewrites'
              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          STAR Resume Bullet Rewrites ({roast.bulletRewrites.length})
        </button>
      </div>

      {/* TAB 1: VIRAL SCORECARD (EXPORTABLE TO IMAGE) */}
      {activeTab === 'overview' && (
        <div
          ref={cardRef}
          id="cooked-scorecard"
          className="relative w-full rounded-3xl p-6 sm:p-8 bg-[#0a0b12] border-2 shadow-2xl overflow-hidden transition-all duration-300"
          style={{
            borderColor: `${currentPersona.accentColor}50`,
            boxShadow: `0 20px 50px -10px ${currentPersona.accentColor}20`,
          }}
        >
          {/* Ambient Glows */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: currentPersona.accentColor }}
          />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-15 bg-orange-600 pointer-events-none" />

          {/* Top Header Row */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
            {/* Brand Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center shadow-md">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-black tracking-tight text-white">
                  Cooked<span className="text-orange-500">Resume</span>.in
                </div>
                <div className="text-[10px] text-zinc-400 font-mono uppercase tracking-wider">
                  The Indian Tech Roaster • Spotify Wrapped Edition
                </div>
              </div>
            </div>

            {/* Persona Stamp */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 self-start sm:self-auto">
              <span className="text-xl">{currentPersona.avatarEmoji}</span>
              <div>
                <div className="text-[10px] uppercase font-bold text-zinc-400">Roasted By</div>
                <div
                  className="text-xs font-bold line-clamp-1"
                  style={{ color: currentPersona.accentColor }}
                >
                  {currentPersona.name}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Section: Cooked Gauge & Predicted Package */}
          <div className="relative z-10 my-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left: Cooked Percentage Gauge */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 text-center relative overflow-hidden">
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                Cooked Meter
              </div>

              {/* Big Score Display */}
              <div className="my-2 flex items-baseline justify-center gap-1">
                <span
                  className="text-6xl sm:text-7xl font-black tracking-tighter"
                  style={{
                    color: currentPersona.accentColor,
                    textShadow: `0 0 25px ${currentPersona.accentColor}50`,
                  }}
                >
                  {roast.cookedPercentage}
                </span>
                <span className="text-3xl font-extrabold text-zinc-500">%</span>
              </div>

              {/* Cooked Status Badge */}
              <div
                className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase border mt-1 ${cookedStatus.bg} ${cookedStatus.color}`}
              >
                {cookedStatus.label}
              </div>

              {/* Candidate Name */}
              <p className="text-xs text-zinc-400 mt-3 font-mono">
                Candidate: <strong className="text-zinc-200">{roast.targetName || 'Engineering Graduate'}</strong>
              </p>
            </div>

            {/* Right: Verdict & Predicted Package */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4">
              {/* Verdict Title */}
              <div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Official Verdict
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5 leading-snug">
                  &ldquo;{roast.verdictTitle}&rdquo;
                </h3>
              </div>

              {/* Predicted Package Pill / Stamp */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-orange-950/20 to-zinc-900 border border-amber-500/40 shadow-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Predicted Indian Tech Package
                  </span>
                </div>
                <div className="text-lg sm:text-xl font-black text-white font-mono">
                  {roast.predictedPackage}
                </div>
              </div>
            </div>
          </div>

          {/* Roast Summary Paragraph */}
          <div className="relative z-10 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/90 text-sm text-zinc-200 leading-relaxed italic mb-6">
            <div className="flex items-start gap-2.5">
              <span className="text-2xl text-orange-400 font-serif shrink-0">&ldquo;</span>
              <p className="flex-1 font-medium">{roast.roastSummary}</p>
              <span className="text-2xl text-orange-400 font-serif shrink-0">&rdquo;</span>
            </div>
          </div>

          {/* Red & Green Flags Columns */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Red Flags */}
            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 uppercase tracking-wide">
                <BadgeAlert className="w-4 h-4 text-rose-400" />
                Brutal Red Flags (3)
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {roast.redFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold shrink-0 mt-0.5">🚩</span>
                    <span className="leading-snug">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Green Flags */}
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Saving Graces (Green Flags)
              </div>
              <ul className="space-y-2 text-xs text-zinc-300">
                {roast.greenFlags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold shrink-0 mt-0.5">🟢</span>
                    <span className="leading-snug">{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Preview of Bullet Rewrites */}
          <div className="relative z-10 p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-orange-400" />
                {roast.bulletRewrites.length} STAR Method Bullet Rewrites Available
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Turned weak tutorial lines into quantified impact bullets that beat the ATS.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('rewrites')}
              className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition flex items-center gap-1 shrink-0"
            >
              Inspect Fixes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card Footer Watermark */}
          <div className="relative z-10 mt-6 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-zinc-400">CookedResume.in</span>
              <span>•</span>
              <span>The Indian Tech Resume &amp; GitHub Roaster</span>
            </div>
            <div className="font-mono text-[10px] text-zinc-500">
              Verified Roast • No feelings were spared
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILED BULLET REWRITES (STAR METHOD FIXES) */}
      {activeTab === 'rewrites' && (
        <div className="w-full bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-orange-400" />
                Resume Bullet Point Makeover (STAR Method)
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                We took the 3 weakest lines from your profile and transformed them into high-converting bullet points with measurable impact metrics.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-xs font-semibold text-zinc-400 hover:text-white px-3 py-1.5 rounded-xl bg-zinc-800 border border-zinc-700 shrink-0"
            >
              Back to Scorecard
            </button>
          </div>

          <div className="space-y-5">
            {roast.bulletRewrites.map((rewrite, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 space-y-3.5 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-400 font-mono">
                    Fix #{idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    STAR Metric Enhanced
                  </span>
                </div>

                {/* Original weak line */}
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs">
                  <span className="text-rose-400 font-bold block mb-1">
                    ❌ Weak Original Line:
                  </span>
                  <p className="text-zinc-300 italic font-mono">&ldquo;{rewrite.original}&rdquo;</p>
                </div>

                {/* Fixed line */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/40 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-emerald-400 font-bold block">
                      ✅ Production-Grade Rewrite:
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(rewrite.fixed);
                        alert('Copied fixed bullet to clipboard!');
                      }}
                      className="text-[10px] text-zinc-400 hover:text-white underline"
                    >
                      Copy Bullet
                    </button>
                  </div>
                  <p className="text-emerald-200 font-medium leading-relaxed">
                    {rewrite.fixed}
                  </p>
                </div>

                {/* Why it works explanation */}
                <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-400 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-300">Why this gets you hired: </strong>
                    {rewrite.whyItWorks}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

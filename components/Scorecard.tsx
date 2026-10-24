'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RoastResult, PersonaId } from '@/lib/types';
import { PERSONAS } from '@/lib/personas';
import {
  Flame,
  Download,
  Copy,
  CheckCircle,
  RefreshCw,
  GitPullRequest,
  GitCommit,
  Check,
  Share2,
  FileCode2,
  Sparkles,
  TrendingDown,
  AlertOctagon,
  MessageCircle,
  ExternalLink,
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
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  const currentPersona = PERSONAS[roast.personaId || 'mass-recruiter'];

  // Calculate delusion level
  const getDelusionLevel = (score: number) => {
    if (score >= 90) return 'TERMINAL';
    if (score >= 80) return 'EXTREME';
    if (score >= 70) return 'VERY HIGH';
    return 'ELEVATED';
  };

  const delusionLevel = getDelusionLevel(roast.cookedPercentage);

  // SVG Progress Ring calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roast.cookedPercentage / 100) * circumference;

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F97316', '#EF4444', '#EAB308', '#10B981'],
      });
    } catch {
      // Ignore
    }
  }, [roast]);

  // Export card as PNG using html-to-image
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5,
        backgroundColor: '#09090b',
      });

      const link = document.createElement('a');
      link.download = `CookedScorecard-${roast.targetName || 'DesiDev'}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export scorecard PNG:', err);
      alert('Could not export image. Please try taking a screenshot or try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Share handlers
  const shareMessage = `I just got roasted on CookedResume.in! 🔥\nScore: ${roast.cookedPercentage}% COOKED (${roast.verdictTitle})\nPredicted CTC: ${roast.predictedPackage}\nDelusion Level: ${delusionLevel}\nRoast yours at: https://cookedresume.in`;

  const handleShareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleShareReddit = () => {
    const title = `My resume is ${roast.cookedPercentage}% COOKED according to CookedResume.in (${roast.verdictTitle})`;
    window.open(`https://reddit.com/submit?title=${encodeURIComponent(title)}&url=${encodeURIComponent('https://cookedresume.in')}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  return (
    <div className="w-full space-y-12">
      {/* Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-zinc-300">
            Roast Execution Complete. Scorecard ready below.
          </span>
        </div>

        {/* Persona quick switch */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-mono text-zinc-500 mr-1 hidden sm:inline">
            Re-roast as:
          </span>
          {(Object.keys(PERSONAS) as PersonaId[]).map((pid) => {
            const p = PERSONAS[pid];
            const isCurrent = roast.personaId === pid;
            return (
              <button
                key={pid}
                onClick={() => onReRoastWithPersona(pid)}
                disabled={isCurrent}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium flex items-center gap-1 transition ${
                  isCurrent
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 cursor-default'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <span>{p.avatarEmoji}</span>
                <span className="hidden md:inline">{p.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. THE SHAREABLE "COOKED SCORECARD" COMPONENT (CRUCIAL MAX-W-MD CONTAINER) */}
      {/* ========================================================================= */}
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          ref={cardRef}
          id="cooked-scorecard"
          className="w-full max-w-md mx-auto border-2 border-zinc-700 rounded-2xl p-6 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Ambient Background Gradients */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Row: User's Name/GitHub + Persona Badge + Date */}
          <div className="relative z-10 flex items-center justify-between border-b border-zinc-800/90 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-sm shadow-inner">
                {currentPersona.avatarEmoji}
              </div>
              <div className="leading-tight">
                <div className="text-xs font-mono font-bold text-zinc-200 truncate max-w-[150px]">
                  {roast.targetName || 'Desi Candidate'}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 truncate max-w-[150px]">
                  @{currentPersona.name.split(' ')[0].toLowerCase()}-verdict
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
                {currentPersona.name.split(' ')[0]}
              </span>
              <div className="text-[9px] font-mono text-zinc-500 mt-0.5">
                {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Centerpiece: Massive Circular SVG Progress Ring + Bold Verdict Title */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center my-3">
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#27272a"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Animated Progress Gradient Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="url(#cookedGradient)"
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="cookedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Cooked Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500 tracking-tighter">
                  {roast.cookedPercentage}%
                </span>
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-orange-400 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-orange-500 text-orange-500 inline" />
                  COOKED
                </span>
              </div>
            </div>

            {/* Bold Verdict Title Badge */}
            <div className="mt-3 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-md">
              <span className="text-xs sm:text-sm font-extrabold tracking-tight text-zinc-100 line-clamp-1">
                &ldquo;{roast.verdictTitle}&rdquo;
              </span>
            </div>
          </div>

          {/* Metric Box: 2-Column Monospace Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-2.5 my-4">
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                PREDICTED CTC
              </span>
              <span className="text-xs sm:text-sm font-mono font-black text-orange-400 leading-tight block truncate">
                {roast.predictedPackage}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                DELUSION LEVEL
              </span>
              <span className="text-xs sm:text-sm font-mono font-black text-red-400 leading-tight block truncate flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5 text-red-500 shrink-0" />
                {delusionLevel}
              </span>
            </div>
          </div>

          {/* Roast Summary Quote Block */}
          <div className="relative z-10 p-3 rounded-xl bg-zinc-950/90 border border-zinc-800/80 text-[11px] text-zinc-300 italic mb-4 leading-relaxed font-sans">
            &ldquo;{roast.roastSummary}&rdquo;
          </div>

          {/* Red Flags List: 3 Compact Dark Pills with ❌ Icons */}
          <div className="relative z-10 space-y-2 mb-5">
            <div className="text-[10px] font-mono uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1">
              <span>CRITICAL RED FLAGS</span>
            </div>
            {roast.redFlags.map((flag, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg bg-zinc-950/70 border border-red-500/20 text-xs text-zinc-300"
              >
                <span className="text-red-500 text-xs shrink-0 select-none">❌</span>
                <span className="text-[11px] leading-snug">{flag}</span>
              </div>
            ))}
          </div>

          {/* Footer Inside the Card: Watermark for Viral Screenshots */}
          <div className="relative z-10 pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span className="font-bold text-zinc-400">cookedresume.in</span>
            <span>Roast Your Tech Resume</span>
          </div>
        </motion.div>

        {/* Buttons Below the Card */}
        <div className="w-full max-w-md mt-4 flex flex-col gap-2.5">
          {/* Prominent Download Button */}
          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="w-full py-3.5 px-4 rounded-xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting Retina Scorecard...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>📸 Download Scorecard PNG</span>
              </>
            )}
          </button>

          {/* Social Share Buttons (WhatsApp, Reddit, Twitter/X) */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-emerald-500/40 text-xs font-mono font-semibold text-zinc-200 transition flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleShareReddit}
              className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-orange-500/40 text-xs font-mono font-semibold text-zinc-200 transition flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5 text-orange-400" />
              <span>Reddit</span>
            </button>

            <button
              onClick={handleShareTwitter}
              className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-semibold text-zinc-200 transition flex items-center justify-center gap-1.5"
            >
              <TwitterXIcon className="w-3.5 h-3.5 text-zinc-100" />
              <span>Post to X</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. GITHUB-PR STYLE RESUME FIXER UI (BELOW THE CARD) */}
      {/* ========================================================================= */}
      <section className="pt-6 border-t border-zinc-800">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>🛠️ Okay, Stop Crying. Here is How to Un-Cook Your Resume:</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-mono">
                Pull Request: <span className="text-emerald-400 font-bold">Fix/ATS-Optimization</span> into <code className="text-zinc-300">main</code>
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 self-start sm:self-auto">
              <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
              <span>3 changes requested</span>
            </div>
          </div>

          {/* 3 Git Diff Cards */}
          <div className="space-y-5">
            {roast.bulletRewrites.map((rewrite, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.3 }}
                className="rounded-xl border border-zinc-800 bg-[#09090b] overflow-hidden shadow-xl"
              >
                {/* Git Commit / File Header */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono text-zinc-400">
                  <div className="flex items-center gap-2">
                    <FileCode2 className="w-3.5 h-3.5 text-orange-400" />
                    <span className="text-zinc-200 font-semibold">
                      resume_experience_v{idx + 1}.tex
                    </span>
                    <span className="text-[10px] text-zinc-500 hidden sm:inline">
                      @@ -1,1 +1,1 @@
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    STAR METRIC ENHANCED
                  </span>
                </div>

                {/* Top Half: Red Tint (Original Weak Line) */}
                <div className="p-3.5 sm:p-4 bg-red-950/20 border-l-4 border-red-500 font-mono text-xs sm:text-sm text-red-200 flex items-start gap-2.5">
                  <span className="text-red-500 font-bold select-none">-</span>
                  <div className="flex-1 line-through opacity-85 leading-relaxed">
                    {rewrite.original}
                  </div>
                </div>

                {/* Bottom Half: Green Tint (Quantified Rewrite) + Copy Button */}
                <div className="p-3.5 sm:p-4 bg-emerald-950/20 border-l-4 border-emerald-500 font-mono text-xs sm:text-sm text-emerald-200 flex items-start justify-between gap-3 border-t border-zinc-800/60">
                  <div className="flex items-start gap-2.5 flex-1">
                    <span className="text-emerald-400 font-bold select-none">+</span>
                    <div className="font-semibold leading-relaxed text-emerald-100">
                      {rewrite.fixed}
                    </div>
                  </div>

                  {/* One-click Copy Button */}
                  <button
                    onClick={() => handleCopyBullet(rewrite.fixed, idx)}
                    className="p-1.5 sm:px-2.5 sm:py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-1 shrink-0 transition"
                    title="Copy fixed bullet to clipboard"
                  >
                    {copiedBulletIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="hidden sm:inline">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Engineering Explanation Footer */}
                <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-800/80 text-[11px] font-mono text-zinc-400 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-300">Why this works: </strong>
                    {rewrite.whyItWorks}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reset / Roast Another CTA */}
          <div className="pt-4 text-center">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 text-xs font-mono font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
              <span>Upload Another Resume or GitHub</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

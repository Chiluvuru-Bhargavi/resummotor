'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { PersonaSelector } from '@/components/PersonaSelector';
import { InputSection, InputMode } from '@/components/InputSection';
import { Scorecard } from '@/components/Scorecard';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { SampleResumePreviewModal } from '@/components/SampleResumePreviewModal';
import { PersonaId, RoastResult } from '@/lib/types';
import { PERSONAS } from '@/lib/personas';
import { SAMPLE_TIER3_RESUME_TEXT, PRESET_SAMPLE_ROASTS } from '@/lib/sample-data';
import {
  Flame,
  Sparkles,
  Zap,
  Building2,
  GraduationCap,
  Trophy,
  ArrowDown,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Coffee,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('mass-recruiter');
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stored inputs for one-click persona switching
  const [cachedInput, setCachedInput] = useState<{
    text: string;
    sourceType: InputMode;
    targetName?: string;
  } | null>(null);

  // Modals state
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState<string>('');

  const scorecardSectionRef = useRef<HTMLDivElement>(null);

  // Load custom API key from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('cookedresume_gemini_key') || '';
      setCustomApiKey(savedKey);
    } catch {
      // Ignore if localStorage unavailable
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    try {
      if (key) {
        localStorage.setItem('cookedresume_gemini_key', key);
      } else {
        localStorage.removeItem('cookedresume_gemini_key');
      }
    } catch {
      // Ignore
    }
  };

  // Perform Roast API call
  const executeRoast = async (
    text: string,
    personaId: PersonaId,
    sourceType: InputMode,
    targetName?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    // Save cached input for quick persona toggling
    setCachedInput({ text, sourceType, targetName });

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(customApiKey ? { 'x-gemini-key': customApiKey } : {}),
        },
        body: JSON.stringify({
          text,
          persona: personaId,
          sourceType,
          targetName,
          apiKey: customApiKey,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Roast request failed with status ${response.status}`);
      }

      const data: RoastResult = await response.json();
      setRoastResult(data);

      // Smooth scroll to scorecard
      setTimeout(() => {
        scorecardSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } catch (err: any) {
      console.error('Roast error:', err);
      setErrorMessage(err.message || 'Something went wrong while roasting. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger from InputSection
  const handleRoastTrigger = (data: {
    text: string;
    sourceType: InputMode;
    targetName?: string;
  }) => {
    executeRoast(data.text, selectedPersona, data.sourceType, data.targetName);
  };

  // Quick action: Try sample directly from hero or navbar
  const handleTrySampleDirectly = () => {
    executeRoast(SAMPLE_TIER3_RESUME_TEXT, selectedPersona, 'sample', 'Rahul Sharma');
  };

  // Re-roast with different persona
  const handleReRoastWithPersona = (newPersonaId: PersonaId) => {
    setSelectedPersona(newPersonaId);
    if (cachedInput) {
      executeRoast(cachedInput.text, newPersonaId, cachedInput.sourceType, cachedInput.targetName);
    } else if (roastResult) {
      executeRoast(SAMPLE_TIER3_RESUME_TEXT, newPersonaId, 'sample', 'Rahul Sharma');
    }
  };

  // Reset to roast another
  const handleReset = () => {
    setRoastResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07080e] text-zinc-100 relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Background Ambience / Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-orange-600/15 via-rose-600/10 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-[35%] -left-32 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <Navbar
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={!!customApiKey}
        onSelectSample={handleTrySampleDirectly}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 space-y-10">
        {/* HERO SECTION */}
        <section className="text-center space-y-5 max-w-3xl mx-auto">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-zinc-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <span>Over 100,000+ Indian Resumes Judged</span>
            <span className="text-zinc-600">•</span>
            <span className="text-orange-400 font-mono">100% Client-Side Privacy</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            How Badly Is Your Resume{' '}
            <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-rose-500 bg-clip-text text-transparent">
              Cooked?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Get brutally roasted by Indian tech personas: the <strong>3.2 LPA Mass Recruiter</strong>, <strong>Bengaluru Startup CTO</strong>, <strong>FAANG Bhaiya</strong>, or your college <strong>TPO Placement Cell HOD</strong>.
          </p>

          {/* Quick Demo CTA Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleTrySampleDirectly}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10 transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>Try with Sample Tier-3 Resume (Instant Demo)</span>
            </button>

            <button
              onClick={() => setIsSampleModalOpen(true)}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline px-2 py-1"
            >
              Preview Sample Resume
            </button>
          </div>

          {/* Cultural Meme Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-400">
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950/80 border border-zinc-800">
              🏢 90-Day Notice Period
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950/80 border border-zinc-800">
              ☕ p99 Koramangala Latency
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950/80 border border-zinc-800">
              📈 Striver 450 DSA Sheet
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-950/80 border border-zinc-800">
              🎓 Times New Roman 12pt
            </span>
          </div>
        </section>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-rose-300 hover:text-white underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* INPUT & CONFIGURATION WORKFLOW */}
        <section className="space-y-8">
          {/* Step 1: Input Section (PDF or GitHub or Sample) */}
          <InputSection
            onRoastTrigger={handleRoastTrigger}
            isLoading={isLoading}
            onOpenSampleModal={() => setIsSampleModalOpen(true)}
          />

          {/* Step 2: Persona Selector */}
          <div className="p-5 sm:p-7 bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 rounded-3xl shadow-xl">
            <PersonaSelector
              selectedPersona={selectedPersona}
              onSelectPersona={setSelectedPersona}
              disabled={isLoading}
            />
          </div>
        </section>

        {/* RESULTS SCORECARD SECTION */}
        <div ref={scorecardSectionRef}>
          {roastResult && (
            <section className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                  <h2 className="text-base font-black uppercase tracking-wider text-white">
                    Step 3: Your Certified Roast &amp; Scorecard
                  </h2>
                </div>
                <span className="text-xs text-zinc-400">
                  Ready to download &amp; share
                </span>
              </div>

              <Scorecard
                roast={roastResult}
                onReRoastWithPersona={handleReRoastWithPersona}
                onReset={handleReset}
              />
            </section>
          )}
        </div>

        {/* CULTURAL FEATURE HIGHLIGHTS */}
        <section className="pt-12 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Strict Client-Side PDF Parsing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Your resume PDF is parsed strictly inside your browser using <code className="text-zinc-300 font-mono">pdfjs-dist</code>. No PDF files are uploaded or stored on any server.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Gemini 2.5 Flash Structured JSON</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Powered by Google GenAI with strict schema guarantees, generating accurate cooked percentages, salary brackets, and STAR method rewrites.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Authentic Indian Tech Lore</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Tailored specifically to mass recruiter 3.2 LPA bonds, Koramangala beanbag hustle, Striver DSA grinds, and strict college placement cells.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800/80 bg-zinc-950/90 py-8 relative z-10 text-center text-xs text-zinc-500 space-y-2">
        <p className="flex items-center justify-center gap-1.5 font-medium text-zinc-400">
          Built with <Flame className="w-3.5 h-3.5 text-orange-500" /> for Indian Techies, SDE Aspirants &amp; Placement Survivors.
        </p>
        <p className="text-[11px] text-zinc-600">
          CookedResume.in • Purely for entertainment and resume improvement. No 2-year service bonds were harmed.
        </p>
      </footer>

      {/* MODALS */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={customApiKey}
      />

      <SampleResumePreviewModal
        isOpen={isSampleModalOpen}
        onClose={() => setIsSampleModalOpen(false)}
        onSelectAndRoast={handleTrySampleDirectly}
      />
    </div>
  );
}

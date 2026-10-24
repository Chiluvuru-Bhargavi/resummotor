'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { PersonaSelector } from '@/components/PersonaSelector';
import { InputSection, InputMode } from '@/components/InputSection';
import { Scorecard } from '@/components/Scorecard';
import { TerminalLoader } from '@/components/TerminalLoader';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { SampleResumePreviewModal } from '@/components/SampleResumePreviewModal';
import { PersonaId, RoastResult } from '@/lib/types';
import { SAMPLE_TIER3_RESUME_TEXT } from '@/lib/sample-data';
import {
  Flame,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Coffee,
  GitBranch,
  Terminal,
} from 'lucide-react';

export default function HomePage() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>('mass-recruiter');
  const [roastResult, setRoastResult] = useState<RoastResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cached input for instantaneous persona toggling
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
  const terminalRef = useRef<HTMLDivElement>(null);

  // Load custom API key from localStorage on mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('cookedresume_gemini_key') || '';
      setCustomApiKey(savedKey);
    } catch {
      // Ignore
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
    setCachedInput({ text, sourceType, targetName });

    // Scroll to terminal loader so user watches the fake terminal logs
    setTimeout(() => {
      terminalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

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
      }, 300);
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

  // Quick action: Try sample directly
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

  // Reset
  const handleReset = () => {
    setRoastResult(null);
    setErrorMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100 relative overflow-x-hidden selection:bg-orange-500 selection:text-white bg-grid-dots">
      {/* Background radial gradient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-b from-orange-500/10 via-red-500/5 to-transparent blur-3xl opacity-60" />
      </div>

      {/* Header */}
      <Navbar
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={!!customApiKey}
        onSelectSample={handleTrySampleDirectly}
      />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10 space-y-10">
        {/* HERO SECTION */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Live-style Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono font-medium text-zinc-300 shadow-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>🔥 Built for Indian Tech Placements • 100% Client-Side PDF Parsing</span>
          </motion.div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            How Badly Is Your Resume{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-red-500">
              Cooked?
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl mx-auto">
            Get brutally roasted by Indian tech archetypes: the <strong>3.2 LPA Mass Recruiter</strong>, <strong>Bengaluru Startup CTO</strong>, <strong>FAANG Bhaiya</strong>, or your college <strong>TPO Placement Cell HOD</strong>.
          </p>

          {/* Quick Demo CTA Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleTrySampleDirectly}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Try with Sample Tier-3 Resume (Instant Demo)</span>
            </button>

            <button
              onClick={() => setIsSampleModalOpen(true)}
              className="text-xs font-mono text-zinc-400 hover:text-zinc-200 underline px-2 py-1"
            >
              [Inspect Sample Text]
            </button>
          </div>
        </section>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs sm:text-sm flex items-center justify-between gap-3 shadow-lg font-mono">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-300 hover:text-white underline shrink-0"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* INPUT WORKFLOW */}
        <section className="space-y-6">
          {/* Step 1: Input Section (PDF or GitHub or Sample) */}
          <InputSection
            onRoastTrigger={handleRoastTrigger}
            isLoading={isLoading}
            onOpenSampleModal={() => setIsSampleModalOpen(true)}
          />

          {/* Step 2: Persona Selector (Video Game Character Select) */}
          <div className="p-5 sm:p-6 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl shadow-xl">
            <PersonaSelector
              selectedPersona={selectedPersona}
              onSelectPersona={setSelectedPersona}
              disabled={isLoading}
            />
          </div>
        </section>

        {/* FAKE TERMINAL LOADING STATE (3. Fake Terminal Loading State) */}
        <div ref={terminalRef}>
          <AnimatePresence>
            {isLoading && <TerminalLoader />}
          </AnimatePresence>
        </div>

        {/* RESULTS SCORECARD SECTION (4. The Shareable Scorecard + 5. GitHub PR Fixer) */}
        <div ref={scorecardSectionRef}>
          {roastResult && !isLoading && (
            <section className="pt-6">
              <Scorecard
                roast={roastResult}
                onReRoastWithPersona={handleReRoastWithPersona}
                onReset={handleReset}
              />
            </section>
          )}
        </div>

        {/* DEVELOPER FEATURE HIGHLIGHTS */}
        <section className="pt-10 border-t border-zinc-800/80 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-orange-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              01 // CLIENT-SIDE SANDBOX
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              PDFs are parsed strictly in your browser via <code className="text-zinc-300">pdfjs-dist</code>. No resume files are ever sent to or saved on any server.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-orange-400 font-bold flex items-center gap-1.5">
              <Cpu className="w-4 h-4" />
              02 // GEMINI 2.5 FLASH SCHEMA
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              Powered by Google GenAI with strict JSON schema output for deterministic scoring, salary calculations, and STAR rewrites.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5">
            <div className="text-orange-400 font-bold flex items-center gap-1.5">
              <Coffee className="w-4 h-4" />
              03 // INDIAN TECH FOLKLORE
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              Engineered with 90-day notice periods, 3.2 LPA bonds, Koramangala p99 latency, Striver 450 sheets, and TPO debarments.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-zinc-800/80 bg-zinc-950 py-6 text-center text-xs font-mono text-zinc-500 space-y-1">
        <p className="text-zinc-400">
          CookedResume.in • Built for Indian Techies, SDE Aspirants &amp; Placement Survivors.
        </p>
        <p className="text-[10px] text-zinc-600">
          Purely for entertainment and resume enhancement. No 2-year service bonds were harmed.
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

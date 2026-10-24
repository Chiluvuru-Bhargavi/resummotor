'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Flame, ShieldCheck, AlertCircle, Key } from 'lucide-react';
import { PersonaSelector } from '@/components/PersonaSelector';
import { InputSection, InputMode } from '@/components/InputSection';
import { Scorecard } from '@/components/Scorecard';
import { TerminalLoader } from '@/components/TerminalLoader';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { SampleResumePreviewModal } from '@/components/SampleResumePreviewModal';
import { PersonaId, RoastResult } from '@/lib/types';
import { SAMPLE_TIER3_RESUME_TEXT } from '@/lib/sample-data';

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

    // Scroll to terminal loader
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

      // Smooth scroll to 03 / DAMAGE REPORT
      setTimeout(() => {
        scorecardSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
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

  // Quick action: Try sample directly from navbar or hero
  const loadSampleResume = () => {
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
    <div className="w-full max-w-[1440px] min-h-screen mx-auto bg-zinc-950 flex flex-col justify-start items-start overflow-x-hidden text-neutral-50 selection:bg-orange-500 selection:text-white">
      {/* TOP NAVBAR (EXACT FIGMA JSX MATCH) */}
      <header className="self-stretch h-20 px-6 md:px-16 border-b border-zinc-800 inline-flex justify-between items-center w-full">
        {/* Brand / Logo */}
        <div className="flex justify-start items-center gap-2.5">
          <div className="size-8 bg-orange-500 flex justify-center items-center rounded-xs">
            <Flame className="size-5 text-zinc-950 fill-zinc-950" />
          </div>
          <div className="text-neutral-50 text-xl font-extrabold font-['Inter']">
            CookedResume.in
          </div>
          <div className="text-zinc-500 text-[10px] font-normal font-['IBM_Plex_Mono']">
            / BETA
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex justify-start items-center gap-5 sm:gap-8">
          <div className="text-orange-500 text-xs font-normal font-['IBM_Plex_Mono'] hidden md:block">
            THE ROAST ROOM
          </div>

          <button
            onClick={loadSampleResume}
            className="text-zinc-400 hover:text-orange-400 text-xs font-normal font-['IBM_Plex_Mono'] cursor-pointer transition"
          >
            Try Sample Resume ↗
          </button>

          {/* System Online Status */}
          <div className="flex justify-start items-center gap-1.5">
            <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <div className="text-emerald-500 text-xs font-normal font-['IBM_Plex_Mono']">
              SYSTEM ONLINE
            </div>
          </div>

          {/* Optional Gemini API key trigger */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className="text-zinc-500 hover:text-orange-400 text-xs font-['IBM_Plex_Mono'] hidden sm:flex items-center gap-1 transition cursor-pointer"
            title="Configure Gemini API Key"
          >
            <Key className="size-3" />
            {customApiKey ? <span className="text-emerald-400 font-bold">API KEY SET</span> : 'API KEY'}
          </button>
        </div>
      </header>

      {/* HERO SECTION (EXACT FIGMA JSX MATCH) */}
      <section className="self-stretch px-6 md:px-16 py-10 relative flex flex-col justify-start items-center gap-5 overflow-hidden w-full">
        <div className="w-[950px] h-56 left-1/2 -translate-x-1/2 top-0 absolute bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 to-transparent pointer-events-none" />

        <div className="px-3.5 py-2 bg-orange-500/5 rounded-full shadow-[0px_0px_28px_0px_rgba(249,115,22,0.15)] outline outline-1 outline-orange-500/30 inline-flex items-center">
          <div className="text-orange-400 text-xs font-normal font-['IBM_Plex_Mono']">
            🔥 4,820 Resumes Cooked Today
          </div>
        </div>

        <div className="self-stretch flex flex-col justify-start items-center gap-3.5">
          <h1 className="text-center text-4xl md:text-6xl font-extrabold font-['Inter'] md:leading-[71.28px]">
            <span className="text-neutral-50">Is Your Tech Resume </span>
            <span className="text-orange-500">Cooked?</span>
          </h1>
          <p className="text-center text-zinc-400 text-base font-normal font-['Inter'] leading-6 max-w-2xl">
            Select a brutal AI persona and get a reality check on your tech career.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <main className="self-stretch px-6 md:px-16 pb-20 flex flex-col gap-10 w-full">
        {/* Error notification */}
        {errorMessage && (
          <div className="w-full max-w-[900px] mx-auto p-4 rounded-md bg-red-950/40 border border-red-500/50 text-red-200 text-xs font-['IBM_Plex_Mono'] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-xs text-red-300 hover:text-white underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 01 / SELECT YOUR ROAST PERSONA */}
        <PersonaSelector
          selectedPersona={selectedPersona}
          onSelectPersona={setSelectedPersona}
          disabled={isLoading}
        />

        {/* 02 / FEED THE FIRE */}
        <InputSection
          onRoastTrigger={handleRoastTrigger}
          isLoading={isLoading}
          onOpenSampleModal={() => setIsSampleModalOpen(true)}
        />

        {/* FAKE TERMINAL LOADER */}
        <div ref={terminalRef}>
          {isLoading && <TerminalLoader />}
        </div>

        {/* 03 / DAMAGE REPORT */}
        <div ref={scorecardSectionRef}>
          {roastResult && !isLoading && (
            <Scorecard
              roast={roastResult}
              onReRoastWithPersona={handleReRoastWithPersona}
              onReset={handleReset}
            />
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="self-stretch px-6 md:px-16 py-8 border-t border-zinc-900 bg-zinc-950 text-center text-xs font-['IBM_Plex_Mono'] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-400">CookedResume.in</span>
          <span>•</span>
          <span>The Indian Tech Resume Roaster</span>
        </div>
        <div className="text-[11px] text-zinc-600">
          Built for Indian Techies, SDE Aspirants &amp; Placement Survivors.
        </div>
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
        onSelectAndRoast={loadSampleResume}
      />
    </div>
  );
}

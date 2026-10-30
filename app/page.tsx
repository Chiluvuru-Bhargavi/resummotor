'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/roast/HeroSection';
import PersonaGrid from '@/components/roast/PersonaGrid';
import type { InputMode } from '@/components/roast/UploadZone';
import { TerminalLoader } from '@/components/TerminalLoader';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { SampleResumePreviewModal } from '@/components/SampleResumePreviewModal';
import { PersonaId, RoastResult } from '@/lib/types';
import { SAMPLE_TIER3_RESUME_TEXT } from '@/lib/sample-data';
import { AlertCircle } from 'lucide-react';

const UploadZone = dynamic(() => import('@/components/roast/UploadZone'), {
  ssr: false,
});

const Scorecard = dynamic(() => import('@/components/roast/Scorecard'), {
  ssr: false,
});

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

  // Trigger from UploadZone
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
      {/* 1. TOP NAVBAR */}
      <Navbar
        onLoadSample={loadSampleResume}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasCustomKey={!!customApiKey}
      />

      {/* 2. HERO SECTION */}
      <HeroSection />

      {/* 3. MAIN CONTENT CONTAINER */}
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

        {/* 01 / CHOOSE YOUR DESTROYER */}
        <PersonaGrid
          selectedPersona={selectedPersona}
          onSelectPersona={setSelectedPersona}
          disabled={isLoading}
        />

        {/* 02 / FEED THE FIRE */}
        <UploadZone
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

      {/* 4. FOOTER */}
      <Footer />

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

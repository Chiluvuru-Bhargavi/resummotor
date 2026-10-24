'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Flame,
  ChevronDown,
  ChevronUp,
  Star,
  GitFork,
  BookOpen,
  Terminal,
} from 'lucide-react';
import { GithubIcon } from '@/components/BrandIcons';
import { extractTextFromPdf } from '@/lib/pdf-parser';
import { fetchGitHubSummary, FormattedGitHubResult } from '@/lib/github';
import {
  SAMPLE_TIER3_RESUME_TEXT,
  SAMPLE_GITHUB_USERNAME,
} from '@/lib/sample-data';

export type InputMode = 'pdf' | 'github' | 'sample';

interface InputSectionProps {
  onRoastTrigger: (data: {
    text: string;
    sourceType: InputMode;
    targetName?: string;
  }) => void;
  isLoading: boolean;
  onOpenSampleModal: () => void;
}

export function InputSection({
  onRoastTrigger,
  isLoading,
  onOpenSampleModal,
}: InputSectionProps) {
  const [activeTab, setActiveTab] = useState<InputMode>('pdf');

  // PDF State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState<string>('');
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GitHub State
  const [githubUsername, setGithubUsername] = useState('');
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubResult, setGithubResult] = useState<FormattedGitHubResult | null>(null);
  const [githubError, setGithubError] = useState<string | null>(null);

  // Preview toggle
  const [showExtractedPreview, setShowExtractedPreview] = useState(false);

  // Handle PDF file selection
  const handlePdfFile = async (file: File) => {
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setPdfError('Please upload a valid PDF document (.pdf)');
      return;
    }

    setPdfFile(file);
    setPdfError(null);
    setIsExtractingPdf(true);

    try {
      // Strictly Client-Side Extraction using pdfjs-dist
      const result = await extractTextFromPdf(file);
      setPdfText(result.text);
      setPdfPageCount(result.numPages);
    } catch (err: any) {
      console.error('PDF extraction failed:', err);
      setPdfError(err.message || 'Failed to extract text from PDF.');
      setPdfText('');
    } finally {
      setIsExtractingPdf(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handlePdfFile(file);
  };

  // Handle GitHub Fetch
  const handleFetchGithub = async (usernameToFetch?: string) => {
    const target = usernameToFetch || githubUsername;
    if (!target.trim()) {
      setGithubError('Please enter a GitHub username');
      return;
    }

    setIsFetchingGithub(true);
    setGithubError(null);

    try {
      const data = await fetchGitHubSummary(target);
      setGithubResult(data);
    } catch (err: any) {
      console.error('GitHub fetch failed:', err);
      setGithubError(err.message || 'Failed to fetch GitHub profile.');
      setGithubResult(null);
    } finally {
      setIsFetchingGithub(false);
    }
  };

  // Submit Handler
  const handleRoast = () => {
    if (activeTab === 'pdf') {
      if (!pdfText) {
        setPdfError('Please upload a PDF resume first.');
        return;
      }
      onRoastTrigger({
        text: pdfText,
        sourceType: 'pdf',
        targetName: pdfFile?.name.replace('.pdf', '') || 'Candidate',
      });
    } else if (activeTab === 'github') {
      if (!githubResult) {
        setGithubError('Please fetch a valid GitHub profile first.');
        return;
      }
      onRoastTrigger({
        text: githubResult.summaryString,
        sourceType: 'github',
        targetName: githubResult.profile.login,
      });
    } else {
      // Sample
      onRoastTrigger({
        text: SAMPLE_TIER3_RESUME_TEXT,
        sourceType: 'sample',
        targetName: 'Rahul Sharma',
      });
    }
  };

  const isReadyToRoast =
    (activeTab === 'pdf' && !!pdfText && !isExtractingPdf) ||
    (activeTab === 'github' && !!githubResult && !isFetchingGithub) ||
    activeTab === 'sample';

  return (
    <div className="w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-2xl p-5 sm:p-7 shadow-2xl relative">
      {/* Top Header / Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-orange-500/20 text-orange-400 text-xs font-mono font-bold border border-orange-500/30">
              01
            </span>
            Step 1: Ingest Profile Data
          </h2>
          <p className="text-xs text-zinc-400 mt-1 font-mono">
            Client-side text parsing only. Zero server-side file persistence.
          </p>
        </div>

        {/* Developer Tab switcher */}
        <div className="flex items-center p-1 bg-black/60 border border-zinc-800 rounded-xl self-start sm:self-auto font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'pdf'
                ? 'bg-zinc-800 text-orange-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            resume.pdf
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'github'
                ? 'bg-zinc-800 text-orange-400 border border-zinc-700 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <GithubIcon className="w-3.5 h-3.5" />
            github.com
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sample')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'sample'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            tier3_demo
          </button>
        </div>
      </div>

      {/* Tab 1: PDF Upload */}
      {activeTab === 'pdf' && (
        <div className="space-y-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePdfFile(file);
            }}
            accept="application/pdf"
            className="hidden"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
              isDragOver
                ? 'border-orange-500 bg-orange-500/10'
                : pdfText
                ? 'border-emerald-500/60 bg-emerald-950/20'
                : 'border-zinc-800 hover:border-orange-500/50 bg-black/40 hover:bg-black/60'
            }`}
          >
            {isExtractingPdf ? (
              <div className="flex flex-col items-center gap-3 text-center py-4 font-mono">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-zinc-200">
                    Executing <span className="text-orange-400">pdfjs-dist</span> in browser sandbox...
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Zero server transmission of binary files.
                  </p>
                </div>
              </div>
            ) : pdfText ? (
              <div className="flex flex-col items-center gap-3 text-center py-2 font-mono">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-100 flex items-center justify-center gap-2">
                    {pdfFile?.name}
                    <span className="text-[11px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      EXTRACTED ({pdfPageCount}p • {pdfText.split(/\s+/).length}w)
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-1 font-sans">
                    Text stripped and verified. Ready for roasting. Click to replace PDF.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 group-hover:text-orange-400 group-hover:border-orange-500/50 group-hover:scale-105 transition flex items-center justify-center shadow-lg">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-zinc-200 tracking-tight">
                    Drop your resume PDF here or <span className="text-orange-400 underline font-mono">browse</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 font-mono">
                    Client-side extraction via pdfjs-dist • 100% private
                  </p>
                </div>
              </div>
            )}
          </div>

          {pdfError && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pdfError}</span>
            </div>
          )}

          {/* Extracted text snippet preview toggle */}
          {pdfText && (
            <div className="pt-2 font-mono">
              <button
                type="button"
                onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition"
              >
                {showExtractedPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showExtractedPreview ? 'Hide Raw Text Stream' : 'Inspect Extracted Text Stream'}
              </button>
              {showExtractedPreview && (
                <div className="mt-2 p-3 bg-black border border-zinc-800 rounded-xl text-xs text-zinc-400 font-mono max-h-40 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {pdfText}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: GitHub Username */}
      {activeTab === 'github' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-sm">
                github.com/
              </span>
              <input
                type="text"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleFetchGithub();
                }}
                placeholder="username (e.g. torvalds)"
                className="w-full pl-28 pr-4 py-2.5 bg-black border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono text-sm transition"
              />
            </div>
            <button
              type="button"
              onClick={() => handleFetchGithub()}
              disabled={isFetchingGithub || !githubUsername.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-50 transition border border-zinc-700"
            >
              {isFetchingGithub ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Querying API...
                </>
              ) : (
                'Fetch Repos'
              )}
            </button>
          </div>

          {/* Quick preset profile button */}
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>Or try sample:</span>
            <button
              type="button"
              onClick={() => {
                setGithubUsername(SAMPLE_GITHUB_USERNAME);
                handleFetchGithub(SAMPLE_GITHUB_USERNAME);
              }}
              className="px-2.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-orange-400 hover:border-orange-500/50 transition"
            >
              @{SAMPLE_GITHUB_USERNAME}
            </button>
          </div>

          {githubError && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 font-mono">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{githubError}</span>
            </div>
          )}

          {/* GitHub Profile preview card */}
          {githubResult && (
            <div className="p-4 bg-black border border-zinc-800 rounded-xl space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={githubResult.profile.avatar_url}
                    alt={githubResult.profile.login}
                    className="w-10 h-10 rounded-full border border-zinc-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
                      {githubResult.profile.name || githubResult.profile.login}
                      <span className="text-xs font-mono text-zinc-400 font-normal">
                        @{githubResult.profile.login}
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1 font-sans">
                      {githubResult.profile.bio || 'No public bio written'}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  READY
                </span>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-center text-xs">
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">PUBLIC REPOS</div>
                  <div className="text-sm font-bold text-zinc-200">
                    {githubResult.profile.public_repos}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> TOTAL STARS
                  </div>
                  <div className="text-sm font-bold text-zinc-200">
                    {githubResult.repos.reduce((acc, r) => acc + r.stargazers_count, 0)}
                  </div>
                </div>
                <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
                    <GitFork className="w-3 h-3 text-cyan-400" /> FORKED
                  </div>
                  <div className="text-sm font-bold text-zinc-200">
                    {githubResult.repos.filter((r) => r.fork).length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sample Tier-3 Student Resume */}
      {activeTab === 'sample' && (
        <div className="p-4 sm:p-5 bg-gradient-to-br from-amber-950/20 via-zinc-950 to-black border border-amber-500/40 rounded-xl space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  Rahul Sharma - Tier-3 SDE Candidate
                </h4>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  7.18 CGPA | VTU College | Turbo C++ | 2-Day GenAI Workshop
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSampleModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-semibold text-zinc-200 border border-zinc-700 transition shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Inspect Full Text
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
              <span className="text-amber-400 font-bold block mb-0.5 text-[10px]">MAJOR PROJECT</span>
              <span className="text-zinc-300 font-sans text-xs">C++ Library System using plaintext file storage</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
              <span className="text-amber-400 font-bold block mb-0.5 text-[10px]">FLAGSHIP WEB APP</span>
              <span className="text-zinc-300 font-sans text-xs">React Calculator &amp; OpenWeatherMap free API</span>
            </div>
            <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800">
              <span className="text-amber-400 font-bold block mb-0.5 text-[10px]">CERTIFICATIONS</span>
              <span className="text-zinc-300 font-sans text-xs">2-Day National GenAI Workshop by IITian trainer</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Roast CTA Button */}
      <div className="mt-6 pt-5 border-t border-zinc-800/80">
        <button
          type="button"
          disabled={!isReadyToRoast || isLoading}
          onClick={handleRoast}
          className={`w-full py-4 px-6 rounded-xl font-mono text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl transition-all duration-200 ${
            isReadyToRoast && !isLoading
              ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-orange-500/20 hover:scale-[1.005] active:scale-[0.99] cursor-pointer'
              : 'bg-zinc-800/60 text-zinc-500 cursor-not-allowed border border-zinc-800'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>Execute Brutal Roast Now 🔥</span>
        </button>
      </div>
    </div>
  );
}

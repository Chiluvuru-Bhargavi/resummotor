'use client';

import React, { useState, useRef } from 'react';
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
  UserCheck,
  Star,
  GitFork,
  BookOpen
} from 'lucide-react';
import { GithubIcon } from '@/components/BrandIcons';
import { extractTextFromPdf } from '@/lib/pdf-parser';
import { fetchGitHubSummary, FormattedGitHubResult } from '@/lib/github';
import {
  SAMPLE_TIER3_RESUME_TEXT,
  SAMPLE_GITHUB_USERNAME,
  SAMPLE_GITHUB_SUMMARY_TEXT,
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

const ROAST_LOADING_STEPS = [
  '📄 Scanning for "Career Objective: To work in a challenging environment..."',
  '☕ Calculating Hinjewadi cafeteria commute time...',
  '💻 Searching for React Calculator and Weather App...',
  '📊 Checking 10th and 12th marksheet for 60% criteria...',
  '🔥 Checking if you solved Striver 450 DSA sheet...',
  '📑 Verifying Times New Roman 12pt margin compliance...',
  '⚡ Formulating brutal Hinglish roast...',
];

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

  // Loading step index for fun animation
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);

  React.useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingStepIndex((prev) => (prev + 1) % ROAST_LOADING_STEPS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

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
    <div className="w-full bg-zinc-900/60 backdrop-blur-md border border-zinc-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/50">
      {/* Step Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-800/80 pb-5">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-mono">
              1
            </span>
            Step 1: Provide Your Profile
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Client-side parsing guarantees zero server storage of your private documents.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-zinc-950/80 border border-zinc-800 rounded-2xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'pdf'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload PDF
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'github'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <GithubIcon className="w-3.5 h-3.5" />
            GitHub Profile
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sample')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeTab === 'sample'
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Sample Tier-3
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
            className={`group relative flex flex-col items-center justify-center p-8 sm:p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
              isDragOver
                ? 'border-orange-500 bg-orange-500/10'
                : pdfText
                ? 'border-emerald-500/50 bg-emerald-950/10'
                : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950/40 hover:bg-zinc-950/70'
            }`}
          >
            {isExtractingPdf ? (
              <div className="flex flex-col items-center gap-3 text-center py-4">
                <Loader2 className="w-9 h-9 text-orange-400 animate-spin" />
                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    Extracting text on client side with <code className="text-orange-400 font-mono">pdfjs-dist</code>...
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Your PDF never leaves your device. Only raw text is sent to our roast API.
                  </p>
                </div>
              </div>
            ) : pdfText ? (
              <div className="flex flex-col items-center gap-3 text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white flex items-center justify-center gap-2">
                    {pdfFile?.name}
                    <span className="text-xs font-normal text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      Extracted ({pdfPageCount} {pdfPageCount === 1 ? 'page' : 'pages'})
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">
                    Extracted {pdfText.split(/\s+/).length} words ready for roasting. Click to replace PDF.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-orange-400 group-hover:border-orange-500/40 group-hover:scale-105 transition flex items-center justify-center shadow-lg">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-200">
                    Drop your resume PDF here or <span className="text-orange-400 underline">browse</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Client-side extraction via <span className="text-zinc-400 font-mono">pdfjs-dist</span> (standard ATS PDF resumes work best)
                  </p>
                </div>
              </div>
            )}
          </div>

          {pdfError && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pdfError}</span>
            </div>
          )}

          {/* Extracted text snippet preview toggle */}
          {pdfText && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowExtractedPreview(!showExtractedPreview)}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition"
              >
                {showExtractedPreview ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {showExtractedPreview ? 'Hide Extracted Text' : 'View Extracted Text Preview'}
              </button>
              {showExtractedPreview && (
                <div className="mt-2 p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-300 font-mono max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
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
                placeholder="username (e.g. torvalds, shadcn)"
                className="w-full pl-28 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-mono text-sm transition"
              />
            </div>
            <button
              type="button"
              onClick={() => handleFetchGithub()}
              disabled={isFetchingGithub || !githubUsername.trim()}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white disabled:opacity-50 transition border border-zinc-700/60"
            >
              {isFetchingGithub ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Fetch Repos'
              )}
            </button>
          </div>

          {/* Quick preset profile button */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Or try sample:</span>
            <button
              type="button"
              onClick={() => {
                setGithubUsername(SAMPLE_GITHUB_USERNAME);
                handleFetchGithub(SAMPLE_GITHUB_USERNAME);
              }}
              className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-orange-400 hover:border-orange-500/40 font-mono text-[11px] transition"
            >
              @{SAMPLE_GITHUB_USERNAME}
            </button>
          </div>

          {githubError && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{githubError}</span>
            </div>
          )}

          {/* GitHub Profile preview card */}
          {githubResult && (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={githubResult.profile.avatar_url}
                    alt={githubResult.profile.login}
                    className="w-11 h-11 rounded-full border border-zinc-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      {githubResult.profile.name || githubResult.profile.login}
                      <span className="text-xs font-mono font-normal text-zinc-400">
                        @{githubResult.profile.login}
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1">
                      {githubResult.profile.bio || 'No public bio'}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready to Roast
                </span>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-center">
                <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-xs text-zinc-400">Public Repos</div>
                  <div className="text-sm font-bold text-white font-mono">
                    {githubResult.profile.public_repos}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-xs text-zinc-400 flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-amber-400" /> Stars
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {githubResult.repos.reduce((acc, r) => acc + r.stargazers_count, 0)}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <div className="text-xs text-zinc-400 flex items-center justify-center gap-1">
                    <GitFork className="w-3 h-3 text-cyan-400" /> Forked
                  </div>
                  <div className="text-sm font-bold text-white font-mono">
                    {githubResult.repos.filter((r) => r.fork).length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sample Tier-3 Resume */}
      {activeTab === 'sample' && (
        <div className="p-5 bg-gradient-to-br from-amber-950/20 via-zinc-950 to-zinc-950 border border-amber-500/30 rounded-2xl space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Rahul Sharma - Aspiring Full Stack Developer
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  7.18 CGPA | VTU Affiliated | Turbo C++ & MS Office | 2 Backlogs Cleared
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenSampleModal}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 border border-zinc-700 transition shrink-0"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              View Full Resume
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <span className="text-amber-400 font-bold block mb-0.5">Major Project</span>
              <span className="text-zinc-300">C++ Library Management System using text file handling</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <span className="text-amber-400 font-bold block mb-0.5">Headline Web App</span>
              <span className="text-zinc-300">Responsive Calculator & OpenWeatherMap API</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80">
              <span className="text-amber-400 font-bold block mb-0.5">Certifications</span>
              <span className="text-zinc-300">2-Day National GenAI Workshop by IITian trainer</span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 italic">
            💡 This sample is pre-loaded with every classic tier-3 student trope. Hit &quot;Roast Profile&quot; below for an immediate roast!
          </p>
        </div>
      )}

      {/* Main Roast CTA Button */}
      <div className="mt-6 pt-5 border-t border-zinc-800/80">
        <button
          type="button"
          disabled={!isReadyToRoast || isLoading}
          onClick={handleRoast}
          className={`w-full relative group overflow-hidden py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-2xl transition-all duration-300 ${
            isReadyToRoast && !isLoading
              ? 'bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 hover:from-orange-500 hover:via-amber-500 hover:to-rose-500 text-white shadow-orange-600/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
              : 'bg-zinc-800/70 text-zinc-500 cursor-not-allowed border border-zinc-800'
          }`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-1.5 py-1">
              <div className="flex items-center gap-2 text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm font-bold tracking-normal normal-case">
                  Roasting in Progress...
                </span>
              </div>
              <p className="text-xs text-orange-200/90 font-mono font-normal normal-case animate-pulse">
                {ROAST_LOADING_STEPS[loadingStepIndex]}
              </p>
            </div>
          ) : (
            <>
              <Flame className="w-5 h-5 text-amber-300 group-hover:scale-125 transition-transform" />
              <span>Roast This Profile Now 🔥</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

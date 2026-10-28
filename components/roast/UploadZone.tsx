'use client';

import React, { useState, useRef } from 'react';
import {
  FileUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Flame,
  ChevronDown,
  ChevronUp,
  Star,
  GitFork,
} from 'lucide-react';
import { GithubIcon } from '@/components/BrandIcons';
import { extractTextFromPdf } from '@/lib/pdf-parser';
import { fetchGitHubSummary, FormattedGitHubResult } from '@/lib/github';
import { SAMPLE_GITHUB_USERNAME } from '@/lib/sample-data';

export type InputMode = 'pdf' | 'github' | 'sample';

interface UploadZoneProps {
  onRoastTrigger: (data: {
    text: string;
    sourceType: InputMode;
    targetName?: string;
  }) => void;
  isLoading: boolean;
  onOpenSampleModal?: () => void;
}

export default function UploadZone({
  onRoastTrigger,
  isLoading,
  onOpenSampleModal,
}: UploadZoneProps) {
  const [activeTab, setActiveTab] = useState<'pdf' | 'github'>('pdf');

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

  // Raw text preview toggle
  const [showPreview, setShowPreview] = useState(false);

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
    } else {
      if (!githubResult) {
        setGithubError('Please fetch a valid GitHub profile first.');
        return;
      }
      onRoastTrigger({
        text: githubResult.summaryString,
        sourceType: 'github',
        targetName: githubResult.profile.login,
      });
    }
  };

  const isReadyToRoast =
    (activeTab === 'pdf' && !!pdfText && !isExtractingPdf) ||
    (activeTab === 'github' && !!githubResult && !isFetchingGithub);

  return (
    <div className="w-full max-w-[900px] mx-auto bg-gradient-to-br from-stone-800/60 via-zinc-900/90 to-stone-900/60 rounded-lg outline outline-1 outline-orange-500/60 backdrop-blur-md p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
      {/* 02 / FEED THE FIRE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="text-orange-500 text-xs font-normal font-['IBM_Plex_Mono'] uppercase tracking-widest mb-1">
            02 / FEED THE FIRE
          </div>
          <h2 className="text-neutral-50 text-2xl font-extrabold font-['Inter']">
            Submit Resume or GitHub
          </h2>
          <p className="text-zinc-400 text-xs font-normal font-['Inter'] mt-0.5">
            Choose how you want to be evaluated. All documents parsed 100% in-browser.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-md self-start sm:self-auto font-['IBM_Plex_Mono']">
          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-medium transition cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-zinc-800 text-orange-400 border border-zinc-700'
                : 'text-zinc-400 hover:text-neutral-50'
            }`}
          >
            <FileUp className="size-3.5" />
            PDF Upload
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-medium transition cursor-pointer ${
              activeTab === 'github'
                ? 'bg-zinc-800 text-orange-400 border border-zinc-700'
                : 'text-zinc-400 hover:text-neutral-50'
            }`}
          >
            <GithubIcon className="size-3.5" />
            GitHub Profile
          </button>
        </div>
      </div>

      {/* TAB 1: PDF DROPZONE */}
      {activeTab === 'pdf' && (
        <div className="flex flex-col gap-3">
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
            className={`border-2 border-dashed rounded-lg p-8 sm:p-10 flex flex-col items-center justify-center gap-3 bg-zinc-950/40 cursor-pointer transition ${
              isDragOver
                ? 'border-orange-500 bg-orange-500/10'
                : pdfText
                ? 'border-emerald-500/60 bg-emerald-950/20'
                : 'border-zinc-700 hover:border-orange-500/80 hover:bg-zinc-950/70'
            }`}
          >
            {isExtractingPdf ? (
              <div className="flex flex-col items-center gap-2.5 text-center font-['IBM_Plex_Mono']">
                <Loader2 className="size-7 text-orange-500 animate-spin" />
                <p className="text-xs text-neutral-200 font-medium">
                  Extracting text strictly in browser via <span className="text-orange-400">pdfjs-dist</span>...
                </p>
                <p className="text-[11px] text-zinc-500">
                  Zero byte uploads. Your PDF never leaves this tab.
                </p>
              </div>
            ) : pdfText ? (
              <div className="flex flex-col items-center gap-2 text-center font-['IBM_Plex_Mono']">
                <div className="size-11 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                  <CheckCircle2 className="size-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-100 flex items-center justify-center gap-2">
                    {pdfFile?.name}
                    <span className="text-[11px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {pdfPageCount}p • {pdfText.split(/\s+/).length} words
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400 mt-1 font-['Inter']">
                    Text extracted and ready to roast. Click to choose another PDF.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2.5 text-center">
                <FileUp className="size-7 text-orange-500" />
                <p className="text-neutral-200 text-sm font-medium font-['Inter']">
                  Drag &amp; drop your resume PDF here, or <span className="text-orange-500 underline font-['IBM_Plex_Mono']">click to browse</span>
                </p>
                <p className="text-zinc-500 text-xs font-normal font-['IBM_Plex_Mono']">
                  Strictly parsed in browser via pdfjs-dist. Zero files uploaded.
                </p>
              </div>
            )}
          </div>

          {pdfError && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-md bg-red-950/40 border border-red-500/40 text-red-300 font-['IBM_Plex_Mono']">
              <AlertCircle className="size-4 shrink-0" />
              <span>{pdfError}</span>
            </div>
          )}

          {pdfText && (
            <div className="pt-1 font-['IBM_Plex_Mono'] text-xs">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-zinc-400 hover:text-orange-400 flex items-center gap-1 transition cursor-pointer"
              >
                {showPreview ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                {showPreview ? 'Hide Raw Extracted Stream' : 'Inspect Raw Extracted Stream'}
              </button>
              {showPreview && (
                <div className="mt-2 p-3 bg-zinc-950 border border-zinc-800 rounded-md text-xs text-zinc-400 max-h-36 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {pdfText}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GITHUB PROFILE */}
      {activeTab === 'github' && (
        <div className="flex flex-col gap-3 font-['IBM_Plex_Mono']">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
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
                className="w-full pl-28 pr-4 py-2.5 bg-zinc-950 border border-zinc-700 rounded-md text-neutral-50 placeholder-zinc-600 focus:outline-none focus:border-orange-500 text-sm transition"
              />
            </div>
            <button
              type="button"
              onClick={() => handleFetchGithub()}
              disabled={isFetchingGithub || !githubUsername.trim()}
              className="px-5 py-2.5 rounded-md text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-neutral-50 disabled:opacity-50 transition border border-zinc-700 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isFetchingGithub ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Fetch Repos'
              )}
            </button>
          </div>

          {/* Quick preset trigger */}
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span>Or test with sample profile:</span>
            <button
              type="button"
              onClick={() => {
                setGithubUsername(SAMPLE_GITHUB_USERNAME);
                handleFetchGithub(SAMPLE_GITHUB_USERNAME);
              }}
              className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-orange-400 hover:border-orange-500 transition cursor-pointer"
            >
              @{SAMPLE_GITHUB_USERNAME}
            </button>
          </div>

          {githubError && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-md bg-red-950/40 border border-red-500/40 text-red-300">
              <AlertCircle className="size-4 shrink-0" />
              <span>{githubError}</span>
            </div>
          )}

          {/* Profile Card */}
          {githubResult && (
            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-md space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={githubResult.profile.avatar_url}
                    alt={githubResult.profile.login}
                    className="size-10 rounded-full border border-zinc-700"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-neutral-50 flex items-center gap-1.5 font-['Inter']">
                      {githubResult.profile.name || githubResult.profile.login}
                      <span className="text-xs text-zinc-400 font-normal font-['IBM_Plex_Mono']">
                        @{githubResult.profile.login}
                      </span>
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-1 font-['Inter']">
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
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500">PUBLIC REPOS</div>
                  <div className="text-sm font-bold text-neutral-200">
                    {githubResult.profile.public_repos}
                  </div>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
                    <Star className="size-3 text-amber-400" /> STARS
                  </div>
                  <div className="text-sm font-bold text-neutral-200">
                    {githubResult.repos.reduce((acc, r) => acc + r.stargazers_count, 0)}
                  </div>
                </div>
                <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                  <div className="text-[10px] text-zinc-500 flex items-center justify-center gap-1">
                    <GitFork className="size-3 text-cyan-400" /> FORKED
                  </div>
                  <div className="text-sm font-bold text-neutral-200">
                    {githubResult.repos.filter((r) => r.fork).length}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CTA BUTTON */}
      <button
        type="button"
        disabled={!isReadyToRoast || isLoading}
        onClick={handleRoast}
        className={`self-stretch py-4 rounded-md font-['IBM_Plex_Mono'] text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition duration-200 ${
          isReadyToRoast && !isLoading
            ? 'bg-orange-500 hover:bg-orange-600 text-zinc-950 shadow-[0px_0px_28px_0px_rgba(249,115,22,0.35)] cursor-pointer'
            : 'bg-zinc-800/60 text-zinc-500 cursor-not-allowed border border-zinc-800'
        }`}
      >
        <Flame className="size-4 text-zinc-950 fill-zinc-950" />
        <span>Roast My Career →</span>
      </button>

      {/* PRIVACY FOOTER NOTE */}
      <div className="flex items-center justify-center gap-1.5 text-zinc-500 text-xs font-['IBM_Plex_Mono']">
        <ShieldCheck className="size-3.5 text-emerald-500" />
        <span>100% Client-Side Parsing • Your document never leaves your machine.</span>
      </div>
    </div>
  );
}

export { UploadZone };

'use client';

import React from 'react';
import { Flame, Key, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenApiKeyModal: () => void;
  hasCustomKey: boolean;
  onSelectSample: () => void;
}

export function Navbar({ onOpenApiKeyModal, hasCustomKey, onSelectSample }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-rose-600 shadow-lg shadow-orange-500/20 ring-1 ring-orange-400/40">
            <Flame className="w-6 h-6 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                Cooked<span className="text-orange-500">Resume</span><span className="text-xs sm:text-sm font-semibold text-zinc-400">.in</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-orange-500/10 text-orange-400 border border-orange-500/30">
                desi edition 🇮🇳
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-zinc-400 font-medium">
              The Indian Tech Resume & GitHub Roaster
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick sample button */}
          <button
            onClick={onSelectSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 transition shadow-sm hover:border-orange-500/40"
            title="Load sample tier-3 student resume"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Try</span> Sample Tier-3
          </button>

          {/* API Key Modal trigger */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              hasCustomKey
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
            title="Configure Gemini API Key (optional)"
          >
            <Key className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden md:inline">API Key</span>
            {hasCustomKey && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Indian Tech Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/70 border border-zinc-800 text-[11px] text-zinc-400">
            <span>🔥 3.2 LPA Specialist</span>
          </div>
        </div>
      </div>
    </header>
  );
}

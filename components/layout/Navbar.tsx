'use client';

import React from 'react';
import { Flame, Key } from 'lucide-react';

interface NavbarProps {
  onLoadSample?: () => void;
  onOpenApiKeyModal?: () => void;
  hasCustomKey?: boolean;
}

export default function Navbar({
  onLoadSample,
  onOpenApiKeyModal,
  hasCustomKey = false,
}: NavbarProps) {
  return (
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
          onClick={onLoadSample}
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
        {onOpenApiKeyModal && (
          <button
            onClick={onOpenApiKeyModal}
            className="text-zinc-500 hover:text-orange-400 text-xs font-['IBM_Plex_Mono'] hidden sm:flex items-center gap-1 transition cursor-pointer"
            title="Configure Gemini API Key"
          >
            <Key className="size-3" />
            {hasCustomKey ? <span className="text-emerald-400 font-bold">API KEY SET</span> : 'API KEY'}
          </button>
        )}
      </div>
    </header>
  );
}

export { Navbar };

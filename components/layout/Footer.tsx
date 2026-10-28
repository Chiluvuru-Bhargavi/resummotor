import React from 'react';

export default function Footer() {
  return (
    <footer className="self-stretch px-6 md:px-16 py-8 border-t border-zinc-900 bg-zinc-950 text-center text-xs font-['IBM_Plex_Mono'] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-2">
        <span className="font-bold text-neutral-400">CookedResume.in</span>
        <span>•</span>
        <span>The Indian Tech Resume Roaster</span>
      </div>
      <div className="text-[11px] text-zinc-600">
        Built for Devs. Not Egos. • SDE Aspirants &amp; Placement Survivors.
      </div>
    </footer>
  );
}

export { Footer };

'use client';

import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  count?: number;
}

export default function HeroSection({ count }: HeroSectionProps) {
  const [internalCount, setInternalCount] = useState<number>(0);

  useEffect(() => {
    if (count === undefined) {
      fetch('/api/counter')
        .then((res) => res.json())
        .then((data) => {
          if (data && typeof data.count === 'number') {
            setInternalCount(data.count);
          }
        })
        .catch(() => {});
    }
  }, [count]);

  const displayCount = count !== undefined ? count : internalCount;

  return (
    <section className="self-stretch px-6 md:px-16 py-10 relative flex flex-col justify-start items-center gap-5 overflow-hidden w-full">
      <div className="w-[950px] h-56 left-1/2 -translate-x-1/2 top-0 absolute bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/10 to-transparent pointer-events-none" />

      {/* Real Daily Live Counter Badge */}
      <div className="px-4 py-2 bg-orange-500/5 rounded-full shadow-[0px_0px_28px_0px_rgba(249,115,22,0.15)] outline outline-1 outline-orange-500/30 inline-flex items-center gap-2">
        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" title="Live daily counter" />
        <div className="text-orange-400 text-xs font-normal font-['IBM_Plex_Mono'] flex items-center gap-1.5">
          <span>🔥</span>
          <span className="font-bold text-neutral-100">{displayCount.toLocaleString()}</span>
          <span>{displayCount === 1 ? 'Resume' : 'Resumes'} Cooked Today</span>
          {displayCount === 0 && (
            <span className="text-zinc-500 text-[11px] hidden sm:inline">• Be the first today!</span>
          )}
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
  );
}

export { HeroSection };

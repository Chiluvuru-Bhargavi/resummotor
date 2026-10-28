'use client';

import React from 'react';
import { PersonaId } from '@/lib/types';
import { PERSONAS } from '@/lib/personas';
import { Briefcase, Terminal, Code2, GraduationCap, Flame } from 'lucide-react';

interface PersonaGridProps {
  selectedPersona: PersonaId;
  onSelectPersona: (id: PersonaId) => void;
  disabled?: boolean;
}

export default function PersonaGrid({
  selectedPersona,
  onSelectPersona,
  disabled = false,
}: PersonaGridProps) {
  const personaList = Object.values(PERSONAS);

  const getPersonaIcon = (id: PersonaId, isSelected: boolean) => {
    const iconClass = `size-5 ${isSelected ? 'text-orange-500' : 'text-zinc-400'}`;
    switch (id) {
      case 'mass-recruiter':
        return <Briefcase className={iconClass} />;
      case 'startup-cto':
        return <Terminal className="size-5 text-orange-500" />;
      case 'faang-bhaiya':
        return <Code2 className={iconClass} />;
      case 'placement-hod':
        return <GraduationCap className={iconClass} />;
    }
  };

  const getBarColor = (id: PersonaId, barIndex: number, totalActive: number) => {
    if (barIndex < totalActive) {
      if (id === 'mass-recruiter') return 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]';
      if (id === 'faang-bhaiya') return 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]';
      return 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.6)]';
    }
    return 'bg-zinc-800';
  };

  return (
    <div className="self-stretch w-full flex flex-col gap-4">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <div className="text-orange-500 text-xs font-normal font-['IBM_Plex_Mono'] uppercase tracking-widest flex items-center gap-2">
          <span>01 / CHOOSE YOUR DESTROYER</span>
        </div>
        <div className="text-zinc-500 text-xs font-['IBM_Plex_Mono'] hidden sm:block">
          [ 4 EXECUTIONERS AVAILABLE ]
        </div>
      </div>

      {/* 4 PERSONA CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {personaList.map((p) => {
          const isSelected = selectedPersona === p.id;

          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPersona(p.id)}
              className={`p-5 rounded-lg text-left transition-all duration-200 flex flex-col justify-between gap-4 cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 shadow-[0px_0px_28px_0px_rgba(249,115,22,0.15)] outline outline-1 outline-orange-500'
                  : 'bg-zinc-900 outline outline-1 outline-zinc-800 hover:outline-zinc-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Header inside card */}
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="size-9 rounded-md bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                    {getPersonaIcon(p.id, isSelected)}
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-['IBM_Plex_Mono'] font-bold text-orange-400 uppercase tracking-widest px-2 py-0.5 rounded bg-orange-500/10 border border-orange-500/30">
                      SELECTED
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-neutral-50 text-base font-extrabold font-['Inter'] leading-snug">
                    {p.name}
                  </h3>
                  <p className="text-zinc-500 text-xs font-normal font-['IBM_Plex_Mono']">
                    {p.role}
                  </p>
                </div>

                {/* Quote */}
                <p className="text-zinc-300 text-xs italic font-normal font-['Inter'] leading-relaxed pt-1">
                  &ldquo;{p.sampleQuote}&rdquo;
                </p>
              </div>

              {/* Exact 5-Bar Spice Level Indicator at Bottom */}
              <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[10px] font-['IBM_Plex_Mono'] text-zinc-400">
                  <span className="uppercase">SPICE: {p.spiceLevel}</span>
                  <Flame className={`size-3 ${isSelected ? 'text-orange-500 fill-orange-500' : 'text-zinc-500'}`} />
                </div>

                {/* 5 horizontal bars */}
                <div className="grid grid-cols-5 gap-1.5 w-full">
                  {[0, 1, 2, 3, 4].map((barIndex) => (
                    <div
                      key={barIndex}
                      className={`h-1.5 rounded-xs transition-colors ${getBarColor(p.id, barIndex, p.spiceBars)}`}
                    />
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { PersonaGrid };

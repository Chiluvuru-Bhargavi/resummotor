'use client';

import React from 'react';
import { PersonaId } from '@/lib/types';
import { PERSONAS } from '@/lib/personas';
import { Check, Flame, Quote, Building2, Zap, GraduationCap, Trophy } from 'lucide-react';

interface PersonaSelectorProps {
  selectedPersona: PersonaId;
  onSelectPersona: (id: PersonaId) => void;
  disabled?: boolean;
}

export function PersonaSelector({
  selectedPersona,
  onSelectPersona,
  disabled = false,
}: PersonaSelectorProps) {
  const personaList = Object.values(PERSONAS);

  const getPersonaIcon = (id: PersonaId) => {
    switch (id) {
      case 'mass-recruiter':
        return <Building2 className="w-5 h-5 text-amber-400" />;
      case 'startup-cto':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'faang-bhaiya':
        return <Trophy className="w-5 h-5 text-rose-400" />;
      case 'placement-hod':
        return <GraduationCap className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            Step 2: Choose Your Roast Persona
          </h2>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          Selected: <span className="text-zinc-200 font-semibold">{PERSONAS[selectedPersona].name}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {personaList.map((p) => {
          const isSelected = selectedPersona === p.id;

          return (
            <button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPersona(p.id)}
              className={`relative group text-left p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900/90 border-2 shadow-xl ring-1'
                  : 'bg-zinc-950/70 border border-zinc-800/80 hover:bg-zinc-900/50 hover:border-zinc-700'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              style={{
                borderColor: isSelected ? p.accentColor : undefined,
                boxShadow: isSelected ? `0 10px 25px -5px ${p.accentColor}25` : undefined,
              }}
            >
              {/* Active Checkmark Pill */}
              {isSelected && (
                <div
                  className="absolute -top-2.5 -right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1 shadow-md"
                  style={{ backgroundColor: p.accentColor }}
                >
                  <Check className="w-3 h-3 stroke-[3]" />
                  Active
                </div>
              )}

              {/* Persona Header */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 shadow-inner">
                      {p.avatarEmoji}
                    </span>
                    <div className="p-1 rounded-lg bg-zinc-800/60 border border-zinc-700/50">
                      {getPersonaIcon(p.id)}
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-orange-300 transition-colors line-clamp-1">
                  {p.name}
                </h3>
                <p className="text-[11px] font-medium text-zinc-400 mb-2 line-clamp-1">
                  {p.role}
                </p>

                {/* Slogan / Voice Quote */}
                <div className="p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/90 text-[11px] text-zinc-300 italic mb-2.5 relative">
                  <Quote className="w-3 h-3 text-zinc-600 absolute top-1.5 right-1.5" />
                  &quot;{p.tagline}&quot;
                </div>
              </div>

              {/* Bottom Badge */}
              <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px]">
                <span className="text-zinc-500 font-medium">Style</span>
                <span
                  className="font-semibold px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: `${p.accentColor}18`,
                    color: p.accentColor,
                  }}
                >
                  {p.companyBadge}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

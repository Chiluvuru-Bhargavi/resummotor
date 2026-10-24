'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PersonaId } from '@/lib/types';
import { PERSONAS } from '@/lib/personas';
import { Check, Flame, Quote, Building2, Zap, GraduationCap, Trophy, Swords } from 'lucide-react';

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
        return <Building2 className="w-4 h-4 text-amber-400" />;
      case 'startup-cto':
        return <Zap className="w-4 h-4 text-cyan-400" />;
      case 'faang-bhaiya':
        return <Trophy className="w-4 h-4 text-rose-400" />;
      case 'placement-hod':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="w-full">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Swords className="w-4 h-4" />
          </div>
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-300 font-bold">
            Step 2: Choose Your Executioner [Character Select]
          </h2>
        </div>
        <span className="text-[11px] font-mono text-zinc-500">
          Selected Boss: <strong className="text-orange-400 font-semibold">{PERSONAS[selectedPersona].name}</strong>
        </span>
      </div>

      {/* 4 Video Game Character Select Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {personaList.map((p) => {
          const isSelected = selectedPersona === p.id;

          return (
            <motion.button
              key={p.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectPersona(p.id)}
              whileHover={!disabled ? { y: -3, transition: { duration: 0.15 } } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              className={`relative text-left p-4 rounded-xl transition-all flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? 'bg-orange-500/10 border-2 border-orange-500 ring-2 ring-orange-500/40 shadow-xl shadow-orange-500/10'
                  : 'bg-zinc-900/80 backdrop-blur-md border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Corner Selection Indicator */}
              {isSelected && (
                <div className="absolute top-0 right-0">
                  <div className="bg-orange-500 text-black px-2 py-0.5 text-[9px] font-mono font-black uppercase tracking-wider rounded-bl-lg flex items-center gap-1 shadow-sm">
                    <Check className="w-2.5 h-2.5 stroke-[4]" />
                    LOCKED
                  </div>
                </div>
              )}

              <div>
                {/* Character Class & Spice Pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-zinc-400 uppercase">
                    {p.characterClass}
                  </span>

                  {/* Spice Level Badge */}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold bg-red-950/80 text-red-400 border border-red-500/40 shadow-sm">
                    <Flame className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />
                    {p.spiceLevel}
                  </span>
                </div>

                {/* Avatar & Icon */}
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-700/80 flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform">
                    {p.avatarEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-extrabold text-sm text-zinc-100 group-hover:text-orange-400 transition-colors line-clamp-1 tracking-tight">
                      {p.name}
                    </h3>
                    <p className="text-[11px] font-mono text-zinc-400 line-clamp-1">
                      {p.role}
                    </p>
                  </div>
                </div>

                {/* Sample Quote in Italics */}
                <div className="p-2.5 rounded-lg bg-black/60 border border-zinc-800/80 text-[11px] text-zinc-300 italic mb-3 relative font-sans leading-relaxed">
                  <Quote className="w-3 h-3 text-zinc-600 absolute top-1.5 right-1.5 opacity-60" />
                  &quot;{p.tagline}&quot;
                </div>
              </div>

              {/* Bottom Specialty Tag */}
              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono">
                <span className="text-zinc-500">ATTACK TYPE</span>
                <span className="font-bold text-orange-400/90 truncate max-w-[130px]">
                  {p.companyBadge}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

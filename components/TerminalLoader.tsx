'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ShieldAlert, Cpu } from 'lucide-react';

const LOADING_COMMANDS = [
  'Scanning for copy-pasted Netflix & MERN Todo clones...',
  "Checking if 'Proficient in C/C++' is an absolute lie...",
  'Calculating TCS Ninja vs Bengaluru Startup probability...',
  'Consulting Sharma Ji Ka Beta for comparison metrics...',
  'Detecting Turbo C++ and MS Office in technical skills...',
  'Searching for active backlogs in Engineering Mathematics II...',
  'Evaluating 2-day GenAI workshop participation certificate...',
  'Analyzing Hinjewadi Phase-3 cafeteria commute resistance...',
  'Measuring LeetCode Hard evasion coefficient...',
  'Formulating high-temperature Desi tech roast...',
];

export function TerminalLoader() {
  const [logs, setLogs] = useState<string[]>([LOADING_COMMANDS[0]]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % LOADING_COMMANDS.length;
        setLogs((prevLogs) => {
          const updated = [...prevLogs, LOADING_COMMANDS[next]];
          if (updated.length > 5) return updated.slice(-5);
          return updated;
        });
        return next;
      });
    }, 800);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xl mx-auto my-6 rounded-2xl bg-[#09090b] border-2 border-zinc-700/80 shadow-2xl shadow-orange-500/10 overflow-hidden font-mono"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600/60" />
          <span className="ml-2 text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-orange-400" />
            cooked-cli — bash (80x24)
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          ANALYZING
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-5 text-xs sm:text-sm space-y-2.5 min-h-[180px] bg-black/80 flex flex-col justify-end">
        <div className="text-zinc-600 text-xs mb-1">
          $ cooked-cli --model=gemini-2.5-flash --strict-schema --target=resume.pdf
        </div>

        {/* Previous completed logs */}
        {logs.slice(0, -1).map((log, index) => (
          <div key={index} className="text-zinc-500 flex items-start gap-2">
            <span className="text-emerald-500/70 select-none">✓</span>
            <span className="line-clamp-1">{log}</span>
          </div>
        ))}

        {/* Active blinking command */}
        <div className="text-orange-400 flex items-start gap-2 font-bold">
          <span className="text-orange-500 select-none">&gt;</span>
          <span className="leading-snug">
            {LOADING_COMMANDS[currentIndex]}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-orange-400 ml-1 translate-y-0.5"
            />
          </span>
        </div>

        <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
          <span>Target: Indian Tech Ecosystem</span>
          <span className="font-mono text-orange-400/80">Buffer: 4096 tokens</span>
        </div>
      </div>
    </motion.div>
  );
}

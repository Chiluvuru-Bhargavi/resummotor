'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';

const LOADING_COMMANDS = [
  'Scanning for copy-pasted YouTube tutorial clones...',
  'Calculating WITCH company bond probability...',
  "Searching for 'Proficient in MS Office & C++' contradictions...",
  'Checking if 4th semester backlogs were cleared...',
  'Running sentiment analysis on 2-day GenAI workshop certificate...',
  'Calculating Koramangala beanbag rejection quotient...',
  'Consulting Sharma Ji Ka Beta for CTC benchmark...',
  'Compiling high-temperature Indian tech roast...',
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
    }, 700);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="w-full max-w-[900px] mx-auto my-8 bg-zinc-900 outline outline-1 outline-orange-500/40 rounded-lg p-6 shadow-2xl font-['IBM_Plex_Mono']"
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="size-2.5 rounded-full bg-red-500/80" />
          <div className="size-2.5 rounded-full bg-amber-500/80" />
          <div className="size-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs text-zinc-400 flex items-center gap-1.5">
            <Terminal className="size-3.5 text-orange-500" />
            cooked-cli v2.5 / EXECUTION RUNTIME
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-orange-500">
          <div className="size-1.5 bg-orange-500 rounded-full animate-ping" />
          <span>ROAST IN PROGRESS</span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="space-y-2 text-xs min-h-[140px] flex flex-col justify-end">
        {logs.slice(0, -1).map((log, index) => (
          <div key={index} className="text-zinc-500 flex items-start gap-2">
            <span className="text-emerald-500 select-none">✓</span>
            <span>{log}</span>
          </div>
        ))}

        {/* Current log */}
        <div className="text-orange-400 flex items-start gap-2 font-semibold">
          <span className="text-orange-500 select-none">&gt;</span>
          <span>
            {LOADING_COMMANDS[currentIndex]}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="inline-block w-1.5 h-3.5 bg-orange-500 ml-1 translate-y-0.5"
            />
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
        <span>Strict Schema: @google/genai (gemini-2.5-flash)</span>
        <span className="text-orange-500/80">Polling Rate: 700ms</span>
      </div>
    </motion.div>
  );
}

export type PersonaId = 'mass-recruiter' | 'startup-cto' | 'faang-bhaiya' | 'placement-hod';

export interface PersonaInfo {
  id: PersonaId;
  name: string;
  role: string;
  tagline: string;
  companyBadge: string;
  avatarEmoji: string;
  accentColor: string;
  description: string;
  sampleQuote: string;
  spiceLevel: string; // e.g. "MILD (1/5)", "EXTRA HOT (4/5)", "NUCLEAR (5/5)", "DESI HOT (3/5)"
  spiceBars: number;  // 1 to 5
}

export interface BulletFix {
  weakOriginal: string;
  strongRewrite: string;
  reason: string;
  // Aliases for compatibility
  original?: string;
  fixed?: string;
  whyItWorks?: string;
}

export interface RoastResult {
  cookedPercentage: number;
  verdictBadge: string;
  predictedCTC: string;
  delusionLevel: 'EXTREME' | 'HIGH' | 'MODERATE' | 'LOW' | string;
  roastParagraph: string;
  redFlags: string[];
  greenFlags: string[];
  bulletFixes: BulletFix[];

  // Compatibility aliases
  verdictTitle?: string;
  predictedPackage?: string;
  roastSummary?: string;
  bulletRewrites?: { original: string; fixed: string; whyItWorks: string }[];
  personaId?: PersonaId;
  targetName?: string;
  sourceType?: 'pdf' | 'github' | 'sample';
  isAIGenerated?: boolean;
  note?: string;
}

export interface RoastRequest {
  text: string;
  persona: PersonaId;
  sourceType: 'pdf' | 'github' | 'sample';
  targetName?: string;
  apiKey?: string;
}

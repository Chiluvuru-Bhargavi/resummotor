export type PersonaId = 'mass-recruiter' | 'startup-cto' | 'faang-bhaiya' | 'placement-hod';

export interface PersonaInfo {
  id: PersonaId;
  name: string;
  role: string;
  tagline: string;
  companyBadge: string;
  avatarEmoji: string;
  accentColor: string;
  borderColor: string;
  bgGlow: string;
  description: string;
  sampleQuote: string;
}

export interface BulletRewrite {
  original: string;
  fixed: string;
  whyItWorks: string;
}

export interface RoastResult {
  cookedPercentage: number;
  verdictTitle: string;
  predictedPackage: string;
  roastSummary: string;
  redFlags: string[];
  greenFlags: string[];
  bulletRewrites: BulletRewrite[];
  personaId?: PersonaId;
  targetName?: string;
  sourceType?: 'pdf' | 'github' | 'sample';
}

export interface RoastRequest {
  text: string;
  persona: PersonaId;
  sourceType: 'pdf' | 'github' | 'sample';
  targetName?: string;
  apiKey?: string;
}

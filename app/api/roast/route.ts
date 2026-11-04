export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { PersonaId, RoastRequest, RoastResult } from '@/lib/types';
import { PERSONAS, PERSONA_PROMPTS } from '@/lib/personas';
import { generateHeuristicRoast } from '@/lib/fallback-roaster';

export async function POST(req: NextRequest) {
  try {
    const body: RoastRequest = await req.json();
    const { text, persona, targetName, sourceType, apiKey: clientApiKey } = body;

    if (!text || text.trim().length < 15) {
      return NextResponse.json(
        { error: 'Extracted text is too short. Please provide a more detailed resume or GitHub profile.' },
        { status: 400 }
      );
    }

    const personaId: PersonaId = PERSONAS[persona] ? persona : 'mass-recruiter';
    const personaMeta = PERSONAS[personaId];
    const personaSystemPrompt = PERSONA_PROMPTS[personaId];

    // Check for API key (Client provided, or process.env.GEMINI_API_KEY)
    const apiKey =
      clientApiKey?.trim() ||
      req.headers.get('x-gemini-key')?.trim() ||
      process.env.GEMINI_API_KEY?.trim();

    // If no API key is provided, gracefully use the dynamic heuristic roast engine
    if (!apiKey) {
      console.log('No GEMINI_API_KEY found, using high-fidelity heuristic fallback roast engine.');
      const fallbackRoast = generateHeuristicRoast(text, personaId, targetName, sourceType);
      return NextResponse.json({
        ...fallbackRoast,
        isAIGenerated: false,
        note: 'Generated using local Indian tech roast engine (Add a Gemini API key for live LLM customization)',
      });
    }

    // Call @google/genai SDK with gemini-2.5-flash and responseSchema
    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
Analyze and roast the following ${sourceType === 'github' ? 'GitHub profile data' : 'tech resume'} strictly in your assigned persona.

PERSONA CONTEXT:
Name/Role: ${personaMeta.name} (${personaMeta.role})
Persona Catchphrase: "${personaMeta.sampleQuote}"
Persona Prompt:
${personaSystemPrompt}

CONTENT TO ROAST:
${text.slice(0, 8000)}

REALISTIC SCORING & CTC CALIBRATION RULES (DO NOT USE HARDCODED DEFAULTS):
- TIER 1: TRULY TERRIBLE / GHOST / ZERO-EFFORT (0-2 repos, 0 stars, 0 followers, all forked repos, or empty/lazy resume):
  * "cookedPercentage": MUST BE 93 to 99 (Completely incinerated).
  * "predictedCTC": MUST BE brutal and low (e.g. "₹0 (ATS Auto-Reject in 0.1s)", "₹1.8 LPA (Non-Voice BPO Night Shift)", "₹0 (Unpaid 16-Hour Intern)", "Debarred by TPO (0 Offers)").
  * "delusionLevel": "EXTREME".
- TIER 2: TUTORIAL HELL / WEAK (calculator, todo, weather app, clones, no metrics, 0-2 stars, basic college tasks):
  * "cookedPercentage": MUST BE 78 to 91.
  * "predictedCTC": ₹2.8 LPA to ₹4.5 LPA (e.g. "₹3.36 LPA (2-Yr Bond)", "₹3.6 LPA + Unlimited ESOPs (Worth ₹0)").
  * "delusionLevel": "HIGH".
- TIER 3: AVERAGE / EMPLOYABLE (real projects, clean code, some stars or work experience, decent tech stack):
  * "cookedPercentage": MUST BE 45 to 68.
  * "predictedCTC": ₹8 LPA to ₹16 LPA (e.g. "₹12 LPA (Junior SDE)", "₹10 LPA + ESOPs").
  * "delusionLevel": "MODERATE" or "LOW".
- TIER 4: TRULY CRACKED / ROCKSTAR (high stars 30+, open source tools, Go/Rust/Docker/K8s/System Design, high LeetCode rating, production scale metrics):
  * "cookedPercentage": MUST BE 10 to 30 (Barely cooked / Actually cracked).
  * "predictedCTC": ₹25 LPA to ₹50+ LPA (e.g. "₹38 LPA (L4 SDE-2)", "₹32 LPA + 0.25% Equity").
  * "delusionLevel": "LOW".

INSTRUCTIONS:
1. "cookedPercentage": Integer from 0 to 100 adhering strictly to the calibration tiers above.
2. "verdictBadge": A punchy, capitalised 3-5 word Indian tech verdict reflecting the true tier.
3. "predictedCTC": A hilarious, realistic Indian tech salary prediction matching the candidate's actual quality and persona.
4. "delusionLevel": One of "EXTREME", "HIGH", "MODERATE", "LOW".
5. "roastParagraph": Exactly 1 brutal, funny Hinglish/Indian tech roast paragraph in your persona's distinctive voice, directly referencing actual data found (or missing) in the profile.
6. "redFlags": Exactly 3 short, brutal one-liners specific to this candidate.
7. "greenFlags": Exactly 2 genuine or funny positive observations.
8. "bulletFixes": Exactly 3 objects containing { "weakOriginal": string, "strongRewrite": string, "reason": string } fixing weak lines with quantified action metrics (STAR format).
`;

      const candidateModels = ['gemini-2.5-flash', 'gemini-3.8-flash'];
      let response: any = null;
      let lastError: any = null;

      for (const model of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction: `You are the world's funniest and most culturally accurate Indian tech resume roaster. You know Indian engineering college culture, mass recruiter culture (TCS, Infosys, Wipro, Cognizant), Bangalore startup culture (Koramangala, Indiranagar, seed funding, p99 latency), FAANG tech lead culture (DSA 450 sheets, LeetCode, STAR method), and strict college Placement Cell HODs (TPO, backlogs, Times New Roman 12pt, debarment). Output MUST strictly conform to the JSON schema.`,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  cookedPercentage: {
                    type: Type.INTEGER,
                    description: 'Score from 0 to 100 where 100 is completely cooked / doomed',
                  },
                  verdictBadge: {
                    type: Type.STRING,
                    description: 'Punchy uppercase verdict badge (e.g. CERTIFIED TUTORIAL HELL)',
                  },
                  predictedCTC: {
                    type: Type.STRING,
                    description: 'Humorous Indian tech CTC prediction (e.g. ₹3.36 LPA (2-Yr Bond))',
                  },
                  delusionLevel: {
                    type: Type.STRING,
                    description: 'Delusion level: EXTREME, HIGH, MODERATE, or LOW',
                  },
                  roastParagraph: {
                    type: Type.STRING,
                    description: '1 punchy paragraph in Indian tech slang/Hinglish matching persona',
                  },
                  redFlags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Exactly 3 short brutal one-liners',
                  },
                  greenFlags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Exactly 2 decent things found',
                  },
                  bulletFixes: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        weakOriginal: { type: Type.STRING },
                        strongRewrite: { type: Type.STRING },
                        reason: { type: Type.STRING },
                      },
                      required: ['weakOriginal', 'strongRewrite', 'reason'],
                    },
                    description: '3 objects fixing weak resume lines with STAR format and metrics',
                  },
                },
                required: [
                  'cookedPercentage',
                  'verdictBadge',
                  'predictedCTC',
                  'delusionLevel',
                  'roastParagraph',
                  'redFlags',
                  'greenFlags',
                  'bulletFixes',
                ],
              },
            },
          });

          if (response?.text) {
            break;
          }
        } catch (mErr: any) {
          lastError = mErr;
          console.warn(`Model ${model} request failed:`, mErr?.message || mErr);
        }
      }

      if (!response?.text) {
        throw lastError || new Error('Empty response received from Gemini API');
      }

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response received from Gemini API');
      }

      const parsed: any = JSON.parse(responseText);

      // Add compatibility fields
      const result: RoastResult = {
        ...parsed,
        verdictTitle: parsed.verdictBadge,
        predictedPackage: parsed.predictedCTC,
        roastSummary: parsed.roastParagraph,
        bulletRewrites: parsed.bulletFixes?.map((b: any) => ({
          original: b.weakOriginal,
          fixed: b.strongRewrite,
          whyItWorks: b.reason,
        })) || [],
        personaId,
        targetName: targetName || 'Candidate',
        sourceType,
        isAIGenerated: true,
      };

      return NextResponse.json(result);
    } catch (apiError: any) {
      console.warn('Gemini API call failed, falling back to heuristic roaster:', apiError?.message || apiError);
      const fallbackRoast = generateHeuristicRoast(text, personaId, targetName, sourceType);
      return NextResponse.json({
        ...fallbackRoast,
        isAIGenerated: false,
        note: `API error encountered (${apiError?.message || 'Rate limit/Quota'}), served via intelligent fallback engine.`,
      });
    }
  } catch (err: any) {
    console.error('Server error in /api/roast:', err);
    return NextResponse.json(
      { error: err.message || 'Internal server error while roasting' },
      { status: 500 }
    );
  }
}

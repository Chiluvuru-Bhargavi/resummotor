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

INSTRUCTIONS:
1. "cookedPercentage": Integer from 0 to 100 representing how cooked/doomed this profile is.
2. "verdictBadge": A punchy, capitalised 3-5 word Indian tech verdict (e.g. "CERTIFIED TUTORIAL HELL", "MASS RECRUITER BAIT", "ACTUALLY CRACKED", "NOTICE PERIOD FUGITIVE").
3. "predictedCTC": A hilarious Indian tech salary prediction (e.g. "₹3.36 LPA (2-Yr Bond)", "₹4.5 LPA + Beanbag", "₹18 LPA + 0.001% ESOPs", "Debarred by TPO").
4. "delusionLevel": One of "EXTREME", "HIGH", "MODERATE", "LOW".
5. "roastParagraph": Exactly 1 brutal, funny Hinglish/Indian tech roast paragraph in your persona's distinctive voice.
6. "redFlags": Exactly 3 short, brutal one-liners.
7. "greenFlags": Exactly 2 things that are actually decent.
8. "bulletFixes": Exactly 3 objects containing { "weakOriginal": string, "strongRewrite": string, "reason": string } fixing weak lines with quantified action metrics (STAR format).
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
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

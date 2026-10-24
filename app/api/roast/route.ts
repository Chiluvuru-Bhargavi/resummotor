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
Persona Slogan: ${personaMeta.tagline}
Persona Prompt:
${personaSystemPrompt}

CONTENT TO ROAST:
${text.slice(0, 8000)}

INSTRUCTIONS:
1. Provide a "cookedPercentage" from 0 to 100 representing how cooked/doomed this profile is (higher = more cooked, typically 65 to 98 for typical Indian engineering graduates).
2. "verdictTitle": A funny, brutal 3-6 word Indian tech verdict title (e.g. "Certified Tutorial Hell Resident", "Mass Recruiter Day-1 Bait", "Indiranagar Coffee Rejection", "Notice Period Fugitive").
3. "predictedPackage": A hilarious, culturally accurate Indian tech salary prediction (e.g. "₹3.36 LPA with 2-year bond & 90-day notice period", "₹4.5 LPA + 0.0001% phantom ESOPs", "Debarred from campus placement").
4. "roastSummary": Exactly 1 punchy, funny, brutally honest paragraph in Indian tech slang / Hinglish-flavored English matching your persona.
5. "redFlags": Exactly 3 short, brutal one-liners about their specific projects/skills/habits mentioned in the text.
6. "greenFlags": Exactly 1 or 2 genuine, decent things about their profile.
7. "bulletRewrites": Exactly 3 objects containing { original: string, fixed: string, whyItWorks: string }. Take the weakest lines from their content and genuinely transform them into punchy, high-impact resume bullets using action verbs and quantified metrics (STAR format).
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: `You are the world's funniest and most culturally accurate Indian tech resume roaster. You know Indian engineering college culture, mass recruiter culture (TCS, Infosys, Wipro, Cognizant), Bangalore startup culture (Koramangala, Indiranagar, seed funding, p99 latency), FAANG bhaiya/didi culture (DSA 450 sheets, LeetCode, STAR method), and strict college Placement Cell HODs (TPO, backlogs, Times New Roman 12pt, debarment). Output MUST strictly conform to the JSON schema.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cookedPercentage: {
                type: Type.INTEGER,
                description: 'Score from 0 to 100 where 100 is completely cooked / doomed',
              },
              verdictTitle: {
                type: Type.STRING,
                description: 'Brutal, humorous 3-6 word verdict title',
              },
              predictedPackage: {
                type: Type.STRING,
                description: 'Humorous Indian tech package prediction (e.g. ₹3.36 LPA with bond)',
              },
              roastSummary: {
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
                description: '1-2 decent things found',
              },
              bulletRewrites: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    original: { type: Type.STRING },
                    fixed: { type: Type.STRING },
                    whyItWorks: { type: Type.STRING },
                  },
                  required: ['original', 'fixed', 'whyItWorks'],
                },
                description: '3 objects fixing weak resume lines with STAR format and metrics',
              },
            },
            required: [
              'cookedPercentage',
              'verdictTitle',
              'predictedPackage',
              'roastSummary',
              'redFlags',
              'greenFlags',
              'bulletRewrites',
            ],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response received from Gemini API');
      }

      const parsed: RoastResult = JSON.parse(responseText);
      return NextResponse.json({
        ...parsed,
        personaId,
        targetName: targetName || 'Candidate',
        sourceType,
        isAIGenerated: true,
      });
    } catch (apiError: any) {
      console.warn('Gemini API call failed, falling back to heuristic roaster:', apiError?.message || apiError);
      // Fallback seamlessly so user experience never breaks
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

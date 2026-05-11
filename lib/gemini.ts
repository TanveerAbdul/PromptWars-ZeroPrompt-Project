import { GoogleGenerativeAI } from "@google/generative-ai";
import { AnalysisResult } from "@/types";

// ── Model cascade (ordered by availability and performance) ──────────────────
const GEMINI_MODELS = [
  "gemini-3-flash-preview", // Latest and likely has fresh quota
  "gemini-2.5-flash",       // Mid-tier fallback
  "gemini-flash-latest",    // Alias for the latest stable flash
  "gemini-2.0-flash",       // Previous version
];

// ── Hidden system prompt builder ──────────────────────────────────────────────
function buildHiddenPrompt(resumeText: string): string {
  return `You are an elite ATS (Applicant Tracking System) specialist and career coach with 20+ years of experience helping candidates land roles at FAANG and top-tier companies. You are analyzing a resume automatically — the user has NOT written any prompt; you must infer everything from the resume text alone.

Resume Text (auto-extracted):
---
${resumeText.slice(0, 5000)}
---

Analyze this resume comprehensively and return ONLY a valid JSON object (no markdown, no code fences, no extra text) with this exact structure:

{
  "detectedRole": "The most specific likely current or target job title based on skills, experience, and education (e.g., 'Senior Frontend Engineer', 'Data Scientist', 'Product Manager')",
  "atsScore": <integer 0-100 representing ATS friendliness>,
  "summary": "A 2-3 sentence sharp professional summary highlighting the candidate's strongest value proposition",
  "candidateStrengths": [
    "Specific strength with evidence from the resume",
    "Specific strength with evidence from the resume",
    "Specific strength with evidence from the resume",
    "Specific strength with evidence from the resume",
    "Specific strength with evidence from the resume"
  ],
  "missingSkills": [
    "Critical skill missing for their target role",
    "Critical skill missing for their target role",
    "Critical skill missing for their target role",
    "Critical skill missing for their target role"
  ],
  "recommendedTechnologies": [
    "Technology 1",
    "Technology 2",
    "Technology 3",
    "Technology 4",
    "Technology 5"
  ],
  "interviewQuestions": [
    { "question": "Specific technical question based on their listed skills", "category": "Technical" },
    { "question": "Behavioral question targeting a gap you noticed", "category": "Behavioral" },
    { "question": "Situational question relevant to their target role", "category": "Situational" },
    { "question": "Deep technical question on their strongest area", "category": "Technical" },
    { "question": "Leadership or collaboration question", "category": "Behavioral" }
  ],
  "careerRoadmap": [
    {
      "phase": "Immediate Actions",
      "duration": "0–3 months",
      "goals": ["Actionable goal 1", "Actionable goal 2", "Actionable goal 3"]
    },
    {
      "phase": "Short-Term Growth",
      "duration": "3–6 months",
      "goals": ["Skill or certification to acquire", "Project to build", "Network milestone"]
    },
    {
      "phase": "Career Acceleration",
      "duration": "6–12 months",
      "goals": ["Senior milestone or promotion target", "Contribution goal", "Industry recognition goal"]
    }
  ],
  "resumeImprovements": [
    "Specific, actionable improvement with exact instruction",
    "Specific, actionable improvement with exact instruction",
    "Specific, actionable improvement with exact instruction",
    "Specific, actionable improvement with exact instruction",
    "Specific, actionable improvement with exact instruction"
  ]
}`;
}

// ── Gemini analysis function with model cascade ───────────────────────────────
export async function analyzeResume(
  resumeText: string,
  apiKey: string
): Promise<AnalysisResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const prompt = buildHiddenPrompt(resumeText);

  console.log(
    `[Gemini] Resume text length: ${resumeText.length} characters`
  );
  console.log(`[Gemini] Will try models in order:`, GEMINI_MODELS);

  let lastError = "AI analysis temporarily unavailable. Please try again.";

  // Try each model in cascade order
  for (const modelName of GEMINI_MODELS) {
    console.log(`[Gemini] Trying model: ${modelName}`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const raw = result.response.text();

      console.log(
        `[Gemini] ✓ Response from ${modelName} — ${raw.length} chars`
      );
      console.log(`[Gemini] Preview:`, raw.slice(0, 150));

      // Strip markdown code fences if present
      const cleaned = raw
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/g, "")
        .trim();

      // Extract JSON object
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error(`[Gemini] No JSON found in response from ${modelName}`);
        lastError = "AI returned an unexpected format. Please try again.";
        continue; // Try next model
      }

      let analysis: AnalysisResult;
      try {
        analysis = JSON.parse(jsonMatch[0]) as AnalysisResult;
      } catch {
        console.error(`[Gemini] JSON parse failed for ${modelName}`);
        lastError = "AI response could not be parsed. Please try again.";
        continue; // Try next model
      }

      // Validate required fields
      const requiredFields: (keyof AnalysisResult)[] = [
        "detectedRole",
        "atsScore",
        "summary",
        "candidateStrengths",
        "missingSkills",
        "recommendedTechnologies",
        "interviewQuestions",
        "careerRoadmap",
        "resumeImprovements",
      ];

      let missingField: string | null = null;
      for (const field of requiredFields) {
        if (!(field in analysis)) {
          missingField = field;
          break;
        }
      }
      if (missingField) {
        console.error(`[Gemini] Missing field "${missingField}" from ${modelName}`);
        lastError = `AI response incomplete. Please try again.`;
        continue; // Try next model
      }

      // Clamp ATS score
      analysis.atsScore = Math.max(
        0,
        Math.min(100, Number(analysis.atsScore) || 0)
      );

      console.log(
        `[Gemini] ✅ Success with ${modelName}. Role: ${analysis.detectedRole}, ATS: ${analysis.atsScore}`
      );
      return analysis;
    } catch (apiErr) {
      const msg = apiErr instanceof Error ? apiErr.message : String(apiErr);
      console.warn(`[Gemini] ✗ ${modelName} failed:`, msg);

      // Classify the error
      if (msg.includes("API_KEY_INVALID") || msg.includes("401")) {
        // Bad key — no point trying other models
        throw new Error(
          "Invalid Gemini API key. Please check your configuration."
        );
      }
      if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
        lastError = "Gemini API quota exceeded. Please try again in a few minutes.";
        console.warn(`[Gemini] Quota exceeded on ${modelName}, trying next...`);
        continue; // Try next model
      }
      if (msg.includes("404") || msg.toLowerCase().includes("not found")) {
        lastError = "Gemini model unavailable. Trying fallback...";
        console.warn(`[Gemini] Model not found: ${modelName}, trying next...`);
        continue; // Try next model
      }

      // Unknown error — try next model
      lastError = "AI analysis temporarily unavailable. Please try again.";
      continue;
    }
  }

  // All models exhausted
  console.error("[Gemini] All models failed. Last error:", lastError);
  throw new Error(lastError);
}


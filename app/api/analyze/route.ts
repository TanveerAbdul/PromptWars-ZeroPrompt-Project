import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";
import { analyzeResume } from "@/lib/gemini";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  // ── 1. Verify API key is configured ────────────────────────────────────────
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[/api/analyze] GEMINI_API_KEY is not set in .env.local");
    return NextResponse.json(
      { error: "Server configuration error. GEMINI_API_KEY is missing." },
      { status: 500 }
    );
  }
  console.log("[/api/analyze] GEMINI_API_KEY loaded ✓");

  // ── 2. Parse incoming form data ─────────────────────────────────────────────
  let file: File | null = null;
  try {
    const formData = await request.formData();
    file = formData.get("resume") as File | null;
  } catch {
    return NextResponse.json(
      { error: "Failed to read uploaded file." },
      { status: 400 }
    );
  }

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  // ── 3. Validate file ────────────────────────────────────────────────────────
  if (file.type !== "application/pdf") {
    return NextResponse.json(
      { error: "Please upload a PDF file." },
      { status: 400 }
    );
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json(
      { error: "File is too large. Maximum size is 10MB." },
      { status: 400 }
    );
  }
  console.log(
    `[/api/analyze] File received: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)`
  );

  // ── 4. Extract text from PDF ────────────────────────────────────────────────
  let resumeText: string;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("[/api/analyze] Parsing PDF...");
    const pdfData = await pdf(buffer);
    resumeText = pdfData.text?.trim() ?? "";
    console.log(
      `[/api/analyze] PDF parsed. Extracted ${resumeText.length} characters.`
    );
  } catch (pdfErr) {
    console.error("[/api/analyze] PDF parse error:", pdfErr);
    return NextResponse.json(
      {
        error:
          "Failed to read your PDF. Please ensure it is not password-protected or a scanned image.",
      },
      { status: 400 }
    );
  }

  if (!resumeText || resumeText.length < 50) {
    console.warn("[/api/analyze] Extracted text too short:", resumeText.length);
    return NextResponse.json(
      {
        error:
          "Could not extract readable text from this PDF. Please ensure it contains selectable text (not a scanned image).",
      },
      { status: 400 }
    );
  }

  // ── 5. Call Gemini via lib/gemini.ts ────────────────────────────────────────
  try {
    const analysis = await analyzeResume(resumeText, apiKey);
    console.log("[/api/analyze] Success — returning analysis to client.");
    return NextResponse.json(analysis);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "AI analysis temporarily unavailable. Please try again.";
    console.error("[/api/analyze] Gemini error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

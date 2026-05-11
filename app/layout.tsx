import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptLess AI — Zero-Prompt Career Assistant",
  description:
    "Upload your resume. Let AI handle the rest. Zero-Prompt AI Career Assistant powered by Gemini. Built for PromptWars @ Ascent 2026.",
  keywords: [
    "AI career assistant",
    "resume analyzer",
    "ATS score",
    "zero-prompt AI",
    "Gemini AI",
    "PromptWars",
  ],
  openGraph: {
    title: "PromptLess AI — Zero-Prompt Career Assistant",
    description: "Upload your resume. Let AI handle the rest.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

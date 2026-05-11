# PromptLess AI — Zero-Prompt Career Assistant

> **PromptWars @ Ascent 2026 | Problem Statement 3: Zero-Prompt AI — AI That Just Works**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini-1.5_Flash-8B5CF6?logo=google)](https://ai.google.dev)

---

## 🎯 Problem Statement

Traditional AI tools require users to write prompts — a skill most people don't have. This excludes millions from the benefits of AI. Users type something vague, get a bad result, and conclude "AI doesn't work."

## 💡 Solution

**PromptLess AI** removes prompting entirely. Users upload their résumé PDF. That's it. Gemini AI automatically infers intent, extracts context, and generates a complete career analysis — no text input required.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 Role Detection | AI predicts your most likely job title |
| 📊 ATS Score | Measures how ATS-friendly your résumé is |
| 💪 Strengths Analysis | Highlights your top professional strengths |
| 🔍 Skills Gap | Identifies what you're missing for your target role |
| 🚀 Tech Recommendations | Suggests technologies to learn next |
| 🎤 Interview Questions | Generates custom, relevant interview Q&A |
| 🗺️ Career Roadmap | 3-phase roadmap with actionable milestones |
| ✏️ Resume Tips | Specific, actionable improvement suggestions |

---

## 🏗️ Architecture — Zero-Prompt Design

```
User uploads PDF (no text input required)
        ↓
Next.js API Route (server-side)
        ↓
pdf-parse → extracts raw text
        ↓
Hidden System Prompt constructed programmatically
        ↓
Gemini 1.5 Flash → structured JSON analysis
        ↓
Beautiful card dashboard rendered
```

> **The user never writes a prompt. All AI context is inferred from the resume.**

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 1.5 Flash (`@google/generative-ai`)
- **PDF Parsing**: `pdf-parse` (server-side)
- **Hosting**: Vercel (recommended)

---

## 🚀 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/PromptWars-ZeroPrompt-Project.git
cd PromptWars-ZeroPrompt-Project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

> Get your free Gemini API key at [aistudio.google.com](https://aistudio.google.com)

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npx vercel --prod
```

Add `GEMINI_API_KEY` as an environment variable in your Vercel project settings.

---

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles & animations
│   ├── layout.tsx           # Root layout & SEO metadata
│   ├── page.tsx             # Main page (state machine)
│   └── api/analyze/
│       └── route.ts         # PDF parse + Gemini API handler
├── components/
│   ├── HeroSection.tsx      # Hero with gradient & animations
│   ├── UploadSection.tsx    # Drag-and-drop PDF upload
│   ├── LoadingState.tsx     # Animated loading steps
│   └── ResultsDashboard.tsx # Full analysis dashboard
├── types/
│   └── index.ts             # TypeScript interfaces
├── .env.example             # Environment variable template
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📸 Screenshots

> *(Add screenshots here after running the app)*

---

## 🔮 Future Scope

- [ ] LinkedIn summary auto-generator
- [ ] Cover letter generation
- [ ] Job description matching (upload JD + resume)
- [ ] PDF download of full report
- [ ] Multi-language support
- [ ] Voice-based résumé input

---

## 👥 Team

Built for **PromptWars @ Ascent 2026** under Problem Statement 3: *Zero-Prompt AI — AI That Just Works*.

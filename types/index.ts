export interface InterviewQuestion {
  question: string;
  category: "Technical" | "Behavioral" | "Situational";
}

export interface RoadmapPhase {
  phase: string;
  duration: string;
  goals: string[];
}

export interface AnalysisResult {
  detectedRole: string;
  atsScore: number;
  summary: string;
  candidateStrengths: string[];
  missingSkills: string[];
  recommendedTechnologies: string[];
  interviewQuestions: InterviewQuestion[];
  careerRoadmap: RoadmapPhase[];
  resumeImprovements: string[];
}

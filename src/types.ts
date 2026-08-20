export type ViewMode =
  | 'jobs'
  | 'resume-ats'
  | 'interview-coach'
  | 'applications-tracker'
  | 'salary-radar'
  | 'career-roadmap';

export interface Job {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'On-site';
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Staff / Principal';
  salaryMin: number;
  salaryMax: number;
  currency: string;
  tags: string[];
  department: string;
  postedAt: string;
  featured?: boolean;
  applicantsCount: number;
  matchScore?: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  companyInsights: {
    culture: string;
    interviewRounds: number;
    interviewDifficulty: 'Low' | 'Medium' | 'High' | 'Very High';
    avgResponseDays: number;
    glassdoorRating: number;
    size: string;
  };
}

export interface CandidateExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface CandidateEducation {
  id: string;
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export interface CandidateProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  link?: string;
  impactMetrics?: string;
}

export interface CandidateProfile {
  id: string;
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  summary: string;
  skills: string[];
  yearsExperience: number;
  targetRole: string;
  targetSalary: number;
  preferredWorkplace: 'Remote' | 'Hybrid' | 'On-site' | 'Any';
  experiences: CandidateExperience[];
  education: CandidateEducation[];
  projects: CandidateProject[];
  certifications: string[];
}

export interface ATSBulletImprovement {
  original: string;
  improved: string;
  reason: string;
}

export interface ATSAnalysisResult {
  score: number;
  breakdown: {
    keywordOptimization: number;
    formattingStructure: number;
    impactQuantification: number;
    actionVerbs: number;
    brevityClarity: number;
  };
  missingKeywords: string[];
  strongKeywords: string[];
  issues: string[];
  recommendations: string[];
  bulletImprovements: ATSBulletImprovement[];
}

export type ApplicationStatus =
  | 'saved'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'final'
  | 'offer'
  | 'rejected';

export interface ApplicationContact {
  name: string;
  role: string;
  email?: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  location: string;
  salaryOffered?: string;
  status: ApplicationStatus;
  appliedDate: string;
  lastUpdated: string;
  nextStepDate?: string;
  nextStepLabel?: string;
  notes: string;
  matchScore: number;
  coverLetterGenerated?: string;
  tailoredSummary?: string;
  contacts?: ApplicationContact[];
}

export interface InterviewQuestion {
  id: string;
  question: string;
  context: string;
  idealKeyPoints: string[];
  candidateAnswer?: string;
  feedback?: {
    score: number;
    scoreCategory: string;
    strengths: string[];
    improvements: string[];
    starRubric?: {
      situation: string;
      task: string;
      action: string;
      result: string;
    };
    modelAnswer: string;
  };
}

export interface MockInterviewSession {
  id: string;
  role: string;
  category: 'Behavioral STAR' | 'System Architecture' | 'Coding & Algorithms' | 'Engineering Leadership' | 'Product Sense';
  difficulty: 'Entry' | 'Mid' | 'Senior' | 'Staff / Principal';
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  overallScore?: number;
  completed: boolean;
  date: string;
}

export interface SalaryBenchmark {
  role: string;
  level: string;
  location: string;
  baseAvg: number;
  bonusAvg: number;
  equityAvg: number;
  totalAvg: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  demandRating: 'Very High' | 'High' | 'Moderate';
  sampleCount: number;
}

export interface OfferEvaluationInput {
  role: string;
  location: string;
  yearsExperience: number;
  base: number;
  bonus: number;
  equity: number;
  signOn: number;
  competingOffers?: string;
}

export interface CareerRoadmapPhase {
  phase: string;
  focus: string;
  actionItems: string[];
  keyMilestone: string;
}

export interface CareerRoadmapResult {
  summary: string;
  phases: CareerRoadmapPhase[];
  topSkillsToAcquire: string[];
  recommendedCertifications: string[];
}

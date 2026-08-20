import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI client
const getAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health check
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// 1. AI Job Matching Endpoint
app.post("/api/ai/job-match", async (req: Request, res: Response) => {
  try {
    const { profile, job } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Fallback smart calculation if API key is not yet set
      const profileSkills = (profile.skills || []).map((s: string) => s.toLowerCase());
      const jobTags = (job.tags || []).map((t: string) => t.toLowerCase());
      const matched = jobTags.filter((t: string) => profileSkills.some((s: string) => s.includes(t) || t.includes(s)));
      const missing = jobTags.filter((t: string) => !matched.includes(t));
      const score = Math.min(96, Math.max(60, Math.round((matched.length / (jobTags.length || 1)) * 40 + 55)));

      return res.json({
        matchScore: score,
        strengths: [
          `Strong alignment in core stack: ${matched.slice(0, 3).join(", ") || "Technical background"}`,
          `Experience profile meets ${job.level || "mid-level"} requirements`,
          `Domain alignment with ${job.company} industry sector`,
        ],
        missingSkills: missing.slice(0, 4),
        recommendations: [
          `Highlight experience with ${missing[0] || "scalable cloud architectures"} in resume summary`,
          `Quantify impact metrics for recent ${job.title} related projects`,
        ],
        talkingPoints: [
          `Discuss your track record in cross-functional team delivery`,
          `Emphasize problem solving in high-throughput environments`,
        ],
      });
    }

    const prompt = `You are an elite career matching AI engine. Analyze the candidate's profile against the target job posting and provide a high-precision match score and structured insights.
    
Candidate Profile:
${JSON.stringify(profile, null, 2)}

Target Job Posting:
${JSON.stringify(job, null, 2)}

Respond ONLY with valid JSON matching this exact structure:
{
  "matchScore": number (integer between 50 and 99),
  "strengths": string[] (3-4 bullet points highlighting specific match strengths),
  "missingSkills": string[] (2-4 key keywords or qualifications missing or light in the profile),
  "recommendations": string[] (2-3 concrete tips to increase interview probability for this specific role),
  "talkingPoints": string[] (2-3 tailored interview elevator pitch points for this company)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/job-match:", error);
    res.status(500).json({
      error: "Failed to evaluate job match",
      message: error?.message || "Internal server error",
    });
  }
});

// 2. AI Resume ATS Analysis Endpoint
app.post("/api/ai/analyze-resume", async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        score: 84,
        breakdown: {
          keywordOptimization: 86,
          formattingStructure: 92,
          impactQuantification: 78,
          actionVerbs: 85,
          brevityClarity: 80,
        },
        missingKeywords: ["Distributed Systems", "CI/CD Pipeline", "Kubernetes", "Latency Optimization"],
        strongKeywords: ["TypeScript", "React", "Node.js", "System Architecture", "Performance Tuning"],
        issues: [
          "Several bullet points lack quantifiable business metrics (%, $, time saved)",
          "Summary section can be tailored more aggressively towards executive/staff impact",
        ],
        recommendations: [
          "Apply the STAR (Situation, Task, Action, Result) methodology across all work experience bullets",
          "Ensure every engineering accomplishment includes measurable revenue or latency outcomes",
          "Front-load strong action verbs like 'Architected', 'Spearheaded', 'Optimized'",
        ],
        bulletImprovements: [
          {
            original: "Worked on frontend and improved website loading speed for users.",
            improved: "Spearheaded frontend architecture overhaul utilizing code-splitting and asset optimization, reducing LCP by 42% and boosting conversion by 14%.",
            reason: "Replaces passive 'worked on' with active verb 'Spearheaded' and adds quantifiable 42% latency and 14% conversion metrics.",
          },
          {
            original: "Built APIs and managed backend databases for user accounts.",
            improved: "Architected fault-tolerant RESTful microservices and PostgreSQL data models handling 2.5M+ daily requests with 99.98% uptime.",
            reason: "Quantifies scale (2.5M+ daily requests, 99.98% uptime) and specifies technology depth.",
          },
        ],
      });
    }

    const prompt = `You are a world-class ATS (Applicant Tracking System) and executive recruiter resume auditor.
Analyze the following candidate resume for the target role "${targetRole || 'Software Engineering / Tech Professional'}".

Resume Content:
${resumeText}

Provide an exhaustive, realistic ATS score evaluation and line-by-line bullet improvements.
Respond ONLY with valid JSON in this exact schema:
{
  "score": number (integer between 40 and 98),
  "breakdown": {
    "keywordOptimization": number (0-100),
    "formattingStructure": number (0-100),
    "impactQuantification": number (0-100),
    "actionVerbs": number (0-100),
    "brevityClarity": number (0-100)
  },
  "missingKeywords": string[],
  "strongKeywords": string[],
  "issues": string[],
  "recommendations": string[],
  "bulletImprovements": [
    {
      "original": string,
      "improved": string,
      "reason": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/analyze-resume:", error);
    res.status(500).json({ error: "Failed to analyze resume", message: error?.message });
  }
});

// 3. AI Resume Tailor Endpoint
app.post("/api/ai/tailor-resume", async (req: Request, res: Response) => {
  try {
    const { resumeText, jobDescription, targetCompany } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        tailoredSummary: `Accomplished and high-impact technology leader with proven track record delivering scalable solutions. Expert in modern architectures, distributed data systems, and driving high-velocity team execution aligned with ${targetCompany || "high-growth enterprise"} engineering standards.`,
        tailoredBullets: [
          "Architected high-throughput services scaling to 5M+ monthly active users with sub-50ms p99 latency.",
          "Led cross-functional migration to modern microservices, improving deployment frequency by 3x and developer velocity by 35%.",
          "Engineered intelligent data caching and real-time processing pipelines reducing cloud compute expenditures by $120K annually.",
        ],
        atsKeywordsInjected: ["Microservices", "High-Throughput", "Cloud Architecture", "Performance Optimization", "Scalability"],
        matchDelta: "+18% ATS Match Increase",
      });
    }

    const prompt = `You are an expert executive resume writer. Tailor the candidate's resume content specifically to align with this target job description and company.
    
Target Company: ${targetCompany || "Target Employer"}
Job Description:
${jobDescription}

Candidate Resume:
${resumeText}

Generate optimized tailored content with high-keyword relevance and STAR-format impact.
Respond ONLY in JSON format:
{
  "tailoredSummary": string,
  "tailoredBullets": string[],
  "atsKeywordsInjected": string[],
  "matchDelta": string (e.g. "+22% ATS Match Increase")
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/tailor-resume:", error);
    res.status(500).json({ error: "Failed to tailor resume", message: error?.message });
  }
});

// 4. AI Cover Letter Generator Endpoint
app.post("/api/ai/generate-cover-letter", async (req: Request, res: Response) => {
  try {
    const { profile, job, tone } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        subject: `Application for ${job.title} - ${profile.fullName || "Candidate"}`,
        coverLetter: `Dear Hiring Team at ${job.company},

I am writing to express my enthusiastic interest in the ${job.title} position. Having followed ${job.company}'s recent innovations, I have been deeply impressed by your commitment to technical excellence and user-centric product engineering.

With my background in ${profile.skills?.slice(0, 4).join(", ") || "full-stack software engineering and scalable systems"}, I have consistently spearheaded projects that blend robust architectural design with measurable business outcomes. In my previous roles, I led high-impact initiatives that improved system throughput by over 40% while mentoring high-performing engineering squads.

The opportunity to contribute to ${job.company}'s mission excites me, particularly given your focus on ${job.tags?.[0] || "scalable cloud systems"}. My experience in driving high-velocity development and cross-functional collaboration aligns seamlessly with the requirements of your team.

Thank you for your time and consideration. I welcome the opportunity to discuss how my technical expertise and problem-solving mindset can contribute to ${job.company}'s continued success.

Warm regards,

${profile.fullName || "Your Candidate"}
${profile.email || ""} | ${profile.phone || ""}`,
        keyHighlights: [
          "Direct alignment with target tech stack and engineering standards",
          "Quantified business results and leadership impact",
          "Personalized narrative addressing company mission",
        ],
      });
    }

    const prompt = `Write a persuasive, highly tailored, non-generic cover letter for this candidate applying to this job.
Tone style: ${tone || "Confident & Results-Oriented"} (options: Confident, Executive, Technical, Storyteller, Concise).

Candidate Profile:
${JSON.stringify(profile, null, 2)}

Job Details:
${JSON.stringify(job, null, 2)}

Respond ONLY with valid JSON:
{
  "subject": string,
  "coverLetter": string,
  "keyHighlights": string[] (3 bullet points of what makes this letter stand out)
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/generate-cover-letter:", error);
    res.status(500).json({ error: "Failed to generate cover letter", message: error?.message });
  }
});

// 5. AI Interview Coach & Grading Endpoint
app.post("/api/ai/interview-chat", async (req: Request, res: Response) => {
  try {
    const { role, questionType, question, candidateAnswer, history, difficulty } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        feedback: {
          score: 88,
          scoreCategory: "Strong Hire",
          strengths: [
            "Good articulation of technical tradeoffs and architecture choices",
            "Clear structure addressing the core problem parameters",
            "Effective mention of monitoring and scalability considerations",
          ],
          improvements: [
            "Could quantify exact latency metrics or scale limits more specifically",
            "Include a brief mention of failure recovery/fallback scenarios",
          ],
          starRubric: {
            situation: "Clear context established",
            task: "Explicitly identified core engineering challenge",
            action: "Detailed technical steps taken",
            result: "Solid outcome, could emphasize business metric delta more",
          },
          modelAnswer: `In my previous role at a high-scale platform, we faced a similar challenge when API latency spiked during traffic surges. As the technical lead, my objective was to reduce p99 latency below 100ms without tripling infrastructure costs. I spearheaded the implementation of a distributed Redis caching layer with optimistic cache warming and partitioned PostgreSQL queries. As a result, we reduced p99 latency by 58% (from 240ms to 98ms) and absorbed a 3x holiday traffic surge with zero downtime.`,
        },
        nextFollowUpQuestion: `That was a solid breakdown. How would you handle cache invalidation and consistency across multiple availability zones under high write volume in that system?`,
      });
    }

    const prompt = `You are a Principal Hiring Bar Raiser and Senior Interviewer conducting a mock interview for the role of "${role || 'Staff Software Engineer'}".
Question Category: ${questionType || 'Behavioral / Technical System Design'}
Difficulty: ${difficulty || 'Mid-Senior Level'}

Interview Question Asked:
"${question}"

Candidate's Answer:
"${candidateAnswer}"

Previous Interview Context / History:
${JSON.stringify(history || [], null, 2)}

Provide an incisive, realistic critique, grading score (0-100), STAR evaluation, a gold-standard model answer, and the next smart follow-up question.
Respond ONLY with valid JSON:
{
  "feedback": {
    "score": number (0-100),
    "scoreCategory": string ("Strong Hire" | "Hire" | "Leaning Hire" | "Needs Practice"),
    "strengths": string[] (2-3 key strengths),
    "improvements": string[] (2-3 actionable improvements),
    "starRubric": {
      "situation": string,
      "task": string,
      "action": string,
      "result": string
    },
    "modelAnswer": string
  },
  "nextFollowUpQuestion": string
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/interview-chat:", error);
    res.status(500).json({ error: "Failed to evaluate interview answer", message: error?.message });
  }
});

// 6. AI Salary Negotiation & Compensation Strategizer Endpoint
app.post("/api/ai/salary-negotiate", async (req: Request, res: Response) => {
  try {
    const { role, location, currentOffer, competingOffers, experienceYears } = req.body;
    const ai = getAIClient();

    if (!ai) {
      const base = currentOffer?.base || 165000;
      const targetBase = Math.round(base * 1.14);
      const targetEquity = Math.round((currentOffer?.equity || 50000) * 1.25);
      const signOn = currentOffer?.signOn || 20000;

      return res.json({
        marketAnalysis: {
          percentile: "62nd percentile for " + location,
          marketRange: `$${Math.round(base * 0.95).toLocaleString()} - $${Math.round(base * 1.28).toLocaleString()}`,
          negotiationLeverage: "High - strong candidate profile with competing demand in tech hub",
        },
        counterOfferTarget: {
          base: targetBase,
          bonus: currentOffer?.bonus || Math.round(targetBase * 0.15),
          equity: targetEquity,
          signOn: Math.max(signOn, 25000),
          totalComp: targetBase + (currentOffer?.bonus || Math.round(targetBase * 0.15)) + targetEquity + Math.max(signOn, 25000),
        },
        strategyPoints: [
          "Anchor your counter on market median compensation for tier-1 tech firms in " + location,
          "Leverage your specialized background in system architecture to justify top of band",
          "Propose flexibility on equity vesting or sign-on if base is constrained by band caps",
        ],
        emailScripts: {
          enthusiasticCounter: `Hi [Recruiter Name],

Thank you so much for extending the offer to join [Company] as ${role}! I am genuinely excited about the team's roadmap and the impact I can make on the product.

I've carefully reviewed the total compensation package. Based on my ${experienceYears || "6+"} years of specialized experience in high-throughput systems and current market benchmarks for this level in ${location}, I was targeting a base salary of $${targetBase.toLocaleString()} and an initial equity grant of $${targetEquity.toLocaleString()} over 4 years.

If we can bridge this difference to reach $${targetBase.toLocaleString()} base with a $${Math.max(signOn, 25000).toLocaleString()} sign-on bonus, I would be thrilled to sign immediately and decline other ongoing interview loops.

Looking forward to hearing your thoughts on how we can make this work!

Best regards,
[Your Name]`,
          competingOfferLeverage: `Hi [Recruiter Name],

I am really enthusiastic about the team at [Company] and believe this is where I can do my best work. 

I wanted to share transparently that I have received another offer at a higher total compensation level. However, [Company] remains my top choice due to the mission and engineering culture. If we can adjust the base to $${targetBase.toLocaleString()} or supplement with a sign-on bonus of $30,000, I will gladly sign today.

Thank you again for your partnership throughout this process.

Best regards,
[Your Name]`,
        },
      });
    }

    const prompt = `You are a high-stakes executive compensation negotiator who has negotiated offers at Google, Meta, Apple, OpenAI, and premier startups.
Analyze this job offer and develop a data-driven counter-offer strategy with realistic targets and customized negotiation scripts.

Role: ${role}
Location: ${location}
Years of Experience: ${experienceYears}
Current Offer: ${JSON.stringify(currentOffer)}
Competing Offers / Leverage: ${JSON.stringify(competingOffers || "None specified")}

Respond ONLY with valid JSON:
{
  "marketAnalysis": {
    "percentile": string,
    "marketRange": string,
    "negotiationLeverage": string
  },
  "counterOfferTarget": {
    "base": number,
    "bonus": number,
    "equity": number,
    "signOn": number,
    "totalComp": number
  },
  "strategyPoints": string[],
  "emailScripts": {
    "enthusiasticCounter": string,
    "competingOfferLeverage": string
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/salary-negotiate:", error);
    res.status(500).json({ error: "Failed to strategize salary negotiation", message: error?.message });
  }
});

// 7. AI Career & Skill Roadmap Endpoint
app.post("/api/ai/career-roadmap", async (req: Request, res: Response) => {
  try {
    const { currentRole, targetRole, currentSkills } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        summary: `Structured 90-day accelerator from ${currentRole || "Mid Engineer"} to ${targetRole || "Staff / Lead Engineer"}`,
        phases: [
          {
            phase: "Days 1-30: Core Architecture Mastery",
            focus: "Distributed system patterns, event-driven design, high-concurrency storage engines",
            actionItems: [
              "Deep dive into Kafka/RabbitMQ partitioning, consumer group semantics, and dead-letter queues",
              "Study database sharding, connection pooling, and multi-region replication tradeoffs",
              "Build a prototype distributed task orchestrator with retry policies and idempotency",
            ],
            keyMilestone: "Complete architectural blueprint of an enterprise event-driven data pipeline",
          },
          {
            phase: "Days 31-60: Engineering Leadership & System Design",
            focus: "Technical RFC authoring, cross-team consensus, performance profiling, and cost optimization",
            actionItems: [
              "Write 2 production-grade RFC design docs covering fault-tolerance and SLA/SLO budgets",
              "Master advanced observability: OpenTelemetry distributed tracing, p99 profiling, and alerting",
              "Conduct 5 mock system design interviews focusing on billion-scale user applications",
            ],
            keyMilestone: "Present a mock RFC on zero-downtime database migration to an engineering forum",
          },
          {
            phase: "Days 61-90: Executive Presence & Portfolio Capstone",
            focus: "End-to-end open source capstone, staff-level behavioral narratives, interview mastery",
            actionItems: [
              "Launch a polished open-source tool or benchmark comparing modern cache topologies",
              "Formulate 8 STAR behavioral stories highlighting ambiguity navigation and conflict resolution",
              "Conduct full-loop staff-level mock interviews with senior bar raisers",
            ],
            keyMilestone: "Deliver polished portfolio capstone and complete 3 full mock loops with >90% hire score",
          },
        ],
        topSkillsToAcquire: ["Distributed Consensus (Raft/Paxos)", "OpenTelemetry Tracing", "Cross-Functional RFC Leadership", "Cloud Cost FinOps"],
        recommendedCertifications: ["AWS Certified Solutions Architect - Professional", "CKA (Certified Kubernetes Administrator)"],
      });
    }

    const prompt = `You are a Principal Engineering Director and Career Coach. Create an actionable, highly practical 30-60-90 day skill and portfolio roadmap for someone moving from:
Current Role: ${currentRole}
Target Role: ${targetRole}
Current Skills: ${JSON.stringify(currentSkills || [])}

Respond ONLY with valid JSON:
{
  "summary": string,
  "phases": [
    {
      "phase": string,
      "focus": string,
      "actionItems": string[],
      "keyMilestone": string
    }
  ],
  "topSkillsToAcquire": string[],
  "recommendedCertifications": string[]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error in /api/ai/career-roadmap:", error);
    res.status(500).json({ error: "Failed to generate roadmap", message: error?.message });
  }
});

// Vite Middleware and Production Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI JobSphere Server running on port ${PORT}`);
  });
}

startServer();

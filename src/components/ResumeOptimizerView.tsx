import React, { useState, useMemo } from 'react';
import { CandidateProfile, ATSAnalysisResult, Job } from '../types';
import {
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sliders,
  RefreshCw,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Award,
  Layers,
  Search,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResumeOptimizerViewProps {
  profile: CandidateProfile;
  onUpdateProfile: (profile: CandidateProfile) => void;
  jobs: Job[];
  preselectedJobForTailor?: Job | null;
}

export const ResumeOptimizerView: React.FC<ResumeOptimizerViewProps> = ({
  profile,
  onUpdateProfile,
  jobs,
  preselectedJobForTailor,
}) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'ats-audit' | 'job-tailor' | 'preview'>('ats-audit');
  
  // ATS Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [atsResult, setAtsResult] = useState<ATSAnalysisResult | null>(null);

  // Job Tailor State
  const [targetJobText, setTargetJobText] = useState<string>(
    preselectedJobForTailor
      ? `${preselectedJobForTailor.title} at ${preselectedJobForTailor.company}\n\n${preselectedJobForTailor.description}\n\nRequirements:\n${preselectedJobForTailor.requirements.join('\n')}`
      : ''
  );
  const [targetCompany, setTargetCompany] = useState<string>(
    preselectedJobForTailor?.company || ''
  );
  const [isTailoring, setIsTailoring] = useState<boolean>(false);
  const [tailorResult, setTailorResult] = useState<any>(null);

  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [copiedResume, setCopiedResume] = useState<boolean>(false);

  // Convert profile into formatted text for ATS analysis
  const profileAsText = useMemo(() => {
    return `${profile.fullName}
${profile.title} | ${profile.email} | ${profile.phone} | ${profile.location}
${profile.githubUrl ? `GitHub: ${profile.githubUrl}` : ''} ${profile.linkedinUrl ? `LinkedIn: ${profile.linkedinUrl}` : ''}

SUMMARY:
${profile.summary}

SKILLS:
${profile.skills.join(', ')}

EXPERIENCE:
${profile.experiences
  .map(
    (exp) =>
      `${exp.role} - ${exp.company} (${exp.startDate} to ${exp.current ? 'Present' : exp.endDate})\n` +
      exp.bullets.map((b) => `• ${b}`).join('\n')
  )
  .join('\n\n')}

EDUCATION:
${profile.education.map((edu) => `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.year})`).join('\n')}

PROJECTS:
${profile.projects.map((proj) => `${proj.title} [${proj.techStack.join(', ')}]: ${proj.description} (${proj.impactMetrics || ''})`).join('\n')}
`;
  }, [profile]);

  // Run ATS Resume Analysis
  const handleRunATSAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: profileAsText,
          targetRole: profile.targetRole,
        }),
      });
      const data = await res.json();
      setAtsResult(data);

      if (data.score >= 80) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      }
    } catch (err) {
      console.error('Error running ATS audit:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Tailor to Specific Job Description
  const handleRunJobTailor = async () => {
    if (!targetJobText.trim()) return;
    setIsTailoring(true);
    try {
      const res = await fetch('/api/ai/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: profileAsText,
          jobDescription: targetJobText,
          targetCompany: targetCompany || 'Target Employer',
        }),
      });
      const data = await res.json();
      setTailorResult(data);
    } catch (err) {
      console.error('Error tailoring resume:', err);
    } finally {
      setIsTailoring(false);
    }
  };

  // Apply single bullet improvement to profile
  const handleApplyBulletImprovement = (original: string, improved: string) => {
    const updatedExperiences = profile.experiences.map((exp) => {
      const updatedBullets = exp.bullets.map((b) => (b === original ? improved : b));
      return { ...exp, bullets: updatedBullets };
    });

    onUpdateProfile({
      ...profile,
      experiences: updatedExperiences,
    });

    // Remove from current improvement list to show feedback
    if (atsResult) {
      setAtsResult({
        ...atsResult,
        bulletImprovements: atsResult.bulletImprovements.filter((i) => i.original !== original),
      });
    }
  };

  // Add missing keyword into skills list
  const handleAddSkill = (skill: string) => {
    if (!profile.skills.includes(skill)) {
      onUpdateProfile({
        ...profile,
        skills: [...profile.skills, skill],
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> ATS Score Optimizer & Bullet Polisher
            </span>
            <span className="text-xs text-slate-400">Target Role: <strong className="text-white">{profile.targetRole}</strong></span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Resume Intelligence & ATS Audit Studio
          </h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
            Optimize your resume for enterprise Applicant Tracking Systems (Workday, Greenhouse, Lever). Audit keyword density, quantify impact with STAR, and tailor for specific job openings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {[
            { id: 'ats-audit', label: 'ATS Score & Audit', icon: TrendingUp },
            { id: 'job-tailor', label: 'Tailor to Job Description', icon: Zap },
            { id: 'editor', label: 'Live Resume Editor', icon: Sliders },
            { id: 'preview', label: 'Export & Print View', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. ATS AUDIT TAB */}
      {activeTab === 'ats-audit' && (
        <div className="space-y-6">
          
          {/* Top Score Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Overall Score Card */}
            <div className="md:col-span-4 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-cyan-500/5 blur-2xl" />
              
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                ATS Compatibility Score
              </span>

              <div className="relative my-2 flex h-32 w-32 items-center justify-center rounded-full border-8 border-slate-800 bg-slate-950 shadow-inner">
                <div
                  className="absolute inset-0 rounded-full border-8 border-cyan-400 transition-all duration-1000"
                  style={{
                    clipPath: `polygon(0 0, 100% 0, 100% ${atsResult ? atsResult.score : 84}%, 0 ${atsResult ? atsResult.score : 84}%)`,
                  }}
                />
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-extrabold text-white">
                    {atsResult ? atsResult.score : 84}
                  </span>
                  <span className="text-[10px] font-semibold text-cyan-300 uppercase">
                    / 100
                  </span>
                </div>
              </div>

              <div className="mt-2 text-xs font-medium text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Top 12% Candidate Quality</span>
              </div>

              <button
                onClick={handleRunATSAnalysis}
                disabled={isAnalyzing}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Auditing Resume Metrics...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Run Full ATS Neural Audit</span>
                  </>
                )}
              </button>
            </div>

            {/* Score Breakdown Radar */}
            <div className="md:col-span-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Detailed Category Diagnostics
                </h3>
                <span className="text-xs text-slate-400">
                  Target: {profile.targetRole}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    name: 'Keyword Density & Match',
                    score: atsResult?.breakdown.keywordOptimization || 86,
                    desc: 'Alignment with tier-1 engineering and tech stack keywords.',
                  },
                  {
                    name: 'Impact & STAR Quantification',
                    score: atsResult?.breakdown.impactQuantification || 78,
                    desc: 'Presence of quantifiable metrics (%, $, time saved, latency).',
                  },
                  {
                    name: 'Action Verb Strength',
                    score: atsResult?.breakdown.actionVerbs || 85,
                    desc: 'Front-loaded high-impact verbs (Spearheaded, Architected).',
                  },
                  {
                    name: 'ATS Structure & Formatting',
                    score: atsResult?.breakdown.formattingStructure || 92,
                    desc: 'Clean parseable headers, dates, and hierarchy.',
                  },
                ].map((cat, idx) => (
                  <div key={idx} className="rounded-xl bg-slate-950/70 p-3.5 border border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-200">{cat.name}</span>
                      <span className="font-bold text-cyan-400">{cat.score}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">{cat.desc}</p>
                  </div>
                ))}
              </div>

              {/* Keywords Detected & Missing */}
              <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 mb-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" /> High-Value Keywords Present:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(atsResult?.strongKeywords || ['TypeScript', 'React', 'Node.js', 'Distributed Systems', 'System Architecture']).map(
                      (kw, i) => (
                        <span
                          key={i}
                          className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300 border border-emerald-500/20"
                        >
                          {kw}
                        </span>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-amber-400 flex items-center gap-1 mb-1.5">
                    <AlertCircle className="h-3.5 w-3.5" /> Missing / Recommended Keywords (Click to add):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(atsResult?.missingKeywords || ['Kubernetes', 'CI/CD Pipeline', 'Latency Optimization', 'Microservices']).map(
                      (kw, i) => (
                        <button
                          key={i}
                          onClick={() => handleAddSkill(kw)}
                          className="rounded bg-amber-500/10 px-2 py-0.5 text-[11px] text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-400 transition-colors flex items-center gap-1 group"
                          title="Click to add to your skills"
                        >
                          <span>+ {kw}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Line-by-Line AI Bullet Point Polisher */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Line-by-Line STAR Bullet Point Polisher
                  </h3>
                  <p className="text-xs text-slate-400">
                    AI transforms weak responsibility-focused bullets into quantifiable, high-impact accomplishments.
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                1-Click Apply Ready
              </span>
            </div>

            <div className="space-y-4">
              {(atsResult?.bulletImprovements || [
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
              ]).map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 relative overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Original */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Before (Weak / Passive)
                      </span>
                      <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 line-through decoration-rose-500/50">
                        {item.original}
                      </p>
                    </div>

                    {/* Improved */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> After (Quantified STAR Impact)
                      </span>
                      <p className="text-xs font-medium text-slate-100 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/30">
                        {item.improved}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-[11px] text-slate-400 italic">
                      💡 Reason: {item.reason}
                    </span>
                    <button
                      onClick={() => handleApplyBulletImprovement(item.original, item.improved)}
                      className="shrink-0 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Apply to My Resume</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. JOB TAILOR TAB */}
      {activeTab === 'job-tailor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Side: Paste Target Job */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Target Job Description
              </h3>
              <p className="text-xs text-slate-400">
                Paste any target job posting to custom-calibrate resume keywords and summary.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Employer / Company Name
              </label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="e.g. Anthropic, Stripe, Apple..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Job Posting / Requirements
              </label>
              <textarea
                value={targetJobText}
                onChange={(e) => setTargetJobText(e.target.value)}
                rows={14}
                placeholder="Paste the full job description or select a role from the job discovery view..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
              />
            </div>

            <button
              onClick={handleRunJobTailor}
              disabled={isTailoring || !targetJobText.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity disabled:opacity-50"
            >
              {isTailoring ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Calibrating Keywords & Alignment...</span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  <span>Generate Tailored Resume Variant</span>
                </>
              )}
            </button>
          </div>

          {/* Right Side: Tailored Results */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Tailored Resume Variant & Keyword Boost
              </h3>
              {tailorResult && (
                <span className="rounded-full bg-emerald-500/20 px-3 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  {tailorResult.matchDelta || '+18% ATS Match Increase'}
                </span>
              )}
            </div>

            {tailorResult ? (
              <div className="space-y-5 text-xs">
                
                {/* Tailored Summary */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                      Tailored Executive Summary
                    </span>
                    <button
                      onClick={() => {
                        onUpdateProfile({ ...profile, summary: tailorResult.tailoredSummary });
                        setCopiedSummary(true);
                        setTimeout(() => setCopiedSummary(false), 2000);
                      }}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                    >
                      {copiedSummary ? '✓ Replaced in Profile' : 'Replace in Profile'}
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-slate-200 leading-relaxed font-mono">
                    {tailorResult.tailoredSummary}
                  </div>
                </div>

                {/* Tailored Experience Bullets */}
                <div className="space-y-2">
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px]">
                    Recommended Role-Targeted Accomplishment Bullets
                  </span>
                  <div className="space-y-2">
                    {tailorResult.tailoredBullets?.map((bullet: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded-xl bg-slate-950 p-3 border border-slate-800"
                      >
                        <ChevronRight className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-slate-200 leading-relaxed">{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keywords Injected */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                    Keywords Injected for ATS Bypass
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tailorResult.atsKeywordsInjected?.map((kw: string, i: number) => (
                      <span
                        key={i}
                        className="rounded bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30"
                      >
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <FileText className="h-12 w-12 text-slate-600" />
                <h4 className="font-semibold text-slate-300">Ready to Tailor</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Paste the target job posting on the left and click "Generate Tailored Resume Variant" to optimize keyword density.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 3. LIVE RESUME EDITOR TAB */}
      {activeTab === 'editor' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white">Live Candidate Profile & Resume Editor</h3>
              <p className="text-xs text-slate-400">Edits automatically synchronize across all AI coaching modules.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => onUpdateProfile({ ...profile, fullName: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Professional Title</label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => onUpdateProfile({ ...profile, title: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => onUpdateProfile({ ...profile, email: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => onUpdateProfile({ ...profile, location: e.target.value })}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1 text-xs">Professional Summary</label>
            <textarea
              value={profile.summary}
              onChange={(e) => onUpdateProfile({ ...profile, summary: e.target.value })}
              rows={3}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Skills tags */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1 text-xs">Technical Skills (Comma separated)</label>
            <input
              type="text"
              value={profile.skills.join(', ')}
              onChange={(e) =>
                onUpdateProfile({
                  ...profile,
                  skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                })
              }
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Work Experiences */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white">Work Experience</h4>
            {profile.experiences.map((exp, expIdx) => (
              <div key={exp.id} className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Company:</span>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExps = [...profile.experiences];
                        newExps[expIdx].company = e.target.value;
                        onUpdateProfile({ ...profile, experiences: newExps });
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Role:</span>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const newExps = [...profile.experiences];
                        newExps[expIdx].role = e.target.value;
                        onUpdateProfile({ ...profile, experiences: newExps });
                      }}
                      className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-200"
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Accomplishment Bullets:</span>
                  {exp.bullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <textarea
                        value={bullet}
                        onChange={(e) => {
                          const newExps = [...profile.experiences];
                          newExps[expIdx].bullets[bIdx] = e.target.value;
                          onUpdateProfile({ ...profile, experiences: newExps });
                        }}
                        rows={2}
                        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-slate-200"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 4. PREVIEW & EXPORT TAB */}
      {activeTab === 'preview' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Formatted Plaintext & ATS Print Preview</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(profileAsText);
                  setCopiedResume(true);
                  setTimeout(() => setCopiedResume(false), 2000);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedResume ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-white text-slate-900 p-8 font-serif leading-relaxed text-xs shadow-2xl max-w-4xl mx-auto space-y-4">
            <div className="text-center border-b border-slate-300 pb-3 space-y-1">
              <h2 className="text-2xl font-bold font-sans tracking-tight text-slate-950">
                {profile.fullName}
              </h2>
              <div className="text-[11px] text-slate-600 font-sans">
                {profile.email} • {profile.phone} • {profile.location}
              </div>
            </div>

            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
                Executive Summary
              </h3>
              <p className="text-slate-800 leading-normal">{profile.summary}</p>
            </div>

            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
                Technical Proficiencies
              </h3>
              <p className="text-slate-800 font-sans text-[11px]">{profile.skills.join(' • ')}</p>
            </div>

            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
                Professional Experience
              </h3>
              <div className="space-y-3">
                {profile.experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-baseline font-sans">
                      <span className="font-bold text-slate-900">{exp.role}</span>
                      <span className="text-[11px] text-slate-600">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-[11px] italic text-slate-700 font-sans">{exp.company} — {exp.location}</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-800 text-[11px]">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5 mb-1.5">
                Education & Credentials
              </h3>
              <div className="space-y-1 text-[11px] font-sans">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="flex justify-between text-slate-800">
                    <span>{edu.degree} in {edu.field} — <strong>{edu.institution}</strong></span>
                    <span className="text-slate-600">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { ViewMode, CandidateProfile, Job, JobApplication, ApplicationStatus } from './types';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { MOCK_JOBS } from './data/mockJobs';
import { Navbar } from './components/Navbar';
import { JobDiscoveryView } from './components/JobDiscoveryView';
import { ResumeOptimizerView } from './components/ResumeOptimizerView';
import { InterviewCoachView } from './components/InterviewCoachView';
import { ApplicationTrackerView } from './components/ApplicationTrackerView';
import { SalaryRadarView } from './components/SalaryRadarView';
import { CareerRoadmapView } from './components/CareerRoadmapView';
import { Bot, Sparkles, Send, X, MessageSquare, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('jobs');
  const [profiles, setProfiles] = useState<CandidateProfile[]>(SAMPLE_PROFILES);
  const [activeProfile, setActiveProfile] = useState<CandidateProfile>(SAMPLE_PROFILES[0]);
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);

  // AI Career Assistant Drawer State
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [assistantInput, setAssistantInput] = useState<string>('');
  const [isAssistantLoading, setIsAssistantLoading] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'assistant' | 'user'; content: string }[]>([
    {
      role: 'assistant',
      content: `Hello ${activeProfile.fullName.split(' ')[0]}! I'm your AI JobSphere Career Copilot. Ask me to draft a cover letter, review your resume bullet points, simulate tough interview questions, or formulate a counter-offer strategy.`,
    },
  ]);

  // Initial Sample Applications
  const [applications, setApplications] = useState<JobApplication[]>([
    {
      id: 'app-1',
      jobId: 'job-1',
      jobTitle: 'Principal Full Stack Engineer (AI Platforms)',
      company: 'Anthropic AI',
      location: 'San Francisco, CA (Hybrid / Remote)',
      appliedDate: '2026-03-01',
      lastUpdated: '2026-03-10',
      status: 'interview',
      matchScore: 96,
      salaryOffered: '$230k - $290k + 0.15% Equity',
      notes: 'Passed round 2 system architecture. Final executive loop scheduled next Tuesday.',
      coverLetterGenerated: 'Dear Anthropic Hiring Team,\n\nI am thrilled to submit my candidacy for the Principal Full Stack Engineer position on the AI Platforms team...',
      contacts: [],
    },
    {
      id: 'app-2',
      jobId: 'job-2',
      jobTitle: 'Staff Distributed Systems Engineer',
      company: 'Stripe',
      location: 'Seattle, WA (Remote)',
      appliedDate: '2026-02-24',
      lastUpdated: '2026-03-08',
      status: 'offer',
      matchScore: 92,
      salaryOffered: '$245k Base + $85k Equity + $35k Bonus',
      notes: 'Official offer received. Currently in counter-negotiation phase for sign-on bonus.',
      contacts: [],
    },
    {
      id: 'app-3',
      jobId: 'job-3',
      jobTitle: 'Senior Machine Learning & LLM Engineer',
      company: 'Scale AI',
      location: 'San Francisco, CA',
      appliedDate: '2026-03-05',
      lastUpdated: '2026-03-07',
      status: 'screening',
      matchScore: 88,
      salaryOffered: '$210k - $260k',
      notes: 'Initial recruiter call went great. Reviewing take-home architecture prompt.',
      contacts: [],
    },
    {
      id: 'app-4',
      jobId: 'job-5',
      jobTitle: 'Senior React / Design Systems Architect',
      company: 'Vercel',
      location: 'San Francisco, CA (Remote)',
      appliedDate: '2026-03-11',
      lastUpdated: '2026-03-11',
      status: 'applied',
      matchScore: 91,
      salaryOffered: '$195k - $240k',
      notes: 'Direct referral through former teammate.',
      contacts: [],
    },
    {
      id: 'app-5',
      jobId: 'job-7',
      jobTitle: 'Staff Backend Infrastructure Engineer',
      company: 'OpenAI',
      location: 'San Francisco, CA',
      appliedDate: '2026-02-15',
      lastUpdated: '2026-03-02',
      status: 'saved',
      matchScore: 94,
      salaryOffered: '$250k - $320k',
      notes: 'Bookmarked for targeted custom resume tailoring.',
      contacts: [],
    }
  ]);

  // Context passed when jumping from job view to resume tailor or interview coach
  const [selectedJobForTailor, setSelectedJobForTailor] = useState<Job | null>(null);
  const [selectedJobForInterview, setSelectedJobForInterview] = useState<Job | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handle Profile Update
  const handleUpdateProfile = (updatedProfile: CandidateProfile) => {
    setActiveProfile(updatedProfile);
    setProfiles((prev) =>
      prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
    );
    showToast('✓ Profile & Resume changes synced across AI modules');
  };

  // Handle Applying to a Job from Discovery View
  const handleApplyToJob = (job: Job) => {
    const existing = applications.find((a) => a.jobId === job.id);
    if (existing) {
      showToast(`Already tracked in your pipeline: ${job.company}`);
      return;
    }

    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'applied',
      matchScore: job.matchScore || 85,
      salaryOffered: `$${Math.round(job.salaryMin / 1000)}k - $${Math.round(job.salaryMax / 1000)}k`,
      notes: `Applied via AI JobSphere match engine.`,
      contacts: [],
    };

    setApplications((prev) => [newApp, ...prev]);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });

    showToast(`✓ Applied to ${job.company}! Added to your Application Funnel.`);
  };

  // Jump directly to Resume Tailor for a specific job
  const handleSelectJobForTailor = (job: Job) => {
    setSelectedJobForTailor(job);
    setCurrentView('resume-ats');
    showToast(`Loaded "${job.title} at ${job.company}" into ATS Tailoring Studio`);
  };

  // Jump directly to Interview Coach for a specific job
  const handleSelectJobForInterview = (job: Job) => {
    setSelectedJobForInterview(job);
    setCurrentView('interview-coach');
    showToast(`Preparing AI Interview Room for ${job.title} (${job.company})`);
  };

  // Application Pipeline Updates
  const handleUpdateApplicationStatus = (id: string, newStatus: ApplicationStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : a))
    );
  };

  const handleDeleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    showToast('Application removed from tracker');
  };

  const handleAddApplication = (newApp: Omit<JobApplication, 'id' | 'appliedDate' | 'lastUpdated'>) => {
    const created: JobApplication = {
      ...newApp,
      id: `app-${Date.now()}`,
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
    };
    setApplications((prev) => [created, ...prev]);
    showToast(`✓ Added ${newApp.company} to application pipeline`);
  };

  // Send AI Chat Message in Drawer
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assistantInput.trim() || isAssistantLoading) return;

    const userMsg = assistantInput;
    setAssistantInput('');
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsAssistantLoading(true);

    try {
      // Call general interview/career endpoint with active context
      const res = await fetch('/api/ai/interview-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: activeProfile.targetRole,
          questionType: 'Career Strategy',
          question: userMsg,
          candidateAnswer: `Candidate: ${activeProfile.fullName}, ${activeProfile.title}. Skills: ${activeProfile.skills.join(', ')}.`,
          history: chatMessages.slice(-4),
          difficulty: 'Senior',
        }),
      });

      const data = await res.json();
      const reply =
        data.feedback?.modelAnswer ||
        data.feedback?.strengths?.join('\n• ') ||
        "I've analyzed your career query against current hiring trends. Focus on front-loading quantifiable achievements (latency reduction, revenue impact) and aligning your tech stack keywords to the target job description.";

      setChatMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Here's a strategic recommendation: Highlight leadership in distributed systems, quantify project metrics with STAR formatting, and emphasize your experience with modern AI pipelines.",
        },
      ]);
    } finally {
      setIsAssistantLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans antialiased">
      
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfile={setActiveProfile}
        applicationsCount={applications.length}
        onOpenAiAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Content Area */}
      <main className="pb-16 pt-2">
        {currentView === 'jobs' && (
          <JobDiscoveryView
            jobs={jobs}
            activeProfile={activeProfile}
            applications={applications}
            onApplyOrTrack={handleAddApplication}
            onNavigateToResumeTailor={handleSelectJobForTailor}
            onNavigateToInterview={handleSelectJobForInterview}
          />
        )}

        {currentView === 'resume-ats' && (
          <ResumeOptimizerView
            profile={activeProfile}
            onUpdateProfile={handleUpdateProfile}
            jobs={jobs}
            preselectedJobForTailor={selectedJobForTailor}
          />
        )}

        {currentView === 'interview-coach' && (
          <InterviewCoachView
            activeProfile={activeProfile}
            preselectedJob={selectedJobForInterview}
          />
        )}

        {currentView === 'applications-tracker' && (
          <ApplicationTrackerView
            applications={applications}
            onUpdateApplicationStatus={handleUpdateApplicationStatus}
            onDeleteApplication={handleDeleteApplication}
            onAddApplication={handleAddApplication}
          />
        )}

        {currentView === 'salary-radar' && (
          <SalaryRadarView activeProfile={activeProfile} />
        )}

        {currentView === 'career-roadmap' && (
          <CareerRoadmapView activeProfile={activeProfile} />
        )}
      </main>

      {/* Floating AI Career Assistant Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-xl shadow-cyan-500/25 hover:scale-105 transition-all"
        >
          <Bot className="h-4 w-4 text-slate-950" />
          <span>Ask AI Career Copilot</span>
        </button>
      </div>

      {/* AI Career Assistant Drawer Modal */}
      {isAssistantOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm">
          <div className="flex h-full w-full max-w-md flex-col border-l border-slate-800 bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-200">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Bot className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">AI Career Copilot</h3>
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready & Context-Aware
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAssistantOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white rounded-br-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 px-1">
                    {msg.role === 'user' ? 'You' : 'JobSphere AI'}
                  </span>
                </div>
              ))}

              {isAssistantLoading && (
                <div className="flex items-center gap-2 text-xs text-cyan-400 bg-slate-950 p-3 rounded-2xl border border-slate-800 w-fit">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Synthesizing career advice...</span>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40">
              <span className="text-[10px] font-semibold text-slate-400 block mb-1">Quick Prompts:</span>
              <div className="flex flex-wrap gap-1">
                {[
                  "How can I negotiate a higher sign-on bonus?",
                  "Give me 3 tough L6 system design questions",
                  "Rewrite my bullet to sound more executive",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setAssistantInput(prompt);
                    }}
                    className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="border-t border-slate-800 p-3 flex items-center gap-2">
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                placeholder="Ask advice on interviews, resume, offers..."
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!assistantInput.trim() || isAssistantLoading}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 p-2.5 text-slate-950 font-bold hover:opacity-90 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-cyan-300 shadow-2xl shadow-cyan-500/20 backdrop-blur">
            {toastMessage}
          </div>
        </div>
      )}

    </div>
  );
}

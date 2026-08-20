import React, { useState, useMemo } from 'react';
import { Job, CandidateProfile, JobApplication } from '../types';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  DollarSign,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mic,
  Send,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  Layers,
  Bookmark,
  BookmarkCheck,
  Award,
  Loader2,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface JobDiscoveryViewProps {
  jobs: Job[];
  activeProfile: CandidateProfile;
  applications: JobApplication[];
  onApplyOrTrack: (application: Omit<JobApplication, 'id' | 'appliedDate' | 'lastUpdated'>) => void;
  onNavigateToResumeTailor: (job: Job) => void;
  onNavigateToInterview: (job: Job) => void;
}

export const JobDiscoveryView: React.FC<JobDiscoveryViewProps> = ({
  jobs = [],
  activeProfile,
  applications = [],
  onApplyOrTrack,
  onNavigateToResumeTailor,
  onNavigateToInterview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkplace, setSelectedWorkplace] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [minSalary, setMinSalary] = useState<number>(100000);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'recent'>('match');

  const [selectedJob, setSelectedJob] = useState<Job | null>(jobs[0] || null);
  const [isEvaluatingMatch, setIsEvaluatingMatch] = useState<boolean>(false);
  const [matchDetails, setMatchDetails] = useState<any>(null);

  // Cover letter generator modal state
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState<boolean>(false);
  const [coverLetterData, setCoverLetterData] = useState<{ subject: string; coverLetter: string; keyHighlights: string[] } | null>(null);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState<boolean>(false);
  const [coverLetterTone, setCoverLetterTone] = useState<string>('Confident & Results-Oriented');
  const [copiedCoverLetter, setCopiedCoverLetter] = useState<boolean>(false);

  // Apply Modal state
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [applyNotes, setApplyNotes] = useState<string>('');

  // Extract unique tags for quick filter chips
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    jobs.forEach((j) => j.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).slice(0, 10);
  }, [jobs]);

  // Compute match score for jobs based on profile
  const jobsWithMatchScore = useMemo(() => {
    const profileSkills = (activeProfile.skills || []).map((s) => s.toLowerCase());
    return jobs.map((job) => {
      const jobTags = job.tags.map((t) => t.toLowerCase());
      const matchedCount = jobTags.filter((t) =>
        profileSkills.some((s) => s.includes(t) || t.includes(s))
      ).length;
      const baseScore = Math.round((matchedCount / (jobTags.length || 1)) * 42 + 54);
      const experienceFit =
        (activeProfile.yearsExperience >= 5 && (job.experienceLevel === 'Senior' || job.experienceLevel === 'Lead')) ||
        (activeProfile.yearsExperience >= 8 && job.experienceLevel === 'Staff / Principal') ||
        (activeProfile.yearsExperience >= 2 && job.experienceLevel === 'Mid')
          ? 4
          : 0;
      const finalScore = Math.min(98, Math.max(58, baseScore + experienceFit));
      return {
        ...job,
        matchScore: finalScore,
      };
    });
  }, [jobs, activeProfile]);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return jobsWithMatchScore
      .filter((job) => {
        const matchesQuery =
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
          job.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesWorkplace =
          selectedWorkplace === 'All' || job.workplaceType === selectedWorkplace;

        const matchesLevel =
          selectedLevel === 'All' || job.experienceLevel === selectedLevel;

        const matchesSalary = job.salaryMax >= minSalary;

        const matchesTag =
          selectedTag === 'All' || job.tags.includes(selectedTag);

        return matchesQuery && matchesWorkplace && matchesLevel && matchesSalary && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return (b.matchScore || 0) - (a.matchScore || 0);
        if (sortBy === 'salary') return b.salaryMax - a.salaryMax;
        return 0; // Default order
      });
  }, [jobsWithMatchScore, searchQuery, selectedWorkplace, selectedLevel, minSalary, selectedTag, sortBy]);

  // Evaluate deep match with Gemini API
  const handleEvaluateDeepMatch = async (job: Job) => {
    setIsEvaluatingMatch(true);
    try {
      const res = await fetch('/api/ai/job-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: activeProfile, job }),
      });
      const data = await res.json();
      setMatchDetails(data);
    } catch (err) {
      console.error('Error fetching job match:', err);
    } finally {
      setIsEvaluatingMatch(false);
    }
  };

  // Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    if (!selectedJob) return;
    setIsGeneratingCoverLetter(true);
    setShowCoverLetterModal(true);
    try {
      const res = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: activeProfile,
          job: selectedJob,
          tone: coverLetterTone,
        }),
      });
      const data = await res.json();
      setCoverLetterData(data);
    } catch (err) {
      console.error('Error generating cover letter:', err);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // Apply & Add to Kanban
  const handleConfirmApply = () => {
    if (!selectedJob) return;
    onApplyOrTrack({
      jobId: selectedJob.id,
      jobTitle: selectedJob.title,
      company: selectedJob.company,
      location: selectedJob.location,
      salaryOffered: `$${selectedJob.salaryMin.toLocaleString()} - $${selectedJob.salaryMax.toLocaleString()}`,
      status: 'applied',
      matchScore: selectedJob.matchScore || 85,
      notes: applyNotes || `Applied directly via AI JobSphere match portal with ${selectedJob.matchScore}% compatibility.`,
      coverLetterGenerated: coverLetterData?.coverLetter,
      contacts: [
        {
          name: `${selectedJob.company} Talent Team`,
          role: 'Recruiting & Talent Acquisition',
          email: `recruiting@${selectedJob.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        },
      ],
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setShowApplyModal(false);
    setApplyNotes('');
  };

  const isJobApplied = (jobId: string) => {
    return (applications || []).some((app) => app?.jobId === jobId);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Banner / Match Summary */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-900/40 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                <Sparkles className="h-3.5 w-3.5" /> AI Job Matching Active
              </span>
              <span className="text-xs text-slate-400">
                Calibrated for <strong className="text-white">{activeProfile.fullName}</strong> ({activeProfile.yearsExperience} yrs exp)
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Curated Opportunities & Role Compatibility
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Our neural matching engine analyzes technical keywords, seniority indicators, and compensation benchmarks to surface your highest-probability career opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/80 rounded-xl p-3 border border-slate-800">
            <div className="text-center px-2">
              <div className="text-xs text-slate-400">Top Match</div>
              <div className="text-xl font-extrabold text-cyan-400">
                {jobsWithMatchScore[0]?.matchScore || 94}%
              </div>
            </div>
            <div className="h-8 w-px bg-slate-800" />
            <div className="text-center px-2">
              <div className="text-xs text-slate-400">Matching Roles</div>
              <div className="text-xl font-extrabold text-white">
                {filteredJobs.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 space-y-4 shadow-sm backdrop-blur">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Main Search Input */}
          <div className="relative md:col-span-5">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by job title, tech stack (e.g. React, Python), or company..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Workplace Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedWorkplace}
              onChange={(e) => setSelectedWorkplace(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">All Locations</option>
              <option value="Remote">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Seniority Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior Level</option>
              <option value="Lead">Lead Level</option>
              <option value="Staff / Principal">Staff / Principal</option>
            </select>
          </div>

          {/* Sort By Filter */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-200 focus:border-indigo-500 focus:outline-none font-medium"
            >
              <option value="match">Sort: Highest Match Score (AI)</option>
              <option value="salary">Sort: Highest Salary Range</option>
              <option value="recent">Sort: Most Recently Posted</option>
            </select>
          </div>
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/60">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="h-3 w-3" /> Tech Stack:
          </span>
          <button
            onClick={() => setSelectedTag('All')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedTag === 'All'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            All Skills
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? 'All' : tag)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Job Cards List + Deep Drilldown Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Job Cards List */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {filteredJobs.length} Available Opportunities
            </h2>
            <span className="text-xs text-cyan-400 font-medium">
              Click any role to inspect AI analysis
            </span>
          </div>

          <div className="space-y-3 max-h-[780px] overflow-y-auto pr-1">
            {filteredJobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              const applied = isJobApplied(job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setMatchDetails(null);
                  }}
                  className={`group relative cursor-pointer rounded-2xl border p-4 transition-all ${
                    isSelected
                      ? 'border-indigo-500/80 bg-slate-900/95 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/5'
                      : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    
                    {/* Company Logo & Title */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-xl border border-slate-700">
                        {job.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-indigo-400">
                            {job.company}
                          </span>
                          {job.featured && (
                            <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-500/20">
                              Featured
                            </span>
                          )}
                          {applied && (
                            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 border border-emerald-500/20 flex items-center gap-0.5">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Tracked
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                          {job.title}
                        </h3>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex flex-col items-end">
                      <div
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                          (job.matchScore || 0) >= 85
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : (job.matchScore || 0) >= 70
                            ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        <Sparkles className="h-3 w-3" />
                        <span>{job.matchScore}% Match</span>
                      </div>
                      <span className="text-[10px] text-slate-500 mt-1">
                        {job.applicantsCount} applicants
                      </span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="mt-3 flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-500" />
                      {job.location} ({job.workplaceType})
                    </span>
                    <span className="flex items-center gap-1 text-slate-300 font-semibold">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-slate-500" />
                      {job.postedAt}
                    </span>
                  </div>

                  {/* Tech Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {job.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/50"
                      >
                        {tag}
                      </span>
                    ))}
                    {job.tags.length > 4 && (
                      <span className="rounded-md bg-slate-800/40 px-1.5 py-0.5 text-[11px] text-slate-400">
                        +{job.tags.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredJobs.length === 0 && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
                <Building2 className="mx-auto h-10 w-10 text-slate-600 mb-2" />
                <h4 className="font-semibold text-slate-300">No matching jobs found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your filters or search keywords.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedWorkplace('All');
                    setSelectedLevel('All');
                    setSelectedTag('All');
                  }}
                  className="mt-3 rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-indigo-300 hover:bg-slate-700"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Selected Job Deep Drilldown */}
        <div className="lg:col-span-7">
          {selectedJob ? (
            <div className="sticky top-20 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl space-y-6">
              
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-800 text-3xl border border-slate-700 shadow-inner">
                    {selectedJob.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-white">
                        {selectedJob.title}
                      </h2>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-sm">
                      <span className="font-semibold text-indigo-400">{selectedJob.company}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{selectedJob.department}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400">{selectedJob.location}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-opacity"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>Apply & Track</span>
                  </button>
                </div>
              </div>

              {/* Quick AI Action Hub */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                
                {/* 1. Tailor Resume Button */}
                <button
                  onClick={() => onNavigateToResumeTailor(selectedJob)}
                  className="flex flex-col items-start p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-950 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                    <FileText className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Tailor Resume</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Auto-inject STAR metrics & keywords for this role.
                  </p>
                </button>

                {/* 2. Generate Cover Letter */}
                <button
                  onClick={handleGenerateCoverLetter}
                  className="flex flex-col items-start p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 hover:bg-slate-950 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                    <span>AI Cover Letter</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Generate compelling pitch aligned to mission.
                  </p>
                </button>

                {/* 3. Practice Mock Interview */}
                <button
                  onClick={() => onNavigateToInterview(selectedJob)}
                  className="flex flex-col items-start p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-950 transition-all text-left group"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                    <Mic className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Mock Interview</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Practice role-specific system & behavioral questions.
                  </p>
                </button>
              </div>

              {/* AI Match Matrix Panel */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600/30 text-cyan-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        AI Compatibility Matrix
                      </h4>
                      <span className="text-[11px] text-indigo-300">
                        {selectedJob.matchScore}% Match with your current resume
                      </span>
                    </div>
                  </div>

                  {!matchDetails && !isEvaluatingMatch && (
                    <button
                      onClick={() => handleEvaluateDeepMatch(selectedJob)}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>Deep AI Analysis</span>
                    </button>
                  )}
                </div>

                {isEvaluatingMatch && (
                  <div className="flex items-center justify-center gap-2 py-4 text-xs text-indigo-300">
                    <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                    <span>Gemini analyzing candidate strengths vs requirements...</span>
                  </div>
                )}

                {matchDetails && (
                  <div className="space-y-3 text-xs pt-2 border-t border-indigo-500/20">
                    <div>
                      <span className="font-semibold text-emerald-300 flex items-center gap-1 mb-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Match Strengths:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {matchDetails.strengths?.map((s: string, idx: number) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    {matchDetails.missingSkills?.length > 0 && (
                      <div>
                        <span className="font-semibold text-amber-300 flex items-center gap-1 mb-1">
                          <AlertCircle className="h-3.5 w-3.5" /> Missing / Light Keywords:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {matchDetails.missingSkills.map((m: string, idx: number) => (
                            <span
                              key={idx}
                              className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-medium text-amber-300 border border-amber-500/30"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchDetails.talkingPoints && (
                      <div className="rounded-lg bg-slate-950/60 p-2.5 border border-slate-800">
                        <span className="font-semibold text-cyan-300 block mb-1">
                          Recommended Interview Elevator Pitch:
                        </span>
                        <p className="text-slate-300 leading-relaxed italic">
                          "{matchDetails.talkingPoints[0]}"
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Company & Role Intelligence */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Salary Range</span>
                  <span className="text-xs font-bold text-emerald-400 mt-0.5 block">
                    ${(selectedJob.salaryMin / 1000).toFixed(0)}k - ${(selectedJob.salaryMax / 1000).toFixed(0)}k
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Interview Loop</span>
                  <span className="text-xs font-bold text-white mt-0.5 block">
                    {selectedJob.companyInsights.interviewRounds} Rounds ({selectedJob.companyInsights.interviewDifficulty})
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Avg Response</span>
                  <span className="text-xs font-bold text-cyan-400 mt-0.5 block">
                    ~{selectedJob.companyInsights.avgResponseDays} business days
                  </span>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Company Culture</span>
                  <span className="text-xs font-bold text-amber-400 mt-0.5 block">
                    ★ {selectedJob.companyInsights.glassdoorRating} / 5.0
                  </span>
                </div>
              </div>

              {/* Role Description & Responsibilities */}
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed max-h-80 overflow-y-auto pr-1">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">Role Overview</h4>
                  <p>{selectedJob.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">Key Responsibilities</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">Candidate Requirements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white mb-1.5">Benefits & Perks</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedJob.benefits.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>

      {/* Cover Letter Generator Modal */}
      {showCoverLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    AI Cover Letter Generator
                  </h3>
                  <span className="text-xs text-slate-400">
                    Tailored for {selectedJob?.company} • {selectedJob?.title}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCoverLetterModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tone Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Tone:</span>
              {['Confident & Results-Oriented', 'Executive & Strategic', 'Technical Depth', 'Concise'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setCoverLetterTone(tone)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    coverLetterTone === tone
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {tone}
                </button>
              ))}
              <button
                onClick={handleGenerateCoverLetter}
                disabled={isGeneratingCoverLetter}
                className="ml-auto rounded-lg bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 text-xs font-bold text-cyan-300 hover:bg-cyan-500/30"
              >
                Regenerate
              </button>
            </div>

            {isGeneratingCoverLetter ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
                <p className="text-xs text-slate-300">
                  Drafting customized, high-converting cover letter...
                </p>
              </div>
            ) : coverLetterData ? (
              <div className="space-y-3 text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {coverLetterData.coverLetter}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-400">
                    💡 Standout factors included: {coverLetterData.keyHighlights?.join(', ')}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(coverLetterData.coverLetter);
                        setCopiedCoverLetter(true);
                        setTimeout(() => setCopiedCoverLetter(false), 2000);
                      }}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                    >
                      {copiedCoverLetter ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button
                      onClick={() => {
                        handleConfirmApply();
                        setShowCoverLetterModal(false);
                      }}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                    >
                      Attach & Track Application
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Apply & Track Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Track Application in Kanban Pipeline
              </h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 space-y-1">
                <div className="font-semibold text-white">{selectedJob?.title}</div>
                <div className="text-slate-400">{selectedJob?.company} • {selectedJob?.location}</div>
                <div className="text-emerald-400 font-semibold">
                  Salary: ${selectedJob?.salaryMin.toLocaleString()} - ${selectedJob?.salaryMax.toLocaleString()}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Application Notes / Referral Contact (Optional)
                </label>
                <textarea
                  value={applyNotes}
                  onChange={(e) => setApplyNotes(e.target.value)}
                  placeholder="e.g. Applied via referral from Sarah Miller (Engineering Manager). Follow up scheduled for next Tuesday."
                  rows={3}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApply}
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  Confirm & Add to Pipeline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

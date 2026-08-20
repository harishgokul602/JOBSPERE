import React, { useState } from 'react';
import { CandidateProfile, CareerRoadmapResult } from '../types';
import {
  Compass,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  ChevronRight,
  BookOpen,
  Target,
  Loader2,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CareerRoadmapViewProps {
  activeProfile: CandidateProfile;
}

export const CareerRoadmapView: React.FC<CareerRoadmapViewProps> = ({ activeProfile }) => {
  const [currentRole, setCurrentRole] = useState<string>(activeProfile.title);
  const [targetRole, setTargetRole] = useState<string>('Staff Distributed Systems & AI Architect');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const [roadmap, setRoadmap] = useState<CareerRoadmapResult>({
    summary: `Structured 90-day accelerator from ${activeProfile.title} to Staff / Principal AI & Distributed Systems Architect`,
    phases: [
      {
        phase: 'Days 1-30: Core Architecture Mastery & Distributed Consensus',
        focus: 'Distributed system patterns, event-driven mesh, Raft/Paxos consensus, and high-concurrency storage engines',
        actionItems: [
          'Deep dive into Kafka/RabbitMQ partitioning, consumer group semantics, and dead-letter queues',
          'Study database sharding, connection pooling, and multi-region replication tradeoffs in PostgreSQL',
          'Build a prototype distributed task orchestrator with retry policies and idempotency keys',
        ],
        keyMilestone: 'Complete architectural blueprint of an enterprise event-driven data pipeline',
      },
      {
        phase: 'Days 31-60: Engineering Leadership & System Design RFCs',
        focus: 'Technical RFC authoring, cross-team consensus, performance profiling, and cost optimization',
        actionItems: [
          'Write 2 production-grade RFC design docs covering fault-tolerance and SLA/SLO budgets',
          'Master advanced observability: OpenTelemetry distributed tracing, p99 profiling, and alerting',
          'Conduct 5 mock system design interviews focusing on billion-scale user applications',
        ],
        keyMilestone: 'Present a mock RFC on zero-downtime database migration to an engineering forum',
      },
      {
        phase: 'Days 61-90: Executive Presence & Portfolio Capstone',
        focus: 'End-to-end open source capstone, staff-level behavioral narratives, interview mastery',
        actionItems: [
          'Launch a polished open-source tool or benchmark comparing modern cache topologies',
          'Formulate 8 STAR behavioral stories highlighting ambiguity navigation and conflict resolution',
          'Conduct full-loop staff-level mock interviews with senior bar raisers',
        ],
        keyMilestone: 'Deliver polished portfolio capstone and complete 3 full mock loops with >90% hire score',
      },
    ],
    topSkillsToAcquire: [
      'Distributed Consensus (Raft/Paxos)',
      'OpenTelemetry Tracing',
      'Cross-Functional RFC Leadership',
      'Cloud Cost FinOps',
      'LLM Agent Orchestration',
    ],
    recommendedCertifications: [
      'AWS Certified Solutions Architect - Professional',
      'CKA (Certified Kubernetes Administrator)',
      'Google Cloud Professional Cloud Architect',
    ],
  });

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/career-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRole,
          targetRole,
          currentSkills: activeProfile.skills,
        }),
      });

      const data = await res.json();
      setRoadmap(data);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Error generating roadmap:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskKey]: !prev[taskKey],
    }));
  };

  const totalTasks = roadmap.phases.reduce((acc, p) => acc + p.actionItems.length, 0);
  const checkedTasks = Object.values(completedTasks).filter(Boolean).length;
  const progressPercent = totalTasks > 0 ? Math.round((checkedTasks / totalTasks) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                <Compass className="h-3 w-3" /> Career Progression Accelerator
              </span>
              <span className="text-xs text-slate-400">Personalized Skill Acquisition Path</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              30-60-90 Day Executive & Staff Career Roadmap
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Bridge the technical and leadership gap between your current role and your target executive or staff promotion.
            </p>
          </div>

          {/* Progress Gauge */}
          <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Roadmap Progress</span>
              <span className="text-base font-bold text-emerald-400 block">
                {checkedTasks} / {totalTasks} Completed ({progressPercent}%)
              </span>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-900 border-2 border-emerald-500 flex items-center justify-center text-xs font-black text-white">
              {progressPercent}%
            </div>
          </div>
        </div>

        {/* Transition Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="sm:col-span-5">
            <label className="block text-slate-400 font-semibold mb-1">Current Role</label>
            <input
              type="text"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="block text-slate-400 font-semibold mb-1">Target Next Promotion Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              onClick={handleGenerateRoadmap}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 p-2.5 font-bold text-white shadow-md hover:opacity-95 transition-opacity"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Regenerate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 30-60-90 Day Timeline Phases */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roadmap.phases.map((phase, phaseIdx) => (
          <div
            key={phaseIdx}
            className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4 relative overflow-hidden"
          >
            {/* Phase Tag */}
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-indigo-500/15 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/30">
                Phase {phaseIdx + 1}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Day {phaseIdx * 30 + 1} - {(phaseIdx + 1) * 30}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-white leading-snug">
                {phase.phase}
              </h3>
              <p className="text-xs text-cyan-300/90 mt-1">
                {phase.focus}
              </p>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 flex-1 text-xs">
              <span className="font-semibold text-slate-400 block text-[11px] uppercase tracking-wider">
                Action Items & Deliverables:
              </span>
              {phase.actionItems.map((item, itemIdx) => {
                const key = `${phaseIdx}-${itemIdx}`;
                const isChecked = !!completedTasks[key];

                return (
                  <div
                    key={itemIdx}
                    onClick={() => toggleTask(key)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-400 line-through'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`h-4 w-4 shrink-0 rounded-md border flex items-center justify-center mt-0.5 ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                          : 'border-slate-600 bg-slate-900'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                );
              })}
            </div>

            {/* Key Milestone */}
            <div className="rounded-xl bg-slate-950 p-3 border border-indigo-500/20 text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1 mb-0.5">
                <Target className="h-3.5 w-3.5" /> Target Milestone:
              </span>
              <p className="text-slate-300">{phase.keyMilestone}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Skills Radar & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Skills Radar */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-cyan-400" /> High-Demand Target Skills to Acquire
          </span>
          <div className="flex flex-wrap gap-2 pt-1">
            {roadmap.topSkillsToAcquire.map((skill, idx) => (
              <span
                key={idx}
                className="rounded-xl bg-slate-950 border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm"
              >
                ⚡ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-3">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-4 w-4 text-amber-400" /> Recommended Tier-1 Credentials
          </span>
          <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
            {roadmap.recommendedCertifications.map((cert, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="text-amber-400">★</span>
                <span>{cert}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};

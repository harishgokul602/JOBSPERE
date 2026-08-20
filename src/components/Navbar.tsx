import React from 'react';
import { ViewMode, CandidateProfile } from '../types';
import {
  Briefcase,
  FileText,
  Mic,
  Kanban,
  TrendingUp,
  Compass,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  activeProfile: CandidateProfile;
  profiles: CandidateProfile[];
  onSelectProfile: (profile: CandidateProfile) => void;
  applicationsCount: number;
  onOpenAiAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  activeProfile,
  profiles,
  onSelectProfile,
  applicationsCount,
  onOpenAiAssistant,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const navItems = [
    {
      id: 'jobs' as ViewMode,
      label: 'Job Discovery & Match',
      icon: Briefcase,
      badge: 'Live',
    },
    {
      id: 'resume-ats' as ViewMode,
      label: 'ATS Resume Optimizer',
      icon: FileText,
      badge: 'AI Audit',
    },
    {
      id: 'interview-coach' as ViewMode,
      label: 'AI Interview Coach',
      icon: Mic,
      badge: 'Interactive',
    },
    {
      id: 'applications-tracker' as ViewMode,
      label: 'Application Pipeline',
      icon: Kanban,
      badge: applicationsCount > 0 ? `${applicationsCount}` : undefined,
    },
    {
      id: 'salary-radar' as ViewMode,
      label: 'Salary Radar & Negotiator',
      icon: TrendingUp,
    },
    {
      id: 'career-roadmap' as ViewMode,
      label: '30-60-90d Roadmap',
      icon: Compass,
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectView('jobs')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse-subtle" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-white">
                    Job<span className="text-cyan-400">Sphere</span>
                  </span>
                  <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/30">
                    AI PRO
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                  Autonomous Career Intelligence
                </p>
              </div>
            </button>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-700'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: AI Assistant button & Profile Selector */}
          <div className="flex items-center gap-2.5">
            {/* Quick AI Assistant Trigger */}
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600/30 hover:border-indigo-400 transition-colors shadow-sm"
              title="Open AI Career Copilot"
            >
              <Bot className="h-4 w-4 text-cyan-400" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 rounded-lg bg-slate-900 border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-700 transition-colors focus:outline-none"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 text-[11px] font-bold text-white">
                  {activeProfile.fullName.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="font-semibold text-white truncate max-w-[110px]">
                    {activeProfile.fullName}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50">
                  <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Candidate Profile Preset
                  </div>
                  <div className="space-y-1">
                    {profiles.map((p) => {
                      const isCurrent = p.id === activeProfile.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onSelectProfile(p);
                            setProfileDropdownOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                            isCurrent
                              ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
                              : 'text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-white">{p.fullName}</div>
                            <div className="text-[11px] text-slate-400 truncate max-w-[170px]">
                              {p.title}
                            </div>
                          </div>
                          {isCurrent && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 border-t border-slate-800 pt-2">
                    <button
                      onClick={() => {
                        onSelectView('resume-ats');
                        setProfileDropdownOpen(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                    >
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Edit Resume / Profile</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Nav Scroller */}
        <div className="flex lg:hidden overflow-x-auto py-2 border-t border-slate-800/80 gap-1.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white ring-1 ring-slate-700'
                    : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

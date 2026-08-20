import React, { useState, useMemo } from 'react';
import { JobApplication, ApplicationStatus } from '../types';
import {
  Kanban,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Trash2,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  User,
  MoreVertical,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationTrackerViewProps {
  applications: JobApplication[];
  onUpdateApplicationStatus: (id: string, newStatus: ApplicationStatus) => void;
  onDeleteApplication: (id: string) => void;
  onAddApplication: (app: Omit<JobApplication, 'id' | 'appliedDate' | 'lastUpdated'>) => void;
}

const COLUMNS: { status: ApplicationStatus; title: string; color: string; border: string }[] = [
  { status: 'saved', title: 'Bookmarked / Saved', color: 'bg-slate-500/10 text-slate-300', border: 'border-slate-800' },
  { status: 'applied', title: 'Applied', color: 'bg-cyan-500/10 text-cyan-300', border: 'border-cyan-500/20' },
  { status: 'screening', title: 'Recruiter Screening', color: 'bg-indigo-500/10 text-indigo-300', border: 'border-indigo-500/20' },
  { status: 'interview', title: 'Technical & Onsite Loop', color: 'bg-purple-500/10 text-purple-300', border: 'border-purple-500/20' },
  { status: 'offer', title: 'Offer Extended 🎉', color: 'bg-emerald-500/10 text-emerald-300', border: 'border-emerald-500/30' },
  { status: 'rejected', title: 'Archived / Passed', color: 'bg-rose-500/10 text-rose-300', border: 'border-rose-500/20' },
];

export const ApplicationTrackerView: React.FC<ApplicationTrackerViewProps> = ({
  applications,
  onUpdateApplicationStatus,
  onDeleteApplication,
  onAddApplication,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<JobApplication | null>(null);

  // New Application Form
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCompany, setNewCompany] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('San Francisco, CA (Remote)');
  const [newSalary, setNewSalary] = useState<string>('$180k - $220k');
  const [newNotes, setNewNotes] = useState<string>('');

  // Analytics
  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter((a) => a.status !== 'rejected' && a.status !== 'saved').length;
    const interviews = applications.filter((a) => a.status === 'screening' || a.status === 'interview').length;
    const offers = applications.filter((a) => a.status === 'offer').length;
    const responseRate = total > 0 ? Math.round(((interviews + offers) / Math.max(1, total - applications.filter((a) => a.status === 'saved').length)) * 100) : 0;

    return { total, active, interviews, offers, responseRate };
  }, [applications]);

  const handleCreateNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    onAddApplication({
      jobId: `custom-${Date.now()}`,
      jobTitle: newTitle,
      company: newCompany,
      location: newLocation,
      salaryOffered: newSalary,
      status: 'applied',
      matchScore: 88,
      notes: newNotes,
      contacts: [],
    });

    setNewTitle('');
    setNewCompany('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const handleAdvanceStatus = (app: JobApplication, direction: 'next' | 'prev') => {
    const statusOrder: ApplicationStatus[] = ['saved', 'applied', 'screening', 'interview', 'offer', 'rejected'];
    const currIdx = statusOrder.indexOf(app.status);
    if (direction === 'next' && currIdx < statusOrder.length - 2) {
      const next = statusOrder[currIdx + 1];
      onUpdateApplicationStatus(app.id, next);
      if (next === 'offer') {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      }
    } else if (direction === 'prev' && currIdx > 0) {
      onUpdateApplicationStatus(app.id, statusOrder[currIdx - 1]);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header & Metrics Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                <Kanban className="h-3 w-3" /> Visual Application Pipeline
              </span>
              <span className="text-xs text-slate-400">
                {applications.length} Total tracked opportunities
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Job Application Pipeline & Funnel
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Manage your interview loops, track recruiter follow-ups, store custom cover letters, and celebrate job offers.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span>Add Custom Application</span>
          </button>
        </div>

        {/* Funnel KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
          <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Active Pipeline</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{stats.active} Roles</span>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Interview Loops</span>
            <span className="text-lg font-bold text-purple-400 mt-0.5 block">{stats.interviews} Active</span>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Offers Extended</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{stats.offers} Offers 🎉</span>
          </div>

          <div className="rounded-xl bg-slate-950/70 p-3 border border-slate-800">
            <span className="text-[11px] text-slate-400 block">Funnel Response Rate</span>
            <span className="text-lg font-bold text-cyan-400 mt-0.5 block">
              {stats.responseRate > 0 ? `${stats.responseRate}%` : '38%'}
            </span>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.status);

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-3 min-w-[240px] space-y-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <span className={`rounded-lg px-2 py-0.5 text-xs font-bold ${col.color}`}>
                  {col.title}
                </span>
                <span className="text-xs font-semibold text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800">
                  {colApps.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[640px] pr-0.5">
                {colApps.map((app) => (
                  <div
                    key={app.id}
                    className="group relative rounded-xl border border-slate-800 bg-slate-950/90 p-3.5 shadow-md hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-semibold text-[11px] text-indigo-400 block">
                          {app.company}
                        </span>
                        <h4 className="font-bold text-xs text-white leading-snug">
                          {app.jobTitle}
                        </h4>
                      </div>

                      <span className="shrink-0 rounded bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/20">
                        {app.matchScore}%
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <span className="truncate">{app.location}</span>
                      </div>
                      {app.salaryOffered && (
                        <div className="flex items-center gap-1 text-emerald-400 font-medium">
                          <DollarSign className="h-3 w-3" />
                          <span>{app.salaryOffered}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                        <Clock className="h-3 w-3" />
                        <span>Applied: {app.appliedDate}</span>
                      </div>
                    </div>

                    {app.notes && (
                      <p className="text-[11px] text-slate-400 bg-slate-900/60 p-2 rounded-lg border border-slate-800 line-clamp-2 italic">
                        "{app.notes}"
                      </p>
                    )}

                    {/* Stage Actions */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <div className="flex items-center gap-1">
                        {col.status !== 'saved' && (
                          <button
                            onClick={() => handleAdvanceStatus(app, 'prev')}
                            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
                            title="Move back a stage"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {col.status !== 'rejected' && col.status !== 'offer' && (
                          <button
                            onClick={() => handleAdvanceStatus(app, 'next')}
                            className="rounded p-1 text-cyan-400 hover:bg-slate-800 hover:text-cyan-300 font-bold"
                            title="Advance to next interview stage"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedAppForDetail(app)}
                          className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold px-1.5 py-0.5 rounded hover:bg-slate-800"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="rounded p-1 text-slate-600 hover:text-rose-400"
                          title="Delete application"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {colApps.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-800/80 p-6 text-center text-slate-600 text-xs">
                    No applications
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">
                Add External Application
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewApp} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. OpenAI, Google, Stripe..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Staff Full Stack Engineer..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Salary</label>
                  <input
                    type="text"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Initial Notes</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Referral name, interview dates, initial thoughts..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 px-4 py-1.5 font-bold text-white shadow-md hover:opacity-95"
                >
                  Add to Kanban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Application Detail Modal */}
      {selectedAppForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold text-indigo-400">{selectedAppForDetail.company}</span>
                <h3 className="text-lg font-bold text-white">{selectedAppForDetail.jobTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedAppForDetail(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Status:</span>
                  <span className="font-bold text-cyan-400 uppercase tracking-wider">{selectedAppForDetail.status}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block">Match Score:</span>
                  <span className="font-bold text-emerald-400">{selectedAppForDetail.matchScore}% Match</span>
                </div>
              </div>

              {selectedAppForDetail.coverLetterGenerated && (
                <div className="space-y-1">
                  <span className="font-semibold text-slate-300">Attached Tailored Cover Letter:</span>
                  <div className="max-h-40 overflow-y-auto rounded-xl bg-slate-950 p-3 border border-slate-800 font-mono text-slate-300 text-[11px] leading-relaxed">
                    {selectedAppForDetail.coverLetterGenerated}
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <span className="font-semibold text-slate-300">Application Notes:</span>
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-slate-300">
                  {selectedAppForDetail.notes || 'No custom notes recorded yet.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

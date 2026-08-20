import React, { useState } from 'react';
import { SALARY_BENCHMARKS } from '../data/salaryData';
import { CandidateProfile, SalaryBenchmark } from '../types';
import {
  TrendingUp,
  DollarSign,
  MapPin,
  Sparkles,
  Award,
  Send,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  Loader2,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import confetti from 'canvas-confetti';

interface SalaryRadarViewProps {
  activeProfile: CandidateProfile;
}

export const SalaryRadarView: React.FC<SalaryRadarViewProps> = ({ activeProfile }) => {
  const [selectedBenchmarkIndex, setSelectedBenchmarkIndex] = useState<number>(0);
  const selectedBenchmark = SALARY_BENCHMARKS[selectedBenchmarkIndex] || SALARY_BENCHMARKS[0];

  // Offer Evaluation Form
  const [offerRole, setOfferRole] = useState<string>(activeProfile.targetRole);
  const [offerLocation, setOfferLocation] = useState<string>('San Francisco, CA (Bay Area)');
  const [offerBase, setOfferBase] = useState<number>(175000);
  const [offerBonus, setOfferBonus] = useState<number>(25000);
  const [offerEquity, setOfferEquity] = useState<number>(60000);
  const [offerSignOn, setOfferSignOn] = useState<number>(20000);
  const [competingOffers, setCompetingOffers] = useState<string>('Competing final loop with Series B AI startup at $270k TC');

  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [negotiationResult, setNegotiationResult] = useState<any>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Recharts Chart Data
  const compensationComponentsData = [
    { name: 'Base Salary', amount: selectedBenchmark.baseAvg, fill: '#6366f1' },
    { name: 'Annual Bonus', amount: selectedBenchmark.bonusAvg, fill: '#06b6d4' },
    { name: 'Equity / Year', amount: selectedBenchmark.equityAvg, fill: '#10b981' },
  ];

  const percentileData = [
    { percentile: '25th (Entry/Low)', compensation: selectedBenchmark.p25 },
    { percentile: '50th (Median)', compensation: selectedBenchmark.p50 },
    { percentile: '75th (High)', compensation: selectedBenchmark.p75 },
    { percentile: '90th (Top Tier)', compensation: selectedBenchmark.p90 },
  ];

  const handleEvaluateNegotiation = async () => {
    setIsEvaluating(true);
    try {
      const res = await fetch('/api/ai/salary-negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: offerRole,
          location: offerLocation,
          experienceYears: activeProfile.yearsExperience,
          currentOffer: {
            base: offerBase,
            bonus: offerBonus,
            equity: offerEquity,
            signOn: offerSignOn,
          },
          competingOffers,
        }),
      });

      const data = await res.json();
      setNegotiationResult(data);

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error('Error negotiating salary:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const totalCurrentOffer = offerBase + offerBonus + offerEquity + offerSignOn;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Tech Market Compensation Radar & Strategizer
              </span>
              <span className="text-xs text-slate-400">Verified Level Bands</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Salary Intelligence & Offer Counter-Strategizer
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Explore accurate total compensation (Base + Bonus + Equity) across global tech hubs and leverage AI to formulate data-backed counter-offers.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-400">Select Market:</span>
            <select
              value={selectedBenchmarkIndex}
              onChange={(e) => setSelectedBenchmarkIndex(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 font-semibold focus:outline-none"
            >
              {SALARY_BENCHMARKS.map((b, i) => (
                <option key={i} value={i}>
                  {b.role} — {b.location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Market Benchmark Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Total Comp Card & Component Breakdown */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-5">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                {selectedBenchmark.level} • {selectedBenchmark.location}
              </span>
              <h3 className="text-lg font-extrabold text-white mt-0.5">
                {selectedBenchmark.role}
              </h3>
            </div>
            <span className="rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-bold text-cyan-300 border border-cyan-500/20">
              Demand: {selectedBenchmark.demandRating}
            </span>
          </div>

          {/* Big Number Average TC */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 font-medium">Average Total Compensation (TC)</span>
              <div className="text-3xl font-black text-emerald-400 mt-0.5">
                ${(selectedBenchmark.totalAvg / 1000).toFixed(0)}k <span className="text-xs text-slate-400 font-normal">/ year</span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>Based on {selectedBenchmark.sampleCount} data points</div>
              <div className="text-cyan-400 font-semibold mt-0.5">Updated 2026 Index</div>
            </div>
          </div>

          {/* Recharts Bar Chart: Comp Breakdown */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-indigo-400" /> Average Compensation Breakdown
            </span>
            <div className="h-48 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compensationComponentsData} layout="vertical">
                  <XAxis type="number" tickFormatter={(v) => `$${v / 1000}k`} stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" fontSize={11} width={100} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Average']}
                  />
                  <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                    {compensationComponentsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: Percentiles Distribution Chart */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-lg space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Distribution Spectrum
              </span>
              <h3 className="text-lg font-extrabold text-white mt-0.5">
                Market Percentile Curves
              </h3>
            </div>
          </div>

          {/* 4 Stat Boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-[10px] text-slate-500 font-semibold block">25th Percentile</span>
              <span className="text-sm font-bold text-slate-300 mt-0.5 block">
                ${(selectedBenchmark.p25 / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-indigo-500/30">
              <span className="text-[10px] text-indigo-400 font-semibold block">50th (Median)</span>
              <span className="text-sm font-bold text-white mt-0.5 block">
                ${(selectedBenchmark.p50 / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-cyan-500/30">
              <span className="text-[10px] text-cyan-400 font-semibold block">75th Percentile</span>
              <span className="text-sm font-bold text-cyan-300 mt-0.5 block">
                ${(selectedBenchmark.p75 / 1000).toFixed(0)}k
              </span>
            </div>

            <div className="rounded-xl bg-slate-950 p-3 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 font-semibold block">90th (Top Tier)</span>
              <span className="text-sm font-bold text-emerald-300 mt-0.5 block">
                ${(selectedBenchmark.p90 / 1000).toFixed(0)}k
              </span>
            </div>
          </div>

          {/* Area Chart: Percentile Distribution */}
          <div className="h-48 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={percentileData}>
                <defs>
                  <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="percentile" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Total Comp']}
                />
                <Area type="monotone" dataKey="compensation" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorComp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* AI Offer Evaluator & Negotiation Strategizer */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white font-bold shadow-md">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              AI Offer Evaluator & Counter-Offer Strategizer
            </h3>
            <p className="text-xs text-slate-400">
              Input any job offer to analyze your leverage, target counter package, and generate email scripts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Input Form */}
          <div className="lg:col-span-5 space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Role</label>
                <input
                  type="text"
                  value={offerRole}
                  onChange={(e) => setOfferRole(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Location</label>
                <input
                  type="text"
                  value={offerLocation}
                  onChange={(e) => setOfferLocation(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Base Salary ($)</label>
                <input
                  type="number"
                  value={offerBase}
                  onChange={(e) => setOfferBase(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Annual Bonus ($)</label>
                <input
                  type="number"
                  value={offerBonus}
                  onChange={(e) => setOfferBonus(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Equity / Year ($)</label>
                <input
                  type="number"
                  value={offerEquity}
                  onChange={(e) => setOfferEquity(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sign-on Bonus ($)</label>
                <input
                  type="number"
                  value={offerSignOn}
                  onChange={(e) => setOfferSignOn(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Competing Offers / Leverage Context (Optional)
              </label>
              <textarea
                value={competingOffers}
                onChange={(e) => setCompetingOffers(e.target.value)}
                rows={2}
                placeholder="e.g. Another offer from Seed-stage AI startup with higher equity..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Current TC Pill */}
            <div className="flex items-center justify-between rounded-xl bg-slate-950 p-3 border border-slate-800">
              <span className="text-slate-400 font-medium">Offered Total Comp (Year 1):</span>
              <span className="text-base font-bold text-white">${totalCurrentOffer.toLocaleString()}</span>
            </div>

            <button
              onClick={handleEvaluateNegotiation}
              disabled={isEvaluating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 px-4 py-2.5 font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity"
            >
              {isEvaluating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Analyzing Market Levers & Formulating Strategy...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-slate-950" />
                  <span>Generate Counter-Offer Strategy & Scripts</span>
                </>
              )}
            </button>
          </div>

          {/* Strategy & Email Output */}
          <div className="lg:col-span-7 space-y-4">
            {negotiationResult ? (
              <div className="space-y-4 text-xs">
                
                {/* Target Counter Card */}
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 uppercase tracking-wider text-[11px]">
                      Recommended Target Counter Package
                    </span>
                    <span className="text-emerald-400 font-bold">
                      +${(negotiationResult.counterOfferTarget.totalComp - totalCurrentOffer).toLocaleString()} Boost Potential
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Target Base</span>
                      <span className="font-bold text-white">${negotiationResult.counterOfferTarget.base?.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Target Bonus</span>
                      <span className="font-bold text-white">${negotiationResult.counterOfferTarget.bonus?.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Target Equity</span>
                      <span className="font-bold text-white">${negotiationResult.counterOfferTarget.equity?.toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Sign-on Goal</span>
                      <span className="font-bold text-emerald-400">${negotiationResult.counterOfferTarget.signOn?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Key Levers */}
                <div className="space-y-1.5">
                  <span className="font-bold text-cyan-300 text-[11px] uppercase tracking-wider">
                    High-Leverage Negotiation Angles
                  </span>
                  <ul className="space-y-1 text-slate-300">
                    {negotiationResult.strategyPoints?.map((pt: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-cyan-400">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ready-to-Send Email Script */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                      Recruiter Email Script (Enthusiastic Counter)
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(negotiationResult.emailScripts.enthusiasticCounter);
                        setCopiedEmail('enthusiastic');
                        setTimeout(() => setCopiedEmail(null), 2000);
                      }}
                      className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
                    >
                      <Copy className="h-3 w-3" />
                      <span>{copiedEmail === 'enthusiastic' ? 'Copied!' : 'Copy Script'}</span>
                    </button>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                    {negotiationResult.emailScripts.enthusiasticCounter}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-2 rounded-xl bg-slate-950 border border-slate-800/60 p-6">
                <DollarSign className="h-10 w-10 text-slate-600 mb-1" />
                <h4 className="font-semibold text-slate-300">Offer Analysis Ready</h4>
                <p className="text-xs text-slate-500 max-w-sm">
                  Enter your current offer components on the left and click "Generate Counter-Offer Strategy" to calculate your target compensation and recruiter scripts.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Job, CandidateProfile, InterviewQuestion } from '../types';
import { QUESTION_BANK } from '../data/interviewQuestions';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Award,
  RotateCcw,
  Play,
  Pause,
  ChevronRight,
  BookOpen,
  HelpCircle,
  Loader2,
  Layers,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InterviewCoachViewProps {
  activeProfile: CandidateProfile;
  preselectedJob?: Job | null;
}

export const InterviewCoachView: React.FC<InterviewCoachViewProps> = ({
  activeProfile,
  preselectedJob,
}) => {
  const [role, setRole] = useState<string>(
    preselectedJob ? `${preselectedJob.title} (${preselectedJob.company})` : activeProfile.targetRole
  );
  const [category, setCategory] = useState<string>('Behavioral STAR');
  const [difficulty, setDifficulty] = useState<string>('Senior');

  const [currentQuestions, setCurrentQuestions] = useState<InterviewQuestion[]>(
    QUESTION_BANK['Behavioral STAR'] || []
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [candidateAnswer, setCandidateAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedbackHistory, setFeedbackHistory] = useState<any[]>([]);

  // Speech to Text (Web Speech API)
  const [isListening, setIsListening] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  // Audio Speech Synthesis
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const activeQuestion = currentQuestions[currentIndex] || currentQuestions[0];

  // Initialize questions when category changes
  useEffect(() => {
    const list = QUESTION_BANK[category] || QUESTION_BANK['Behavioral STAR'];
    setCurrentQuestions(list);
    setCurrentIndex(0);
    setCandidateAnswer('');
  }, [category]);

  // Speech to text initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
          }
          setCandidateAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
        };

        recog.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        recog.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your answer below.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Submit Answer to AI for grading
  const handleEvaluateAnswer = async () => {
    if (!candidateAnswer.trim()) return;
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/ai/interview-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          questionType: category,
          question: activeQuestion.question,
          candidateAnswer,
          history: feedbackHistory,
          difficulty,
        }),
      });

      const data = await res.json();

      const updatedQuestion = {
        ...activeQuestion,
        candidateAnswer,
        feedback: data.feedback,
      };

      const newQuestions = [...currentQuestions];
      newQuestions[currentIndex] = updatedQuestion;
      setCurrentQuestions(newQuestions);

      setFeedbackHistory((prev) => [...prev, { question: activeQuestion.question, answer: candidateAnswer, feedback: data.feedback }]);

      if (data.feedback?.score >= 85) {
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Error evaluating interview answer:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  // Preset sample answer helper for quick demo/testing
  const handleInsertSampleAnswer = () => {
    if (category === 'Behavioral STAR') {
      setCandidateAnswer(
        "In my previous role at Aura Cloud, we faced a high-stakes project with tight quarterly deadlines to overhaul our dashboard. I took ownership of the technical roadmap, held daily standups to unblock the team, and decomposed the monolithic architecture into asynchronous microservices. As a result, we delivered 2 weeks ahead of schedule, reduced page latency by 48%, and had zero production downtime during launch."
      );
    } else if (category === 'System Architecture') {
      setCandidateAnswer(
        "To architect this notifications engine for 50M DAU, I would decouple ingestion from dispatch using an event-driven message bus like Apache Kafka, partitioned by userId. Workers process batches, verify user preference flags, and communicate with APNs/FCM gateways with exponential backoff. For deduplication, we use distributed Redis idempotency keys with a 24-hour TTL alongside database unique constraints."
      );
    } else {
      setCandidateAnswer(
        "I approach this by translating technical debt into direct business and developer velocity metrics. I reserve 20% capacity in each sprint cycle for foundational refactors and tie larger technical initiatives directly into strategic feature epics so leadership sees the continuous ROI in lower latency and fewer Sev-1 incidents."
      );
    }
  };

  const currentFeedback = activeQuestion.feedback;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      
      {/* Header Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Principal Hiring Bar Raiser Simulator
              </span>
              <span className="text-xs text-slate-400">Live Voice & Text AI Evaluation</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
              Interactive AI Mock Interview Studio
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
              Practice real-time behavioral, system architecture, and leadership interview loops. Receive instant STAR grading, rubric critiques, and gold-standard model answers.
            </p>
          </div>

          {/* Role Config */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-xs">
              <span className="text-slate-400 pl-2">Role:</span>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-100 font-semibold focus:outline-none focus:border-indigo-500 w-48 truncate"
              />
            </div>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none font-semibold"
            >
              <option value="Entry">Entry Level</option>
              <option value="Mid">Mid Level</option>
              <option value="Senior">Senior (L5)</option>
              <option value="Staff / Principal">Staff / Principal (L6+)</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800">
          {Object.keys(QUESTION_BANK).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interview Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Question Navigation & Current Prompt */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Question Stepper */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question {currentIndex + 1} of {currentQuestions.length}
              </span>
              <div className="flex gap-1">
                {currentQuestions.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentIndex(i);
                      setCandidateAnswer(currentQuestions[i].candidateAnswer || '');
                    }}
                    className={`h-2 w-7 rounded-full transition-colors ${
                      i === currentIndex
                        ? 'bg-cyan-400'
                        : currentQuestions[i].feedback
                        ? 'bg-emerald-500/60'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Question Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <HelpCircle className="h-4 w-4 shrink-0" />
                  <span>Interviewer Prompt</span>
                </div>
                <button
                  onClick={() => speakText(activeQuestion.question)}
                  className={`rounded-lg p-1.5 text-xs transition-colors flex items-center gap-1 ${
                    isSpeaking
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Read question aloud"
                >
                  {isSpeaking ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                  <span className="text-[10px]">{isSpeaking ? 'Stop' : 'Listen'}</span>
                </button>
              </div>

              <p className="text-sm font-semibold text-white leading-relaxed">
                "{activeQuestion.question}"
              </p>

              <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                <strong className="text-slate-300">Context Evaluated:</strong> {activeQuestion.context}
              </div>
            </div>

            {/* Key Evaluation Criteria */}
            <div className="space-y-2 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-indigo-400" /> Ideal Evaluation Rubric Points:
              </span>
              <ul className="space-y-1 text-slate-400">
                {activeQuestion.idealKeyPoints?.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-cyan-400">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next / Prev Navigation */}
            <div className="flex justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => {
                  if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                    setCandidateAnswer(currentQuestions[currentIndex - 1].candidateAnswer || '');
                  }
                }}
                disabled={currentIndex === 0}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                onClick={() => {
                  if (currentIndex < currentQuestions.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                    setCandidateAnswer(currentQuestions[currentIndex + 1].candidateAnswer || '');
                  }
                }}
                disabled={currentIndex === currentQuestions.length - 1}
                className="rounded-lg bg-slate-800 px-3 py-1.5 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
              >
                Next Question
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Answer Input & Real-Time AI Grading Feedback */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Answer Input Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Your Answer
                </span>
                {isListening && (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 animate-pulse">
                    <span className="h-2 w-2 rounded-full bg-rose-500" /> Listening (Speak into mic)...
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleInsertSampleAnswer}
                  className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline"
                >
                  Insert Sample STAR Answer
                </button>
                <button
                  onClick={toggleListening}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                    isListening
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5 text-rose-400" /> : <Mic className="h-3.5 w-3.5 text-cyan-400" />}
                  <span>{isListening ? 'Stop Mic' : 'Voice Input'}</span>
                </button>
              </div>
            </div>

            <textarea
              value={candidateAnswer}
              onChange={(e) => setCandidateAnswer(e.target.value)}
              rows={6}
              placeholder="Type your response using the STAR framework (Situation, Task, Action, Result) or click 'Voice Input' to speak..."
              className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-500">
                {candidateAnswer.split(/\s+/).filter(Boolean).length} words
              </span>

              <button
                onClick={handleEvaluateAnswer}
                disabled={isEvaluating || !candidateAnswer.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-600 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-95 transition-opacity disabled:opacity-40"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-950" />
                    <span>Bar Raiser Grading in Progress...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 text-slate-950" />
                    <span>Submit for AI Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Real-Time AI Scorecard & Feedback */}
          {currentFeedback ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-5">
              
              {/* Scorecard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 border border-slate-800 text-2xl font-black text-cyan-400">
                    {currentFeedback.score}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Evaluation Score:</span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-bold ${
                          currentFeedback.score >= 85
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : currentFeedback.score >= 70
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {currentFeedback.scoreCategory || 'Hire'}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Based on Senior Bar Raiser scoring rubric
                    </span>
                  </div>
                </div>
              </div>

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-xl bg-emerald-950/20 border border-emerald-500/30 p-3.5 space-y-2">
                  <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Key Strengths
                  </span>
                  <ul className="space-y-1 text-slate-200">
                    {currentFeedback.strengths?.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-amber-950/20 border border-amber-500/30 p-3.5 space-y-2">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 text-amber-400" /> Actionable Improvements
                  </span>
                  <ul className="space-y-1 text-slate-200">
                    {currentFeedback.improvements?.map((imp: string, i: number) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Gold-Standard Model Answer */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <Sparkles className="h-3.5 w-3.5 text-cyan-400" /> Gold-Standard Model Answer (L5/L6 Bar)
                  </span>
                  <button
                    onClick={() => speakText(currentFeedback.modelAnswer)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>Listen Model Answer</span>
                  </button>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                  {currentFeedback.modelAnswer}
                </div>
              </div>

            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center space-y-2">
              <Award className="mx-auto h-10 w-10 text-slate-600 mb-1" />
              <h4 className="font-semibold text-slate-300">Awaiting Your Answer</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Type your answer or use the voice recording button above. Gemini Bar Raiser will break down your STAR structure and give you instant scoring.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

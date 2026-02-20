"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import LikertQuestion from "@/components/LikertQuestion";
import Link from "next/link";

// Each question maps to OT specialty areas via dimension scoring
const QUESTIONS = [
  // Work setting
  { id: "q1", text: "I prefer working in structured, institutional settings (hospitals, clinics) over community or home-based environments.", dimension: "clinical" },
  { id: "q2", text: "I enjoy working in schools and collaborating with teachers and parents to support children's learning.", dimension: "school" },
  { id: "q3", text: "I am passionate about serving people in their homes and natural community environments.", dimension: "community" },
  { id: "q4", text: "I want the autonomy and flexibility that comes with running my own private practice.", dimension: "private_practice" },
  // Client population
  { id: "q5", text: "Working with children and helping them develop foundational skills is deeply meaningful to me.", dimension: "pediatric" },
  { id: "q6", text: "I feel called to support older adults in maintaining independence and quality of life.", dimension: "geriatric" },
  { id: "q7", text: "Mental health and emotional well-being are at the core of how I view occupational therapy.", dimension: "mental_health" },
  { id: "q8", text: "I am drawn to working with neurodivergent individuals (ADHD, autism, PDA) and their unique needs.", dimension: "neurodivergent" },
  { id: "q9", text: "Physical rehabilitation — helping people regain function after injury or surgery — excites me.", dimension: "neurorehab" },
  // Type of work
  { id: "q10", text: "I prefer direct, hands-on therapy sessions over program design or consulting work.", dimension: "clinical" },
  { id: "q11", text: "I enjoy designing and developing programs, systems, and educational resources.", dimension: "community" },
  { id: "q12", text: "I would rather consult and advise across multiple settings than work intensively with one population.", dimension: "private_practice" },
  // Work style
  { id: "q13", text: "I thrive in fast-paced, high-acuity environments where I need to think and adapt quickly.", dimension: "neurorehab" },
  { id: "q14", text: "I prefer a slower, relationship-focused pace where I deeply know each client over time.", dimension: "pediatric" },
  { id: "q15", text: "I enjoy collaborative, interdisciplinary teamwork more than working independently.", dimension: "school" },
  { id: "q16", text: "Data, research, and evidence-based practice are central to how I approach my work.", dimension: "mental_health" },
  { id: "q17", text: "I am naturally patient and value building long-term therapeutic relationships.", dimension: "geriatric" },
  { id: "q18", text: "I am energized by advocacy, innovation, and challenging the status quo in OT practice.", dimension: "neurodivergent" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function OTAreaQuizPage() {
  const router = useRouter();
  const shuffledQuestions = useMemo(() => shuffle(QUESTIONS), []);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  const answered = Object.keys(answers).length;
  const total = QUESTIONS.length;
  const progress = Math.round((answered / total) * 100);

  const handleAnswer = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSubmit = () => {
    if (answered < total) {
      setError(`Please answer all questions. (${total - answered} remaining)`);
      const firstUnanswered = shuffledQuestions.find((q) => !answers[q.id]);
      if (firstUnanswered) {
        document.getElementById(`q-${firstUnanswered.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Tally scores by dimension
    const scores: Record<string, number> = {};
    QUESTIONS.forEach((q) => {
      const dim = q.dimension;
      scores[dim] = (scores[dim] || 0) + (answers[q.id] || 0);
    });

    // Get top two dimensions
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top = sorted[0][0];
    const second = sorted[1][0];

    const params = new URLSearchParams({
      quiz: "ot-area",
      result: top,
      second: second,
      scores: JSON.stringify(scores),
    });
    router.push(`/quiz-results?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-noctua-black/60 hover:text-noctua-brown text-sm mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className="bg-gradient-to-r from-noctua-brown-dark to-noctua-brown rounded-2xl p-8 text-noctua-cream mb-8">
        <div className="inline-block bg-white/20 text-noctua-cream text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-white/30">
          Career Fit Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">What&apos;s Your Ideal OT Area?</h1>
        <p className="text-noctua-cream/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none", letterSpacing: "normal" }}>
          Discover which OT specialization aligns best with your values, strengths, and practice preferences.
          Rate each statement honestly — your instincts matter here.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-noctua-cream/80">
          <span>⏱ ~7 minutes</span>
          <span>📋 {total} questions</span>
          <span>🗂 Covers 8 specializations</span>
        </div>
      </div>

      {answered > 0 && (
        <div className="mb-6 bg-white rounded-xl border border-noctua-border p-4 shadow-sm">
          <div className="flex justify-between text-sm text-noctua-black/70 mb-2">
            <span className="font-medium">Your progress</span>
            <span className="font-semibold text-noctua-brown">{answered}/{total} answered</span>
          </div>
          <div className="w-full bg-noctua-muted rounded-full h-2.5">
            <div
              className="bg-noctua-brown h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {shuffledQuestions.map((q, idx) => (
          <div key={q.id} id={`q-${q.id}`}>
            <LikertQuestion
              question={q.text}
              questionNumber={idx + 1}
              name={q.id}
              value={answers[q.id] ?? null}
              onChange={(val) => handleAnswer(q.id, val)}
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        className="w-full bg-noctua-brown hover:bg-noctua-brown-dark text-noctua-cream font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        Find My OT Area
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
      <p className="text-center text-sm text-noctua-black/60 mt-3">
        Discover your top OT specialization and get a free career guide.
      </p>
    </div>
  );
}

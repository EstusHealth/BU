"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import LikertQuestion from "@/components/LikertQuestion";
import Link from "next/link";

const QUESTIONS = [
  // Transformational
  {
    id: "q1",
    text: "When I talk about where OT practice — or my own career — is heading, others feel energized and start to believe in it too.",
    dimension: "transformational",
  },
  {
    id: "q2",
    text: "In clinical or team settings, I push people to question conventional OT approaches and design better solutions rather than defaulting to what's always been done.",
    dimension: "transformational",
  },
  {
    id: "q3",
    text: "Before I can lead anyone effectively — a patient, a student, a colleague — I take real time to understand what drives them personally.",
    dimension: "transformational",
  },
  // Servant
  {
    id: "q4",
    text: "My measure of success as an OT — in a team, a practice, or a project — is whether the people around me are growing and thriving, not just whether I am.",
    dimension: "servant",
  },
  {
    id: "q5",
    text: "When working with colleagues or students, I'm more focused on clearing barriers for others than asserting my own authority or expertise.",
    dimension: "servant",
  },
  {
    id: "q6",
    text: "If my OT practice or clinical project succeeded but my team felt unsupported or burned out to get there, I would not consider that a real win.",
    dimension: "servant",
  },
  // Democratic
  {
    id: "q7",
    text: "Before making decisions — about a practice model, a client program, or a team structure — I genuinely want input from everyone the decision affects.",
    dimension: "democratic",
  },
  {
    id: "q8",
    text: "I believe that when my OT collaborators feel shared ownership over a decision, they are far more committed to making it work.",
    dimension: "democratic",
  },
  {
    id: "q9",
    text: "I regularly seek out perspectives different from my own — from clients, other disciplines, and settings outside OT — before locking in a direction.",
    dimension: "democratic",
  },
  // Strategic
  {
    id: "q10",
    text: "I find it natural to map out a 1–5 year vision for my OT career or practice and break it into concrete, prioritized milestones.",
    dimension: "strategic",
  },
  {
    id: "q11",
    text: "When time, money, or clinical resources are limited, I'm comfortable making tough trade-off calls — and I don't second-guess them once made.",
    dimension: "strategic",
  },
  {
    id: "q12",
    text: "Before starting a new clinical approach, business model, or OT program, I always step back and think through how it fits the larger picture first.",
    dimension: "strategic",
  },
  // Coaching
  {
    id: "q13",
    text: "I get real satisfaction from helping a fieldwork student, colleague, or new practitioner level up their clinical reasoning or professional confidence.",
    dimension: "coaching",
  },
  {
    id: "q14",
    text: "When someone on my team or in my clinic hits a wall, my instinct is to ask questions that help them find the answer — not to hand it to them.",
    dimension: "coaching",
  },
  {
    id: "q15",
    text: "I regularly carve out time to give thoughtful, specific feedback and actively support the professional growth of the people around me.",
    dimension: "coaching",
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function LeadershipQuizPage() {
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
      setError(`Please answer all questions before submitting. (${total - answered} remaining)`);
      const firstUnanswered = shuffledQuestions.find((q) => !answers[q.id]);
      if (firstUnanswered) {
        document.getElementById(`q-${firstUnanswered.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Calculate dimension scores
    const scores: Record<string, number> = {};
    const dims = ["transformational", "servant", "democratic", "strategic", "coaching"];
    dims.forEach((dim) => {
      const dimQs = QUESTIONS.filter((q) => q.dimension === dim);
      scores[dim] = dimQs.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
    });

    const topDimension = dims.reduce((a, b) => (scores[a] > scores[b] ? a : b));
    const params = new URLSearchParams({
      quiz: "leadership",
      result: topDimension,
      scores: JSON.stringify(scores),
    });
    router.push(`/quiz-results?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1 text-noctua-black/60 hover:text-noctua-brown text-sm mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-noctua-brown-dark to-noctua-brown rounded-2xl p-8 text-noctua-cream mb-8">
        <div className="inline-block bg-white/20 text-noctua-cream text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-white/30">
          Leadership Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">What&apos;s Your Leadership Style?</h1>
        <p className="text-noctua-cream/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none", letterSpacing: "normal" }}>
          Discover your natural leadership approach and how to leverage it as an OT entrepreneur. Rate each statement
          honestly — there are no right or wrong answers.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-noctua-cream/80">
          <span>⏱ ~5 minutes</span>
          <span>📋 {total} questions</span>
          <span>🎯 Identifies your top style</span>
        </div>
      </div>

      {/* Progress bar */}
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

      {/* Questions */}
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

      {/* Error */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full bg-noctua-brown hover:bg-noctua-brown-dark text-noctua-cream font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        See My Leadership Style
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
      <p className="text-center text-sm text-noctua-black/60 mt-3">
        You&apos;ll see your results and get a free guide on the next page.
      </p>
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import LikertQuestion from "@/components/LikertQuestion";
import Link from "next/link";

const QUESTIONS = [
  // Transformational
  { id: "q1", text: "I inspire others by sharing a compelling vision for the future.", dimension: "transformational" },
  { id: "q2", text: "I encourage my team to challenge assumptions and think creatively.", dimension: "transformational" },
  { id: "q3", text: "I take time to understand each person's individual needs and motivations.", dimension: "transformational" },
  // Servant
  { id: "q4", text: "I prioritize the growth and well-being of the people I work with over my own advancement.", dimension: "servant" },
  { id: "q5", text: "I prefer listening and empowering others rather than directing and controlling.", dimension: "servant" },
  { id: "q6", text: "I define success by the success of my team, not my own achievements.", dimension: "servant" },
  // Democratic
  { id: "q7", text: "I make better decisions when I gather input from everyone involved.", dimension: "democratic" },
  { id: "q8", text: "I value consensus and shared ownership of outcomes.", dimension: "democratic" },
  { id: "q9", text: "I actively seek out different perspectives before finalizing a direction.", dimension: "democratic" },
  // Strategic
  { id: "q10", text: "I enjoy setting long-term goals and breaking them into actionable steps.", dimension: "strategic" },
  { id: "q11", text: "I am comfortable making difficult trade-off decisions under uncertainty.", dimension: "strategic" },
  { id: "q12", text: "I naturally think about the big picture before diving into details.", dimension: "strategic" },
  // Coaching
  { id: "q13", text: "I get genuine satisfaction from helping others develop their skills.", dimension: "coaching" },
  { id: "q14", text: "I prefer guiding people toward solutions rather than giving them the answer.", dimension: "coaching" },
  { id: "q15", text: "I invest significant time in giving feedback and mentoring others.", dimension: "coaching" },
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

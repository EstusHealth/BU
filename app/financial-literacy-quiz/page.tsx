"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import LikertQuestion from "@/components/LikertQuestion";
import Link from "next/link";

const QUESTIONS = [
  { id: "q1", text: "I have a clear understanding of my current monthly income and expenses.", category: "budgeting" },
  { id: "q2", text: "I consistently track my spending against a budget.", category: "budgeting" },
  { id: "q3", text: "I have an emergency fund that covers at least 3 months of expenses.", category: "savings" },
  { id: "q4", text: "I understand the difference between a Roth IRA and a traditional 401(k).", category: "investing" },
  { id: "q5", text: "I know my current credit score and what factors affect it.", category: "credit" },
  { id: "q6", text: "I understand how compound interest works and how it applies to both savings and debt.", category: "debt" },
  { id: "q7", text: "I feel confident in my ability to negotiate my salary or contract rate.", category: "income" },
  { id: "q8", text: "I understand the basic tax implications of being self-employed or an independent contractor.", category: "taxes" },
  { id: "q9", text: "I know the difference between income-driven repayment plans for student loans.", category: "debt" },
  { id: "q10", text: "I have a plan for how I will manage my student loan debt after graduation.", category: "debt" },
  { id: "q11", text: "I understand what malpractice insurance is and why OTs may need it.", category: "insurance" },
  { id: "q12", text: "I feel comfortable making financial decisions without needing someone else to explain them.", category: "confidence" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FinancialLiteracyQuizPage() {
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

    // Score: sum all answers, max = 12 * 5 = 60, normalize to 0-100
    const rawScore = Object.values(answers).reduce((a, b) => a + b, 0);
    const normalizedScore = Math.round(((rawScore - 12) / (60 - 12)) * 100);

    const params = new URLSearchParams({
      quiz: "financial",
      score: normalizedScore.toString(),
    });
    router.push(`/quiz-results?${params.toString()}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 text-sm mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8">
        <div className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-white/30">
          Financial Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Your Financial Readiness Score</h1>
        <p className="text-emerald-100 leading-relaxed">
          Assess your financial knowledge and readiness as an OT entering practice. Be honest — this is about identifying
          where to grow, not judging where you are.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-emerald-100">
          <span>⏱ ~5 minutes</span>
          <span>📋 {total} questions</span>
          <span>💯 Score out of 100</span>
        </div>
      </div>

      {answered > 0 && (
        <div className="mb-6 bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span className="font-medium">Your progress</span>
            <span className="font-semibold text-emerald-600">{answered}/{total} answered</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div
              className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
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
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
      >
        See My Financial Score
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
      <p className="text-center text-sm text-slate-500 mt-3">
        You&apos;ll see your score and get a free financial guide on the next page.
      </p>
    </div>
  );
}

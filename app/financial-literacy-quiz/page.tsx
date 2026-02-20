"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import LikertQuestion from "@/components/LikertQuestion";
import Link from "next/link";

const QUESTIONS = [
  {
    id: "q1",
    text: "I could sit down right now and tell you exactly what my monthly income is — stipends, part-time work, loans — and where every dollar actually goes.",
    category: "budgeting",
  },
  {
    id: "q2",
    text: "Each month I check my actual spending against a real budget — not just roughly in my head, but with a system I actually use.",
    category: "budgeting",
  },
  {
    id: "q3",
    text: "If an unexpected $1,500 expense hit me today — a car repair, a medical bill — I could cover it without going into new debt, because I have an emergency fund.",
    category: "savings",
  },
  {
    id: "q4",
    text: "If a classmate asked me to explain the difference between a Roth IRA and a traditional 401(k) — including which might make more sense for a new-grad OT — I could do it clearly.",
    category: "investing",
  },
  {
    id: "q5",
    text: "I know my current credit score right now, I know what specific factors are affecting it, and I know what I'd need to do to improve it.",
    category: "credit",
  },
  {
    id: "q6",
    text: "I understand exactly how compound interest snowballs over time — and I'm fully aware of how it is working against me in my student loans right now.",
    category: "debt",
  },
  {
    id: "q7",
    text: "If a hospital offered me a salaried position and a private practice offered me a 1099 contract rate, I would know how to compare them and confidently negotiate either.",
    category: "income",
  },
  {
    id: "q8",
    text: "I understand what quarterly estimated taxes, self-employment tax, and Schedule C filing mean — and how they'd apply the moment I started my own OT practice.",
    category: "taxes",
  },
  {
    id: "q9",
    text: "I could explain the real differences between SAVE, PAYE, and IBR income-driven repayment plans to a classmate who just graduated and needed to pick one.",
    category: "debt",
  },
  {
    id: "q10",
    text: "I have a written, realistic plan for how I will handle my student loans in my first year after graduation — not just a vague intention to 'figure it out later.'",
    category: "debt",
  },
  {
    id: "q11",
    text: "I understand what malpractice insurance covers, what it typically costs for OTs, and how my coverage needs would change if I moved from employee to sole practitioner.",
    category: "insurance",
  },
  {
    id: "q12",
    text: "When financial decisions come up — refinancing, retirement contributions, contract terms — I feel genuinely confident making them on my own without needing someone else to walk me through it.",
    category: "confidence",
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
      <Link href="/" className="inline-flex items-center gap-1 text-noctua-black/60 hover:text-noctua-brown text-sm mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      <div className="bg-gradient-to-r from-noctua-brown-dark to-noctua-brown rounded-2xl p-8 text-noctua-cream mb-8">
        <div className="inline-block bg-white/20 text-noctua-cream text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-white/30">
          Financial Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Your Financial Readiness Score</h1>
        <p className="text-noctua-cream/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none", letterSpacing: "normal" }}>
          Assess your financial knowledge and readiness as an OT entering practice. Be honest — this is about identifying
          where to grow, not judging where you are.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-noctua-cream/80">
          <span>⏱ ~5 minutes</span>
          <span>📋 {total} questions</span>
          <span>💯 Score out of 100</span>
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
        See My Financial Score
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
      <p className="text-center text-sm text-noctua-black/60 mt-3">
        You&apos;ll see your score and get a free financial guide on the next page.
      </p>
    </div>
  );
}

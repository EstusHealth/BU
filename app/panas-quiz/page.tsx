"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import LikertQuestion from "@/components/LikertQuestion";
import Link from "next/link";

const PANAS_ITEMS = [
  {
    id: "interested",
    text: "Interested",
    scenario: "I feel a genuine curiosity pulling me in — like I want to understand or explore something more deeply right now.",
    type: "positive",
  },
  {
    id: "excited",
    text: "Excited",
    scenario: "There's an energized anticipation in me — like something I care about is unfolding and building toward something real.",
    type: "positive",
  },
  {
    id: "strong",
    text: "Strong",
    scenario: "I feel capable and solid — like I have the physical and mental resources to handle what's in front of me today.",
    type: "positive",
  },
  {
    id: "enthusiastic",
    text: "Enthusiastic",
    scenario: "I feel genuinely fired up — eager to throw myself into something and bring real energy to it.",
    type: "positive",
  },
  {
    id: "proud",
    text: "Proud",
    scenario: "I feel a quiet confidence in something I've done or who I'm becoming — a sense of earned satisfaction.",
    type: "positive",
  },
  {
    id: "alert",
    text: "Alert",
    scenario: "I feel mentally sharp and switched on — like I'm picking up on cues around me and processing them quickly and clearly.",
    type: "positive",
  },
  {
    id: "inspired",
    text: "Inspired",
    scenario: "Something has sparked a sense of purpose or creative energy in me — I feel moved to act or think differently than I did before.",
    type: "positive",
  },
  {
    id: "determined",
    text: "Determined",
    scenario: "I feel a steady resolve — I know what I'm working toward and I'm not letting obstacles stop me.",
    type: "positive",
  },
  {
    id: "attentive",
    text: "Attentive",
    scenario: "I feel focused and present — tracking what's happening around me with care and awareness, not drifting.",
    type: "positive",
  },
  {
    id: "active",
    text: "Active",
    scenario: "I feel in motion — physically and mentally energized, engaged in what's in front of me rather than passive or withdrawn.",
    type: "positive",
  },
  {
    id: "distressed",
    text: "Distressed",
    scenario: "I feel troubled or overwhelmed — like things are going wrong and I'm struggling to stay on top of it all.",
    type: "negative",
  },
  {
    id: "upset",
    text: "Upset",
    scenario: "Something has unsettled or bothered me emotionally — I feel stirred up and not at ease right now.",
    type: "negative",
  },
  {
    id: "guilty",
    text: "Guilty",
    scenario: "I feel like I've done something wrong or let someone down — a weight of self-blame is sitting with me right now.",
    type: "negative",
  },
  {
    id: "scared",
    text: "Scared",
    scenario: "I feel a real sense of fear — something specific feels genuinely threatening or dangerous to me right now.",
    type: "negative",
  },
  {
    id: "hostile",
    text: "Hostile",
    scenario: "I feel an edge of irritation or resentment — a sharpness in how I'm responding to people or situations around me.",
    type: "negative",
  },
  {
    id: "irritable",
    text: "Irritable",
    scenario: "Small things feel more of an annoyance than usual — I'm quicker to frustration than I'd like to be.",
    type: "negative",
  },
  {
    id: "ashamed",
    text: "Ashamed",
    scenario: "I feel exposed or embarrassed — like I've fallen short of my own standards or been seen in a way I didn't want.",
    type: "negative",
  },
  {
    id: "nervous",
    text: "Nervous",
    scenario: "I feel on edge and uncertain — uneasy about what's ahead or whether I'm ready for what's coming.",
    type: "negative",
  },
  {
    id: "jittery",
    text: "Jittery",
    scenario: "There's a restless, keyed-up energy in me — I can't quite settle, like nervous energy is running just below the surface.",
    type: "negative",
  },
  {
    id: "afraid",
    text: "Afraid",
    scenario: "I feel a sense of apprehension — something specific feels threatening and uncertain, and I'm genuinely worried about it.",
    type: "negative",
  },
];

const PANAS_LABELS = [
  "Very slightly / Not at all",
  "A little",
  "Moderately",
  "Quite a bit",
  "Extremely",
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PANASQuizPage() {
  const router = useRouter();
  const shuffledItems = useMemo(() => shuffle(PANAS_ITEMS), []);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState("");

  const answered = Object.keys(answers).length;
  const total = PANAS_ITEMS.length;
  const progress = Math.round((answered / total) * 100);

  const handleAnswer = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setError("");
  };

  const handleSubmit = () => {
    if (answered < total) {
      setError(`Please rate all ${total} words before submitting. (${total - answered} remaining)`);
      const firstUnanswered = shuffledItems.find((q) => !answers[q.id]);
      if (firstUnanswered) {
        document.getElementById(`q-${firstUnanswered.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const positiveScore = PANAS_ITEMS
      .filter((i) => i.type === "positive")
      .reduce((sum, i) => sum + (answers[i.id] || 0), 0);

    const negativeScore = PANAS_ITEMS
      .filter((i) => i.type === "negative")
      .reduce((sum, i) => sum + (answers[i.id] || 0), 0);

    const params = new URLSearchParams({
      quiz: "panas",
      positive: positiveScore.toString(),
      negative: negativeScore.toString(),
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
          Emotional Assessment
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Your Positive &amp; Negative Affect Profile</h1>
        <p className="text-noctua-cream/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none", letterSpacing: "normal" }}>
          The PANAS (Positive and Negative Affect Schedule) is a validated 20-item scale that measures your current
          emotional state. Below you&apos;ll see 20 words describing different feelings and emotions.
        </p>
        <div className="mt-4 bg-white/15 rounded-xl px-5 py-3 border border-white/30">
          <p className="text-sm font-semibold text-noctua-cream">
            📌 Indicate to what extent you feel this way <strong>right now, at this moment</strong>.
          </p>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-noctua-cream/80">
          <span>⏱ ~5 minutes</span>
          <span>📋 {total} words to rate</span>
          <span>📊 Two separate scores</span>
        </div>
      </div>

      {answered > 0 && (
        <div className="mb-6 bg-white rounded-xl border border-noctua-border p-4 shadow-sm">
          <div className="flex justify-between text-sm text-noctua-black/70 mb-2">
            <span className="font-medium">Your progress</span>
            <span className="font-semibold text-noctua-brown">{answered}/{total} rated</span>
          </div>
          <div className="w-full bg-noctua-muted rounded-full h-2.5">
            <div
              className="bg-noctua-brown h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-noctua-cream border border-noctua-border rounded-xl p-4 mb-6 text-sm text-noctua-brown">
        <p className="font-semibold mb-1">How to respond:</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {PANAS_LABELS.map((label, i) => (
            <span key={i}><span className="font-bold">{i + 1}</span> = {label}</span>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {shuffledItems.map((item, idx) => (
          <div key={item.id} id={`q-${item.id}`}>
            <LikertQuestion
              question={item.text}
              scenario={item.scenario}
              questionNumber={idx + 1}
              name={item.id}
              value={answers[item.id] ?? null}
              onChange={(val) => handleAnswer(item.id, val)}
              labels={PANAS_LABELS}
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
        See My PANAS Results
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
      <p className="text-center text-sm text-noctua-black/60 mt-3">
        You&apos;ll see your positive and negative affect scores on the next page.
      </p>
    </div>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import EmailCapture from "@/components/EmailCapture";

// ---- Leadership result data ----
const LEADERSHIP_RESULTS: Record<string, { title: string; description: string; traits: string[]; tip: string }> = {
  transformational: {
    title: "Transformational Leader",
    description:
      "You lead through inspiration and vision. You naturally energize those around you, painting a compelling picture of the future and challenging your team to reach their full potential.",
    traits: ["Visionary thinking", "Motivates through purpose", "Encourages innovation", "Builds commitment"],
    tip: "Leverage your vision-setting skills to build a brand or practice that others genuinely believe in.",
  },
  servant: {
    title: "Servant Leader",
    description:
      "You put the needs of others first. As a servant leader, you build deep trust by prioritizing the well-being, development, and success of the people you lead — and your community.",
    traits: ["Empathy-first approach", "Builds deep trust", "Community-focused", "Empowers others"],
    tip: "Your relational strength is a competitive advantage in OT. Use it to build a practice where clients feel truly seen.",
  },
  democratic: {
    title: "Democratic Leader",
    description:
      "You believe the best decisions emerge from collective wisdom. You actively seek input, build consensus, and create environments where every voice is valued.",
    traits: ["Inclusive decision-making", "Strong listening skills", "Collaborative by nature", "Shares ownership"],
    tip: "Your collaborative strength shines in group practice models, interdisciplinary teams, and co-founded ventures.",
  },
  strategic: {
    title: "Strategic Leader",
    description:
      "You are a big-picture thinker who excels at planning, prioritizing, and making tough trade-offs. You see the chessboard several moves ahead.",
    traits: ["Systems thinking", "Goal-oriented", "Decisive under uncertainty", "Long-term planner"],
    tip: "Your strategic mindset is invaluable for building scalable OT businesses — from private practice to consulting.",
  },
  coaching: {
    title: "Coaching Leader",
    description:
      "You find deep fulfillment in growing other people. You prefer guiding others to discover their own solutions rather than simply giving answers.",
    traits: ["Develops talent in others", "Patient mentor", "Feedback-focused", "Builds capability"],
    tip: "Consider building mentorship programs, supervision services, or coaching practices alongside clinical work.",
  },
};

// ---- OT Area result data ----
const OT_AREA_RESULTS: Record<string, { title: string; description: string; why: string; settings: string[] }> = {
  clinical: {
    title: "Clinical & Hospital-Based OT",
    description: "You thrive in structured, high-acuity medical environments where you can deliver direct, evidence-based interventions.",
    why: "Your preference for structured settings, direct care, and fast-paced work aligns with acute care and inpatient OT roles.",
    settings: ["Acute care hospitals", "Inpatient rehab", "Outpatient clinics", "Hand therapy centers"],
  },
  school: {
    title: "School-Based OT",
    description: "You are energized by supporting children's participation in educational environments through collaboration with educators and families.",
    why: "Your love for working with children and collaborative teamwork maps perfectly onto school-based OT practice.",
    settings: ["Public K-12 schools", "Special education programs", "Early intervention", "Private learning centers"],
  },
  community: {
    title: "Community Integration Specialist",
    description: "You are passionate about serving people in their natural environments and designing programs that promote community participation.",
    why: "Your preference for home/community settings and program development is the hallmark of community OT practice.",
    settings: ["Community health centers", "Home health agencies", "Nonprofit organizations", "Government programs"],
  },
  private_practice: {
    title: "Private Practice OT / Entrepreneur",
    description: "You crave autonomy, flexibility, and the opportunity to build something of your own — a practice aligned entirely with your values.",
    why: "Your entrepreneurial instincts and desire for independence make private practice a natural fit.",
    settings: ["Independent practice", "Telehealth platforms", "Consulting", "Specialty clinics"],
  },
  pediatric: {
    title: "Pediatric OT Specialist",
    description: "You are deeply drawn to supporting children's development, play, and meaningful participation across childhood.",
    why: "Your connection to children and preference for relationship-focused, developmental work aligns with pediatric OT.",
    settings: ["Pediatric clinics", "Early intervention", "Sensory gyms", "Schools", "Home health"],
  },
  geriatric: {
    title: "Geriatric Care Specialist",
    description: "You find profound meaning in supporting older adults to maintain independence, dignity, and quality of life.",
    why: "Your patience, relationship focus, and commitment to long-term therapeutic partnerships map to geriatric OT.",
    settings: ["Skilled nursing facilities", "Assisted living", "Home health", "Memory care programs"],
  },
  mental_health: {
    title: "Mental Health OT Specialist",
    description: "You see emotional well-being as foundational to function — and you want your practice to reflect that.",
    why: "Your evidence-based mindset and passion for mental health place you at the leading edge of OT's roots.",
    settings: ["Psychiatric hospitals", "Community mental health", "Private practice", "Crisis stabilization"],
  },
  neurodivergent: {
    title: "Neurodivergent / PDA Specialist",
    description: "You are drawn to innovative, advocacy-driven OT practice that centers neurodivergent individuals — especially those with ADHD, autism, or Pathological Demand Avoidance (PDA).",
    why: "Your drive to challenge the status quo and deep empathy for misunderstood populations make this specialty a powerful fit.",
    settings: ["Specialty private practice", "Schools", "Telehealth", "Consulting", "Family coaching"],
  },
  neurorehab: {
    title: "Neurorehabilitation Specialist",
    description: "You are energized by the complexity and urgency of helping people regain function after neurological events.",
    why: "Your fast-paced adaptability and data-driven thinking excel in complex neurorehab settings.",
    settings: ["Inpatient rehab", "Stroke recovery programs", "TBI clinics", "Outpatient neurorehab"],
  },
};

// ---- Financial result logic ----
function getFinancialResult(score: number) {
  if (score >= 80) return { label: "Financial All-Star", interpretation: "You have strong financial literacy. Focus on advanced strategies: investing, tax planning, and building wealth.", color: "emerald" };
  if (score >= 60) return { label: "On the Right Track", interpretation: "Solid financial foundation with clear opportunities to deepen your knowledge, especially around investing and taxes.", color: "blue" };
  if (score >= 40) return { label: "Building Blocks in Place", interpretation: "You have some key concepts down, but there's meaningful room to grow — especially around debt, savings, and self-employment.", color: "amber" };
  return { label: "Room to Grow", interpretation: "Financial literacy is a skill, not a talent. The Financial Literacy Masterclass is designed exactly for where you are now.", color: "rose" };
}

// ---- PANAS interpretation ----
function getPANASInterpretation(positive: number, negative: number) {
  const posStatus = positive >= 35 ? "high" : positive >= 25 ? "average" : "low";
  const negStatus = negative <= 15 ? "low" : negative <= 25 ? "average" : "high";

  const posDesc =
    posStatus === "high" ? "You're experiencing high positive affect — feeling energized, enthusiastic, and engaged." :
    posStatus === "average" ? "Your positive affect is in the average range. There's room to cultivate more joy and engagement." :
    "Your positive affect is below average. This could reflect fatigue, stress, or low engagement right now.";

  const negDesc =
    negStatus === "low" ? "Your negative affect is low, which is a healthy sign — you're not feeling particularly distressed or anxious." :
    negStatus === "average" ? "Your negative affect is in the normal range. Some tension is typical during high-demand periods." :
    "Your negative affect is elevated. It may be worth exploring what's driving distress or anxiety right now.";

  return { posStatus, negStatus, posDesc, negDesc };
}

// ---- Score ring component ----
function ScoreRing({ score, max, color, label }: { score: number; max: number; color: string; label: string }) {
  const pct = (score / max) * 100;
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  const colorMap: Record<string, string> = {
    blue: "#2563eb",
    emerald: "#059669",
    amber: "#d97706",
    rose: "#e11d48",
    green: "#16a34a",
    orange: "#ea580c",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
        <circle
          cx="50" cy="50" r={r} fill="none"
          stroke={colorMap[color] || colorMap.blue}
          strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="-mt-16 flex flex-col items-center">
        <span className="text-2xl font-extrabold text-slate-800">{score}</span>
        <span className="text-xs text-slate-500">out of {max}</span>
      </div>
      <p className="text-sm font-semibold text-slate-700 mt-8">{label}</p>
    </div>
  );
}

function QuizResultsContent() {
  const params = useSearchParams();
  const quiz = params.get("quiz");
  const result = params.get("result") || "";
  const second = params.get("second") || "";
  const score = parseInt(params.get("score") || "0");
  const positive = parseInt(params.get("positive") || "0");
  const negative = parseInt(params.get("negative") || "0");

  let quizName = "Quiz";
  let guideName = "Guide";
  let resultContent: React.ReactNode = null;
  let accentColor = "bg-blue-600";

  if (quiz === "leadership") {
    quizName = "Leadership Quiz";
    guideName = "Leadership Styles Guide";
    const data = LEADERSHIP_RESULTS[result] || LEADERSHIP_RESULTS.transformational;
    accentColor = "bg-blue-600";
    resultContent = (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-7 text-white">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-wider mb-2">Your Leadership Style</p>
          <h2 className="text-3xl font-extrabold mb-3">{data.title}</h2>
          <p className="text-blue-100 leading-relaxed">{data.description}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-4">Key Characteristics</h3>
          <div className="grid grid-cols-2 gap-3">
            {data.traits.map((trait) => (
              <div key={trait} className="flex items-center gap-2 text-sm text-slate-700">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                {trait}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <p className="font-semibold text-blue-800 mb-1">💡 OT Entrepreneur Tip</p>
          <p className="text-blue-900 text-sm">{data.tip}</p>
        </div>
      </div>
    );
  }

  else if (quiz === "financial") {
    quizName = "Financial Literacy Quiz";
    guideName = "Financial Literacy Masterclass for OTs";
    const data = getFinancialResult(score);
    accentColor = "bg-emerald-600";
    resultContent = (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-7 text-white">
          <p className="text-emerald-200 text-sm font-semibold uppercase tracking-wider mb-2">Your Financial Readiness Score</p>
          <div className="flex items-end gap-4 mb-3">
            <span className="text-6xl font-extrabold">{score}</span>
            <span className="text-emerald-300 text-2xl font-bold mb-2">/ 100</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 mb-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-1000"
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-emerald-100 font-semibold">{data.label}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-3">What This Means</h3>
          <p className="text-slate-700 leading-relaxed">{data.interpretation}</p>
        </div>
      </div>
    );
  }

  else if (quiz === "ot-area") {
    quizName = "OT Area Finder Quiz";
    guideName = "Find Your OT Niche Guide";
    const primary = OT_AREA_RESULTS[result] || OT_AREA_RESULTS.clinical;
    const secondary = OT_AREA_RESULTS[second];
    accentColor = "bg-violet-600";
    resultContent = (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-r from-violet-600 to-purple-700 rounded-2xl p-7 text-white">
          <p className="text-violet-200 text-sm font-semibold uppercase tracking-wider mb-2">Your Primary OT Specialization</p>
          <h2 className="text-3xl font-extrabold mb-3">{primary.title}</h2>
          <p className="text-violet-100 leading-relaxed">{primary.description}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 mb-3">Why This Fits You</h3>
          <p className="text-slate-700 leading-relaxed mb-5">{primary.why}</p>
          <h3 className="font-bold text-slate-800 mb-3">Common Work Settings</h3>
          <div className="flex flex-wrap gap-2">
            {primary.settings.map((s) => (
              <span key={s} className="bg-violet-50 border border-violet-200 text-violet-800 text-sm px-3 py-1 rounded-full font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {secondary && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Secondary Fit</p>
            <p className="font-bold text-slate-800 mb-1">{secondary.title}</p>
            <p className="text-slate-600 text-sm">{secondary.description}</p>
          </div>
        )}
      </div>
    );
  }

  else if (quiz === "panas") {
    quizName = "PANAS Quiz";
    guideName = "Building Better Emotional Habits Guide";
    const { posDesc, negDesc } = getPANASInterpretation(positive, negative);
    accentColor = "bg-amber-500";
    resultContent = (
      <div className="space-y-6 animate-fadeIn">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-7 text-white">
          <p className="text-amber-100 text-sm font-semibold uppercase tracking-wider mb-4">Your PANAS Results</p>
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <ScoreRing score={positive} max={50} color="green" label="Positive Affect" />
            </div>
            <div className="text-center">
              <ScoreRing score={negative} max={50} color="orange" label="Negative Affect" />
            </div>
          </div>
          <p className="text-amber-100 text-xs text-center mt-4">
            Average: Positive ~30 · Negative ~15
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-green-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <h3 className="font-bold text-slate-800">Positive Affect ({positive}/50)</h3>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{posDesc}</p>
          </div>
          <div className="bg-white rounded-xl border border-orange-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <h3 className="font-bold text-slate-800">Negative Affect ({negative}/50)</h3>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{negDesc}</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="font-semibold text-amber-800 mb-1">📊 Reference Averages</p>
          <p className="text-amber-900 text-sm">
            Research suggests that healthy adults typically score around <strong>30–35</strong> on positive affect and
            <strong> 10–18</strong> on negative affect. Your scores reflect your emotional state <em>right now</em> — they can change day to day.
          </p>
        </div>
      </div>
    );
  }

  else {
    // Fallback
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">No results found</h1>
        <p className="text-slate-600 mb-6">It looks like you navigated here directly. Please complete a quiz first.</p>
        <Link href="/" className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-700 transition-colors">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back to quiz */}
      <Link href="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-blue-600 text-sm mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* Congrats banner */}
      <div className={`${accentColor} rounded-2xl p-4 text-white text-center mb-6 font-semibold`}>
        ✅ Quiz Complete! Here are your personalized results.
      </div>

      {/* Results */}
      {resultContent}

      {/* Divider */}
      <div className="flex items-center gap-4 my-8">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-slate-500 text-sm font-medium whitespace-nowrap">Get your free guide</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Email capture */}
      <EmailCapture quizName={quizName} guideName={guideName} />

      {/* Other tools */}
      <div className="mt-12">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Explore More Tools</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: "/leadership-quiz", label: "Leadership Quiz", emoji: "🏆" },
            { href: "/financial-literacy-quiz", label: "Financial Literacy Quiz", emoji: "💰" },
            { href: "/ot-area-quiz", label: "OT Area Finder", emoji: "🗺" },
            { href: "/panas-quiz", label: "PANAS Quiz", emoji: "😊" },
            { href: "/loan-calculator", label: "Loan Calculator", emoji: "🧮" },
          ]
            .filter((t) => !t.href.includes(quiz || ""))
            .slice(0, 4)
            .map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center gap-3 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl p-4 transition-all group"
              >
                <span className="text-2xl">{tool.emoji}</span>
                <span className="font-medium text-slate-700 group-hover:text-blue-700 transition-colors text-sm">{tool.label}</span>
                <svg className="w-4 h-4 text-slate-400 group-hover:text-blue-500 ml-auto transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function QuizResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-600">Loading your results...</p>
        </div>
      </div>
    }>
      <QuizResultsContent />
    </Suspense>
  );
}

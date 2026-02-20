"use client";

interface LikertQuestionProps {
  question: string;
  scenario?: string;
  questionNumber: number;
  name: string;
  value: number | null;
  onChange: (value: number) => void;
  labels?: string[];
}

const DEFAULT_LABELS = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

export default function LikertQuestion({
  question,
  scenario,
  questionNumber,
  name,
  value,
  onChange,
  labels = DEFAULT_LABELS,
}: LikertQuestionProps) {
  return (
    <div className="bg-white rounded-xl border border-noctua-border p-5 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-noctua-black font-semibold mb-1 leading-snug" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none", letterSpacing: "normal" }}>
        <span className="text-noctua-brown font-bold mr-2">{questionNumber}.</span>
        {question}
      </p>
      {scenario && (
        <p className="text-noctua-black/60 text-sm mb-5 leading-relaxed pl-5" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none", letterSpacing: "normal" }}>
          {scenario}
        </p>
      )}
      {!scenario && <div className="mb-5" />}

      {/* Mobile: vertical stacked */}
      <div className="flex flex-col gap-2 sm:hidden">
        {labels.map((label, idx) => {
          const score = idx + 1;
          const selected = value === score;
          return (
            <label
              key={score}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                selected
                  ? "bg-noctua-brown border-noctua-brown text-noctua-cream"
                  : "border-noctua-border hover:bg-noctua-tan hover:border-noctua-brown text-noctua-black"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={score}
                checked={selected}
                onChange={() => onChange(score)}
                className="sr-only"
              />
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 border-2 ${
                selected ? "border-noctua-cream bg-noctua-cream text-noctua-brown" : "border-noctua-border text-noctua-black/60"
              }`}>
                {score}
              </span>
              <span className="text-sm font-medium">{label}</span>
            </label>
          );
        })}
      </div>

      {/* Desktop: horizontal */}
      <div className="hidden sm:block">
        <div className="flex justify-between mb-2 px-1">
          <span className="text-xs text-noctua-black/50 font-medium">{labels[0]}</span>
          <span className="text-xs text-noctua-black/50 font-medium">{labels[labels.length - 1]}</span>
        </div>
        <div className="flex gap-2 justify-between">
          {labels.map((label, idx) => {
            const score = idx + 1;
            const selected = value === score;
            return (
              <label
                key={score}
                className="flex flex-col items-center gap-2 cursor-pointer flex-1"
                title={label}
              >
                <input
                  type="radio"
                  name={name}
                  value={score}
                  checked={selected}
                  onChange={() => onChange(score)}
                  className="sr-only"
                />
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all hover:scale-110 ${
                  selected
                    ? "bg-noctua-brown border-noctua-brown text-noctua-cream shadow-md"
                    : "border-noctua-border text-noctua-black/60 hover:border-noctua-brown hover:bg-noctua-tan"
                }`}>
                  {score}
                </div>
                <span className="text-xs text-noctua-black/50 text-center leading-tight hidden lg:block w-16">
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {value === null && (
        <p className="text-xs text-noctua-black/40 mt-3 italic">Please select an answer</p>
      )}
    </div>
  );
}

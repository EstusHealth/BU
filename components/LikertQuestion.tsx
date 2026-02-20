"use client";

interface LikertQuestionProps {
  question: string;
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
  questionNumber,
  name,
  value,
  onChange,
  labels = DEFAULT_LABELS,
}: LikertQuestionProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-slate-800 font-medium mb-5 leading-relaxed">
        <span className="text-blue-600 font-bold mr-2">{questionNumber}.</span>
        {question}
      </p>

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
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-slate-700"
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
                selected ? "border-white bg-white text-blue-600" : "border-slate-300 text-slate-500"
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
          <span className="text-xs text-slate-500 font-medium">{labels[0]}</span>
          <span className="text-xs text-slate-500 font-medium">{labels[labels.length - 1]}</span>
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
                    ? "bg-blue-600 border-blue-600 text-white shadow-md"
                    : "border-slate-300 text-slate-500 hover:border-blue-400 hover:bg-blue-50"
                }`}>
                  {score}
                </div>
                <span className="text-xs text-slate-500 text-center leading-tight hidden lg:block w-16">
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {value === null && (
        <p className="text-xs text-slate-400 mt-3 italic">Please select an answer</p>
      )}
    </div>
  );
}

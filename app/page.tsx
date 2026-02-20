import Link from "next/link";

const tools = [
  {
    href: "/leadership-quiz",
    title: "Leadership Style Quiz",
    description: "Discover your natural leadership style and how to leverage it as an OT entrepreneur.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    color: "blue",
    badge: "5 min",
  },
  {
    href: "/financial-literacy-quiz",
    title: "Financial Literacy Quiz",
    description: "Assess your financial readiness and get a personalized score with actionable next steps.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: "emerald",
    badge: "5 min",
  },
  {
    href: "/ot-area-quiz",
    title: "Ideal OT Area Finder",
    description: "Find your ideal OT specialization based on your values, strengths, and practice preferences.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    color: "violet",
    badge: "7 min",
  },
  {
    href: "/panas-quiz",
    title: "Happiness & Affect Quiz",
    description: "Measure your positive and negative affect with the validated 20-item PANAS assessment.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "amber",
    badge: "5 min",
  },
  {
    href: "/loan-calculator",
    title: "Student Loan Calculator",
    description: "Compare repayment strategies and see exactly how much interest you can save.",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "rose",
    badge: "Interactive",
  },
];

const colorMap: Record<string, { bg: string; icon: string; badge: string; border: string; hover: string }> = {
  blue: { bg: "bg-blue-50", icon: "text-blue-600", badge: "bg-blue-100 text-blue-700", border: "border-blue-100", hover: "hover:border-blue-300 hover:shadow-blue-100" },
  emerald: { bg: "bg-emerald-50", icon: "text-emerald-600", badge: "bg-emerald-100 text-emerald-700", border: "border-emerald-100", hover: "hover:border-emerald-300 hover:shadow-emerald-100" },
  violet: { bg: "bg-violet-50", icon: "text-violet-600", badge: "bg-violet-100 text-violet-700", border: "border-violet-100", hover: "hover:border-violet-300 hover:shadow-violet-100" },
  amber: { bg: "bg-amber-50", icon: "text-amber-600", badge: "bg-amber-100 text-amber-700", border: "border-amber-100", hover: "hover:border-amber-300 hover:shadow-amber-100" },
  rose: { bg: "bg-rose-50", icon: "text-rose-600", badge: "bg-rose-100 text-rose-700", border: "border-rose-100", hover: "hover:border-rose-300 hover:shadow-rose-100" },
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/30">
            Boston University OTD Presentation
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
            Self-Entrepreneurship Tools
            <br />
            <span className="text-cyan-200">for OTs</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Companion tools from Liam Fagan&apos;s Boston University presentation. Assess your leadership, finances, and career fit — then get a personalized free guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#tools"
              className="bg-white text-blue-700 font-bold py-3 px-8 rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Explore the Tools
            </a>
            <a
              href="/panas-quiz"
              className="bg-white/10 backdrop-blur-sm border border-white/40 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/20 transition-colors"
            >
              Start a Quiz
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-slate-200 py-5">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-3 divide-x divide-slate-200">
          {[
            { num: "4", label: "Validated Quizzes" },
            { num: "1", label: "Loan Calculator" },
            { num: "4", label: "Free Guides" },
          ].map((stat) => (
            <div key={stat.label} className="text-center px-4">
              <div className="text-2xl font-extrabold text-blue-700">{stat.num}</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Your Toolkit</h2>
          <p className="text-slate-600 text-lg max-w-xl mx-auto">
            Five interactive tools to help you understand yourself and plan your OT career with confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const c = colorMap[tool.color];
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group bg-white rounded-2xl border-2 ${c.border} p-6 shadow-sm hover:shadow-lg ${c.hover} transition-all duration-200 flex flex-col`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${c.bg} ${c.icon} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    {tool.icon}
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">
                  {tool.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-semibold">
                  Get started
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* About section */}
      <section className="bg-white border-t border-slate-200 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">About This Resource</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            These tools were created by <strong>Liam Fagan</strong> at Estus Health to accompany his presentation
            on self-entrepreneurship for Boston University OTD students. Each quiz takes 5–7 minutes and provides
            personalized insights along with a free downloadable guide.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
            {[
              { icon: "🎯", title: "Evidence-Based", desc: "Quizzes grounded in validated assessments and OT research" },
              { icon: "🔒", title: "No Account Needed", desc: "Just complete the quiz and get your results instantly" },
              { icon: "📧", title: "Free Guides", desc: "Get a personalized PDF guide delivered to your inbox" },
            ].map((item) => (
              <div key={item.title} className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

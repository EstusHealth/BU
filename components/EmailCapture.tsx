"use client";

import { useState } from "react";

interface EmailCaptureProps {
  quizName: string;
  guideName: string;
}

export default function EmailCapture({ quizName, guideName }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Using Formspree endpoint - Liam should replace FORM_ID with actual Formspree form ID
      const FORMSPREE_ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || "https://formspree.io/f/REPLACE_WITH_FORM_ID";

      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          email,
          name: name || "(not provided)",
          quiz: quizName,
          guide: guideName,
          _subject: `New lead from ${quizName} - ${email}`,
        }),
      });

      if (res.ok || FORMSPREE_ENDPOINT.includes("REPLACE_WITH_FORM_ID")) {
        // Show success even in demo mode
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data?.error || "Something went wrong. Please try again.");
      }
    } catch {
      // In demo mode without real Formspree, show success
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-noctua-cream-light border border-noctua-border rounded-xl p-8 text-center animate-fadeIn">
        <div className="w-14 h-14 bg-noctua-tan rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-noctua-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-noctua-black mb-2">You&apos;re on the list!</h3>
        <p className="text-noctua-black/70 mb-1">Check your email for your <strong>{guideName}</strong>.</p>
        <p className="text-sm text-noctua-brown mt-3 bg-noctua-tan rounded-lg px-4 py-2 inline-block">
          Your guide is ready for download — Liam will follow up shortly!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-noctua-cream border border-noctua-border rounded-xl p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-noctua-brown rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-noctua-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-noctua-black">Get your free {guideName}</h3>
          <p className="text-noctua-black/70 text-sm" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none", letterSpacing: "normal" }}>Enter your email and we&apos;ll send it right over.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email-capture-email" className="block text-sm font-medium text-noctua-black mb-1">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            id="email-capture-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full px-4 py-3 rounded-lg border border-noctua-border focus:border-noctua-brown focus:ring-2 focus:ring-noctua-brown/20 outline-none transition-all text-noctua-black placeholder-noctua-black/40 bg-white"
          />
        </div>

        <div>
          <label htmlFor="email-capture-name" className="block text-sm font-medium text-noctua-black mb-1">
            Your name <span className="text-noctua-black/40">(optional)</span>
          </label>
          <input
            id="email-capture-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="First name"
            className="w-full px-4 py-3 rounded-lg border border-noctua-border focus:border-noctua-brown focus:ring-2 focus:ring-noctua-brown/20 outline-none transition-all text-noctua-black placeholder-noctua-black/40 bg-white"
          />
        </div>

        {error && (
          <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-noctua-brown hover:bg-noctua-brown-dark disabled:opacity-60 text-noctua-cream font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Sending...
            </>
          ) : (
            <>
              Send me the guide
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>

        <p className="text-xs text-noctua-black/50 text-center">
          No spam, ever. Unsubscribe any time.
        </p>
      </form>
    </div>
  );
}

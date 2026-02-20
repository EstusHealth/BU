"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-blue-700 text-xl hover:text-blue-800 transition-colors">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="14" fill="#2563eb"/>
              <path d="M8 14c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" fill="white" fillOpacity="0.3"/>
              <path d="M11 14c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z" fill="white"/>
            </svg>
            Estus Health
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/leadership-quiz" className="hover:text-blue-600 transition-colors">Leadership</Link>
            <Link href="/financial-literacy-quiz" className="hover:text-blue-600 transition-colors">Financial</Link>
            <Link href="/ot-area-quiz" className="hover:text-blue-600 transition-colors">OT Finder</Link>
            <Link href="/panas-quiz" className="hover:text-blue-600 transition-colors">PANAS</Link>
            <Link href="/loan-calculator" className="hover:text-blue-600 transition-colors">Calculator</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-200 py-3 space-y-1">
            {[
              { href: "/leadership-quiz", label: "Leadership Quiz" },
              { href: "/financial-literacy-quiz", label: "Financial Literacy Quiz" },
              { href: "/ot-area-quiz", label: "OT Area Finder" },
              { href: "/panas-quiz", label: "PANAS Quiz" },
              { href: "/loan-calculator", label: "Loan Calculator" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

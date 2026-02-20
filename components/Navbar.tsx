"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-noctua-cream border-b border-noctua-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-noctua-brown text-xl hover:text-noctua-brown-dark transition-colors">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="14" fill="#79543A"/>
              <path d="M8 14c0-3.314 2.686-6 6-6s6 2.686 6 6-2.686 6-6 6-6-2.686-6-6z" fill="white" fillOpacity="0.3"/>
              <path d="M11 14c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z" fill="white"/>
            </svg>
            Estus Health
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-noctua-black/70">
            <Link href="/leadership-quiz" className="hover:text-noctua-brown transition-colors">Leadership</Link>
            <Link href="/financial-literacy-quiz" className="hover:text-noctua-brown transition-colors">Financial</Link>
            <Link href="/ot-area-quiz" className="hover:text-noctua-brown transition-colors">OT Finder</Link>
            <Link href="/panas-quiz" className="hover:text-noctua-brown transition-colors">PANAS</Link>
            <Link href="/loan-calculator" className="hover:text-noctua-brown transition-colors">Calculator</Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md text-noctua-black hover:bg-noctua-tan transition-colors"
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
          <div className="md:hidden border-t border-noctua-border py-3 space-y-1">
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
                className="block px-3 py-2 rounded-md text-noctua-black hover:bg-noctua-tan hover:text-noctua-brown transition-colors font-medium"
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

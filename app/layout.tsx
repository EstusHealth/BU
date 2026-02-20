import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Estus Health | Self-Entrepreneurship Tools for OTs",
  description: "Companion tools from Liam Fagan's Boston University presentation. Quizzes and calculators for OT students exploring entrepreneurship.",
  keywords: "occupational therapy, entrepreneurship, OT students, leadership quiz, financial literacy, PANAS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-slate-900 text-slate-300 py-10 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold text-lg mb-3">Estus Health</h3>
                <p className="text-sm leading-relaxed">
                  Self-entrepreneurship tools and resources for occupational therapy students and practitioners.
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Tools</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/leadership-quiz" className="hover:text-blue-400 transition-colors">Leadership Quiz</a></li>
                  <li><a href="/financial-literacy-quiz" className="hover:text-blue-400 transition-colors">Financial Literacy Quiz</a></li>
                  <li><a href="/ot-area-quiz" className="hover:text-blue-400 transition-colors">OT Area Finder</a></li>
                  <li><a href="/panas-quiz" className="hover:text-blue-400 transition-colors">PANAS Quiz</a></li>
                  <li><a href="/loan-calculator" className="hover:text-blue-400 transition-colors">Loan Calculator</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Presented By</h3>
                <p className="text-sm">Liam Fagan</p>
                <p className="text-sm text-slate-400">Boston University OTD Program</p>
              </div>
            </div>
            <div className="border-t border-slate-700 mt-8 pt-6 text-center text-sm text-slate-500">
              <p>&copy; {new Date().getFullYear()} Estus Health. All rights reserved.</p>
              <p className="mt-1">For educational purposes only. Not financial or medical advice.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

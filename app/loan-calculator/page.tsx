"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ---- Math helpers ----
function monthlyPayment(principal: number, annualRate: number, months: number): number {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

function totalInterest(principal: number, monthlyPmt: number, months: number): number {
  return Math.max(0, monthlyPmt * months - principal);
}

function payoffMonths(principal: number, annualRate: number, payment: number): number {
  if (annualRate === 0) return Math.ceil(principal / payment);
  const r = annualRate / 100 / 12;
  if (payment <= principal * r) return Infinity; // Payment doesn't cover interest
  return Math.ceil(Math.log(payment / (payment - principal * r)) / Math.log(1 + r));
}

function formatCurrency(n: number): string {
  if (!isFinite(n)) return "Never";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function formatMonths(months: number): string {
  if (!isFinite(months) || months > 600) return "30+ years";
  const years = Math.floor(months / 12);
  const mo = months % 12;
  if (years === 0) return `${mo} month${mo !== 1 ? "s" : ""}`;
  if (mo === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years} yr ${mo} mo`;
}

function addMonths(months: number): string {
  if (!isFinite(months) || months > 600) return "30+ years from now";
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

// ---- Number input component ----
function NumberInput({
  label, value, onChange, prefix, suffix, placeholder, min, max, step, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  prefix?: string; suffix?: string; placeholder?: string;
  min?: number; max?: number; step?: number; hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-noctua-black mb-1">{label}</label>
      {hint && <p className="text-xs text-noctua-black/50 mb-1.5">{hint}</p>}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-noctua-black/50 font-medium text-sm pointer-events-none">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step ?? 1}
          className={`w-full py-3 border border-noctua-border rounded-lg focus:border-noctua-brown focus:ring-2 focus:ring-noctua-brown/20 outline-none transition-all text-noctua-black bg-white ${prefix ? "pl-8 pr-4" : suffix ? "pl-4 pr-10" : "px-4"}`}
        />
        {suffix && (
          <span className="absolute right-3 text-noctua-black/50 font-medium text-sm pointer-events-none">{suffix}</span>
        )}
      </div>
    </div>
  );
}

// ---- Result card ----
function ResultCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? "bg-noctua-cream border-noctua-border" : "bg-noctua-cream-light border-noctua-border"}`}>
      <p className="text-xs font-semibold text-noctua-black/50 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-xl font-extrabold ${highlight ? "text-blue-700" : "text-slate-800"}`}>{value}</p>
      {sub && <p className="text-xs text-noctua-black/50 mt-0.5">{sub}</p>}
    </div>
  );
}

// ---- Tabs ----
const TABS = [
  { id: "standard", label: "Standard 10-Year" },
  { id: "extra", label: "Extra Payments" },
  { id: "idr", label: "Income-Driven" },
  { id: "refi", label: "Refinancing" },
];

export default function LoanCalculatorPage() {
  const [balance, setBalance] = useState("50000");
  const [rate, setRate] = useState("6.5");
  const [currentPayment, setCurrentPayment] = useState("");
  const [activeTab, setActiveTab] = useState("standard");

  // Extra payment tab
  const [extraPayment, setExtraPayment] = useState("200");

  // IDR tab
  const [income, setIncome] = useState("55000");

  // Refi tab
  const [refiRate, setRefiRate] = useState("4.5");

  const bal = parseFloat(balance) || 0;
  const apr = parseFloat(rate) || 0;
  const currentPmt = parseFloat(currentPayment) || 0;

  // ---- Strategy 1: Standard 10-year ----
  const std = useMemo(() => {
    const pmt = monthlyPayment(bal, apr, 120);
    const interest = totalInterest(bal, pmt, 120);
    return { pmt, interest, months: 120 };
  }, [bal, apr]);

  // ---- Strategy 2: Extra payments ----
  const extra = useMemo(() => {
    const basePmt = std.pmt;
    const ep = parseFloat(extraPayment) || 0;
    const totalPmt = basePmt + ep;
    const months = payoffMonths(bal, apr, totalPmt);
    const interest = totalInterest(bal, totalPmt, months);
    const saved = std.interest - interest;
    const monthsSaved = std.months - months;
    return { pmt: totalPmt, months, interest, saved: Math.max(0, saved), monthsSaved: Math.max(0, monthsSaved) };
  }, [bal, apr, extraPayment, std]);

  // ---- Strategy 3: Income-driven ----
  const idr = useMemo(() => {
    const annualIncome = parseFloat(income) || 0;
    // Discretionary income = AGI - 150% of poverty line (~$21,870 for 2024 single)
    const povertyLine = 14580;
    const discretionary = Math.max(0, annualIncome - povertyLine * 1.5);
    const monthlyPmt = Math.max(0, (discretionary * 0.1) / 12);
    const idrMonths = 240; // 20 years
    let remaining = bal;
    let totalPaid = 0;
    const r = apr / 100 / 12;
    for (let i = 0; i < idrMonths; i++) {
      const interestAccrued = remaining * r;
      const payment = Math.min(monthlyPmt, remaining + interestAccrued);
      totalPaid += payment;
      remaining = remaining + interestAccrued - payment;
      if (remaining <= 0) { remaining = 0; break; }
    }
    const forgiven = Math.max(0, remaining);
    return { monthlyPmt, totalPaid, forgiven, idrMonths };
  }, [income, bal, apr]);

  // ---- Strategy 4: Refi ----
  const refi = useMemo(() => {
    const newRate = parseFloat(refiRate) || 0;
    const pmt = monthlyPayment(bal, newRate, 120);
    const interest = totalInterest(bal, pmt, 120);
    const saved = std.interest - interest;
    return { pmt, interest, saved: Math.max(0, saved) };
  }, [bal, refiRate, std.interest]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-noctua-black/60 hover:text-noctua-brown text-sm mb-6 transition-colors">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-r from-noctua-brown-dark to-noctua-brown rounded-2xl p-8 text-noctua-cream mb-8">
        <div className="inline-block bg-white/20 text-noctua-cream text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-white/30">
          Financial Tool
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">Student Loan Payoff Calculator</h1>
        <p className="text-noctua-cream/80 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif", textTransform: "none", letterSpacing: "normal" }}>
          Compare repayment strategies side by side. Enter your loan details below, then explore each strategy tab.
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-noctua-border shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-noctua-black mb-5 flex items-center gap-2">
          <svg className="w-5 h-5 text-noctua-brown" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Your Loan Details
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <NumberInput
            label="Current Loan Balance"
            value={balance}
            onChange={setBalance}
            prefix="$"
            placeholder="50000"
            min={0}
            hint="Total amount you owe"
          />
          <NumberInput
            label="Annual Interest Rate"
            value={rate}
            onChange={setRate}
            suffix="%"
            placeholder="6.5"
            min={0}
            max={25}
            step={0.1}
            hint="Your current loan APR"
          />
          <NumberInput
            label="Current Monthly Payment"
            value={currentPayment}
            onChange={setCurrentPayment}
            prefix="$"
            placeholder={`${formatCurrency(std.pmt).replace("$", "")} (auto)`}
            min={0}
            hint="Leave blank to auto-calculate"
          />
        </div>
      </div>

      {/* Strategy tabs */}
      <div className="bg-white rounded-2xl border border-noctua-border shadow-sm overflow-hidden mb-6">
        {/* Tab bar */}
        <div className="flex border-b border-noctua-border overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-5 py-4 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-noctua-brown text-noctua-brown bg-noctua-cream"
                  : "border-transparent text-noctua-black/70 hover:text-noctua-black hover:bg-noctua-cream-light"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Standard 10-Year */}
          {activeTab === "standard" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-noctua-black mb-1">Standard 10-Year Repayment</h3>
                <p className="text-noctua-black/70 text-sm">
                  The federal standard plan: 120 equal monthly payments over 10 years.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ResultCard label="Monthly Payment" value={formatCurrency(std.pmt)} highlight />
                <ResultCard label="Total Interest" value={formatCurrency(std.interest)} />
                <ResultCard label="Payoff Date" value={addMonths(std.months)} />
                <ResultCard label="Total Cost" value={formatCurrency(bal + std.interest)} />
              </div>

              {/* Progress bar visual */}
              <div className="bg-noctua-cream-light rounded-xl p-4 border border-noctua-border">
                <p className="text-sm font-semibold text-noctua-black mb-3">Loan Breakdown</p>
                <div className="flex h-8 rounded-full overflow-hidden">
                  <div
                    className="bg-noctua-brown flex items-center justify-center text-xs text-noctua-cream font-semibold"
                    style={{ width: `${(bal / (bal + std.interest)) * 100}%` }}
                  >
                    Principal
                  </div>
                  <div
                    className="bg-noctua-brown-dark flex items-center justify-center text-xs text-noctua-cream font-semibold"
                    style={{ width: `${(std.interest / (bal + std.interest)) * 100}%` }}
                  >
                    Interest
                  </div>
                </div>
                <div className="flex gap-6 mt-2 text-xs text-noctua-black/70">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-noctua-brown inline-block"></span> Principal: {formatCurrency(bal)}</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-noctua-brown-dark inline-block"></span> Interest: {formatCurrency(std.interest)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Extra Payments */}
          {activeTab === "extra" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-noctua-black mb-1">Aggressive Extra Payment Strategy</h3>
                <p className="text-noctua-black/70 text-sm">
                  Pay extra each month beyond your minimum and dramatically reduce total interest paid.
                </p>
              </div>

              <div className="max-w-xs">
                <NumberInput
                  label="Extra Monthly Payment"
                  value={extraPayment}
                  onChange={setExtraPayment}
                  prefix="$"
                  placeholder="200"
                  min={0}
                  hint="Amount above your minimum payment"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ResultCard label="New Monthly Payment" value={formatCurrency(extra.pmt)} highlight />
                <ResultCard label="Payoff Date" value={isFinite(extra.months) ? addMonths(extra.months) : "N/A"} />
                <ResultCard label="Total Interest" value={formatCurrency(extra.interest)} />
                <ResultCard label="Interest Saved" value={formatCurrency(extra.saved)} />
              </div>

              <div className="bg-noctua-cream-light border border-noctua-border rounded-xl p-4">
                <p className="font-semibold text-noctua-black mb-2">Savings Summary</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-noctua-black/70">Time saved</p>
                    <p className="font-bold text-noctua-black">{isFinite(extra.monthsSaved) ? formatMonths(extra.monthsSaved) : "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-noctua-black/70">Money saved</p>
                    <p className="font-bold text-noctua-brown">{formatCurrency(extra.saved)}</p>
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="bg-noctua-cream-light border border-noctua-border rounded-xl p-4">
                <p className="text-sm font-semibold text-noctua-black mb-3">Comparison vs. Standard Plan</p>
                <div className="space-y-2">
                  {[
                    { label: "Standard Plan", months: std.months, interest: std.interest, color: "bg-noctua-border" },
                    { label: "With Extra Payments", months: extra.months, interest: extra.interest, color: "bg-noctua-brown" },
                  ].map((plan) => (
                    <div key={plan.label} className="flex items-center gap-3 text-sm">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${plan.color}`} />
                      <span className="text-noctua-black/70 w-40">{plan.label}</span>
                      <span className="font-semibold text-noctua-black">{isFinite(plan.months) ? formatMonths(plan.months) : "30+ yr"}</span>
                      <span className="text-noctua-black/50 ml-2">{formatCurrency(plan.interest)} interest</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* IDR */}
          {activeTab === "idr" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-noctua-black mb-1">Income-Driven Repayment (IDR)</h3>
                <p className="text-noctua-black/70 text-sm">
                  Federal IDR plans cap your payment at 10% of discretionary income, with forgiveness after 20 years.
                </p>
              </div>

              <div className="max-w-xs">
                <NumberInput
                  label="Annual Gross Income"
                  value={income}
                  onChange={setIncome}
                  prefix="$"
                  placeholder="55000"
                  min={0}
                  hint="Your expected starting salary"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ResultCard label="Est. Monthly Payment" value={formatCurrency(idr.monthlyPmt)} highlight />
                <ResultCard label="Repayment Period" value="20 years" />
                <ResultCard label="Total Paid" value={formatCurrency(idr.totalPaid)} />
                <ResultCard label="Amount Forgiven" value={formatCurrency(idr.forgiven)} />
              </div>

              <div className="bg-noctua-cream border border-noctua-border rounded-xl p-5 space-y-3">
                <p className="font-semibold text-noctua-black">Key Considerations</p>
                <ul className="text-sm text-noctua-black/80 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-noctua-brown mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Payment is recalculated annually based on your income and family size.
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-noctua-brown mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    Forgiven amounts may be taxable as income (unless PSLF applies).
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-noctua-brown mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <strong>PSLF:</strong> If you work for a nonprofit or government employer, loans may be forgiven after just 10 years (120 payments) — tax-free!
                  </li>
                </ul>
              </div>

              {/* Comparison to standard */}
              <div className="bg-noctua-cream-light border border-noctua-border rounded-xl p-4">
                <p className="text-sm font-semibold text-noctua-black mb-3">Comparison vs. Standard 10-Year</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-noctua-black/50 mb-1">Standard Plan</p>
                    <p className="font-bold text-noctua-black">{formatCurrency(std.pmt)}/mo</p>
                    <p className="text-noctua-black/50">10 yr · {formatCurrency(std.interest)} interest</p>
                  </div>
                  <div>
                    <p className="text-noctua-black/50 mb-1">Income-Driven</p>
                    <p className="font-bold text-noctua-brown">{formatCurrency(idr.monthlyPmt)}/mo</p>
                    <p className="text-noctua-black/50">20 yr · {formatCurrency(idr.forgiven)} forgiven</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Refi */}
          {activeTab === "refi" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-noctua-black mb-1">Refinancing Option</h3>
                <p className="text-noctua-black/70 text-sm">
                  Refinancing at a lower rate can significantly reduce your total interest paid. Note: refinancing federal
                  loans makes you ineligible for federal protections like IDR and PSLF.
                </p>
              </div>

              <div className="max-w-xs">
                <NumberInput
                  label="New Refinance Interest Rate"
                  value={refiRate}
                  onChange={setRefiRate}
                  suffix="%"
                  placeholder="4.5"
                  min={0}
                  max={25}
                  step={0.1}
                  hint="Rate offered by private lender"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <ResultCard label="New Monthly Payment" value={formatCurrency(refi.pmt)} highlight />
                <ResultCard label="Total Interest" value={formatCurrency(refi.interest)} />
                <ResultCard label="Interest Saved" value={formatCurrency(refi.saved)} />
                <ResultCard label="Payoff Date" value={addMonths(120)} />
              </div>

              <div className="bg-noctua-cream border border-noctua-border rounded-xl p-5">
                <p className="font-semibold text-noctua-black mb-2">⚠️ Before You Refinance</p>
                <ul className="text-sm text-noctua-black/80 space-y-1.5">
                  <li>• You lose access to federal income-driven repayment plans</li>
                  <li>• You are no longer eligible for Public Service Loan Forgiveness</li>
                  <li>• Federal forbearance and deferment options may be limited</li>
                  <li>• Best for those with stable income who don&apos;t qualify for PSLF</li>
                </ul>
              </div>

              {/* Comparison */}
              <div className="bg-noctua-cream-light border border-noctua-border rounded-xl p-4">
                <p className="text-sm font-semibold text-noctua-black mb-3">Rate Comparison</p>
                <div className="space-y-3">
                  {[
                    { label: "Current Rate", rate: apr, interest: std.interest, pmt: std.pmt },
                    { label: "Refinanced Rate", rate: parseFloat(refiRate) || 0, interest: refi.interest, pmt: refi.pmt },
                  ].map((plan) => (
                    <div key={plan.label} className="flex flex-wrap gap-4 text-sm">
                      <span className="text-noctua-black/50 w-36">{plan.label}: <strong className="text-noctua-black">{plan.rate}%</strong></span>
                      <span className="text-noctua-black/70">{formatCurrency(plan.pmt)}/mo</span>
                      <span className="text-noctua-black/70">{formatCurrency(plan.interest)} total interest</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-noctua-cream-light border border-noctua-border rounded-xl px-5 py-4 text-sm text-noctua-black/70 flex items-start gap-3">
        <svg className="w-5 h-5 text-noctua-black/40 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          <strong>Disclaimer:</strong> This calculator is for educational purposes and does not constitute financial advice. Results are estimates
          based on simplified calculations. Consult a licensed financial advisor for personalized guidance on your student loans.
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  TrendingDown,
  Wallet,
  Receipt,
  BarChart3,
  Lightbulb,
  Percent,
} from "lucide-react";
import { formatIndianNumber } from "@/lib/formatters";
import { calculateTax, compareRegimes } from "@/lib/taxCalculator";
import type { Deductions, TaxInput } from "@/lib/taxCalculator";
import Navbar from "@/components/Navbar";
import IncomeInput from "@/components/IncomeInput";
import DeductionInput from "@/components/DeductionInput";
import TaxBreakdown from "@/components/TaxBreakdown";
import SavingsPlanner from "@/components/SavingsPlanner";

const STORAGE_KEY = "taxcalc_userdata";

interface UserData {
  monthlyIncome: number;
  otherIncome: number;
  incomeFromAbroad: boolean;
  gstRegistered: boolean;
  taxRegime: "old" | "new";
  deductions: Deductions;
}

function loadFromStorage(): UserData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function saveToStorage(data: UserData) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

const defaultDeductions: Deductions = {
  section80C: 0,
  section80D: 0,
  hra: 0,
  homeLoanInterest: 0,
  professionalTax: 0,
  nps80CCD: 0,
  businessExpenses: 0,
};

const sections = [
  { id: "income", label: "Income", icon: IndianRupee },
  { id: "deductions", label: "Deductions", icon: Receipt },
  { id: "breakdown", label: "Tax Breakdown", icon: BarChart3 },
  { id: "savings", label: "Savings Planner", icon: Lightbulb },
] as const;

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("income");
  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [otherIncome, setOtherIncome] = useState(0);
  const [incomeFromAbroad, setIncomeFromAbroad] = useState(false);
  const [gstRegistered, setGstRegistered] = useState(false);
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("new");
  const [deductions, setDeductions] = useState<Deductions>(defaultDeductions);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) {
      setMonthlyIncome(saved.monthlyIncome);
      setOtherIncome(saved.otherIncome);
      setIncomeFromAbroad(saved.incomeFromAbroad);
      setGstRegistered(saved.gstRegistered);
      setTaxRegime(saved.taxRegime);
      setDeductions(saved.deductions);
    }
    setInitialized(true);
  }, []);

  const persist = useCallback(() => {
    saveToStorage({
      monthlyIncome,
      otherIncome,
      incomeFromAbroad,
      gstRegistered,
      taxRegime,
      deductions,
    });
  }, [monthlyIncome, otherIncome, incomeFromAbroad, gstRegistered, taxRegime, deductions]);

  useEffect(() => {
    if (initialized) persist();
  }, [persist, initialized]);

  const taxInput: TaxInput = useMemo(
    () => ({
      monthlyIncome,
      otherIncome,
      incomeFromAbroad,
      gstRegistered,
      taxRegime,
      deductions,
    }),
    [monthlyIncome, otherIncome, incomeFromAbroad, gstRegistered, taxRegime, deductions]
  );

  const result = useMemo(() => calculateTax(taxInput), [taxInput]);

  const comparison = useMemo(() => {
    return compareRegimes(taxInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxInput]);

  const handleDeductionChange = (key: keyof Deductions, value: number) => {
    setDeductions((prev) => ({ ...prev, [key]: value }));
  };

  const summaryCards = [
    {
      label: "Total Annual Income",
      value: result.grossIncome,
      icon: IndianRupee,
      color: "text-white",
      bg: "bg-white/5",
    },
    {
      label: "Estimated Tax",
      value: result.totalTax,
      icon: TrendingDown,
      color: "text-red-400",
      bg: "bg-red-500/5",
    },
    {
      label: "In-Hand Amount",
      value: result.inHandAmount,
      icon: Wallet,
      color: "text-accent",
      bg: "bg-accent/5",
    },
    {
      label: "Effective Tax Rate",
      value: result.effectiveTaxRate,
      icon: Percent,
      color: "text-yellow-400",
      bg: "bg-yellow-500/5",
      isPercent: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Freelancer Tax Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Real-time tax calculations for Indian freelancers
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {summaryCards.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <span className="text-xs text-gray-400">{card.label}</span>
              </div>
              <div className={`text-lg sm:text-xl font-bold ${card.color}`}>
                {card.isPercent
                  ? `${result.effectiveTaxRate.toFixed(1)}%`
                  : formatIndianNumber(Math.round(card.value as number))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeSection === section.id
                  ? "bg-accent text-black"
                  : "bg-card text-gray-400 hover:text-white border border-card-border"
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {activeSection === "income" && (
          <IncomeInput
            monthlyIncome={monthlyIncome}
            otherIncome={otherIncome}
            incomeFromAbroad={incomeFromAbroad}
            gstRegistered={gstRegistered}
            taxRegime={taxRegime}
            onMonthlyIncomeChange={setMonthlyIncome}
            onOtherIncomeChange={setOtherIncome}
            onIncomeFromAbroadChange={setIncomeFromAbroad}
            onGstRegisteredChange={setGstRegistered}
            onTaxRegimeChange={setTaxRegime}
          />
        )}

        {activeSection === "deductions" && (
          <DeductionInput
            deductions={deductions}
            onDeductionChange={handleDeductionChange}
            taxInput={taxInput}
          />
        )}

        {activeSection === "breakdown" && (
          <TaxBreakdown
            result={result}
            oldResult={comparison.oldTax}
            newResult={comparison.newTax}
            betterRegime={comparison.betterRegime}
            savings={comparison.savings}
            activeRegime={taxRegime}
          />
        )}

        {activeSection === "savings" && (
          <SavingsPlanner input={taxInput} />
        )}
      </main>

      <style jsx global>{`
        .glass-card {
          background: #1A1A1A;
          border: 1px solid #2A2A2A;
          border-radius: 16px;
          backdrop-filter: blur(12px);
        }
        @media (prefers-color-scheme: dark) {
          .glass-card {
            background: #1A1A1A;
          }
        }
      `}</style>
    </div>
  );
}

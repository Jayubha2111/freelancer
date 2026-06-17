"use client";

import { motion } from "framer-motion";
import { IndianRupee, Globe, Building2, RefreshCw } from "lucide-react";
import { formatIndianNumber } from "@/lib/formatters";
import type { YearConfig } from "@/lib/taxCalculator";

interface IncomeInputProps {
  monthlyIncome: number;
  otherIncome: number;
  incomeFromAbroad: boolean;
  gstRegistered: boolean;
  taxRegime: "old" | "new";
  onMonthlyIncomeChange: (v: number) => void;
  onOtherIncomeChange: (v: number) => void;
  onIncomeFromAbroadChange: (v: boolean) => void;
  onGstRegisteredChange: (v: boolean) => void;
  onTaxRegimeChange: (v: "old" | "new") => void;
  taxConfig: YearConfig;
}

export default function IncomeInput({
  monthlyIncome,
  otherIncome,
  incomeFromAbroad,
  gstRegistered,
  taxRegime,
  onMonthlyIncomeChange,
  onOtherIncomeChange,
  onIncomeFromAbroadChange,
  onGstRegisteredChange,
  onTaxRegimeChange,
  taxConfig,
}: IncomeInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IndianRupee className="w-5 h-5 text-accent" />
          Income Details
        </h2>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Monthly Freelance Income: <span className="text-accent font-semibold">{formatIndianNumber(monthlyIncome)}</span>
          </label>
          <input
            type="range"
            min={0}
            max={5000000}
            step={5000}
            value={monthlyIncome}
            onChange={(e) => onMonthlyIncomeChange(Number(e.target.value))}
            className="w-full mb-3"
          />
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => onMonthlyIncomeChange(Math.max(0, Number(e.target.value)))}
            className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent transition-colors"
            placeholder="Enter monthly income"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Other Income (rent, interest, etc.)
          </label>
          <input
            type="number"
            value={otherIncome}
            onChange={(e) => onOtherIncomeChange(Math.max(0, Number(e.target.value)))}
            className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent transition-colors"
            placeholder="Enter other annual income"
          />
        </div>

        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Income from Abroad?</span>
          </div>
          <button
            onClick={() => onIncomeFromAbroadChange(!incomeFromAbroad)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              incomeFromAbroad ? "bg-accent" : "bg-gray-600"
            }`}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                incomeFromAbroad ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {incomeFromAbroad && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 text-sm text-yellow-400"
          >
            Note: Foreign income may require GST registration if aggregate turnover exceeds ₹20L. Consult a CA.
          </motion.div>
        )}

        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">GST Registered?</span>
          </div>
          <button
            onClick={() => onGstRegisteredChange(!gstRegistered)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              gstRegistered ? "bg-accent" : "bg-gray-600"
            }`}
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                gstRegistered ? "translate-x-6" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-accent" />
          Tax Regime
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onTaxRegimeChange("new")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              taxRegime === "new"
                ? "border-accent bg-accent/5"
                : "border-card-border bg-card hover:border-gray-600"
            }`}
          >
            <div className="font-semibold text-white mb-1">New Regime ({taxConfig.label})</div>
            <div className="text-xs text-gray-400">
              Lower rates, no deductions
            </div>
            <div className="text-xs text-gray-500 mt-1">Default choice</div>
          </button>
          <button
            onClick={() => onTaxRegimeChange("old")}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              taxRegime === "old"
                ? "border-accent bg-accent/5"
                : "border-card-border bg-card hover:border-gray-600"
            }`}
          >
            <div className="font-semibold text-white mb-1">Old Regime</div>
            <div className="text-xs text-gray-400">
              Higher rates, claim deductions
            </div>
            <div className="text-xs text-gray-500 mt-1">Maximize savings</div>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

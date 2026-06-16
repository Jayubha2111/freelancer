"use client";

import { motion } from "framer-motion";
import { ArrowRight, TrendingDown } from "lucide-react";
import { formatIndianNumber } from "@/lib/formatters";
import type { TaxResult } from "@/lib/taxCalculator";

interface RegimeComparisonProps {
  oldResult: TaxResult;
  newResult: TaxResult;
  betterRegime: "old" | "new";
  savings: number;
  activeRegime: "old" | "new";
}

export default function RegimeComparison({
  oldResult,
  newResult,
  betterRegime,
  savings,
  activeRegime,
}: RegimeComparisonProps) {
  const oldTax = oldResult.totalTax;
  const newTax = newResult.totalTax;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <h3 className="text-lg font-semibold mb-4">Regime Comparison</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div
          className={`p-4 rounded-xl border-2 transition-all ${
            activeRegime === "old"
              ? "border-accent bg-accent/5"
              : "border-card-border"
          }`}
        >
          <div className="text-sm text-gray-400 mb-1">Old Regime Tax</div>
          <div className="text-2xl font-bold text-white">
            {formatIndianNumber(Math.round(oldTax))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Std Deduction: ₹50,000
          </div>
        </div>
        <div
          className={`p-4 rounded-xl border-2 transition-all ${
            activeRegime === "new"
              ? "border-accent bg-accent/5"
              : "border-card-border"
          }`}
        >
          <div className="text-sm text-gray-400 mb-1">New Regime Tax</div>
          <div className="text-2xl font-bold text-white">
            {formatIndianNumber(Math.round(newTax))}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Std Deduction: ₹75,000
          </div>
        </div>
      </div>

      {savings > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-xl bg-accent/10 border border-accent/20 flex items-center gap-3"
        >
          <TrendingDown className="w-5 h-5 text-accent shrink-0" />
          <div>
            <div className="text-sm font-medium text-white">
              You save{" "}
              <span className="text-accent font-bold">
                {formatIndianNumber(Math.round(savings))}
              </span>{" "}
              with{" "}
              <span className="font-bold capitalize text-accent">
                {betterRegime} regime
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              {betterRegime === "old"
                ? "Claim deductions to reduce taxable income"
                : "Lower tax rates benefit your income"}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-accent shrink-0 ml-auto" />
        </motion.div>
      )}
    </motion.div>
  );
}

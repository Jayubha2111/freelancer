"use client";

import { motion } from "framer-motion";
import {
  Lightbulb,
  Shield,
  PiggyBank,
  Target,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { formatIndianNumber } from "@/lib/formatters";
import type { TaxInput, YearConfig } from "@/lib/taxCalculator";
import { getSavingsSuggestions } from "@/lib/taxCalculator";

interface SavingsPlannerProps {
  input: TaxInput;
  taxConfig: YearConfig;
}

function getEmergencyFund(monthlyExpenses: number): number {
  return monthlyExpenses * 6;
}

function getSipSuggestion(potentialSavings: number): {
  monthlySip: number;
  years5: number;
  years10: number;
  years20: number;
} {
  const monthlySip = Math.round(potentialSavings * 0.5 / 12);
  const years5 = Math.round(monthlySip * 12 * 5 * Math.pow(1.12, 2.5));
  const years10 = Math.round(monthlySip * 12 * 10 * Math.pow(1.12, 5));
  const years20 = Math.round(monthlySip * 12 * 20 * Math.pow(1.12, 10));
  return { monthlySip, years5, years10, years20 };
}

export default function SavingsPlanner({ input, taxConfig }: SavingsPlannerProps) {
  const suggestions = getSavingsSuggestions(input, taxConfig);
  const monthlyExpenses = Math.round(input.monthlyIncome * 0.6);
  const emergencyFund = getEmergencyFund(monthlyExpenses);
  const potentialSavings =
    input.monthlyIncome > 0
      ? Math.round(input.monthlyIncome * 12 * 0.2)
      : 0;
  const sip = getSipSuggestion(potentialSavings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {suggestions.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            Smart Tax Saving Suggestions
          </h3>
          <div className="space-y-3">
            {suggestions.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-xl bg-background/50 border border-card-border"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {s.type === "80C" && <PiggyBank className="w-4 h-4 text-accent" />}
                    {s.type === "80D" && <Shield className="w-4 h-4 text-accent" />}
                    {s.type === "NPS" && <TrendingUp className="w-4 h-4 text-accent" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">{s.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{s.description}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="text-gray-500">
                        Invest:{" "}
                        <span className="text-white font-medium">
                          {formatIndianNumber(Math.round(s.additionalInvestment))}
                        </span>
                      </span>
                      <span className="text-accent font-medium">
                        Save: {formatIndianNumber(Math.round(s.taxSaving))}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h4 className="text-sm font-medium flex items-center gap-2 text-gray-300 mb-3">
            <Target className="w-4 h-4 text-accent" />
            Monthly Savings Target
          </h4>
          <div className="text-2xl font-bold text-white mb-1">
            {formatIndianNumber(Math.round(potentialSavings / 12))}
          </div>
          <p className="text-xs text-gray-500">
            Based on 20% of your annual income
          </p>
          <div className="mt-3 pt-3 border-t border-card-border">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Annual Target</span>
              <span className="text-white font-medium">
                {formatIndianNumber(potentialSavings)}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <h4 className="text-sm font-medium flex items-center gap-2 text-gray-300 mb-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            Emergency Fund
          </h4>
          <div className="text-2xl font-bold text-white mb-1">
            {formatIndianNumber(emergencyFund)}
          </div>
          <p className="text-xs text-gray-500">
            6 months of estimated expenses
          </p>
          <div className="mt-3 pt-3 border-t border-card-border">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Monthly Expenses (est.)</span>
              <span className="text-white font-medium">
                {formatIndianNumber(monthlyExpenses)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {sip.monthlySip > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            SIP Investment Suggestion
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Invest{" "}
            <span className="text-accent font-semibold">
              {formatIndianNumber(sip.monthlySip)}
            </span>{" "}
            monthly in a diversified mutual fund (assumed 12% returns)
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { years: "5 Years", amount: sip.years5 },
              { years: "10 Years", amount: sip.years10 },
              { years: "20 Years", amount: sip.years20 },
            ].map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-background/50 border border-card-border text-center"
              >
                <div className="text-xs text-gray-500">{item.years}</div>
                <div className="text-sm font-bold text-white mt-1">
                  {formatIndianNumber(item.amount)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

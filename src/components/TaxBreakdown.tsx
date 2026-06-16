"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Percent,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import { formatIndianNumber } from "@/lib/formatters";
import type { TaxResult } from "@/lib/taxCalculator";
import { getAdvanceTaxSchedule } from "@/lib/taxCalculator";
import SlabVisualization from "./SlabVisualization";
import RegimeComparison from "./RegimeComparison";

interface TaxBreakdownProps {
  result: TaxResult;
  oldResult: TaxResult | null;
  newResult: TaxResult | null;
  betterRegime: "old" | "new" | null;
  savings: number;
  activeRegime: "old" | "new";
}

export default function TaxBreakdown({
  result,
  oldResult,
  newResult,
  betterRegime,
  savings,
  activeRegime,
}: TaxBreakdownProps) {
  const advanceTax = getAdvanceTaxSchedule(result.totalTax);

  const rows = [
    { label: "Gross Annual Income", value: result.grossIncome, color: "text-white" },
    {
      label: "Standard Deduction",
      value: -result.standardDeduction,
      color: "text-emerald-400",
    },
    ...(result.totalDeductions > 0
      ? [
          {
            label: "Total Deductions",
            value: -result.totalDeductions,
            color: "text-emerald-400" as const,
          },
        ]
      : []),
    {
      label: "Taxable Income",
      value: result.taxableIncome,
      color: "text-white",
      bold: true,
    },
    {
      label: "Tax Before Rebate",
      value: result.taxBeforeRebate,
      color: "text-orange-400",
    },
    ...(result.rebate87A > 0
      ? [
          {
            label: "Rebate u/s 87A",
            value: -result.rebate87A,
            color: "text-emerald-400" as const,
          },
        ]
      : []),
    {
      label: "Tax After Rebate",
      value: result.taxAfterRebate,
      color: "text-orange-400",
    },
    { label: "Health & Education Cess (4%)", value: result.cess, color: "text-red-400" },
    {
      label: "Total Tax Payable",
      value: result.totalTax,
      color: "text-red-400",
      bold: true,
    },
    {
      label: "Monthly Tax to Set Aside",
      value: result.monthlyTax,
      color: "text-red-400",
    },
    {
      label: "In-Hand Amount",
      value: result.inHandAmount,
      color: "text-accent",
      bold: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-accent" />
          Income Summary
        </h3>
        <div className="space-y-2">
          {rows.map((row, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex justify-between items-center py-2 ${
                i < rows.length - 1
                  ? row.label === "Taxable Income" ||
                    row.label === "Total Tax Payable" ||
                    row.label === "In-Hand Amount"
                    ? "border-b border-accent/20"
                    : "border-b border-card-border"
                  : ""
              }`}
            >
              <span className="text-sm text-gray-400">{row.label}</span>
              <span
                className={`font-${row.bold ? "bold" : "medium"} ${
                  row.color
                } ${row.bold ? "text-base" : "text-sm"}`}
              >
                {row.value < 0
                  ? `- ${formatIndianNumber(Math.abs(row.value))}`
                  : formatIndianNumber(Math.round(row.value))}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Percent className="w-5 h-5 text-accent" />
          Tax Slab Breakdown ({activeRegime === "new" ? "New" : "Old"} Regime)
        </h3>
        <SlabVisualization
          slabs={result.slabs}
          taxableIncome={result.taxableIncome}
        />
      </div>

      {oldResult && newResult && betterRegime && (
        <RegimeComparison
          oldResult={oldResult}
          newResult={newResult}
          betterRegime={betterRegime}
          savings={savings}
          activeRegime={activeRegime}
        />
      )}

      {advanceTax.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-accent" />
            Advance Tax Payment Schedule
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Required since your tax exceeds ₹10,000
          </p>
          <div className="space-y-3">
            {advanceTax.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-card-border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <BadgeCheck className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {item.dueDate}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.label} ({item.percentage}%)
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white">
                    {formatIndianNumber(Math.round(item.amount))}
                  </div>
                  <div className="w-24 h-1.5 bg-card-border rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{
                        width: `${item.cumulativePercentage}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center italic">
        This is an estimate. Consult a CA for exact filing.
      </p>
    </motion.div>
  );
}

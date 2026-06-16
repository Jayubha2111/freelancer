"use client";

import { motion } from "framer-motion";
import { Shield, Heart, Home, Briefcase, PiggyBank, Laptop, BadgeIndianRupee } from "lucide-react";
import { formatIndianNumber } from "@/lib/formatters";
import type { Deductions, TaxInput } from "@/lib/taxCalculator";
import { calculateTax } from "@/lib/taxCalculator";

interface DeductionInputProps {
  deductions: Deductions;
  onDeductionChange: (key: keyof Deductions, value: number) => void;
  taxInput: TaxInput;
}

const deductionFields: {
  key: keyof Deductions;
  label: string;
  icon: React.ReactNode;
  maxLimit: number | null;
  maxLabel?: string;
}[] = [
  {
    key: "section80C",
    label: "80C Investments (PPF, ELSS, LIC)",
    icon: <PiggyBank className="w-4 h-4" />,
    maxLimit: 150000,
    maxLabel: "Max ₹1,50,000",
  },
  {
    key: "section80D",
    label: "80D Health Insurance",
    icon: <Heart className="w-4 h-4" />,
    maxLimit: 25000,
    maxLabel: "Max ₹25,000",
  },
  {
    key: "hra",
    label: "HRA Exemption",
    icon: <Home className="w-4 h-4" />,
    maxLimit: null,
  },
  {
    key: "homeLoanInterest",
    label: "Home Loan Interest",
    icon: <BadgeIndianRupee className="w-4 h-4" />,
    maxLimit: 200000,
    maxLabel: "Max ₹2,00,000",
  },
  {
    key: "professionalTax",
    label: "Professional Tax",
    icon: <Briefcase className="w-4 h-4" />,
    maxLimit: 2500,
    maxLabel: "Max ₹2,500",
  },
  {
    key: "nps80CCD",
    label: "NPS 80CCD(1B)",
    icon: <Shield className="w-4 h-4" />,
    maxLimit: 50000,
    maxLabel: "Max ₹50,000",
  },
  {
    key: "businessExpenses",
    label: "Business Expenses (laptop, internet, software)",
    icon: <Laptop className="w-4 h-4" />,
    maxLimit: null,
  },
];

export default function DeductionInput({
  deductions,
  onDeductionChange,
  taxInput,
}: DeductionInputProps) {
  const zeroDeductions: Deductions = {
    section80C: 0, section80D: 0, hra: 0, homeLoanInterest: 0,
    professionalTax: 0, nps80CCD: 0, businessExpenses: 0,
  };
  const oldRegimeResult = calculateTax({ ...taxInput, taxRegime: "old" });
  const taxSaved =
    oldRegimeResult.totalDeductions > 0
      ? oldRegimeResult.taxBeforeRebate - calculateTax({ ...taxInput, deductions: zeroDeductions, taxRegime: "old" }).taxBeforeRebate
      : 0;

  if (taxInput.taxRegime === "new") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-semibold mb-2">Deductions</h2>
        <p className="text-gray-400 text-sm">
          Deductions are not available under the New Tax Regime. Switch to Old Regime to claim deductions.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-2">Claim Deductions</h2>
        <p className="text-sm text-gray-400 mb-4">
          Reduce your taxable income by claiming these deductions
        </p>

        <div className="space-y-4">
          {deductionFields.map((field) => (
            <div key={field.key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-accent">{field.icon}</span>
                  {field.label}
                </label>
                {field.maxLabel && (
                  <span className="text-xs text-gray-500">{field.maxLabel}</span>
                )}
              </div>
              <input
                type="number"
                value={deductions[field.key]}
                onChange={(e) => {
                  let val = Math.max(0, Number(e.target.value));
                  if (field.maxLimit !== null) {
                    val = Math.min(val, field.maxLimit);
                  }
                  onDeductionChange(field.key, val);
                }}
                className="w-full bg-background border border-card-border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-accent transition-colors"
                placeholder="Enter amount"
              />
            </div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-4 border-accent/20"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Tax Saved via Deductions</span>
          <span className="text-accent font-bold text-lg">
            + {formatIndianNumber(Math.round(taxSaved))}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

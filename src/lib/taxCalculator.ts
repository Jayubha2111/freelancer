export interface Deductions {
  section80C: number;
  section80D: number;
  hra: number;
  homeLoanInterest: number;
  professionalTax: number;
  nps80CCD: number;
  businessExpenses: number;
}

export interface TaxInput {
  monthlyIncome: number;
  otherIncome: number;
  incomeFromAbroad: boolean;
  gstRegistered: boolean;
  taxRegime: "old" | "new";
  deductions: Deductions;
}

export interface SlabDetail {
  label: string;
  min: number;
  max: number;
  rate: number;
  tax: number;
  isApplicable: boolean;
}

export interface TaxResult {
  grossIncome: number;
  totalDeductions: number;
  standardDeduction: number;
  taxableIncome: number;
  taxBeforeRebate: number;
  rebate87A: number;
  taxAfterRebate: number;
  cess: number;
  totalTax: number;
  monthlyTax: number;
  inHandAmount: number;
  effectiveTaxRate: number;
  slabs: SlabDetail[];
  regime: "old" | "new";
}

const NEW_REGIME_SLABS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 700000, rate: 5 },
  { min: 700000, max: 1000000, rate: 10 },
  { min: 1000000, max: 1200000, rate: 15 },
  { min: 1200000, max: 1500000, rate: 20 },
  { min: 1500000, max: Infinity, rate: 30 },
];

const OLD_REGIME_SLABS = [
  { min: 0, max: 250000, rate: 0 },
  { min: 250000, max: 500000, rate: 5 },
  { min: 500000, max: 1000000, rate: 20 },
  { min: 1000000, max: Infinity, rate: 30 },
];

const NEW_STANDARD_DEDUCTION = 75000;
const OLD_STANDARD_DEDUCTION = 50000;

function calculateTaxForSlabs(
  taxableIncome: number,
  slabs: { min: number; max: number; rate: number }[]
): { totalTax: number; slabDetails: SlabDetail[] } {
  let totalTax = 0;
  const slabDetails: SlabDetail[] = [];

  for (const slab of slabs) {
    const slabMin = slab.min;
    const slabMax = slab.max === Infinity ? taxableIncome : slab.max;
    if (taxableIncome > slabMin) {
      const incomeInSlab = Math.min(taxableIncome - slabMin, slabMax - slabMin);
      const taxInSlab = (incomeInSlab * slab.rate) / 100;
      totalTax += taxInSlab;
      slabDetails.push({
        label: slab.max === Infinity
          ? `Above ₹${(slabMin / 100000).toFixed(0)}L`
          : `₹${(slabMin / 100000).toFixed(0)}L - ₹${(slabMax / 100000).toFixed(0)}L`,
        min: slabMin,
        max: slabMax,
        rate: slab.rate,
        tax: taxInSlab,
        isApplicable: incomeInSlab > 0,
      });
    } else {
      slabDetails.push({
        label: slab.max === Infinity
          ? `Above ₹${(slabMin / 100000).toFixed(0)}L`
          : `₹${(slabMin / 100000).toFixed(0)}L - ₹${(slabMax / 100000).toFixed(0)}L`,
        min: slabMin,
        max: slabMax,
        rate: slab.rate,
        tax: 0,
        isApplicable: false,
      });
    }
  }

  return { totalTax, slabDetails };
}

export function calculateTax(input: TaxInput): TaxResult {
  const annualIncome = input.monthlyIncome * 12 + input.otherIncome;

  if (input.taxRegime === "new") {
    const stdDeduction = NEW_STANDARD_DEDUCTION;
    const taxableIncome = Math.max(0, annualIncome - stdDeduction);

    const { totalTax: taxBeforeRebate, slabDetails } = calculateTaxForSlabs(
      taxableIncome,
      NEW_REGIME_SLABS
    );

    let rebate87A = 0;
    let taxAfterRebate = taxBeforeRebate;
    if (taxableIncome <= 700000) {
      rebate87A = taxBeforeRebate;
      taxAfterRebate = 0;
    }

    const cess = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cess;
    const monthlyTax = totalTax / 12;
    const inHandAmount = annualIncome - totalTax;
    const effectiveTaxRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;

    return {
      grossIncome: annualIncome,
      totalDeductions: 0,
      standardDeduction: stdDeduction,
      taxableIncome,
      taxBeforeRebate,
      rebate87A,
      taxAfterRebate,
      cess,
      totalTax,
      monthlyTax,
      inHandAmount,
      effectiveTaxRate,
      slabs: slabDetails,
      regime: "new",
    };
  } else {
    const stdDeduction = OLD_STANDARD_DEDUCTION;
    const deductions = input.deductions;
    const totalDeductions =
      deductions.section80C +
      deductions.section80D +
      deductions.hra +
      deductions.homeLoanInterest +
      deductions.professionalTax +
      deductions.nps80CCD +
      deductions.businessExpenses;

    const taxableIncome = Math.max(0, annualIncome - totalDeductions - stdDeduction);

    const { totalTax: taxBeforeRebate, slabDetails } = calculateTaxForSlabs(
      taxableIncome,
      OLD_REGIME_SLABS
    );

    let rebate87A = 0;
    let taxAfterRebate = taxBeforeRebate;
    if (taxableIncome <= 500000) {
      rebate87A = taxBeforeRebate;
      taxAfterRebate = 0;
    }

    const cess = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cess;
    const monthlyTax = totalTax / 12;
    const inHandAmount = annualIncome - totalTax;
    const effectiveTaxRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;

    return {
      grossIncome: annualIncome,
      totalDeductions,
      standardDeduction: stdDeduction,
      taxableIncome,
      taxBeforeRebate,
      rebate87A,
      taxAfterRebate,
      cess,
      totalTax,
      monthlyTax,
      inHandAmount,
      effectiveTaxRate,
      slabs: slabDetails,
      regime: "old",
    };
  }
}

export function calculateGST(turnover: number, rate: number): number {
  return (turnover * rate) / 100;
}

export interface AdvanceTaxSchedule {
  dueDate: string;
  label: string;
  percentage: number;
  cumulativePercentage: number;
  amount: number;
}

export function getAdvanceTaxSchedule(totalTax: number): AdvanceTaxSchedule[] {
  if (totalTax <= 10000) return [];
  return [
    {
      dueDate: "15 June",
      label: "By 15 June",
      percentage: 15,
      cumulativePercentage: 15,
      amount: totalTax * 0.15,
    },
    {
      dueDate: "15 Sept",
      label: "By 15 September",
      percentage: 30,
      cumulativePercentage: 45,
      amount: totalTax * 0.30,
    },
    {
      dueDate: "15 Dec",
      label: "By 15 December",
      percentage: 30,
      cumulativePercentage: 75,
      amount: totalTax * 0.30,
    },
    {
      dueDate: "15 Mar",
      label: "By 15 March",
      percentage: 25,
      cumulativePercentage: 100,
      amount: totalTax * 0.25,
    },
  ];
}

export interface SavingsSuggestion {
  type: "80C" | "80D" | "NPS" | "general";
  title: string;
  description: string;
  additionalInvestment: number;
  taxSaving: number;
  maxLimit?: number;
}

export function getSavingsSuggestions(
  input: TaxInput
): SavingsSuggestion[] {
  const suggestions: SavingsSuggestion[] = [];
  const marginalRate = getMarginalRate(input);

  if (input.taxRegime === "old") {
    const remaining80C = Math.max(0, 150000 - input.deductions.section80C);
    if (remaining80C > 0) {
      const saving = remaining80C * (marginalRate / 100);
      suggestions.push({
        type: "80C",
        title: "Max out 80C investments",
        description: `Invest ₹${Math.round(remaining80C).toLocaleString("en-IN")} more in PPF, ELSS, or LIC`,
        additionalInvestment: remaining80C,
        taxSaving: saving,
        maxLimit: 150000,
      });
    }

    const remaining80D = Math.max(0, 25000 - input.deductions.section80D);
    if (remaining80D > 0) {
      const saving = remaining80D * (marginalRate / 100);
      suggestions.push({
        type: "80D",
        title: "Get health insurance",
        description: `Add health insurance to save ₹${Math.round(saving).toLocaleString("en-IN")} in tax`,
        additionalInvestment: remaining80D,
        taxSaving: saving,
        maxLimit: 25000,
      });
    }

    const remainingNPS = Math.max(0, 50000 - input.deductions.nps80CCD);
    if (remainingNPS > 0) {
      const saving = remainingNPS * (marginalRate / 100);
      suggestions.push({
        type: "NPS",
        title: "Invest in NPS",
        description: `Additional 80CCD(1B) NPS contribution of ₹${Math.round(remainingNPS).toLocaleString("en-IN")}`,
        additionalInvestment: remainingNPS,
        taxSaving: saving,
        maxLimit: 50000,
      });
    }
  }

  return suggestions;
}

function getMarginalRate(input: TaxInput): number {
  const annualIncome = input.monthlyIncome * 12 + input.otherIncome;
  if (input.taxRegime === "new") {
    const taxable = Math.max(0, annualIncome - NEW_STANDARD_DEDUCTION);
    for (let i = NEW_REGIME_SLABS.length - 1; i >= 0; i--) {
      if (taxable > NEW_REGIME_SLABS[i].min) return NEW_REGIME_SLABS[i].rate;
    }
    return 0;
  } else {
    const deductions = input.deductions;
    const totalDed = Object.values(deductions).reduce((a, b) => a + b, 0);
    const taxable = Math.max(0, annualIncome - totalDed - OLD_STANDARD_DEDUCTION);
    for (let i = OLD_REGIME_SLABS.length - 1; i >= 0; i--) {
      if (taxable > OLD_REGIME_SLABS[i].min) return OLD_REGIME_SLABS[i].rate;
    }
    return 0;
  }
}

export function compareRegimes(input: TaxInput): {
  oldTax: TaxResult;
  newTax: TaxResult;
  betterRegime: "old" | "new";
  savings: number;
} {
  const oldInput = { ...input, taxRegime: "old" as const };
  const newInput = { ...input, taxRegime: "new" as const };
  const oldResult = calculateTax(oldInput);
  const newResult = calculateTax(newInput);

  if (oldResult.totalTax <= newResult.totalTax) {
    return {
      oldTax: oldResult,
      newTax: newResult,
      betterRegime: "old",
      savings: newResult.totalTax - oldResult.totalTax,
    };
  }
  return {
    oldTax: oldResult,
    newTax: newResult,
    betterRegime: "new",
    savings: oldResult.totalTax - newResult.totalTax,
  };
}

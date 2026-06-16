"use client";

import { motion } from "framer-motion";
import { formatIndianNumber } from "@/lib/formatters";
import type { SlabDetail } from "@/lib/taxCalculator";

const slabColors = [
  "bg-emerald-500",
  "bg-green-400",
  "bg-yellow-400",
  "bg-orange-400",
  "bg-red-400",
  "bg-red-600",
];

interface SlabVisualizationProps {
  slabs: SlabDetail[];
  taxableIncome: number;
}

export default function SlabVisualization({
  slabs,
  taxableIncome,
}: SlabVisualizationProps) {
  const maxIncome = Math.max(taxableIncome, slabs[slabs.length - 1]?.max || 1500000);
  const applicableSlabs = slabs.filter((s) => s.isApplicable);

  if (taxableIncome === 0) {
    return (
      <div className="text-center text-gray-500 py-4 text-sm">
        No tax slabs applicable
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {slabs.map((slab, idx) => {
        const widthPercent = Math.min(
          ((Math.min(slab.max, taxableIncome) - slab.min) / maxIncome) * 100,
          slab.isApplicable ? 100 : 0
        );

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="space-y-1"
          >
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{slab.label}</span>
              <span className={slab.tax > 0 ? "text-accent" : "text-gray-500"}>
                {slab.rate}% — {formatIndianNumber(Math.round(slab.tax))}
              </span>
            </div>
            <div className="h-6 bg-card-border rounded-full overflow-hidden relative">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${widthPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                className={`h-full rounded-full ${
                  slab.isApplicable ? slabColors[idx % slabColors.length] : ""
                } ${!slab.isApplicable ? "" : "opacity-80"}`}
              />
              {slab.isApplicable && (
                <div className="absolute inset-0 flex items-center px-2">
                  <span className="text-[10px] text-white font-medium drop-shadow-md">
                    {formatIndianNumber(Math.max(0, Math.min(slab.max, taxableIncome) - slab.min))}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}

      {applicableSlabs.length > 0 && (
        <div className="pt-2 flex flex-wrap gap-2">
          {applicableSlabs.map((slab, idx) => (
            <div key={idx} className="flex items-center gap-1 text-xs text-gray-500">
              <div className={`w-2 h-2 rounded-full ${slabColors[idx % slabColors.length]}`} />
              <span>{slab.rate}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

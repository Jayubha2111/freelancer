import { NextResponse } from "next/server";
import taxYears from "@/data/tax-years.json";

export async function GET() {
  const years = Object.entries(taxYears as Record<string, { label: string }>).map(
    ([fy, data]) => ({
      financialYear: fy,
      label: data.label,
    })
  );

  return NextResponse.json({ years });
}

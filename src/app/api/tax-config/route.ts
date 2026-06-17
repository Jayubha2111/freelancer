import { NextResponse } from "next/server";
import taxYears from "@/data/tax-years.json";

function getCurrentFinancialYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  if (month >= 4) {
    return `${year}-${(year + 1).toString().slice(-2)}`;
  }
  return `${year - 1}-${year.toString().slice(-2)}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fy = searchParams.get("fy") ?? getCurrentFinancialYear();
  const config = (taxYears as Record<string, unknown>)[fy];

  if (!config) {
    return NextResponse.json(
      { error: `No tax config found for FY ${fy}` },
      { status: 404 }
    );
  }

  return NextResponse.json({
    financialYear: fy,
    ...config as Record<string, unknown>,
  });
}

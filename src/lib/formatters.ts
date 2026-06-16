export function formatIndianNumber(num: number): string {
  if (num === 0) return "₹0";
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  const numStr = abs.toFixed(0);
  const len = numStr.length;
  if (len <= 3) return `${sign}₹${numStr}`;
  const lastThree = numStr.slice(-3);
  const rest = numStr.slice(0, -3);
  const groups: string[] = [];
  let remaining = rest;
  while (remaining.length > 0) {
    if (remaining.length <= 2) {
      groups.unshift(remaining);
      break;
    }
    groups.unshift(remaining.slice(-2));
    remaining = remaining.slice(0, -2);
  }
  return `${sign}₹${groups.length > 0 ? groups.join(",") + "," : ""}${lastThree}`;
}

export function formatIndianNumberShort(num: number): string {
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";
  if (abs >= 10000000) {
    return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    return `${sign}₹${(abs / 100000).toFixed(1)}L`;
  }
  if (abs >= 1000) {
    return `${sign}₹${(abs / 1000).toFixed(1)}K`;
  }
  return formatIndianNumber(num);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatMonthly(num: number): string {
  return `${formatIndianNumber(num)}/mo`;
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaxCalc — Freelancer Income & Tax Calculator",
  description:
    "Calculate your freelance income tax, track savings, and understand deductions — all in one place.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}

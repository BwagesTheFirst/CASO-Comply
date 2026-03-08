import type { Metadata } from "next";
import { Raleway, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CASO Comply — AI-Powered PDF Accessibility Remediation",
  description:
    "Automated PDF accessibility compliance for government, education, and enterprise. WCAG 2.1 AA, PDF/UA, Section 508, ADA Title II compliant remediation starting at $0.10/page.",
  keywords: [
    "PDF accessibility remediation",
    "WCAG 2.1 compliance",
    "ADA Title II",
    "Section 508",
    "PDF accessibility",
    "automated PDF remediation",
    "PDF/UA compliance",
    "document accessibility",
    "CASO Document Management",
    "Accessibility on Demand",
  ],
  openGraph: {
    title: "CASO Comply — AI-Powered PDF Accessibility Remediation",
    description:
      "Scan your website. Find every inaccessible PDF. Remediate automatically. Starting at $0.10/page.",
    type: "website",
    siteName: "CASO Comply",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable} ${sourceSans.variable}`}>
      <body className="font-[family-name:var(--font-body)] antialiased">
        {children}
      </body>
    </html>
  );
}

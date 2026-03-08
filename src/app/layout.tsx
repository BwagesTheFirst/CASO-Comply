import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CASO Comply — AI-Powered PDF Accessibility Remediation",
  description:
    "Automated PDF accessibility compliance for government, education, and enterprise. WCAG 2.1 AA, PDF/UA, Section 508, ADA Title II.",
  keywords: [
    "PDF accessibility remediation",
    "WCAG 2.1 compliance",
    "ADA Title II",
    "Section 508",
    "PDF accessibility",
    "automated PDF remediation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

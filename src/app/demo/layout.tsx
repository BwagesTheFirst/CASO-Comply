import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Accessibility Demo — CASO Comply",
  description:
    "See CASO Comply in action — upload a PDF and watch our AI analyze, score, and remediate it for WCAG 2.1 AA, PDF/UA, and Section 508 compliance in real time.",
  openGraph: {
    title: "Document Accessibility Demo — CASO Comply",
    description:
      "See CASO Comply in action — upload a PDF and watch our AI analyze, score, and remediate it for WCAG 2.1 AA, PDF/UA, and Section 508 compliance in real time.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

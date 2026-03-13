import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Demo — CASO Comply",
  description:
    "Try CASO Comply's document accessibility remediation live. Upload a PDF and watch it transform into a fully accessible, WCAG 2.1 AA compliant document in real time.",
  openGraph: {
    title: "Live Demo — CASO Comply",
    description:
      "Try CASO Comply's document accessibility remediation live. Upload a PDF and watch it transform into a fully accessible, WCAG 2.1 AA compliant document in real time.",
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

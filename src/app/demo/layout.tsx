import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Demo — CASO Comply",
  description:
    "Try CASO Comply's document accessibility remediation live. Upload a PDF and watch it transform into a fully accessible, WCAG 2.1 AA compliant document in real time.",
  openGraph: {
    title: "Live Demo — CASO Comply",
    description:
      "Try CASO Comply's document accessibility remediation live. Upload a PDF and watch it transform into a fully accessible, WCAG 2.1 AA compliant document in real time.",
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

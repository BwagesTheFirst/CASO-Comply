import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "Free PDF Accessibility Checker & Compliance Scan — CASO Comply",
  description:
    "Use our free PDF accessibility checker to scan your website for non-compliant documents. Get a comprehensive compliance report covering WCAG 2.1 AA, PDF/UA, and Section 508 standards — delivered within 2 business days.",
  openGraph: {
    title: "Free PDF Accessibility Checker & Compliance Scan — CASO Comply",
    description:
      "Use our free PDF accessibility checker to scan your website for non-compliant documents. Get a comprehensive compliance report covering WCAG 2.1 AA, PDF/UA, and Section 508 standards — delivered within 2 business days.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/free-scan",
  },
};

export default function FreeScanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingLayout>{children}</MarketingLayout>;
}

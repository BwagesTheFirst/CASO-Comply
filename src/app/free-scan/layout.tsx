import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "Free Compliance Scan — CASO Comply",
  description:
    "Get a free document accessibility compliance scan of your website. We'll crawl your site, identify every document, and deliver a detailed compliance report within 2 business days.",
  openGraph: {
    title: "Free Compliance Scan — CASO Comply",
    description:
      "Get a free document accessibility compliance scan of your website. We'll crawl your site, identify every document, and deliver a detailed compliance report within 2 business days.",
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

import type { Metadata } from "next";
import { Raleway, Source_Sans_3 } from "next/font/google";
import Analytics from "@/components/Analytics";
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
  metadataBase: new URL("https://casocomply.com"),
  title: "CASO Comply — AI-Powered Document Accessibility Remediation",
  description:
    "Automated document accessibility compliance for government, education, and enterprise. Remediate PDFs, Word documents, and Excel spreadsheets to WCAG 2.2 AA, PDF/UA, and Section 508 standards — starting at $0.10/page.",
  keywords: [
    "PDF accessibility remediation",
    "document accessibility remediation",
    "Word accessibility",
    "Excel accessibility",
    "DOCX remediation",
    "XLSX remediation",
    "WCAG 2.2 compliance",
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
    title: "CASO Comply — AI-Powered Document Accessibility Remediation",
    description:
      "Scan your website. Find every inaccessible document. Remediate PDFs, Word docs, and spreadsheets automatically. Starting at $0.10/page.",
    type: "website",
    siteName: "CASO Comply",
    url: "https://casocomply.com",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "CASO Comply — AI-Powered Document Accessibility Remediation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CASO Comply — AI-Powered Document Accessibility Remediation",
    description:
      "AI-powered document accessibility remediation. WCAG 2.1 AA, PDF/UA, Section 508 compliance starting at $0.30/page.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://casocomply.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CASO Comply",
  url: "https://casocomply.com",
  logo: "https://casocomply.com/caso-comply-logo-white.png",
  description:
    "AI-powered document accessibility remediation for government, education, and enterprise. WCAG 2.1 AA, PDF/UA, Section 508 compliance.",
  parentOrganization: {
    "@type": "Organization",
    name: "CASO Document Management, Inc.",
    url: "https://caso.com",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bohemia",
    addressRegion: "NY",
    addressCountry: "US",
  },
  telephone: "+1-631-393-2700",
  sameAs: [
    "https://www.linkedin.com/company/caso-inc",
    "https://www.facebook.com/casodocumentmanagement/",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Document Accessibility Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "PDF Remediation - Basic Accessibility",
          description:
            "Automated tagging, structure, and reading order for PDF documents",
        },
        price: "0.30",
        priceCurrency: "USD",
        unitText: "per page",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "PDF Remediation - Enhanced Compliance",
          description:
            "Automated remediation with enhanced checks and compliance report",
        },
        price: "1.80",
        priceCurrency: "USD",
        unitText: "per page",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "PDF Remediation - Full Remediation",
          description:
            "Complete remediation with expert QA and Certificate of Compliance",
        },
        price: "12.00",
        priceCurrency: "USD",
        unitText: "per page",
      },
    ],
  },
};

const jsonLdString = JSON.stringify(jsonLd);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${raleway.variable} ${sourceSans.variable}`}>
      <head>
        <script type="application/ld+json" suppressHydrationWarning>
          {jsonLdString}
        </script>
      </head>
      <body className="font-[family-name:var(--font-body)] antialiased">
        <Analytics />
        {children}
      </body>
    </html>
  );
}

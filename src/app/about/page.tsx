import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "About CASO Comply — CASO Document Management",
  description:
    "CASO Comply is the accessibility-focused product line from CASO Document Management. Learn about our mission, leadership, security credentials, and partnership with Accessibility on Demand.",
};

function ShieldCheckIcon() {
  return (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
      />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-caso-green"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

const SECURITY_CREDENTIALS = [
  "SOC 2 Type II certified",
  "HIPAA compliant document handling",
  "Comprehensive insurance coverage for document management operations",
  "Encrypted data handling at rest and in transit",
  "On-premise processing options for sensitive documents",
  "Strict access controls and audit logging",
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Our Story
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            About CASO Comply
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-caso-slate md:text-xl">
            Built on decades of document management expertise, CASO Comply
            delivers AI-powered accessibility remediation you can trust.
          </p>
        </div>
      </section>

      {/* CASO Document Management Background */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex rounded-xl bg-caso-navy-light p-3 text-caso-blue">
                <BuildingIcon />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
                CASO Document Management
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-caso-slate">
                CASO Document Management has been a trusted name in the document
                management industry for over 30 years. From large-scale
                scanning and digitization to secure document storage and
                retrieval, CASO has helped organizations across the public and
                private sectors transform how they handle critical records.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-caso-slate">
                That heritage of precision, security, and reliability is the
                foundation on which CASO Comply was built. When we saw the
                growing need for document accessibility&mdash;driven by ADA
                Title II deadlines and evolving digital standards&mdash;we knew
                our deep expertise in document processing positioned us to solve
                the problem better than anyone.
              </p>
            </div>
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light p-8">
              <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
                Our Heritage
              </h3>
              <ul className="mt-6 space-y-4" role="list">
                {[
                  "30+ years in document management and scanning",
                  "Millions of documents processed for government and enterprise clients",
                  "Full-service digitization, indexing, and archival solutions",
                  "Proven track record with sensitive and regulated documents",
                  "Seamless transition from physical to digital document workflows",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-sm leading-relaxed text-caso-slate">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CASO Comply Product Line */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex rounded-xl bg-caso-navy-light p-3 text-caso-teal">
            <svg
              className="h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            CASO Comply
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-caso-slate">
            CASO Comply is our accessibility-focused product line, purpose-built
            to help organizations bring their digital documents into full
            compliance with WCAG 2.1 AA, PDF/UA, Section 508, and ADA Title II
            requirements.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-caso-slate">
            We combine AI-powered automation with human quality assurance to
            remediate PDFs at scale&mdash;accurately, securely, and at a
            fraction of the cost of traditional manual remediation.
          </p>
        </div>
      </section>

      {/* Leadership */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mx-auto mb-6 inline-flex rounded-xl bg-caso-navy-light p-3 text-caso-blue">
              <UsersIcon />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Leadership
            </h2>
          </div>
          <div className="mx-auto mt-12 max-w-2xl">
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light p-8 md:p-10">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold">
                Richard Tamaro
              </h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-wider text-caso-glacier">
                President, CASO Document Management
              </p>
              <p className="mt-6 text-base leading-relaxed text-caso-slate">
                Richard Tamaro leads CASO Document Management with a
                commitment to operational excellence and client success. Under
                his leadership, CASO has grown from a regional scanning
                provider into a full-service document management firm serving
                government agencies, healthcare organizations, and enterprises
                across the country.
              </p>
              <p className="mt-4 text-base leading-relaxed text-caso-slate">
                Richard&apos;s vision for CASO Comply reflects his belief that
                document accessibility is not just a compliance
                checkbox&mdash;it&apos;s a fundamental responsibility.
                By investing in AI-powered remediation technology, he is
                positioning CASO to help organizations meet their accessibility
                obligations efficiently, affordably, and without compromising
                quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Credentials */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex rounded-xl bg-caso-navy-light p-3 text-caso-green">
                <ShieldCheckIcon />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
                Security You Can Count On
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-caso-slate">
                When you trust us with your documents, you expect the highest
                standards of security and privacy. CASO Document Management
                maintains rigorous certifications and policies to protect your
                data at every stage of the remediation process.
              </p>
            </div>
            <div className="rounded-2xl border border-caso-border bg-caso-navy-light p-8">
              <ul className="space-y-4" role="list">
                {SECURITY_CREDENTIALS.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-sm leading-relaxed text-caso-slate">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-4 border-t border-caso-border pt-6">
                <Image
                  src="/soc2-badge.jpg"
                  alt="AICPA SOC 2 Type II Certified"
                  width={130}
                  height={97}
                  className="h-14 w-auto"
                />
                <p className="text-xs leading-relaxed text-caso-slate">
                  Independently audited and certified for security, availability,
                  and confidentiality.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership with AoD */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 inline-flex rounded-xl bg-caso-navy-light p-3 text-caso-glacier">
            <HandshakeIcon />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Partnership with Accessibility on Demand
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-caso-slate">
            CASO Comply is proud to partner with Accessibility on Demand (AoD)
            to deliver best-in-class PDF remediation services. AoD brings deep
            expertise in digital accessibility standards and remediation
            workflows, complementing CASO&apos;s document management
            infrastructure and AI capabilities.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-caso-slate">
            Together, we offer a complete solution: automated processing for
            speed and scale, combined with expert human review for accuracy and
            compliance assurance. This partnership ensures every document we
            remediate meets the highest standards of accessibility.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b border-caso-border/50 px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Our Mission
          </h2>
          <blockquote className="mt-8 rounded-2xl border border-caso-border bg-caso-navy-light p-8 md:p-10">
            <p className="text-lg italic leading-relaxed text-caso-slate md:text-xl">
              &ldquo;We believe every person deserves equal access to digital
              content. Our mission is to make document accessibility simple,
              affordable, and reliable&mdash;so that no organization is forced to
              choose between compliance and their budget, and no individual is
              excluded from the information they need.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Ready to work with us?
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            Whether you need to remediate a handful of documents or millions,
            we&apos;re here to help. Get in touch to learn how CASO Comply can
            support your accessibility goals.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex rounded-xl bg-caso-blue px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Get in Touch
            </Link>
            <Link
              href="/free-scan"
              className="inline-flex rounded-xl border border-caso-border px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-navy-light"
            >
              Free Compliance Scan
            </Link>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

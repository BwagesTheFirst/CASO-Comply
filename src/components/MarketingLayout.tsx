import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";
import MegaMenu from "./MegaMenu";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-caso-navy text-caso-white">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Navigation */}
      <nav
        aria-label="Primary navigation"
        className="sticky top-0 z-40 border-b border-caso-border/50 bg-caso-navy/95 backdrop-blur-md"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="CASO Comply home"
          >
            <Image
              src="/caso-comply-logo-white.png"
              alt="CASO Comply"
              width={426}
              height={80}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav with Mega Menu */}
          <div className="hidden items-center gap-1 lg:flex">
            <MegaMenu />

            <Link
              href="/pricing"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white focus-visible:ring-2 focus-visible:ring-caso-blue focus-visible:ring-offset-2 focus-visible:ring-offset-caso-navy"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white focus-visible:ring-2 focus-visible:ring-caso-blue focus-visible:ring-offset-2 focus-visible:ring-offset-caso-navy"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white focus-visible:ring-2 focus-visible:ring-caso-blue focus-visible:ring-offset-2 focus-visible:ring-offset-caso-navy"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white focus-visible:ring-2 focus-visible:ring-caso-blue focus-visible:ring-offset-2 focus-visible:ring-offset-caso-navy"
            >
              Login
            </Link>
            <Link
              href="/free-scan"
              className="ml-4 rounded-xl bg-caso-blue px-5 py-2.5 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25 focus-visible:ring-2 focus-visible:ring-caso-blue focus-visible:ring-offset-2 focus-visible:ring-offset-caso-navy"
            >
              Free Compliance Scan
            </Link>
          </div>

          <MobileNav />
        </div>
      </nav>

      <main id="main-content">{children}</main>

      {/* Footer */}
      <footer className="border-t border-caso-border/50 bg-caso-navy" role="contentinfo">
        {/* Footer CTA */}
        <div className="border-b border-caso-border/50 px-6 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
              Not sure where to start?
            </h2>
            <p className="mt-4 text-lg text-caso-slate">
              Get a free compliance scan of your website. We&apos;ll identify
              every inaccessible document and show you exactly what needs to be
              fixed.
            </p>
            <Link
              href="/free-scan"
              className="mt-8 inline-flex rounded-xl bg-caso-blue px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
            >
              Get a Free Compliance Scan
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Company */}
            <div>
              <Image
                src="/caso-comply-logo-white.png"
                alt="CASO Comply"
                width={426}
                height={80}
                className="h-8 w-auto"
              />
              <p className="mt-4 text-sm leading-relaxed text-caso-slate">
                AI-powered document accessibility remediation for government,
                education, and enterprise.
              </p>
              <div className="mt-4 flex items-center gap-4">
                <a
                  href="https://www.linkedin.com/company/caso-inc"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CASO on LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/casodocumentmanagement/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="CASO on Facebook"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
                Services
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <Link
                    href="/services/pdf-remediation"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    PDF Remediation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/demo"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Live Demo
                  </Link>
                </li>
                <li>
                  <Link
                    href="/free-scan"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Free Compliance Scan
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
                Company
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    About CASO
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/resources/ada-title-ii-guide"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    ADA Title II Guide
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
                Legal
              </h3>
              <ul className="mt-4 space-y-3" role="list">
                <li>
                  <Link
                    href="/legal/privacy"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal/terms"
                    className="text-sm text-caso-slate hover:text-caso-white"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 border-t border-caso-border/50 pt-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-6">
                <Image
                  src="/soc2-badge.jpg"
                  alt="AICPA SOC 2 Type II Certified"
                  width={130}
                  height={97}
                  className="h-12 w-auto"
                />
                <div className="text-center text-sm text-caso-slate md:text-left">
                  <p>
                    &copy; {new Date().getFullYear()} CASO Document Management,
                    Inc. All rights reserved.
                  </p>
                  <p className="mt-1">
                    CASO Comply&trade; is a product of CASO Document Management.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

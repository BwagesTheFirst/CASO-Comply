import Image from "next/image";
import Link from "next/link";
import MobileNav from "./MobileNav";

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
            {/* Mega Menu Trigger */}
            <div className="group relative">
              <button
                type="button"
                className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
              >
                Products &amp; Solutions
                <svg
                  className="ml-1.5 h-3 w-3 transition-transform group-hover:rotate-180"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M3 5l3 3 3-3" />
                </svg>
              </button>

              {/* Mega Menu Panel */}
              <div className="pointer-events-none absolute right-0 top-full pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                <div className="w-[640px] rounded-2xl border border-caso-border bg-caso-navy-light p-6 shadow-2xl">
                  <div className="grid grid-cols-3 gap-6">
                    {/* Services Column */}
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-caso-glacier">
                        Services
                      </h3>
                      <ul className="mt-3 space-y-1" role="list">
                        <li>
                          <Link
                            href="/services/pdf-remediation"
                            className="group/link flex items-start gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-caso-navy-mid"
                          >
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
                            </svg>
                            <div>
                              <span className="block text-sm font-medium text-caso-white">PDF Remediation</span>
                              <span className="block text-xs text-caso-slate">WCAG 2.1 AA, PDF/UA, Section 508</span>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <span className="flex items-start gap-2 rounded-lg px-3 py-2 opacity-50">
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-glacier" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
                            </svg>
                            <div>
                              <span className="block text-sm font-medium text-caso-slate">Office Remediation</span>
                              <span className="block text-xs text-caso-slate">Word, Excel, PowerPoint — Coming Soon</span>
                            </div>
                          </span>
                        </li>
                        <li>
                          <span className="flex items-start gap-2 rounded-lg px-3 py-2 opacity-50">
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-glacier" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M9.965 3.236a1 1 0 01.842-.164l6 1.667a1 1 0 01.751.969v4.097a6 6 0 01-3.037 5.213l-3.515 2.007a1 1 0 01-.992 0L6.5 15.018A6 6 0 013.463 9.805V5.708a1 1 0 01.751-.969l6-1.667z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <span className="block text-sm font-medium text-caso-slate">SiteScan</span>
                              <span className="block text-xs text-caso-slate">Document inventory &amp; scoring — Coming Soon</span>
                            </div>
                          </span>
                        </li>
                      </ul>
                    </div>

                    {/* Solutions Column */}
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-caso-glacier">
                        Solutions
                      </h3>
                      <ul className="mt-3 space-y-1" role="list">
                        <li>
                          <Link
                            href="/solutions/government"
                            className="group/link flex items-start gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-caso-navy-mid"
                          >
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L12.69 15H7.31l-.834 3.44a.75.75 0 01-1.452-.38L5.822 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <span className="block text-sm font-medium text-caso-white">Government</span>
                              <span className="block text-xs text-caso-slate">ADA Title II compliance</span>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/solutions/higher-education"
                            className="group/link flex items-start gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-caso-navy-mid"
                          >
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-3.14 1.346 2.352 1.005a1 1 0 00.788 0l7-3a1 1 0 000-1.838l-7-3.001z" />
                              <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm5.99 7.176A9.026 9.026 0 007 15.96v-4.5l2.7 1.157a3 3 0 002.6 0l2.7-1.157v4.5a9.026 9.026 0 00-2.3.613zM17 10.12l-1.69-.724v4.102a8.969 8.969 0 011.05-.174 1 1 0 00.89-.89 11.115 11.115 0 00-.25-3.762z" />
                            </svg>
                            <div>
                              <span className="block text-sm font-medium text-caso-white">Higher Education</span>
                              <span className="block text-xs text-caso-slate">Section 508 &amp; ADA</span>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/solutions/enterprise"
                            className="group/link flex items-start gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-caso-navy-mid"
                          >
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M4 16.5v-13h-.25a.75.75 0 010-1.5h12.5a.75.75 0 010 1.5H16v13h.25a.75.75 0 010 1.5H3.75a.75.75 0 010-1.5H4zm3-11a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 017 5.5zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5A.75.75 0 017 8.5zm0 3a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5h-4.5a.75.75 0 01-.75-.75zm-1 4.75v-2.5a.75.75 0 01.75-.75h2.5a.75.75 0 01.75.75v2.5h-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <span className="block text-sm font-medium text-caso-white">Enterprise</span>
                              <span className="block text-xs text-caso-slate">ADA Title III &amp; risk mitigation</span>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Resources Column */}
                    <div>
                      <h3 className="text-[11px] font-bold uppercase tracking-widest text-caso-glacier">
                        Resources
                      </h3>
                      <ul className="mt-3 space-y-1" role="list">
                        <li>
                          <Link
                            href="/resources/ada-title-ii-guide"
                            className="group/link flex items-start gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-caso-navy-mid"
                          >
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h9.621a1.5 1.5 0 011.061.44l2.879 2.878A1.5 1.5 0 0117.5 6.38V16.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-13zM5.75 8a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 3a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <span className="block text-sm font-medium text-caso-white">ADA Title II Guide</span>
                              <span className="block text-xs text-caso-slate">Deadlines, requirements, compliance</span>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/demo"
                            className="group/link flex items-start gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-caso-navy-mid"
                          >
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                            <div>
                              <span className="block text-sm font-medium text-caso-white">Live Demo</span>
                              <span className="block text-xs text-caso-slate">Try remediation on your own PDF</span>
                            </div>
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/security"
                            className="group/link flex items-start gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-caso-navy-mid"
                          >
                            <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                            </svg>
                            <div>
                              <span className="block text-sm font-medium text-caso-white">Security &amp; Compliance</span>
                              <span className="block text-xs text-caso-slate">SOC 2, HIPAA, FedRAMP</span>
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Mega Menu CTA */}
                  <div className="mt-5 border-t border-caso-border pt-5">
                    <Link
                      href="/free-scan"
                      className="flex items-center justify-between rounded-xl bg-caso-blue/10 px-4 py-3 transition-colors hover:bg-caso-blue/20"
                    >
                      <div>
                        <span className="block text-sm font-semibold text-caso-white">Free Compliance Scan</span>
                        <span className="block text-xs text-caso-slate">Get a full accessibility report for your website</span>
                      </div>
                      <svg className="h-5 w-5 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/pricing"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Contact
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
            >
              Login
            </Link>
            <Link
              href="/free-scan"
              className="ml-4 rounded-xl bg-caso-blue px-5 py-2.5 text-sm font-bold text-caso-white transition-all hover:bg-caso-blue-bright hover:shadow-lg hover:shadow-caso-blue/25"
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

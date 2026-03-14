"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function MegaMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white focus-visible:ring-2 focus-visible:ring-caso-blue focus-visible:ring-offset-2 focus-visible:ring-offset-caso-navy"
      >
        Products &amp; Solutions
        <svg
          className={`ml-1.5 h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M3 5l3 3 3-3" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 top-full pt-3 xl:left-auto xl:right-0"
          role="menu"
          aria-label="Products and Solutions"
        >
          <div className="w-[min(640px,calc(100vw-2rem))] rounded-2xl border border-caso-border bg-caso-navy-light p-4 shadow-2xl sm:p-6">
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 xl:gap-6">
              {/* Services Column */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-caso-glacier">
                  Services
                </h3>
                <ul className="mt-3 space-y-1" role="list">
                  <li role="none">
                    <Link
                      href="/services/pdf-remediation"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
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
                  <li role="none">
                    <Link
                      href="/demo"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">Office Remediation</span>
                        <span className="block text-xs text-caso-slate">Word, Excel & PowerPoint</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/services/section-508-compliance"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">Section 508 Compliance</span>
                        <span className="block text-xs text-caso-slate">Federal accessibility standards</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/services/accessibility-audit"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">Accessibility Audit</span>
                        <span className="block text-xs text-caso-slate">Full-site document assessment</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/services/bulk-remediation"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M3.196 12.87l-.825.483a.75.75 0 000 1.294l7.004 4.086a1.5 1.5 0 001.25 0l7.004-4.086a.75.75 0 000-1.294l-.825-.484-5.929 3.46a3 3 0 01-2.5 0L3.196 12.87z" />
                        <path d="M3.196 8.87l-.825.483a.75.75 0 000 1.294l7.004 4.086a1.5 1.5 0 001.25 0l7.004-4.086a.75.75 0 000-1.294l-.825-.484-5.929 3.46a3 3 0 01-2.5 0L3.196 8.87z" />
                        <path d="M10.625 2.813a1.5 1.5 0 00-1.25 0L2.371 6.899a.75.75 0 000 1.294l7.004 4.086a1.5 1.5 0 001.25 0l7.004-4.086a.75.75 0 000-1.294l-7.004-4.086z" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">Bulk Remediation</span>
                        <span className="block text-xs text-caso-slate">High-volume document processing</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/free-scan"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M9.965 3.236a1 1 0 01.842-.164l6 1.667a1 1 0 01.751.969v4.097a6 6 0 01-3.037 5.213l-3.515 2.007a1 1 0 01-.992 0L6.5 15.018A6 6 0 013.463 9.805V5.708a1 1 0 01.751-.969l6-1.667z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">SiteScan</span>
                        <span className="block text-xs text-caso-slate">Document inventory & scoring</span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Solutions Column */}
              <div>
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-caso-glacier">
                  Solutions
                </h3>
                <ul className="mt-3 space-y-1" role="list">
                  <li role="none">
                    <Link
                      href="/solutions/government"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
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
                  <li role="none">
                    <Link
                      href="/solutions/higher-education"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
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
                  <li role="none">
                    <Link
                      href="/solutions/enterprise"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
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
                  <li role="none">
                    <Link
                      href="/solutions/municipal"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M1 2.75A.75.75 0 011.75 2h16.5a.75.75 0 010 1.5H18v8.75A2.75 2.75 0 0115.25 15h-1.072l.798 3.06a.75.75 0 01-1.452.38L12.69 15H7.31l-.834 3.44a.75.75 0 01-1.452-.38L5.822 15H4.75A2.75 2.75 0 012 12.25V3.5h-.25A.75.75 0 011 2.75z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">Municipal</span>
                        <span className="block text-xs text-caso-slate">City &amp; county compliance</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/solutions/k-12-education"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-3.14 1.346 2.352 1.005a1 1 0 00.788 0l7-3a1 1 0 000-1.838l-7-3.001z" />
                        <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zm5.99 7.176A9.026 9.026 0 007 15.96v-4.5l2.7 1.157a3 3 0 002.6 0l2.7-1.157v4.5a9.026 9.026 0 00-2.3.613zM17 10.12l-1.69-.724v4.102a8.969 8.969 0 011.05-.174 1 1 0 00.89-.89 11.115 11.115 0 00-.25-3.762z" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">K-12 Education</span>
                        <span className="block text-xs text-caso-slate">School district accessibility</span>
                      </div>
                    </Link>
                  </li>
                </ul>

                {/* By State */}
                <div className="mt-4 border-t border-caso-border/50 pt-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-caso-glacier">
                    By State
                  </h4>
                  <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-0.5" role="list">
                    {[
                      { href: "/solutions/states/california", label: "California" },
                      { href: "/solutions/states/colorado", label: "Colorado" },
                      { href: "/solutions/states/florida", label: "Florida" },
                      { href: "/solutions/states/illinois", label: "Illinois" },
                      { href: "/solutions/states/maryland", label: "Maryland" },
                      { href: "/solutions/states/new-york", label: "New York" },
                      { href: "/solutions/states/pennsylvania", label: "Pennsylvania" },
                      { href: "/solutions/states/texas", label: "Texas" },
                      { href: "/solutions/states/virginia", label: "Virginia" },
                      { href: "/solutions/states/washington", label: "Washington" },
                    ].map((state) => (
                      <li key={state.href} role="none">
                        <Link
                          href={state.href}
                          role="menuitem"
                          className="block rounded px-2 py-1 text-xs text-caso-slate transition-colors hover:bg-caso-navy-mid hover:text-caso-white focus-visible:ring-2 focus-visible:ring-caso-blue"
                          onClick={() => setIsOpen(false)}
                        >
                          {state.label}
                        </Link>
                      </li>
                    ))}
                    <li role="none">
                      <Link
                        href="/solutions/states"
                        role="menuitem"
                        className="block rounded px-2 py-1 text-xs font-semibold text-caso-blue transition-colors hover:bg-caso-navy-mid hover:text-caso-blue-bright focus-visible:ring-2 focus-visible:ring-caso-blue"
                        onClick={() => setIsOpen(false)}
                      >
                        All 51 States &rarr;
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Resources Column */}
              <div className="col-span-2 border-t border-caso-border pt-4 xl:col-span-1 xl:border-t-0 xl:pt-0">
                <h3 className="text-[11px] font-bold uppercase tracking-widest text-caso-glacier">
                  Resources
                </h3>
                <ul className="mt-3 grid grid-cols-2 gap-1 xl:grid-cols-1 xl:space-y-1" role="list">
                  <li role="none">
                    <Link
                      href="/resources/ada-title-ii-guide"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h9.621a1.5 1.5 0 011.061.44l2.879 2.878A1.5 1.5 0 0117.5 6.38V16.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-13zM5.75 8a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 3a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">ADA Title II Guide</span>
                        <span className="block text-xs text-caso-slate">Deadlines &amp; requirements</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/resources/wcag-21-aa-guide"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h9.621a1.5 1.5 0 011.061.44l2.879 2.878A1.5 1.5 0 0117.5 6.38V16.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-13zM5.75 8a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 3a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">WCAG 2.1 AA Guide</span>
                        <span className="block text-xs text-caso-slate">Standards &amp; success criteria</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/resources/pdf-ua-guide"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">PDF/UA Guide</span>
                        <span className="block text-xs text-caso-slate">ISO 14289 standard explained</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/resources/ada-compliance-checklist"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">ADA Compliance Checklist</span>
                        <span className="block text-xs text-caso-slate">Step-by-step compliance guide</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/resources/cost-of-non-compliance"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">Cost of Non-Compliance</span>
                        <span className="block text-xs text-caso-slate">Risks, fines &amp; lawsuits</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/demo"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">Live Demo</span>
                        <span className="block text-xs text-caso-slate">Try on your own PDF</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/blog"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h9.621a1.5 1.5 0 011.061.44l2.879 2.878A1.5 1.5 0 0117.5 6.38V16.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 012 16.5v-13zM5.75 8a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 3a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">Blog</span>
                        <span className="block text-xs text-caso-slate">Accessibility insights &amp; news</span>
                      </div>
                    </Link>
                  </li>
                  <li role="none">
                    <Link
                      href="/security"
                      role="menuitem"
                      className="flex items-start gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-caso-navy-mid focus-visible:ring-2 focus-visible:ring-caso-blue xl:px-3"
                      onClick={() => setIsOpen(false)}
                    >
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-sm font-medium text-caso-white">Security</span>
                        <span className="block text-xs text-caso-slate">SOC 2, HIPAA, FedRAMP</span>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mega Menu CTA */}
            <div className="mt-4 border-t border-caso-border pt-4 xl:mt-5 xl:pt-5">
              <Link
                href="/free-scan"
                role="menuitem"
                className="flex items-center justify-between rounded-xl bg-caso-blue/10 px-4 py-3 transition-colors hover:bg-caso-blue/20 focus-visible:ring-2 focus-visible:ring-caso-blue"
                onClick={() => setIsOpen(false)}
              >
                <div>
                  <span className="block text-sm font-semibold text-caso-white">Free Compliance Scan</span>
                  <span className="block text-xs text-caso-slate">Get a full accessibility report for your website</span>
                </div>
                <svg className="h-5 w-5 shrink-0 text-caso-blue" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

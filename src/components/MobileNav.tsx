"use client";

import { useState, useEffect, useRef } from "react";

const NAV_LINKS = [
  { href: "/services/pdf-remediation", label: "PDF Remediation" },
  { href: "/services/section-508-compliance", label: "Section 508 Compliance" },
  { href: "/services/accessibility-audit", label: "Accessibility Audit" },
  { href: "/solutions/government", label: "Government" },
  { href: "/solutions/municipal", label: "Municipal" },
  { href: "/solutions/higher-education", label: "Higher Education" },
  { href: "/solutions/k-12-education", label: "K-12 Education" },
  { href: "/solutions/enterprise", label: "Enterprise" },
  { href: "/solutions/states", label: "All 51 States" },
  { href: "/pricing", label: "Pricing" },
  { href: "/resources/ada-title-ii-guide", label: "ADA Title II Guide" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
];

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-caso-slate hover:text-caso-white focus-visible:outline-offset-4"
      >
        {isOpen ? (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        )}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 top-0 z-50 bg-caso-navy/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-[family-name:var(--font-display)] text-xl font-bold text-caso-white">
                CASO <span className="text-caso-blue">Comply</span>
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close navigation menu"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-caso-slate hover:text-caso-white focus-visible:ring-2 focus-visible:ring-caso-blue focus-visible:ring-offset-2 focus-visible:ring-offset-caso-navy"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <nav ref={menuRef} id="mobile-menu" className="flex-1 px-6 py-8">
              <ul className="space-y-1">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-4 py-3 text-lg font-medium text-caso-slate transition-colors hover:bg-caso-navy-light hover:text-caso-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-8 border-t border-caso-border pt-8">
                <a
                  href="/free-scan"
                  onClick={() => setIsOpen(false)}
                  className="block rounded-xl bg-caso-blue-deep px-6 py-4 text-center font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-colors hover:bg-caso-blue"
                >
                  Free Compliance Scan
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}

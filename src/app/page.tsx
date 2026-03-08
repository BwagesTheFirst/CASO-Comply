export default function Home() {
  const daysUntilDeadline = Math.ceil(
    (new Date("2026-04-24").getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold tracking-tight">
            <span className="text-gray-900">CASO</span>{" "}
            <span className="text-blue-600">Comply</span>
          </div>
          <div className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <a href="#how-it-works" className="hover:text-gray-900">
              How It Works
            </a>
            <a href="#service-levels" className="hover:text-gray-900">
              Service Levels
            </a>
            <a href="#pricing" className="hover:text-gray-900">
              Pricing
            </a>
            <a
              href="#scan"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Free Site Audit
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Deadline banner */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
            ADA Title II Deadline: {daysUntilDeadline} days remaining
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-6xl">
            Your PDFs aren&apos;t accessible.
            <br />
            <span className="text-blue-600">We can prove it in 60 seconds.</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            CASO Comply scans your website, finds every PDF, and shows you
            exactly what&apos;s non-compliant — with before-and-after proof of
            what automated remediation looks like.
          </p>

          {/* SiteScan CTA */}
          <div id="scan" className="mt-10">
            <form className="mx-auto flex max-w-xl gap-3">
              <input
                type="url"
                placeholder="Enter your website URL..."
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                aria-label="Website URL to scan"
              />
              <button
                type="submit"
                className="whitespace-nowrap rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                Scan My Site
              </button>
            </form>
            <p className="mt-3 text-sm text-gray-500">
              Free audit — no credit card required. Results in under 5 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
          {[
            { stat: "2.5T+", label: "PDFs globally" },
            { stat: "90%", label: "are inaccessible" },
            { stat: "$0.10", label: "per page starting cost" },
            { stat: "95%+", label: "automation rate" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {item.stat}
              </div>
              <div className="mt-1 text-sm text-gray-600">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Service Levels */}
      <section id="service-levels" className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Three levels. One goal: compliance.
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              level: "Level 1",
              name: "Standard",
              price: "$0.10",
              description:
                "Automated tagging, metadata, and structure for straightforward documents.",
              features: [
                "Auto-tag structure",
                "Metadata cleanup",
                "Reading order",
                "veraPDF validation",
              ],
            },
            {
              level: "Level 2",
              name: "Enhanced",
              price: "$0.20",
              description:
                "AI-powered alt text, complex table handling, and quality review.",
              features: [
                "Everything in Level 1",
                "AI alt text generation",
                "Complex table remediation",
                "Quality review pass",
              ],
              featured: true,
            },
            {
              level: "Level 3",
              name: "Full Remediation",
              price: "$0.50",
              description:
                "Human-in-the-loop review for mission-critical and legal documents.",
              features: [
                "Everything in Level 2",
                "Human expert review",
                "Compliance certificate",
                "Priority processing",
              ],
            },
          ].map((tier) => (
            <div
              key={tier.level}
              className={`rounded-xl border p-8 ${
                tier.featured
                  ? "border-blue-600 ring-2 ring-blue-100"
                  : "border-gray-200"
              }`}
            >
              <div className="text-sm font-semibold text-blue-600">
                {tier.level}
              </div>
              <div className="mt-1 text-xl font-bold text-gray-900">
                {tier.name}
              </div>
              <div className="mt-2 text-3xl font-bold text-gray-900">
                {tier.price}
                <span className="text-base font-normal text-gray-500">
                  /page
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-600">{tier.description}</p>
              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <svg
                      className="h-4 w-4 shrink-0 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            How CASO Comply works
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {[
              {
                step: "1",
                title: "Scan",
                desc: "Enter your URL. We crawl your site and find every PDF.",
              },
              {
                step: "2",
                title: "Score",
                desc: "AI scores each document against WCAG 2.1 AA and PDF/UA.",
              },
              {
                step: "3",
                title: "Remediate",
                desc: "We fix sample PDFs automatically and show you the before/after.",
              },
              {
                step: "4",
                title: "Report",
                desc: "Get a personalized audit report with costs, timelines, and next steps.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-12">
        <div className="mx-auto max-w-7xl text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} CASO Document Management, Inc.
            All rights reserved.
          </p>
          <p className="mt-2">
            Accessibility on Demand&trade; is a service of CASO Document
            Management.
          </p>
        </div>
      </footer>
    </div>
  );
}

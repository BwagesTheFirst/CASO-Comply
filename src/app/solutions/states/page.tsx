import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "State-by-State ADA & Accessibility Compliance — CASO Comply",
  description:
    "Find your state's specific accessibility requirements. Every state has unique digital accessibility laws on top of the federal ADA Title II mandate. CASO Comply helps you meet them all.",
  openGraph: {
    title: "State-by-State ADA & Accessibility Compliance — CASO Comply",
    description:
      "Find your state's specific accessibility requirements. Every state has unique digital accessibility laws on top of the federal ADA Title II mandate.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/solutions/states",
  },
};

const ALL_STATES = [
  { slug: "alabama", name: "Alabama", abbr: "AL" },
  { slug: "alaska", name: "Alaska", abbr: "AK" },
  { slug: "arizona", name: "Arizona", abbr: "AZ" },
  { slug: "arkansas", name: "Arkansas", abbr: "AR" },
  { slug: "california", name: "California", abbr: "CA" },
  { slug: "colorado", name: "Colorado", abbr: "CO" },
  { slug: "connecticut", name: "Connecticut", abbr: "CT" },
  { slug: "delaware", name: "Delaware", abbr: "DE" },
  { slug: "district-of-columbia", name: "District of Columbia", abbr: "DC" },
  { slug: "florida", name: "Florida", abbr: "FL" },
  { slug: "georgia", name: "Georgia", abbr: "GA" },
  { slug: "hawaii", name: "Hawaii", abbr: "HI" },
  { slug: "idaho", name: "Idaho", abbr: "ID" },
  { slug: "illinois", name: "Illinois", abbr: "IL" },
  { slug: "indiana", name: "Indiana", abbr: "IN" },
  { slug: "iowa", name: "Iowa", abbr: "IA" },
  { slug: "kansas", name: "Kansas", abbr: "KS" },
  { slug: "kentucky", name: "Kentucky", abbr: "KY" },
  { slug: "louisiana", name: "Louisiana", abbr: "LA" },
  { slug: "maine", name: "Maine", abbr: "ME" },
  { slug: "maryland", name: "Maryland", abbr: "MD" },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA" },
  { slug: "michigan", name: "Michigan", abbr: "MI" },
  { slug: "minnesota", name: "Minnesota", abbr: "MN" },
  { slug: "mississippi", name: "Mississippi", abbr: "MS" },
  { slug: "missouri", name: "Missouri", abbr: "MO" },
  { slug: "montana", name: "Montana", abbr: "MT" },
  { slug: "nebraska", name: "Nebraska", abbr: "NE" },
  { slug: "nevada", name: "Nevada", abbr: "NV" },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH" },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ" },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM" },
  { slug: "new-york", name: "New York", abbr: "NY" },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC" },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND" },
  { slug: "ohio", name: "Ohio", abbr: "OH" },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK" },
  { slug: "oregon", name: "Oregon", abbr: "OR" },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA" },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI" },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC" },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD" },
  { slug: "tennessee", name: "Tennessee", abbr: "TN" },
  { slug: "texas", name: "Texas", abbr: "TX" },
  { slug: "utah", name: "Utah", abbr: "UT" },
  { slug: "vermont", name: "Vermont", abbr: "VT" },
  { slug: "virginia", name: "Virginia", abbr: "VA" },
  { slug: "washington", name: "Washington", abbr: "WA" },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV" },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI" },
  { slug: "wyoming", name: "Wyoming", abbr: "WY" },
];

export default function StatesIndexPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            State-by-State Compliance
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Find Your State&apos;s Accessibility Requirements
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-caso-slate md:text-xl">
            Every state has its own digital accessibility laws, policies, and
            enforcement mechanisms — on top of the federal ADA Title II mandate.
            Select your state below to see what applies to you and how CASO
            Comply can help.
          </p>
        </div>
      </section>

      {/* Federal Deadline Reminder */}
      <section className="border-b border-caso-border/50 bg-caso-navy-light px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-red-500/30 bg-caso-navy p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-red-400">
                Deadline Passed
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold">
                April 24, 2026
              </p>
              <p className="mt-1 text-sm text-caso-slate">
                Entities serving populations of{" "}
                <span className="font-semibold text-caso-white">50,000+</span>
              </p>
            </div>
            <div className="rounded-2xl border border-caso-border bg-caso-navy p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
                Approaching
              </p>
              <p className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold">
                April 26, 2027
              </p>
              <p className="mt-1 text-sm text-caso-slate">
                Entities serving populations{" "}
                <span className="font-semibold text-caso-white">under 50,000</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* State Grid */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {ALL_STATES.map((state) => (
              <Link
                key={state.slug}
                href={`/solutions/states/${state.slug}`}
                className="group rounded-xl border border-caso-border bg-caso-navy-light p-4 transition-all hover:border-caso-blue/50 hover:bg-caso-navy-light/80"
              >
                <span className="block text-xs font-bold text-caso-blue">
                  {state.abbr}
                </span>
                <span className="mt-1 block text-sm font-medium text-caso-white group-hover:text-caso-blue">
                  {state.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            Ready to Get Compliant?
          </h2>
          <p className="mt-4 text-lg text-caso-slate">
            No matter what state you&apos;re in, the federal ADA Title II
            deadline applies. Start with a free compliance scan to see where you
            stand.
          </p>
          <Link
            href="/free-scan"
            className="mt-8 inline-flex rounded-xl bg-caso-blue-deep px-8 py-4 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white transition-all hover:bg-caso-blue hover:shadow-lg hover:shadow-caso-blue/25"
          >
            Free Compliance Assessment
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}

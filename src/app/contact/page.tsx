import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us — CASO Comply",
  description:
    "Get in touch with the CASO Comply team. Whether you need PDF remediation, a free compliance scan, or enterprise pricing, we are here to help.",
  openGraph: {
    title: "Contact Us — CASO Comply",
    description:
      "Get in touch with the CASO Comply team. Whether you need PDF remediation, a free compliance scan, or enterprise pricing, we are here to help.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" }],
  },
  alternates: {
    canonical: "/contact",
  },
};

function PhoneIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}

const CONTACT_INFO = [
  {
    icon: <PhoneIcon />,
    label: "Phone",
    value: "(631) 393-2700",
    href: "tel:+16313932700",
  },
  {
    icon: <EnvelopeIcon />,
    label: "Email",
    value: "sales@casocomply.com",
    href: "mailto:sales@casocomply.com",
  },
  {
    icon: <MapPinIcon />,
    label: "Office",
    value: "CASO Document Management, Bohemia, NY",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <MarketingLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            mainEntity: {
              "@type": "Organization",
              name: "CASO Comply",
              telephone: "+1-631-393-2700",
              email: "info@caso.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "1 Bates Drive",
                addressLocality: "Bohemia",
                addressRegion: "NY",
                postalCode: "11716",
                addressCountry: "US",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "sales",
                telephone: "+1-631-393-2700",
                email: "info@caso.com",
                availableLanguage: "English",
              },
            },
          }),
        }}
      />
      {/* Hero */}
      <section className="border-b border-caso-border/50 px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-caso-glacier">
            Get in Touch
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-caso-slate md:text-xl">
            Have questions about PDF remediation, compliance deadlines, or
            enterprise pricing? We&apos;re here to help.
          </p>
        </div>
      </section>

      {/* Form + Contact Info */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
                Send Us a Message
              </h2>
              <p className="mt-2 text-caso-slate">
                Fill out the form below and our team will get back to you within
                one business day.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <aside>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold md:text-3xl">
                Contact Information
              </h2>
              <p className="mt-2 text-caso-slate">
                Prefer to reach out directly? We&apos;d love to hear from you.
              </p>
              <ul className="mt-8 space-y-6" role="list">
                {CONTACT_INFO.map((item) => (
                  <li key={item.label}>
                    <div className="flex items-start gap-4">
                      <div className="inline-flex rounded-xl bg-caso-navy-light p-3 text-caso-blue">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-1 block text-sm text-caso-slate transition-colors hover:text-caso-white"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 text-sm text-caso-slate">
                            {item.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-caso-border bg-caso-navy-light p-6">
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold">
                  Business Hours
                </h3>
                <dl className="mt-4 space-y-2 text-sm text-caso-slate">
                  <div className="flex justify-between">
                    <dt>Monday &ndash; Friday</dt>
                    <dd>8:00 AM &ndash; 6:00 PM ET</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Saturday &ndash; Sunday</dt>
                    <dd>Closed</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

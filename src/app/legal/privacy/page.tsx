import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — CASO Comply",
  description:
    "CASO Comply privacy policy. Learn how we collect, use, and protect your data when you use our document accessibility remediation platform.",
  robots: "noindex, follow",
};

export default function PrivacyPolicyPage() {
  return (
    <MarketingLayout>
      <article className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-caso-teal">
            Legal
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-black tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-caso-slate">
            Last updated: March 13, 2026
          </p>

          <div className="mt-12 space-y-12">
            {/* Introduction */}
            <section>
              <p className="text-caso-slate leading-relaxed">
                CASO Document Management, Inc. (&quot;CASO,&quot;
                &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the
                CASO Comply platform, an AI-powered document accessibility
                remediation service. This Privacy Policy explains how we
                collect, use, disclose, and protect your information when you
                use our website, platform, and services (collectively, the
                &quot;Service&quot;).
              </p>
              <p className="mt-4 text-caso-slate leading-relaxed">
                By using the Service, you agree to the collection and use of
                information in accordance with this policy. If you do not agree
                with the terms of this policy, please do not access or use the
                Service.
              </p>
            </section>

            {/* 1. Information We Collect */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                1. Information We Collect
              </h2>

              <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Account Information
              </h3>
              <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                When you create an account, we collect your name, email address,
                organization name, job title, and billing information. If you
                sign up on behalf of an organization, we may also collect your
                organization&apos;s address and tax identification number for
                invoicing purposes.
              </p>

              <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Uploaded Documents
              </h3>
              <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                When you use our cloud-based remediation service, you may upload
                PDF documents and other files for processing. These documents
                are stored temporarily for the purpose of remediation and
                delivery. If you use our on-premise Docker agent, documents are
                processed entirely on your infrastructure and are never
                transmitted to or stored by CASO.
              </p>

              <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Usage Data
              </h3>
              <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                We automatically collect information about how you interact with
                the Service, including pages visited, features used, documents
                processed, credit consumption, timestamps, browser type,
                operating system, and IP address. This data helps us improve the
                Service and diagnose technical issues.
              </p>

              <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Cookies and Tracking Technologies
              </h3>
              <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                We use cookies and similar technologies to maintain your session,
                remember your preferences, and understand how the Service is
                used. We use essential cookies required for the Service to
                function and analytics cookies to measure usage patterns. You
                can control cookie preferences through your browser settings.
              </p>
            </section>

            {/* 2. How We Use Your Information */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                2. How We Use Your Information
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We use the information we collect for the following purposes:
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  <strong className="text-caso-white">
                    Provide the Service
                  </strong>{" "}
                  — Process your documents, deliver remediated files, manage
                  your account, and handle billing.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Improve the platform
                  </strong>{" "}
                  — Analyze usage patterns to identify bugs, improve features,
                  and optimize performance. We may use anonymized and aggregated
                  data to train and improve our AI remediation models.
                </li>
                <li>
                  <strong className="text-caso-white">Communicate</strong> —
                  Send transactional emails (account confirmations, billing
                  receipts, document processing notifications), respond to
                  support requests, and share product updates. You can opt out
                  of non-essential communications at any time.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Ensure security
                  </strong>{" "}
                  — Detect and prevent fraud, abuse, and unauthorized access to
                  the Service.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Comply with legal obligations
                  </strong>{" "}
                  — Fulfill our legal and regulatory requirements, including tax
                  reporting and responding to lawful requests from government
                  authorities.
                </li>
              </ul>
            </section>

            {/* 3. Data Retention and Deletion */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                3. Data Retention and Deletion
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We retain your account information for as long as your account
                is active. If you close your account, we will delete your
                personal information within 30 days, except where we are
                required to retain it for legal or regulatory purposes (such as
                billing records, which we retain for 7 years).
              </p>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                Uploaded documents processed through our cloud service are
                retained for a maximum of 30 days after processing to allow you
                to download remediated files. After this period, documents are
                permanently deleted from our systems. You may request immediate
                deletion of your documents at any time through your dashboard or
                by contacting us.
              </p>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                Documents processed through our on-premise Docker agent are
                never stored by CASO. All processing occurs on your
                infrastructure and is subject to your own retention policies.
              </p>
            </section>

            {/* 4. Third-Party Services */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                4. Third-Party Services
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We use the following third-party services to operate the
                platform. Each provider has been evaluated for their security
                and privacy practices:
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  <strong className="text-caso-white">Supabase</strong> —
                  Database and authentication infrastructure. Account data and
                  platform metadata are stored in Supabase&apos;s SOC 2
                  certified infrastructure.
                </li>
                <li>
                  <strong className="text-caso-white">Vercel</strong> — Web
                  application hosting. Our website and application are hosted on
                  Vercel&apos;s SOC 2 certified platform.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Analytics providers
                  </strong>{" "}
                  — We use privacy-respecting analytics to understand how the
                  Service is used. We do not sell your data to any analytics or
                  advertising providers.
                </li>
              </ul>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We do not sell, rent, or trade your personal information to any
                third party. We share information with third-party service
                providers only to the extent necessary to operate the Service.
              </p>
            </section>

            {/* 5. Security Measures */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                5. Security Measures
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We take the security of your data seriously and implement
                industry-standard measures to protect it:
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  <strong className="text-caso-white">Encryption</strong> — All
                  data is encrypted in transit using TLS 1.2 or higher.
                  Sensitive data is encrypted at rest using AES-256 encryption.
                </li>
                <li>
                  <strong className="text-caso-white">
                    SOC 2 Type II Certification
                  </strong>{" "}
                  — CASO Document Management maintains SOC 2 Type II
                  certification, demonstrating independently audited controls
                  for security, availability, and confidentiality.
                </li>
                <li>
                  <strong className="text-caso-white">Access controls</strong>{" "}
                  — Access to customer data is restricted to authorized
                  personnel on a need-to-know basis. All access is logged and
                  audited.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Infrastructure security
                  </strong>{" "}
                  — Our infrastructure providers maintain comprehensive physical
                  and network security controls, including intrusion detection,
                  DDoS protection, and regular penetration testing.
                </li>
              </ul>
            </section>

            {/* 6. HIPAA Considerations */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                6. HIPAA Considerations
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                For healthcare organizations and other entities subject to
                HIPAA, we offer our on-premise Docker agent, which processes
                documents entirely on your infrastructure. Because protected
                health information (PHI) never leaves your environment, no
                Business Associate Agreement (BAA) is required for on-premise
                deployments.
              </p>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                If you require cloud-based processing of documents that may
                contain PHI, please contact us to discuss BAA arrangements and
                additional security measures for your specific use case.
              </p>
            </section>

            {/* 7. Your Rights */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                7. Your Rights
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                Depending on your jurisdiction, you may have the following
                rights regarding your personal information:
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  <strong className="text-caso-white">Access</strong> — You may
                  request a copy of the personal information we hold about you.
                </li>
                <li>
                  <strong className="text-caso-white">Correction</strong> — You
                  may request that we correct any inaccurate or incomplete
                  personal information.
                </li>
                <li>
                  <strong className="text-caso-white">Deletion</strong> — You
                  may request that we delete your personal information, subject
                  to our legal retention obligations.
                </li>
                <li>
                  <strong className="text-caso-white">Portability</strong> —
                  You may request a machine-readable export of your personal
                  data.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Restrict processing
                  </strong>{" "}
                  — You may request that we limit how we use your personal
                  information.
                </li>
                <li>
                  <strong className="text-caso-white">Withdraw consent</strong>{" "}
                  — Where processing is based on consent, you may withdraw that
                  consent at any time.
                </li>
              </ul>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                To exercise any of these rights, please contact us at{" "}
                <a
                  href="mailto:privacy@casocomply.com"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright"
                >
                  privacy@casocomply.com
                </a>
                . We will respond to verified requests within 30 days.
              </p>
            </section>

            {/* 8. Children's Privacy */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                8. Children&apos;s Privacy
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                The Service is not intended for use by individuals under the age
                of 18. We do not knowingly collect personal information from
                children. If we become aware that we have collected personal
                information from a child, we will take steps to delete that
                information promptly.
              </p>
            </section>

            {/* 9. International Data Transfers */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                9. International Data Transfers
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                Our Service is operated in the United States. If you are
                accessing the Service from outside the United States, please be
                aware that your information may be transferred to, stored, and
                processed in the United States. By using the Service, you
                consent to the transfer of your information to the United
                States.
              </p>
            </section>

            {/* 10. Changes to This Policy */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                10. Changes to This Policy
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We may update this Privacy Policy from time to time. When we
                make material changes, we will notify you by email or by posting
                a notice on the Service prior to the change becoming effective.
                Your continued use of the Service after the effective date of
                the revised policy constitutes your acceptance of the changes.
              </p>
            </section>

            {/* 11. Contact Us */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                11. Contact Us
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="mt-4 rounded-xl border border-caso-border bg-caso-navy-light/50 p-6 text-sm text-caso-slate leading-relaxed">
                <p className="text-caso-white font-semibold">
                  CASO Document Management, Inc.
                </p>
                <p className="mt-2">
                  Email:{" "}
                  <a
                    href="mailto:privacy@casocomply.com"
                    className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright"
                  >
                    privacy@casocomply.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}

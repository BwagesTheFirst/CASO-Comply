import type { Metadata } from "next";
import Link from "next/link";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "Terms of Service — CASO Comply",
  description:
    "CASO Comply terms of service. Read the terms and conditions governing your use of our document accessibility remediation platform.",
  robots: "noindex, follow",
};

export default function TermsOfServicePage() {
  return (
    <MarketingLayout>
      <article className="px-6 py-16 md:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-caso-teal">
            Legal
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-black tracking-tight sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-caso-slate">
            Last updated: March 13, 2026
          </p>

          <div className="mt-12 space-y-12">
            {/* Introduction */}
            <section>
              <p className="text-caso-slate leading-relaxed">
                These Terms of Service (&quot;Terms&quot;) govern your access to
                and use of the CASO Comply platform and related services
                (collectively, the &quot;Service&quot;) provided by CASO
                Document Management, Inc. (&quot;CASO,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;). By accessing or using the
                Service, you agree to be bound by these Terms. If you do not
                agree, do not use the Service.
              </p>
              <p className="mt-4 text-caso-slate leading-relaxed">
                If you are using the Service on behalf of an organization, you
                represent and warrant that you have the authority to bind that
                organization to these Terms.
              </p>
            </section>

            {/* 1. Service Description */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                1. Service Description
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                CASO Comply is an AI-powered document accessibility remediation
                platform. The Service enables organizations to remediate PDF
                documents and other digital files to conform with WCAG 2.1 AA,
                PDF/UA (ISO 14289), and Section 508 accessibility standards.
                The Service is offered through a cloud-based web application and
                an on-premise Docker agent.
              </p>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We continuously improve the Service and may add, modify, or
                discontinue features at our discretion. We will provide
                reasonable notice before making material changes that
                significantly reduce the functionality of features you are
                actively using.
              </p>
            </section>

            {/* 2. Account Terms */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                2. Account Terms
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                To use the Service, you must create an account. You agree to:
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  Provide accurate, current, and complete information during
                  registration.
                </li>
                <li>
                  Maintain the security of your account credentials. You are
                  responsible for all activity that occurs under your account.
                </li>
                <li>
                  Notify us immediately at{" "}
                  <a
                    href="mailto:legal@casocomply.com"
                    className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright"
                  >
                    legal@casocomply.com
                  </a>{" "}
                  if you suspect unauthorized access to your account.
                </li>
                <li>
                  Not share your account credentials with unauthorized
                  individuals. Multi-user access is available through our team
                  plans.
                </li>
              </ul>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                You must be at least 18 years old and have the legal capacity to
                enter into a binding agreement to use the Service.
              </p>
            </section>

            {/* 3. Acceptable Use */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                3. Acceptable Use
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                You agree to use the Service only for lawful purposes and in
                accordance with these Terms. You agree not to:
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  Use the Service to process documents containing illegal
                  content.
                </li>
                <li>
                  Attempt to reverse-engineer, decompile, or disassemble any
                  part of the Service, including our AI models and remediation
                  algorithms.
                </li>
                <li>
                  Use automated systems (bots, scrapers, or similar) to access
                  the Service in a manner that exceeds reasonable use or
                  bypasses rate limits.
                </li>
                <li>
                  Resell, sublicense, or redistribute the Service or its output
                  as a competing accessibility remediation service.
                </li>
                <li>
                  Interfere with or disrupt the integrity or performance of the
                  Service.
                </li>
                <li>
                  Upload documents that you do not have the right to process or
                  distribute.
                </li>
              </ul>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We reserve the right to suspend or terminate your account if we
                determine, in our sole discretion, that you have violated these
                acceptable use terms.
              </p>
            </section>

            {/* 4. Intellectual Property */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                4. Intellectual Property
              </h2>

              <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Your Documents
              </h3>
              <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                You retain full ownership of all documents you upload to or
                process through the Service. CASO does not claim any
                intellectual property rights over your content. We access your
                documents solely to provide the remediation service you have
                requested.
              </p>

              <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                CASO&apos;s Intellectual Property
              </h3>
              <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                The Service, including its software, AI models, algorithms,
                user interface, documentation, and all related intellectual
                property, is and remains the exclusive property of CASO
                Document Management, Inc. These Terms do not grant you any
                rights to our intellectual property except the limited right to
                use the Service as described herein.
              </p>

              <h3 className="mt-6 font-[family-name:var(--font-display)] text-lg font-bold text-caso-white">
                Remediated Output
              </h3>
              <p className="mt-2 text-sm text-caso-slate leading-relaxed">
                The remediated documents produced by the Service are your
                property. You may use, distribute, and publish them without
                restriction. Any accessibility tags, alt text, metadata, and
                structural elements added by the Service become part of your
                document.
              </p>
            </section>

            {/* 5. Payment Terms */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                5. Payment Terms
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                The Service operates on a credit-based pricing model. You
                purchase credits, which are consumed when documents are
                processed. The number of credits consumed per document depends
                on the document&apos;s page count and complexity tier.
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  <strong className="text-caso-white">Pricing</strong> —
                  Current pricing is listed on our{" "}
                  <Link
                    href="/pricing"
                    className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright"
                  >
                    pricing page
                  </Link>
                  . We reserve the right to change pricing with 30 days&apos;
                  notice. Price changes do not affect credits already purchased.
                </li>
                <li>
                  <strong className="text-caso-white">Payment</strong> —
                  Payments are processed via invoice with Net 30/45/60 payment
                  terms. Purchase orders (POs) are accepted. All charges are
                  based on actual page usage at the service level rate agreed
                  upon in your order form.
                </li>
                <li>
                  <strong className="text-caso-white">Credit expiration</strong>{" "}
                  — Purchased credits do not expire for the duration of your
                  active account. Credits are non-transferable between accounts.
                </li>
                <li>
                  <strong className="text-caso-white">Refunds</strong> — If the
                  Service fails to process a document due to a platform error
                  (not a document quality issue), the credits consumed for that
                  document will be refunded to your account. We do not provide
                  monetary refunds for unused credits.
                </li>
                <li>
                  <strong className="text-caso-white">Enterprise plans</strong>{" "}
                  — Custom pricing and volume discounts are available for
                  enterprise customers. Enterprise agreements may include
                  different payment terms as specified in a separate order form.
                </li>
              </ul>
            </section>

            {/* 6. Service Level Commitments */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                6. Service Level Commitments
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We strive to maintain high availability and performance of the
                Service:
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  <strong className="text-caso-white">Uptime</strong> — We
                  target 99.9% uptime for our cloud platform, excluding
                  scheduled maintenance windows. Scheduled maintenance will be
                  communicated at least 24 hours in advance.
                </li>
                <li>
                  <strong className="text-caso-white">Processing time</strong>{" "}
                  — Standard document processing typically completes within
                  minutes. Processing times may vary based on document
                  complexity and system load.
                </li>
                <li>
                  <strong className="text-caso-white">Support</strong> — We
                  provide email support during business hours (Monday through
                  Friday, 9 AM to 6 PM Eastern). Enterprise customers may have
                  additional support terms as specified in their agreement.
                </li>
              </ul>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                The on-premise Docker agent runs on your infrastructure and is
                not subject to our uptime commitments. Agent availability
                depends on your infrastructure and operational practices.
              </p>
            </section>

            {/* 7. Limitation of Liability */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                7. Limitation of Liability
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, CASO SHALL
                NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO
                LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE
                LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE
                SERVICE.
              </p>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                Our total aggregate liability for all claims arising out of or
                related to these Terms or the Service shall not exceed the
                greater of (a) the amounts you have paid to CASO in the twelve
                (12) months preceding the claim, or (b) one hundred dollars
                ($100).
              </p>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                The Service provides automated document remediation. While we
                strive for high accuracy, we do not guarantee that remediated
                documents will be 100% compliant with all applicable
                accessibility standards in all cases. You are responsible for
                verifying the accessibility of your documents. The Service is
                not a substitute for legal advice regarding your compliance
                obligations.
              </p>
            </section>

            {/* 8. Indemnification */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                8. Indemnification
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                You agree to indemnify, defend, and hold harmless CASO Document
                Management, Inc., its officers, directors, employees, and
                agents from and against any and all claims, damages, losses,
                liabilities, costs, and expenses (including reasonable
                attorneys&apos; fees) arising out of or related to:
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>Your use of the Service.</li>
                <li>
                  Your violation of these Terms or any applicable law or
                  regulation.
                </li>
                <li>
                  Your violation of any third-party rights, including
                  intellectual property rights.
                </li>
                <li>
                  The content of any documents you upload to or process through
                  the Service.
                </li>
              </ul>
            </section>

            {/* 9. Termination */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                9. Termination
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                You may terminate your account at any time by contacting us at{" "}
                <a
                  href="mailto:legal@casocomply.com"
                  className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright"
                >
                  legal@casocomply.com
                </a>{" "}
                or through your account settings. Upon termination:
              </p>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  Your access to the Service will be revoked immediately.
                </li>
                <li>
                  Any unused credits in your account will be forfeited. Credits
                  are non-refundable.
                </li>
                <li>
                  Your uploaded documents will be deleted within 30 days.
                </li>
                <li>
                  Account data will be retained as described in our{" "}
                  <Link
                    href="/legal/privacy"
                    className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright"
                  >
                    Privacy Policy
                  </Link>
                  .
                </li>
              </ul>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                We may suspend or terminate your account if you violate these
                Terms, if we are required to do so by law, or if we discontinue
                the Service. Where possible, we will provide reasonable notice
                before termination. In cases of material breach, we may
                terminate without notice.
              </p>
            </section>

            {/* 10. Disclaimer of Warranties */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                10. Disclaimer of Warranties
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
                OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
                NON-INFRINGEMENT. CASO DOES NOT WARRANT THAT THE SERVICE WILL
                BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
              </p>
            </section>

            {/* 11. Governing Law */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                11. Governing Law
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of the State of New York, without regard to its
                conflict of law provisions. Any legal action or proceeding
                arising out of or relating to these Terms shall be brought
                exclusively in the state or federal courts located in New York
                County, New York, and you consent to the personal jurisdiction
                and venue of such courts.
              </p>
            </section>

            {/* 12. General Provisions */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                12. General Provisions
              </h2>
              <ul className="mt-4 ml-6 list-disc space-y-2 text-sm text-caso-slate leading-relaxed">
                <li>
                  <strong className="text-caso-white">Entire Agreement</strong>{" "}
                  — These Terms, together with our Privacy Policy and any
                  applicable order forms, constitute the entire agreement
                  between you and CASO regarding the Service.
                </li>
                <li>
                  <strong className="text-caso-white">Severability</strong> —
                  If any provision of these Terms is found to be unenforceable,
                  the remaining provisions will continue in full force and
                  effect.
                </li>
                <li>
                  <strong className="text-caso-white">Waiver</strong> — Our
                  failure to enforce any right or provision of these Terms shall
                  not be considered a waiver of that right or provision.
                </li>
                <li>
                  <strong className="text-caso-white">Assignment</strong> — You
                  may not assign or transfer these Terms without our prior
                  written consent. We may assign these Terms in connection with
                  a merger, acquisition, or sale of all or substantially all of
                  our assets.
                </li>
                <li>
                  <strong className="text-caso-white">
                    Force Majeure
                  </strong>{" "}
                  — Neither party shall be liable for any failure or delay in
                  performance due to causes beyond its reasonable control,
                  including natural disasters, war, terrorism, labor disputes,
                  government actions, or internet service disruptions.
                </li>
              </ul>
            </section>

            {/* 13. Contact */}
            <section>
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
                13. Contact Us
              </h2>
              <p className="mt-4 text-sm text-caso-slate leading-relaxed">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="mt-4 rounded-xl border border-caso-border bg-caso-navy-light/50 p-6 text-sm text-caso-slate leading-relaxed">
                <p className="text-caso-white font-semibold">
                  CASO Document Management, Inc.
                </p>
                <p className="mt-2">
                  Email:{" "}
                  <a
                    href="mailto:legal@casocomply.com"
                    className="text-caso-blue underline decoration-caso-blue/30 transition-colors hover:text-caso-blue-bright"
                  >
                    legal@casocomply.com
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

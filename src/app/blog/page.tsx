import Link from "next/link";
import type { Metadata } from "next";
import MarketingLayout from "@/components/MarketingLayout";

export const metadata: Metadata = {
  title: "Blog — CASO Comply",
  description:
    "Document accessibility insights, compliance guides, and industry news from CASO Comply. Stay informed about ADA Title II, WCAG 2.1, PDF accessibility, and more.",
  openGraph: {
    title: "Blog — CASO Comply",
    description:
      "Document accessibility insights, compliance guides, and industry news from CASO Comply.",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "CASO Comply" },
    ],
  },
  alternates: {
    canonical: "/blog",
  },
};

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateFormatted: string;
  category: "Compliance" | "Technical" | "Industry News" | "Guides";
  readTime: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-make-pdfs-accessible",
    title: "How to Make PDFs Accessible: A Complete Guide",
    excerpt:
      "Learn what makes a PDF accessible, the most common accessibility issues, and step-by-step instructions for remediating your documents to meet WCAG 2.1 AA and PDF/UA standards.",
    date: "2026-03-14",
    dateFormatted: "March 14, 2026",
    category: "Guides",
    readTime: "8 min read",
  },
  {
    slug: "ada-title-ii-deadline-what-you-need-to-know",
    title:
      "ADA Title II Deadline: What Government Agencies Need to Know in 2026",
    excerpt:
      "The April 24, 2026 ADA Title II deadline for large government agencies has passed. Here is what happened, what comes next, and how smaller agencies can prepare for the April 2027 deadline.",
    date: "2026-03-14",
    dateFormatted: "March 14, 2026",
    category: "Compliance",
    readTime: "9 min read",
  },
  {
    slug: "document-accessibility-policy-template",
    title: "Document Accessibility Policy Template for Government Agencies",
    excerpt:
      "A practical, ready-to-adopt document accessibility policy template for government agencies. Includes sample policy language, implementation steps, and best practices.",
    date: "2026-03-14",
    dateFormatted: "March 14, 2026",
    category: "Guides",
    readTime: "10 min read",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Compliance:
    "border-caso-warm/50 bg-caso-warm/10 text-caso-warm",
  Technical:
    "border-caso-teal/50 bg-caso-teal/10 text-caso-teal",
  "Industry News":
    "border-caso-glacier/50 bg-caso-glacier/10 text-caso-glacier",
  Guides:
    "border-caso-blue/50 bg-caso-blue/10 text-caso-blue",
};

export default function BlogIndexPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-caso-blue/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-caso-teal">
            Blog
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            Document Accessibility{" "}
            <span className="text-caso-blue">Insights</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-caso-slate">
            Compliance guides, technical deep dives, and industry news to help
            you navigate document accessibility requirements and build a more
            inclusive digital presence.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="group flex flex-col rounded-2xl border border-caso-border bg-caso-navy-light/30 transition-all hover:border-caso-blue/30 hover:bg-caso-navy-light/50"
              >
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${
                        CATEGORY_COLORS[post.category] || ""
                      }`}
                    >
                      {post.category}
                    </span>
                    <span className="text-xs text-caso-slate">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="mt-4 font-[family-name:var(--font-display)] text-xl font-bold text-caso-white group-hover:text-caso-blue transition-colors">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="after:absolute after:inset-0"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-caso-slate">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <time
                      dateTime={post.date}
                      className="text-xs text-caso-slate"
                    >
                      {post.dateFormatted}
                    </time>
                    <span className="text-sm font-semibold text-caso-blue group-hover:text-caso-blue-bright transition-colors">
                      Read more &rarr;
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}

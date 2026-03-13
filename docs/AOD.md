# Accessibility on Demand (AoD) — Complete Knowledge Base

> Compiled from CASO Document Management / Netra Labs source materials.
> Last updated: 2026-03-13

---

## Table of Contents

1. [Company & Brand Overview](#company--brand-overview)
2. [The Accessibility Problem](#the-accessibility-problem)
3. [Market Opportunity](#market-opportunity)
4. [Regulatory Landscape](#regulatory-landscape)
5. [ADA Title II Exceptions (Clarified)](#ada-title-ii-exceptions-clarified)
6. [PDF Accessibility Compliance Checklist](#pdf-accessibility-compliance-checklist)
7. [The AoD Platform & Service Levels](#the-aod-platform--service-levels)
8. [AoD vs. Manual Remediation](#aod-vs-manual-remediation)
9. [Target Verticals](#target-verticals)
10. [K-12 Education Vertical (Deep Dive)](#k-12-education-vertical-deep-dive)
11. [Commercial Model & Pricing](#commercial-model--pricing)
12. [Proposal / SOW Template Structure](#proposal--sow-template-structure)
13. [The Blind / Low-Vision User Experience](#the-blind--low-vision-user-experience)
14. [Sales Messaging & Key Talking Points](#sales-messaging--key-talking-points)
15. [Resources & References](#resources--references)

---

## Company & Brand Overview

- **Brand**: Accessibility on Demand (AoD) — *"That's a wonderful thing..."*
- **Parent Company**: Netra Labs (technology) / CASO Document Management, Inc. (sales & services)
- **Contact**: Richard Tamaro, President — richard.tamaro@caso.com / 917.576.7841
- **Platform URL**: accessibilityondemand.ai
- **Tagline**: "The First Truly Automated PDF Remediation Platform"
- **Core Promise**: 100% automated PDF remediation at scale — achieve PDF/UA, WCAG 2.1 AA, and Section 508 compliance

---

## The Accessibility Problem

### The Scale of Inaccessibility

- **2.5 trillion** PDFs created annually worldwide
- **90%+** of PDFs are at least partially inaccessible (Adobe)
- **74.9%** of scholarly PDFs fail to meet any accessibility criteria (Switzerland Study)
- **96.3%** of analyzed digital content fails WCAG 2.0 Level AA (WebAIM 2024)
- **77%** of government document downloads are PDFs
- **Only 20%** of government PDFs are conformant with accessibility standards
- **73%** of non-conformant federal PDFs are completely untagged
- **57%** of federal agency PDFs are non-conformant (DOJ M-24-08)

### Why Most PDFs Are Still Inaccessible

1. **Unreadable scans** — image-only pages with no text layer
2. **No tags & structure** — no heading hierarchy, reading order, or semantic markup
3. **Missing alt text** — images/charts/graphs with no descriptions
4. **Broken tables/forms** — no header associations, no form labels
5. **Metadata & small errors** — missing language, title, bookmarks

### Why Manual Remediation Doesn't Scale

| Problem | Detail |
|---------|--------|
| **Slow** | 15-30+ min/page; 1M pages = 9-19 staff-years |
| **Expensive** | $5-$25+/page; $50k-$250k+ per 10k pages |
| **Inconsistent** | Different remediators, different results; audits still fail |
| **Unmanageable** | Backlogs grow faster than humans can clear them |

> Manual effort (even with tools) offers only incremental savings, not transformation. **Automation is needed to break the bottleneck.**

---

## Market Opportunity

### Market Size

| Metric | Value |
|--------|-------|
| Global visually impaired population | 338 million (moderate to severe) |
| Global TAM | $56.7 billion annually |
| U.S. TAM | $1.24 billion annually |
| Americans with vision loss/blindness | 7.4 million |
| PDFs created annually | 2.5 trillion |
| Businesses using PDFs for external sharing | 98% |
| Businesses using PDF as primary format | 82% |

### Key Market Drivers

1. **Legal Risk & Compliance Pressure**: DOJ 2024 memorandum (M-24-08); ADA cases reached 4,061 in 2022 (nearly doubled from 2018); average lawsuit cost $100,000
2. **Consumer Behavior & Brand Impact**: 56% of people with disabilities cite accessibility as primary factor choosing online services; disability community controls $490 billion in disposable income
3. **Enterprise Digital Transformation**: European Accessibility Act 2025 deadline; California AB 1757 could impose $4,000 fines per violation; increasing state-level regulations

### AI-Powered Solution Evolution

Modern AI platforms automate up to 90% of the remediation process with:
- Enhanced OCR accuracy for text recognition
- Automated structure tagging and reading order
- AI-generated alternative text for images
- Real-time accessibility validation
- Cost reduction of up to 95% vs. manual methods
- New pricing models: $0.20-$6.00/page depending on level

---

## Regulatory Landscape

### Standards Matrix

| Standard | Scope | Requirement |
|----------|-------|-------------|
| **ADA Title II** | State & local government | WCAG 2.1 Level AA |
| **Section 508** | Federal agencies & recipients | WCAG 2.0 Level AA (lower bar) |
| **PDF/UA (ISO 14289)** | Universal PDF accessibility | Technical standard for tagged PDFs |
| **WCAG 2.1 AA** | Web content guidelines | Perceivable, operable, understandable, robust |
| **AODA** | Ontario, Canada | Accessibility for Ontarians with Disabilities Act |
| **EN 301 549** | European Union | European Accessibility Act |

### ADA Title II Compliance Deadlines

| Population | Deadline |
|------------|----------|
| Entities serving **50,000+ people** | **April 24, 2026** |
| Entities serving **<50,000 people** & special districts | **April 26, 2027** |

### What ADA Title II Covers

**All web content and mobile apps**, including:
- Websites, online portals, intranets, employee systems
- **Electronic documents** (PDFs, Word files, spreadsheets) made available online
- Both **public-facing and internal content** that constitutes part of the entity's services, programs, or activities

### Consequences of Non-Compliance

| Risk Type | Description | Financial Impact |
|-----------|-------------|-----------------|
| Legal Action | OCR complaints, ADA/Section 504 lawsuits; ~20% increase in 2025 | $50,000-$100,000+ |
| Federal Fines | Initial ADA violations $75,000; subsequent $150,000 | $75,000-$150,000+ |
| State Penalties | California: $4,000/instance; Colorado: $3,500/violation | Varies |
| Settlement Costs | Harvard/MIT: $1,575,000 in attorneys' fees | $100,000-$1,000,000+ |
| Reputational Damage | Loss of public trust and community confidence | Intangible but significant |

---

## ADA Title II Exceptions (Clarified)

> **Key message**: Exceptions are far narrower than most organizations assume. The goal is not to find reasons to avoid making content accessible, but to find the most efficient path to full accessibility.

### 1. Archived Web Content Exception

Content created before the compliance deadline and retained exclusively for historical reference may be exempt — **but ALL FOUR criteria must be met**:

1. Created **before** the compliance date
2. Kept **exclusively** for reference, research, or recordkeeping
3. **Not altered or updated** after being archived
4. Stored in a **clearly identified, dedicated archived area** of the website

**Qualifies**: Historical meeting minutes from 1995 in a labeled "Historical Archives" section

**Does NOT qualify**: Any document currently used to apply for, access, or participate in government services; content regularly accessed by the public; documents updated after compliance date; old content not in a designated archive area

### 2. Preexisting Conventional Electronic Documents Exception

Word docs, PDFs, spreadsheets, presentations posted before the compliance date may be exempt.

> **Critical Limitation**: Does NOT apply if the document is currently used to apply for, gain access to, or participate in the public entity's services, programs, or activities.

### 3. Third-Party Content Exception

Content posted by third parties not acting on behalf of or under contract with the entity may be exempt.

**Does NOT qualify**: Vendor/contractor content; third-party platforms delivering government services; content developed by outside tech companies for the government

### 4. Fundamental Alteration & Undue Burden Defenses

These are **legal defenses, not automatic exceptions**:
- Decision must be made by the **head of the public entity**
- Must consider **all available resources** (not just one department)
- Must be documented in a **formal written statement**
- Entity **must still provide alternative means of access**

### Common Misconceptions

| Misconception | Reality |
|---------------|---------|
| "All old content is automatically archived" | Only content meeting ALL FOUR strict criteria qualifies |
| "Small budget = undue burden" | Requires formal written determination by agency head considering ALL resources |
| "Vendor content is third-party" | Content by contractors/vendors working for government is NOT exempt |
| "Section 508 is enough" | Section 508 = WCAG 2.0 AA; Title II requires WCAG 2.1 AA (higher standard) |
| "Internal documents don't need to be accessible" | All web content that is part of services/programs must be accessible |
| "We've always done it this way" | Legacy practices are not an exception |

### Recommended Prioritization Framework

| Tier | Content Type | Priority |
|------|-------------|----------|
| **Tier 1** | Online forms, payment portals, emergency alerts, high-traffic pages | Immediate |
| **Tier 2** | Program info, educational resources, meeting agendas, public notices | Important |
| **Tier 3** | Historical reports, supplementary info, low-traffic pages | General |
| **Tier 4** | Truly exempt content meeting all exception criteria | Exempt |

> **"When in doubt, remediate."** If there's any uncertainty about whether content qualifies for an exception, remediate it. If it's linked from a current page or appears in search results, treat it as active content.

---

## PDF Accessibility Compliance Checklist

### Document Setup
- Use real text (not images of text); use OCR for scanned documents
- Set descriptive Title in Document Properties and default language
- Export using "Save As PDF" (not "Print to PDF") with structure tags enabled
- Avoid PDF security that blocks screen reader access
- Ensure the PDF is tagged with proper logical reading order

### Tagging & Structure
- Proper heading hierarchy (H1 > H2 > H3, etc.) using actual heading tags
- Lists recognized as lists with `<L>` and `<LI>` tags
- Hyperlinks properly tagged as links with descriptive text
- Reading order verified to be logical (left-to-right, top-to-bottom)

### Images & Alt Text
- Alt text for every informative image, graphic, chart, or figure
- Decorative images marked as artifacts (ignored by assistive tech)
- Complex images (infographics, maps) have detailed descriptions

### Tables
- True table structure (not images); `<Table>`, `<TR>`, `<TH>`, `<TD>` tags
- Header cells properly identified with Scope attribute
- Simple tables preferred; avoid merged/spanned cells
- No blank cells used for formatting/spacing

### Forms (Interactive PDFs)
- Form fields have accessible labels/tooltips
- Keyboard navigation and logical tab order
- Standard form field types with proper `<Form>` tags
- Error messages and hints are accessible

### Visual Design
- Color contrast: **4.5:1 minimum** for normal text, **3:1** for large text
- Don't rely on color alone to convey meaning
- Clean, legible fonts at reasonable size
- No flashing content (>3 flashes/second)

### Testing
- Run automated accessibility checker (Acrobat Pro, PAC at pac.pdf-accessibility.org)
- Manual testing with screen reader (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation test
- Real user feedback when possible

---

## The AoD Platform & Service Levels

### Platform Capabilities

- **Automated tag tree and reading order** construction
- **Table tagging** with headers, scope, and summaries
- **Form tagging** with labels, tooltips, and tab order
- **Alt text generation** — basic, contextual, or custom depending on level
- **Artifact identification** for decorative elements
- **Language, title/metadata, and bookmarks** for long documents
- **OCR** for image-only scans (99.5% accuracy)
- **Batch processing** — thousands of pages in parallel
- **API integration** with existing IDP/CMS workflows
- **Manual Editor** — in-platform tool for human review and corrections
- **Compliance validation reports** (WCAG/PDF-UA checks)

### Three Service Levels

| Feature | Level 1: Standard | Level 2: Enhanced | Level 3: Full/Expert |
|---------|-------------------|-------------------|----------------------|
| **Best For** | Text-heavy docs, archives | Public-facing, image/chart-heavy | Policy-driven, legally mandated |
| **AoD Price** | **$0.30/page** | **$1.80/page** | **$12.00/page** |
| **Market Price** | ~$5-$8/page | ~$10-$20/page | Up to $40/page |
| Automated Tagging & Reading Order | Yes | Yes | Yes |
| Searchable PDFs (OCR) | Yes | Yes | Yes |
| Metadata, Language, Bookmarks | Yes | Yes | Yes |
| Alt Text | Basic | Contextual (AI-powered) | Expert-verified & custom |
| Advanced Table/Form Tagging | Basic | Advanced | Advanced |
| Expert Human Review | No | No | **Yes** |
| Compliance Guarantee | ~97%+ (target 90%+) | **95%+** | **99-100%** |
| Turnaround | Seconds | Minutes | Fast SLA (Hours) |

> All levels include: language tagging, document metadata, logical bookmarks, batch processing at scale.

### Level Details

**Level 1 — Standard Accessibility ($0.30/page)**
- Foundational accessibility through automated OCR and tagging
- Best for: internal, text-heavy, or archival documents; rapid automated improvement
- Does NOT include: comprehensive alt-text or advanced compliance checks

**Level 2 — Enhanced Compliance ($1.80/page)**
- Adds AI-powered contextual alt-text and enhanced document analysis
- Each document achieves 95%+ compliance or no cost
- Ideal for: public-facing, image/chart-heavy docs; external audits
- Does NOT include: expert human review

**Level 3 — Full/Expert Remediation ($12.00/page)**
- Complete human review guaranteeing 100% compliance
- For organizations with zero tolerance for compliance risk
- Certified, audit-ready results with VPAT documentation
- Available only via separate Services SOW

### How Customers Use It

1. **Backfile (self-service)**: Process historical PDFs in batches
2. **Day-forward**: Route new PDFs through AoD before publishing
3. **Single or batch**: One document or thousands

### Platform Roles

| Role | Capabilities |
|------|-------------|
| **Admin** | Add/manage user access and roles; create teams; allocate credits |
| **Team Admin** | Add/manage users in team; allocate team credits |
| **User** | Upload PDFs; select assurance level; process; review; publish |

---

## AoD vs. Manual Remediation

| Metric | Traditional Manual | AoD |
|--------|-------------------|-----|
| **Cost per Page** | $8-$50+ | $0.30-$1.80+ |
| **Time per Page** | 15-30+ minutes | Seconds to minutes |
| **Accuracy** | 30% error rate | 95%+ compliance score |
| **Scalability** | Unable to scale with volume | Thousands of pages in minutes |
| **Expertise Required** | High (specialized training) | None |
| **Compliance Validation** | Unpredictable | PAC-validated against WCAG & PDF/UA |

### Real-World Case Study

> A government agency needed **25,000 public records** accessible in **5 days**.
>
> | | Manual Plan | With AoD |
> |---|---|---|
> | **Cost** | $250,000 | $5,000 |
> | **Time** | Weeks to months | < 1 day |
>
> AoD delivered what dozens of contractors and $250,000 couldn't.

### Automation Comparison

- **Legacy automation tools**: ~35% of accessibility process automated
- **AoD**: ~95% of accessibility process automated
- Even the best-known tools leave most work to expensive specialists; AoD eliminates bottlenecks

---

## Target Verticals

### Government (Primary — ADA Title II)
- State & local government agencies
- Municipal websites with public-facing PDFs
- Meeting minutes, agendas, forms, policies, emergency communications
- **Deadline pressure**: April 2026 for pop 50k+, April 2027 for smaller

### K-12 Education
- School districts, individual schools
- Homework packets, lesson plans, IEPs, report cards, parent communications
- ADA + Section 504 of Rehabilitation Act
- Same Title II deadlines apply to public schools

### Higher Education
- Universities, community colleges
- Research papers, course materials, administrative documents
- Section 504 and ADA compliance

### Enterprise / Corporate
- Any business with public-facing documents
- ADA Title III applies to "places of public accommodation"
- Growing litigation pressure (4,061 ADA cases in 2022)

### Healthcare / Medical Centers
- Patient-facing documents, policies, forms
- HIPAA intersection with accessibility requirements

---

## K-12 Education Vertical (Deep Dive)

### Key Use Cases

**Instructional & Learning Materials**:
- Homework packets and assignments (simple worksheets to complex multi-page)
- Lesson plans, rubrics, study guides
- Digital course content and e-books
- Library resources and digital textbooks

**Communication & Administration**:
- Parent/family newsletters and forms (critical for blind/low-vision parents)
- District policies, enrollment forms, student handbooks
- IEP and special education documents
- Report cards and transcripts
- Emergency communications

**Assessment**:
- Standardized tests and assessment materials in digital format

### Legal Framework for K-12

- **ADA** and **Section 504** of the Rehabilitation Act are primary federal laws
- DOJ April 2024 final rule: public schools' web content and PDFs must comply with WCAG 2.1 Level AA
- Deadlines: April 24, 2026 (larger districts 50k+), April 24, 2027 (smaller districts)

### K-12 Benefits of AoD

- **Cost savings**: Up to 95% reduction vs. manual remediation
- **Speed**: Thousands of pages in minutes; address large backlogs quickly
- **Guaranteed compliance**: 95%+ score with WCAG 2.2 AA and PDF/UA validation
- **No expertise needed**: Any school staff can use it without extensive training
- **Comprehensive standards**: WCAG 2.2 AA, PDF/UA, ADA Title II/III, Section 508, AODA, EN 301 549

---

## Commercial Model & Pricing

### Credit-Based System

- **1 Credit = $0.30**
- Credits are **non-refundable** and **never expire** (available for duration of contract)
- No monthly/annual rollover concept needed since credits don't expire
- Client monitors balance in-product or via usage reports

### Credit Rates by Level

| Level | Credits per Page | Cost per Page |
|-------|-----------------|---------------|
| Standard | 1 credit | $0.30 |
| Enhanced | 6 credits | $1.80 |
| Expert Review | 40 credits | $12.00 |

### Volume Discounts

| Volume | Discount |
|--------|----------|
| 1-500 pages | Standard pricing |
| 501-5,000 pages | 10% discount |
| 5,001-25,000 pages | 15% discount |
| 25,001+ pages | Custom pricing |

### Example Proposal (100k pages)

| Level | Pages | Credits/Page | Total Credits | Cost |
|-------|-------|-------------|---------------|------|
| Standard | 80,000 | 1 | 80,000 | $24,000 |
| Enhanced | 18,000 | 6 | 108,000 | $32,400 |
| Expert | 2,000 | 40 | 80,000 | $24,000 |
| **Total** | **100,000** | | **268,000** | **$80,400** |

### Subscription Terms

- 12-month subscription, auto-renews unless 30-day written notice
- Overage usage billed monthly in arrears at current rate
- Payment: Net 30 from invoice
- Late fees: 1.5%/month (18% APR) assessed 15 days after due date
- Target uptime: 99.5% monthly (excluding scheduled maintenance)
- Maintenance window: Sundays 2:00-6:00 AM Eastern

---

## Proposal / SOW Template Structure

### Service Model

AoD is delivered as **SaaS subscription**. CASO provisions platform access; client operates it self-service. CASO does not perform manual remediation under standard SOW.

### Included with Subscription

- Access to AoD web application
- Processing capacity metered by credits
- Knowledge base & email support (business hours, Mon-Fri 9am-6pm ET)
- Two (2) remote training sessions, up to 4 hours

### Not Included (unless separately contracted)

- Manual remediation by CASO
- Content inventory, project management
- Captioning/transcripts, LMS/SCORM fixes
- Website/CMS changes
- Legal advice
- Source document editing (Word/Excel/PowerPoint)

### Typical Engagement Phases

1. **Phase 1 — Backfile**: Client processes historical PDFs in batches through AoD
2. **Phase 2 — Day-Forward**: Route new PDFs through AoD before publishing

### Security & Data Handling

- Encryption in transit (TLS) and at rest (AES-256)
- Least-privilege access and audit logging
- Default document retention: 7 days post-processing (configurable)
- Regional hosting and on-premise options may be available
- **AoD does not train models on client content**

### Accessibility Commitment

CASO produces deliverables aligned with WCAG 2.1 AA / WCAG 2.2 AA and PDF/UA-1. Files verified using automated checks (Acrobat, PAC 2024) and functional spot testing with screen readers (JAWS, NVDA, VoiceOver). Alternate formats available upon request: tagged PDF, accessible HTML, DOCX, EPUB, large print, plain text, braille-ready (BRF).

---

## The Blind / Low-Vision User Experience

### How a Legally Blind Person Experiences a PDF

Understanding these experiences is critical for sales conversations — it creates empathy and urgency.

**Heard Aloud (Screen Readers)**:
- JAWS or NVDA reads content using text-to-speech
- User navigates by headings, paragraphs, and links in sequence
- Like an interactive audiobook — but only if the PDF is properly tagged

**Felt Through Touch (Braille Displays)**:
- Refreshable braille display converts text to physical braille characters
- User reads line by line with fingertips
- Requires actual text layer (not image-only scans)

**Viewed with Magnification (Low Vision)**:
- Screen magnification software enlarges 2x to 60x+
- **"Keyhole" view** — user sees only a small portion at any time; constant panning required
- High-contrast/inverted colors (e.g., white on black) to reduce eye strain
- **Reflow mode** in accessible PDFs reformats into a single large-print column

### Accessible vs. Inaccessible PDF

| Accessible (Tagged) PDF | Inaccessible (Untagged) PDF |
|------------------------|---------------------------|
| Hidden structure that assistive tech can interpret | Flat image of text — essentially a picture |
| Text read in correct logical order | Content read in random, nonsensical order |
| Images have descriptive alt text | Images completely inaccessible |
| Tables navigable cell by cell | Table data jumbled or missing |
| Text can be highlighted, magnified, converted to braille | Text cannot be selected or processed |

### Metaphors for Sales Conversations

- **"Blueprint vs. Jigsaw Puzzle"**: An accessible PDF is a house with a clear blueprint; an inaccessible PDF is a box of random puzzle pieces without the picture on the box
- **"Roadmap vs. Spaghetti"**: A tagged PDF is a roadmap with clear street names; an untagged PDF is a plate of spaghetti where you can't tell where one noodle begins or ends

---

## Sales Messaging & Key Talking Points

### By Audience

**Compliance Officers**: Meet mandates, demonstrate results — automated reports, verified compliance

**Legal Teams**: Reduce litigation risk — well-structured, audit-ready reports

**IT/Digital Teams**: Integrate easily — API/cloud workflow, no new headcount

**Document Operations**: Move huge volumes, stay on budget — seconds per page, predictable cost

### The "Just Do It All" Argument

> Organizations assume most of their content that qualifies as an exception should still be considered for remediation. AoD makes comprehensive remediation economically feasible at scale, allowing organizations to adopt a "just do it all" approach rather than spending time and resources trying to parse narrow exception criteria, only to be called out later for non-compliance.

### Key Stats for Conversations

- **26%** of U.S. adults live with a disability
- **350 million** worldwide with moderate-to-severe vision loss
- **90%** of PDFs are inaccessible
- **$490 billion** in disposable income controlled by disability community
- **$100,000** average ADA lawsuit cost
- **$0.30/page** vs. **$5-$25+/page** manual — up to **95% cost reduction**
- **95%+ compliance** guaranteed at Enhanced level

### Competitive Positioning

- AoD automates **95%** of the process vs. legacy tools at **~35%**
- Costs **less than 10%** of market average
- Only platform offering **tiered accessibility** (Standard/Enhanced/Expert)
- **On-demand** — no project setup delays, no SOW per batch
- **PAC-validated** compliance, not just self-reported

> *"All the things they say are exceptions, we should be doing anyway."* — State Accessibility Officer

---

## Resources & References

### Official Regulatory Sources
- [DOJ Title II Web Accessibility Final Rule](https://www.ada.gov/resources/2024-03-08-web-rule/)
- [ADA.gov First Steps Toward Compliance](https://www.ada.gov/resources/web-rule-first-steps/)
- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [Section 508 Standards](https://www.section508.gov/)
- [Section 508 — Create Accessible PDFs](https://www.section508.gov/create/pdfs/)

### Industry Reports & Data
- UsableNet — 2025 Midyear Digital Accessibility Lawsuit Report
- WebAIM — 2024 Report on Accessibility of Top 1,000,000 Home Pages
- Adobe — Making PDFs Accessible to All
- PDFReaderPro — Top 60 PDF Statistics for 2023
- CDC — VEHSS Modeled Estimates for Vision Loss and Blindness
- Switzerland Study — Uncovering the New Accessibility Crisis in Scholarly PDFs

### Accessibility Tools
- [PAC PDF Accessibility Checker](https://pac.pdf-accessibility.org)
- Adobe Acrobat Pro Accessibility Checker
- NVDA Screen Reader (free, Windows)
- JAWS Screen Reader (Windows)
- VoiceOver (macOS/iOS built-in)
- [WebAIM PDF Accessibility Guide](https://webaim.org/techniques/acrobat/)
- [CoSN K-12 Digital Accessibility Guidelines](https://www.cosn.org/accessibility/)

### Source Documents
1. ADA Title II Exceptions (AoD) — v1, 11/29/2025
2. AoD Proposal Template — v1.0, 11/17/2025
3. K-12 PDF Accessibility Report — 10/15/2025
4. Accessibility on Demand Product Sheet (Netra Labs)
5. Accessibility on Demand Market Report (Netra Labs)
6. AoD Customizable Sales Deck — 12/4/2025
7. Accessible PDF Compliance Checklist 2025 (GovStack)
8. Blind/Low-Vision PDF Experience Guide (CASO internal)

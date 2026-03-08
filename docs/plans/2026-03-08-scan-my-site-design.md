# Scan My Site — Quick Audit MVP

## Overview
User enters a website URL on the landing page, we crawl it for PDFs, score one as a sample, and show inline results with a "Send Full Report" lead capture.

## Flow
1. User enters URL, clicks "Scan My Site"
2. `/api/scan` fetches page HTML, follows links 1 level deep, collects PDF URLs
3. Picks first PDF, sends to Python API (`/api/analyze`) for scoring
4. Returns: total PDF count + first PDF's name, score, and issues
5. ScanForm expands inline — example PDF card with score, issues, total count
6. "Send Full Report" button captures email, stores in Supabase

## New API Routes

### `POST /api/scan`
- Input: `{ url: string }`
- Validates URL (http/https only)
- Fetches page HTML, parses for `<a href="*.pdf">` links
- Follows internal page links 1 level deep, collects more PDF links
- Deduplicates PDF URLs
- Downloads first PDF, POSTs to `caso-comply-api.onrender.com/api/analyze`
- Stores scan in Supabase `scans` table
- Returns: `{ scanId, url, pdfCount, samplePdf: { url, filename, score, issues[] } }`
- 30-second timeout

### `POST /api/scan/email`
- Input: `{ email: string, scanId: string }`
- Stores in Supabase `scan_leads` table
- Returns success

## Updated Component: ScanForm
- On submit: calls `/api/scan`, shows loading state
- On success: expands inline results card
  - "We found X PDFs on yoursite.gov"
  - Sample PDF: filename, score (color-coded A-F), top 3 issues
  - "Send Full Report" → email input → submit → confirmation
- Error states: "No PDFs found", "Couldn't reach that URL"

## Supabase Tables
- `scans`: id (uuid), url, pdf_count, sample_pdf_url, sample_score, sample_issues (jsonb), created_at
- `scan_leads`: id (uuid), scan_id (FK), email, created_at

## Out of Scope
- Full site crawl (homepage + 1 level only)
- Remediation (scoring only)
- Email sending (store lead only)
- Authentication

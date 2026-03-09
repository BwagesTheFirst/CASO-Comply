# Homepage Workflow Animation — Design Document

**Date:** 2026-03-09
**Status:** Approved

## Problem

The homepage needs a visual, animated explanation of how the Docker agent workflow works across all three plans (Standard, AI Verified, Human Review). Currently the "How It Works" section is static 3-step cards that don't communicate the branching paths.

## Solution

Replace the "How It Works" section with an animated horizontal branching flow diagram. Documents enter from the left (watch folders), flow through remediation and scoring in the center, then branch right into different paths based on plan. Animated particles travel along SVG paths. A plan selector highlights the relevant path.

## Layout

Three columns, left to right:

1. **Input:** Watch Folders node (agent scans directories)
2. **Center:** Remediate → Score (two inline processing nodes)
3. **Output branches:**
   - Standard: Score → Output Directory
   - AI Verified: Score → AI Verification → Output Directory
   - Human Review: Score → Score Check (< 70?) → Pass: Output / Fail: CASO API → Human Review → Output Directory

## Interaction

- Three plan selector buttons below diagram (Standard $0.25/pg, AI Verified $0.35/pg, Human Review $4.00/pg)
- Default: all paths visible with subtle animation
- Selected plan: path brightens, others fade to 20% opacity
- Dynamic description text updates per plan
- Human Review shows the decision diamond and return-flow path

## Visual Design

- Nodes: rounded rects, caso-navy-light bg, caso-border borders
- Lines: SVG bezier paths, thin
- Particles: glowing dots traveling along paths
  - Standard: caso-blue
  - AI Verified: caso-teal
  - Human Review: caso-warm
- Center hub slightly larger with subtle glow
- Mobile: vertical layout (top to bottom)

## Nodes & Copy

| Node | Icon | Subtitle |
|------|------|----------|
| Watch Folders | folder | Agent scans configured directories |
| Remediate | wrench | Auto-tag, metadata, reading order |
| Score | bar chart | PDF/UA + WCAG 2.1 AA |
| AI Verification | sparkle | AI verifies tags & alt text |
| Score Check | diamond | Score < 70? |
| CASO API | cloud upload | Sent for expert review |
| Human Review | person | Expert fixes in Acrobat |
| Output Directory | checkmark | Remediated file ready |

## Tech

Best tool for the job — likely Framer Motion for orchestrated path animations + SVG, or pure CSS/SVG if sufficient.

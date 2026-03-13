"use client";

import { useState, useEffect } from "react";

type Plan = "standard" | "ai_verified" | "human_review" | null;

const PLANS: { id: Plan; label: string; price: string; color: string; description: string }[] = [
  {
    id: "standard",
    label: "Basic Accessibility",
    price: "$0.30/pg",
    color: "#2EA3F2",
    description: "Automated tagging, structure, and reading order. Fast turnaround for bulk processing. 24-48 hour delivery.",
  },
  {
    id: "ai_verified",
    label: "Enhanced Compliance",
    price: "$1.80/pg",
    color: "#14B6D3",
    description: "AI-powered remediation with enhanced checks, alt text generation, and a detailed compliance report. 2-3 business days.",
  },
  {
    id: "human_review",
    label: "Full Remediation",
    price: "$12.00/pg",
    color: "#F59E0B",
    description: "Complete remediation with expert human QA review and Certificate of Compliance. 3-5 business days.",
  },
];

function NodeBox({
  x,
  y,
  width,
  height,
  icon,
  label,
  sublabel,
  opacity = 1,
  glowColor,
  diamond,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  opacity?: number;
  glowColor?: string;
  diamond?: boolean;
}) {
  if (diamond) {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const rx = width / 2;
    const ry = height / 2;
    return (
      <g opacity={opacity} style={{ transition: "opacity 0.4s ease" }}>
        {glowColor && (
          <polygon
            points={`${cx},${cy - ry - 4} ${cx + rx + 4},${cy} ${cx},${cy + ry + 4} ${cx - rx - 4},${cy}`}
            fill={glowColor}
            opacity={0.15}
          />
        )}
        <polygon
          points={`${cx},${cy - ry} ${cx + rx},${cy} ${cx},${cy + ry} ${cx - rx},${cy}`}
          fill="#132D54"
          stroke={glowColor || "#1E3A5F"}
          strokeWidth={1.5}
        />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize={10} fontWeight={600}>
          {label}
        </text>
        {sublabel && (
          <text x={cx} y={cy + 14} textAnchor="middle" dominantBaseline="middle" fill="#94A3B8" fontSize={8}>
            {sublabel}
          </text>
        )}
      </g>
    );
  }
  return (
    <g opacity={opacity} style={{ transition: "opacity 0.4s ease" }}>
      {glowColor && (
        <rect
          x={x - 3}
          y={y - 3}
          width={width + 6}
          height={height + 6}
          rx={14}
          fill={glowColor}
          opacity={0.12}
        />
      )}
      <rect x={x} y={y} width={width} height={height} rx={12} fill="#132D54" stroke={glowColor || "#1E3A5F"} strokeWidth={1.5} />
      <g transform={`translate(${x + width / 2}, ${y + (sublabel ? 18 : height / 2 - 4)})`}>
        {icon}
      </g>
      <text x={x + width / 2} y={y + (sublabel ? 38 : height / 2 + 8)} textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize={11} fontWeight={600}>
        {label}
      </text>
      {sublabel && (
        <text x={x + width / 2} y={y + 52} textAnchor="middle" dominantBaseline="middle" fill="#94A3B8" fontSize={8.5}>
          {sublabel}
        </text>
      )}
    </g>
  );
}

function AnimatedParticle({ path, color, duration, delay, opacity = 1 }: {
  path: string;
  color: string;
  duration: number;
  delay: number;
  opacity?: number;
}) {
  return (
    <circle r={4} fill={color} opacity={opacity} style={{ transition: "opacity 0.4s ease" }}>
      <animateMotion dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} path={path} />
    </circle>
  );
}

function AnimatedPath({ d, color, opacity = 1 }: { d: string; color: string; opacity?: number }) {
  return (
    <>
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} opacity={opacity * 0.3} style={{ transition: "opacity 0.4s ease" }} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.5} opacity={opacity} strokeDasharray="6 4" style={{ transition: "opacity 0.4s ease" }}>
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="1s" repeatCount="indefinite" />
      </path>
    </>
  );
}

// Icons as SVG groups (centered at 0,0)
const FolderIcon = (
  <g transform="translate(-10,-10)" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" stroke="#94A3B8" />
  </g>
);

const WrenchIcon = (
  <g transform="translate(-10,-10)" fill="none" stroke="#94A3B8" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085" />
  </g>
);

const ChartIcon = (
  <g transform="translate(-10,-10)" fill="none" stroke="#94A3B8" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </g>
);

const SparkleIcon = (
  <g transform="translate(-10,-10)" fill="none" stroke="#94A3B8" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
  </g>
);

const CloudIcon = (
  <g transform="translate(-10,-10)" fill="none" stroke="#94A3B8" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 3.75 3.75 0 013.572 5.095H7.5" />
  </g>
);

const PersonIcon = (
  <g transform="translate(-10,-10)" fill="none" stroke="#94A3B8" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </g>
);

const CheckIcon = (
  <g transform="translate(-10,-10)" fill="none" stroke="#94A3B8" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </g>
);

export default function WorkflowAnimation() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function getOpacity(plans: Plan[]) {
    if (!selectedPlan) return 1;
    return plans.includes(selectedPlan) ? 1 : 0.15;
  }

  function getColor(plan: Plan) {
    return PLANS.find((p) => p.id === plan)?.color || "#1E3A5F";
  }

  const selectedInfo = PLANS.find((p) => p.id === selectedPlan);

  // SVG viewBox coordinates
  // Layout: Watch Folders (30) → Remediate (200) → Score (370) → branches
  // Standard:    Score → Output (580, y=60)
  // AI Verified: Score → AI Verify (520) → Output (680, y=160)
  // Human Review: Score → Decision (490) → pass → Output (680, y=260)
  //                                       → fail → CASO API (560, y=340) → Human (680, y=340) → Output (800, y=260)

  // Paths
  const pathFolderToRemediate = "M 130 155 C 160 155, 170 155, 200 155";
  const pathRemediateToScore = "M 320 155 C 345 155, 350 155, 370 155";

  // Standard: Score → Output
  const pathStandard = "M 490 145 C 520 130, 540 80, 580 80";
  // AI Verified: Score → AI Verify → Output
  const pathAiToVerify = "M 490 155 C 520 155, 530 155, 545 155";
  const pathVerifyToOutput = "M 665 155 C 690 155, 700 155, 720 155";
  // Human Review: Score → Decision
  const pathToDecision = "M 490 165 C 510 185, 510 250, 530 260";
  // Decision → pass (output)
  const pathDecisionPass = "M 590 250 C 620 240, 680 235, 720 245";
  // Decision → fail (CASO API)
  const pathDecisionFail = "M 560 280 C 560 310, 560 330, 580 340";
  // CASO API → Human Review
  const pathApiToHuman = "M 680 340 C 700 340, 710 340, 720 340";
  // Human Review → Output (curves back up)
  const pathHumanToOutput = "M 820 330 C 850 320, 860 270, 840 255 C 830 248, 810 245, 800 245";

  if (!mounted) {
    return <div className="h-[500px]" />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4">
      {/* SVG Diagram - Desktop */}
      <div className="hidden md:block">
        <svg viewBox="0 0 900 400" className="w-full" role="img" aria-labelledby="workflow-title workflow-desc">
          <title id="workflow-title">CASO Comply Remediation Workflow</title>
          <desc id="workflow-desc">Documents flow through three service levels: Basic Accessibility ($0.30/page) auto-remediates and outputs files directly. Enhanced Compliance ($1.80/page) adds AI verification of tags and alt text. Full Remediation ($12.00/page) includes a scoring threshold check — documents passing above 70 go to output, while those below are sent to CASO API for expert human review in Acrobat before final output.</desc>
          <defs>
            <filter id="glow-blue" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="glow-teal" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* === PATHS === */}
          {/* Shared: Folders → Remediate → Score */}
          <AnimatedPath d={pathFolderToRemediate} color="#94A3B8" opacity={getOpacity(["standard", "ai_verified", "human_review"])} />
          <AnimatedPath d={pathRemediateToScore} color="#94A3B8" opacity={getOpacity(["standard", "ai_verified", "human_review"])} />

          {/* Standard path */}
          <AnimatedPath d={pathStandard} color="#2EA3F2" opacity={getOpacity(["standard"])} />

          {/* AI Verified path */}
          <AnimatedPath d={pathAiToVerify} color="#14B6D3" opacity={getOpacity(["ai_verified"])} />
          <AnimatedPath d={pathVerifyToOutput} color="#14B6D3" opacity={getOpacity(["ai_verified"])} />

          {/* Human Review paths */}
          <AnimatedPath d={pathToDecision} color="#F59E0B" opacity={getOpacity(["human_review"])} />
          <AnimatedPath d={pathDecisionPass} color="#10B981" opacity={getOpacity(["human_review"])} />
          <AnimatedPath d={pathDecisionFail} color="#F59E0B" opacity={getOpacity(["human_review"])} />
          <AnimatedPath d={pathApiToHuman} color="#F59E0B" opacity={getOpacity(["human_review"])} />
          <AnimatedPath d={pathHumanToOutput} color="#10B981" opacity={getOpacity(["human_review"])} />

          {/* === PARTICLES === */}
          {/* Shared particles */}
          <AnimatedParticle path={pathFolderToRemediate} color="#94A3B8" duration={2} delay={0} opacity={getOpacity(["standard", "ai_verified", "human_review"])} />
          <AnimatedParticle path={pathRemediateToScore} color="#94A3B8" duration={2} delay={1} opacity={getOpacity(["standard", "ai_verified", "human_review"])} />

          {/* Standard particles */}
          <AnimatedParticle path={pathStandard} color="#2EA3F2" duration={2.5} delay={0} opacity={getOpacity(["standard"])} />
          <AnimatedParticle path={pathStandard} color="#2EA3F2" duration={2.5} delay={1.2} opacity={getOpacity(["standard"])} />

          {/* AI Verified particles */}
          <AnimatedParticle path={pathAiToVerify} color="#14B6D3" duration={2} delay={0} opacity={getOpacity(["ai_verified"])} />
          <AnimatedParticle path={pathVerifyToOutput} color="#14B6D3" duration={2} delay={0.8} opacity={getOpacity(["ai_verified"])} />

          {/* Human Review particles */}
          <AnimatedParticle path={pathToDecision} color="#F59E0B" duration={2.5} delay={0} opacity={getOpacity(["human_review"])} />
          <AnimatedParticle path={pathDecisionPass} color="#10B981" duration={2} delay={0.5} opacity={getOpacity(["human_review"])} />
          <AnimatedParticle path={pathDecisionFail} color="#F59E0B" duration={2} delay={1} opacity={getOpacity(["human_review"])} />
          <AnimatedParticle path={pathApiToHuman} color="#F59E0B" duration={1.5} delay={1.5} opacity={getOpacity(["human_review"])} />
          <AnimatedParticle path={pathHumanToOutput} color="#10B981" duration={2.5} delay={2} opacity={getOpacity(["human_review"])} />

          {/* === NODES === */}
          {/* Watch Folders */}
          <NodeBox x={20} y={120} width={110} height={70} icon={FolderIcon} label="Watch Folders" sublabel="Scans directories" opacity={getOpacity(["standard", "ai_verified", "human_review"])} glowColor={selectedPlan ? getColor(selectedPlan) : undefined} />

          {/* Remediate */}
          <NodeBox x={200} y={120} width={120} height={70} icon={WrenchIcon} label="Remediate" sublabel="Auto-tag & metadata" opacity={getOpacity(["standard", "ai_verified", "human_review"])} glowColor={selectedPlan ? getColor(selectedPlan) : undefined} />

          {/* Score */}
          <NodeBox x={370} y={120} width={120} height={70} icon={ChartIcon} label="Score" sublabel="PDF/UA + WCAG 2.2" opacity={getOpacity(["standard", "ai_verified", "human_review"])} glowColor={selectedPlan ? getColor(selectedPlan) : undefined} />

          {/* Standard Output */}
          <NodeBox x={580} y={50} width={120} height={60} icon={CheckIcon} label="Output" sublabel="Remediated file ready" opacity={getOpacity(["standard"])} glowColor={selectedPlan === "standard" ? "#2EA3F2" : undefined} />

          {/* AI Verify */}
          <NodeBox x={545} y={125} width={120} height={60} icon={SparkleIcon} label="AI Verification" sublabel="Verifies tags & alt text" opacity={getOpacity(["ai_verified"])} glowColor={selectedPlan === "ai_verified" ? "#14B6D3" : undefined} />

          {/* AI Verified Output */}
          <NodeBox x={720} y={125} width={110} height={60} icon={CheckIcon} label="Output" sublabel="Verified & ready" opacity={getOpacity(["ai_verified"])} glowColor={selectedPlan === "ai_verified" ? "#14B6D3" : undefined} />

          {/* Decision Diamond */}
          <NodeBox x={530} y={235} width={60} height={50} icon={null} label="< 70?" diamond opacity={getOpacity(["human_review"])} glowColor={selectedPlan === "human_review" ? "#F59E0B" : undefined} />

          {/* Pass label */}
          <text x={635} y={232} textAnchor="middle" fill="#10B981" fontSize={9} fontWeight={600} opacity={getOpacity(["human_review"])} style={{ transition: "opacity 0.4s ease" }}>
            PASS
          </text>

          {/* Fail label */}
          <text x={555} y={310} textAnchor="middle" fill="#F59E0B" fontSize={9} fontWeight={600} opacity={getOpacity(["human_review"])} style={{ transition: "opacity 0.4s ease" }}>
            FAIL
          </text>

          {/* Human Review Output (pass) */}
          <NodeBox x={720} y={220} width={110} height={60} icon={CheckIcon} label="Output" sublabel="Remediated file ready" opacity={getOpacity(["human_review"])} glowColor={selectedPlan === "human_review" ? "#10B981" : undefined} />

          {/* CASO API */}
          <NodeBox x={580} y={315} width={100} height={55} icon={CloudIcon} label="CASO API" sublabel="Sent for review" opacity={getOpacity(["human_review"])} glowColor={selectedPlan === "human_review" ? "#F59E0B" : undefined} />

          {/* Human Review */}
          <NodeBox x={720} y={315} width={100} height={55} icon={PersonIcon} label="Expert Review" sublabel="Fixed in Acrobat" opacity={getOpacity(["human_review"])} glowColor={selectedPlan === "human_review" ? "#F59E0B" : undefined} />
        </svg>
      </div>

      {/* Mobile Layout - Vertical single column */}
      <div className="md:hidden">
        <svg
          viewBox={`0 0 300 ${!selectedPlan ? 270 : selectedPlan === "standard" ? 420 : selectedPlan === "ai_verified" ? 500 : 660}`}
          className="w-full"
          aria-label="Workflow diagram showing how documents flow through CASO Comply"
        >
          {/* Shared: Watch Folders → Remediate → Score (always visible) */}
          <AnimatedPath d="M 150 60 L 150 90" color="#94A3B8" opacity={1} />
          <AnimatedPath d="M 150 155 L 150 185" color="#94A3B8" opacity={1} />
          <AnimatedParticle path="M 150 60 L 150 90" color="#94A3B8" duration={1.5} delay={0} />
          <AnimatedParticle path="M 150 155 L 150 185" color="#94A3B8" duration={1.5} delay={0.5} />

          <NodeBox x={90} y={5} width={120} height={55} icon={FolderIcon} label="Watch Folders" sublabel="Scans directories" />
          <NodeBox x={90} y={95} width={120} height={60} icon={WrenchIcon} label="Remediate" sublabel="Auto-tag & metadata" />
          <NodeBox x={90} y={190} width={120} height={60} icon={ChartIcon} label="Score" sublabel="PDF/UA + WCAG 2.2" />

          {/* === Standard path === */}
          {selectedPlan === "standard" && (
            <g>
              <AnimatedPath d="M 150 250 L 150 290" color="#2EA3F2" opacity={getOpacity(["standard"])} />
              <AnimatedParticle path="M 150 250 L 150 290" color="#2EA3F2" duration={1.5} delay={0} opacity={getOpacity(["standard"])} />
              {/* Label */}
              <text x={150} y={275} textAnchor="middle" fill="#2EA3F2" fontSize={9} fontWeight={600} opacity={getOpacity(["standard"])}>
                ▼ Basic
              </text>
              <NodeBox x={90} y={295} width={120} height={55} icon={CheckIcon} label="Output" sublabel="Remediated file ready" opacity={getOpacity(["standard"])} glowColor={selectedPlan === "standard" ? "#2EA3F2" : undefined} />
            </g>
          )}

          {/* === AI Verified path === */}
          {selectedPlan === "ai_verified" && (
            <g>
              {(() => {
                const yStart = !selectedPlan ? 250 : 250;
                const yVerify = !selectedPlan ? 295 : 295;
                const yLine2 = yVerify + 60;
                const yOutput = yLine2 + 5;
                return (
                  <>
                    <AnimatedPath d={`M 150 ${yStart} L 150 ${yVerify}`} color="#14B6D3" opacity={getOpacity(["ai_verified"])} />
                    <AnimatedPath d={`M 150 ${yVerify + 55} L 150 ${yOutput}`} color="#14B6D3" opacity={getOpacity(["ai_verified"])} />
                    <AnimatedParticle path={`M 150 ${yStart} L 150 ${yVerify}`} color="#14B6D3" duration={1.5} delay={0} opacity={getOpacity(["ai_verified"])} />
                    <AnimatedParticle path={`M 150 ${yVerify + 55} L 150 ${yOutput}`} color="#14B6D3" duration={1.5} delay={0.5} opacity={getOpacity(["ai_verified"])} />
                    <text x={150} y={yStart + 20} textAnchor="middle" fill="#14B6D3" fontSize={9} fontWeight={600} opacity={getOpacity(["ai_verified"])}>
                      ▼ Enhanced
                    </text>
                    <NodeBox x={90} y={yVerify} width={120} height={55} icon={SparkleIcon} label="AI Verification" sublabel="Verifies tags & alt text" opacity={getOpacity(["ai_verified"])} glowColor={selectedPlan === "ai_verified" ? "#14B6D3" : undefined} />
                    <NodeBox x={90} y={yOutput} width={120} height={55} icon={CheckIcon} label="Output" sublabel="Verified & ready" opacity={getOpacity(["ai_verified"])} glowColor={selectedPlan === "ai_verified" ? "#14B6D3" : undefined} />
                  </>
                );
              })()}
            </g>
          )}

          {/* === Human Review path === */}
          {selectedPlan === "human_review" && (
            <g>
              {(() => {
                const yStart = 250;
                const yDecision = 295;
                const yPassOutput = yDecision + 10;
                const yCasoApi = yDecision + 80;
                const yExpert = yCasoApi + 75;
                const yOutput = yExpert + 75;
                return (
                  <>
                    <AnimatedPath d={`M 150 ${yStart} L 150 ${yDecision}`} color="#F59E0B" opacity={getOpacity(["human_review"])} />
                    <text x={150} y={yStart + 20} textAnchor="middle" fill="#F59E0B" fontSize={9} fontWeight={600} opacity={getOpacity(["human_review"])}>
                      ▼ Full Remediation
                    </text>
                    <NodeBox x={120} y={yDecision} width={60} height={50} icon={null} label="< 70?" diamond opacity={getOpacity(["human_review"])} glowColor={selectedPlan === "human_review" ? "#F59E0B" : undefined} />

                    {/* Pass path (right side) */}
                    <AnimatedPath d={`M 180 ${yDecision + 25} C 220 ${yDecision + 25}, 230 ${yPassOutput + 40}, 230 ${yOutput}`} color="#10B981" opacity={getOpacity(["human_review"])} />
                    <text x={225} y={yDecision + 10} textAnchor="start" fill="#10B981" fontSize={9} fontWeight={600} opacity={getOpacity(["human_review"])}>
                      PASS
                    </text>

                    {/* Fail path (down) */}
                    <AnimatedPath d={`M 150 ${yDecision + 50} L 150 ${yCasoApi}`} color="#F59E0B" opacity={getOpacity(["human_review"])} />
                    <text x={135} y={yDecision + 65} textAnchor="end" fill="#F59E0B" fontSize={9} fontWeight={600} opacity={getOpacity(["human_review"])}>
                      FAIL
                    </text>
                    <AnimatedParticle path={`M 150 ${yDecision + 50} L 150 ${yCasoApi}`} color="#F59E0B" duration={1.5} delay={0} opacity={getOpacity(["human_review"])} />

                    <NodeBox x={90} y={yCasoApi} width={120} height={55} icon={CloudIcon} label="CASO API" sublabel="Sent for review" opacity={getOpacity(["human_review"])} glowColor={selectedPlan === "human_review" ? "#F59E0B" : undefined} />

                    <AnimatedPath d={`M 150 ${yCasoApi + 55} L 150 ${yExpert}`} color="#F59E0B" opacity={getOpacity(["human_review"])} />
                    <AnimatedParticle path={`M 150 ${yCasoApi + 55} L 150 ${yExpert}`} color="#F59E0B" duration={1.5} delay={0.5} opacity={getOpacity(["human_review"])} />

                    <NodeBox x={90} y={yExpert} width={120} height={55} icon={PersonIcon} label="Expert Review" sublabel="Fixed in Acrobat" opacity={getOpacity(["human_review"])} glowColor={selectedPlan === "human_review" ? "#F59E0B" : undefined} />

                    <AnimatedPath d={`M 150 ${yExpert + 55} L 150 ${yOutput}`} color="#10B981" opacity={getOpacity(["human_review"])} />
                    <AnimatedParticle path={`M 150 ${yExpert + 55} L 150 ${yOutput}`} color="#10B981" duration={1.5} delay={1} opacity={getOpacity(["human_review"])} />

                    {/* Pass line also reaches Output */}
                    <AnimatedParticle path={`M 180 ${yDecision + 25} C 220 ${yDecision + 25}, 230 ${yPassOutput + 40}, 230 ${yOutput}`} color="#10B981" duration={2.5} delay={0.3} opacity={getOpacity(["human_review"])} />

                    <NodeBox x={90} y={yOutput} width={120} height={55} icon={CheckIcon} label="Output" sublabel="Remediated file ready" opacity={getOpacity(["human_review"])} glowColor={selectedPlan === "human_review" ? "#10B981" : undefined} />
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Mobile hint */}
        {!selectedPlan && (
          <p className="text-center text-xs text-caso-slate/60 -mt-2 mb-2">Select a plan below to see its flow</p>
        )}
      </div>

      {/* Plan Selector */}
      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="flex flex-wrap justify-center gap-3">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(selectedPlan === plan.id ? null : plan.id)}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                selectedPlan === plan.id
                  ? "shadow-lg scale-105"
                  : selectedPlan
                    ? "opacity-50 hover:opacity-80"
                    : "hover:scale-105"
              }`}
              style={{
                backgroundColor: selectedPlan === plan.id ? plan.color : "rgba(30, 58, 95, 0.5)",
                color: selectedPlan === plan.id ? "#0B1D3A" : "#FFFFFF",
                borderWidth: 1,
                borderColor: selectedPlan === plan.id ? plan.color : "#1E3A5F",
                boxShadow: selectedPlan === plan.id ? `0 8px 25px ${plan.color}33` : undefined,
              }}
            >
              {plan.label}
              <span className="ml-2 text-xs font-normal opacity-80">{plan.price}</span>
            </button>
          ))}
        </div>

        {/* Dynamic description */}
        <div className="h-12 flex items-center">
          <p
            className="text-center text-sm text-caso-slate max-w-lg transition-all duration-300"
            style={{ opacity: selectedInfo ? 1 : 0.6 }}
          >
            {selectedInfo?.description || "Select a plan to see how your documents flow through the remediation pipeline."}
          </p>
        </div>
      </div>
    </div>
  );
}

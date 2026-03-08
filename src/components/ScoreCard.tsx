"use client";

import { useEffect, useRef, useState } from "react";

interface Check {
  name: string;
  passed: boolean;
  message?: string;
}

interface ScoreCardProps {
  score: number;
  grade: string;
  checks: Check[];
  variant: "before" | "after";
  animate?: boolean;
  label?: string;
}

function getGradeColor(grade: string): {
  text: string;
  bg: string;
  border: string;
  ring: string;
  glow: string;
} {
  switch (grade.toUpperCase()) {
    case "A":
      return {
        text: "text-caso-green",
        bg: "bg-caso-green/10",
        border: "border-caso-green/30",
        ring: "ring-caso-green/20",
        glow: "shadow-caso-green/20",
      };
    case "B":
      return {
        text: "text-caso-green",
        bg: "bg-caso-green/10",
        border: "border-caso-green/30",
        ring: "ring-caso-green/20",
        glow: "shadow-caso-green/20",
      };
    case "C":
      return {
        text: "text-caso-warm",
        bg: "bg-caso-warm/10",
        border: "border-caso-warm/30",
        ring: "ring-caso-warm/20",
        glow: "shadow-caso-warm/20",
      };
    default:
      return {
        text: "text-caso-red",
        bg: "bg-caso-red/10",
        border: "border-caso-red/30",
        ring: "ring-caso-red/20",
        glow: "shadow-caso-red/20",
      };
  }
}

function useCountUp(target: number, duration: number = 1200, enabled: boolean = true): number {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setCurrent(0);
      return;
    }

    startTime.current = null;

    function animate(timestamp: number) {
      if (startTime.current === null) {
        startTime.current = timestamp;
      }

      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      }
    }

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [target, duration, enabled]);

  return current;
}

export default function ScoreCard({
  score,
  grade,
  checks,
  variant,
  animate = true,
  label,
}: ScoreCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const colors = getGradeColor(grade);
  const displayScore = useCountUp(score, 1200, animate && isVisible);
  const passCount = checks.filter((c) => c.passed).length;
  const totalCount = checks.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isBefore = variant === "before";

  return (
    <div
      ref={cardRef}
      className={`score-card relative overflow-hidden rounded-2xl border p-6 transition-all duration-500 md:p-8 ${
        isBefore
          ? "border-caso-red-dark/30 bg-caso-navy-light"
          : "border-caso-green/30 bg-caso-navy-light"
      } ${isVisible ? "score-card-visible" : "score-card-hidden"}`}
      role="region"
      aria-label={label || `${variant === "before" ? "Before" : "After"} remediation score`}
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <span
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
            isBefore ? "bg-caso-red/20" : "bg-caso-green/20"
          }`}
          aria-hidden="true"
        >
          {isBefore ? (
            <svg className="h-4 w-4 text-caso-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-4 w-4 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </span>
        <span
          className={`text-sm font-bold uppercase tracking-wider ${
            isBefore ? "text-caso-red" : "text-caso-green"
          }`}
        >
          {isBefore ? "Before" : "After"}
        </span>
      </div>

      {/* Score Display */}
      <div className="mb-6 flex items-center gap-6">
        {/* Score Circle */}
        <div className={`relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full ring-4 ${colors.bg} ${colors.ring}`}>
          {/* Circular progress */}
          <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 96 96" aria-hidden="true">
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-caso-border/30"
            />
            <circle
              cx="48"
              cy="48"
              r="42"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              className={colors.text}
              strokeDasharray={`${2 * Math.PI * 42}`}
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - (animate && isVisible ? displayScore : score) / 100)}`}
              style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.33, 1, 0.68, 1)" }}
            />
          </svg>
          <div className="text-center">
            <span
              className={`font-[family-name:var(--font-display)] text-2xl font-black ${colors.text}`}
              aria-live="polite"
            >
              {animate ? displayScore : score}
            </span>
          </div>
        </div>

        {/* Grade */}
        <div>
          <div className={`font-[family-name:var(--font-display)] text-5xl font-black ${colors.text}`}>
            {grade}
          </div>
          <div className="mt-1 text-sm text-caso-slate">
            {passCount}/{totalCount} checks passed
          </div>
        </div>
      </div>

      {/* Checks List */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
          Compliance Checks
        </h4>
        <ul className="space-y-2" role="list" aria-label="Compliance check results">
          {checks.map((check, i) => (
            <li
              key={check.name}
              className={`flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-300 ${
                isVisible ? "check-item-visible" : "check-item-hidden"
              } ${check.passed ? "bg-caso-green/5" : "bg-caso-red/5"}`}
              style={{ transitionDelay: `${(i + 1) * 80}ms` }}
            >
              <span className="mt-0.5 shrink-0" aria-hidden="true">
                {check.passed ? (
                  <svg className="h-4 w-4 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4 text-caso-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </span>
              <span className={check.passed ? "text-caso-slate" : "text-caso-red/90"}>
                <span className="sr-only">{check.passed ? "Passed:" : "Failed:"}</span>
                {check.name}
                {check.message && (
                  <span className="ml-1 text-xs text-caso-slate/60">
                    — {check.message}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

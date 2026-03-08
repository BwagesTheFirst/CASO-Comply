"use client";

import { useEffect, useState } from "react";

const DEADLINE = new Date("2026-04-24T00:00:00-04:00");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = DEADLINE.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="flex h-16 w-16 items-center justify-center rounded-lg bg-caso-navy-light font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white sm:h-20 sm:w-20 sm:text-3xl"
        aria-hidden="true"
      >
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wider text-caso-slate">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Server-side / initial render: show static days count
  if (!mounted || !timeLeft) {
    const staticDays = Math.ceil(
      (DEADLINE.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return (
      <div
        role="timer"
        aria-live="polite"
        aria-label={`${staticDays} days until ADA Title II compliance deadline`}
        className="flex items-center justify-center gap-3 sm:gap-4"
      >
        <TimeUnit value={staticDays} label="Days" />
        <div className="text-2xl font-bold text-caso-blue" aria-hidden="true">:</div>
        <TimeUnit value={0} label="Hours" />
        <div className="text-2xl font-bold text-caso-blue" aria-hidden="true">:</div>
        <TimeUnit value={0} label="Minutes" />
        <div className="text-2xl font-bold text-caso-blue" aria-hidden="true">:</div>
        <TimeUnit value={0} label="Seconds" />
      </div>
    );
  }

  const isPastDeadline =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={
        isPastDeadline
          ? "The ADA Title II compliance deadline has passed"
          : `${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, and ${timeLeft.seconds} seconds until ADA Title II compliance deadline`
      }
      className="flex items-center justify-center gap-3 sm:gap-4"
    >
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-2xl font-bold text-caso-blue" aria-hidden="true">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-2xl font-bold text-caso-blue" aria-hidden="true">:</div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="text-2xl font-bold text-caso-blue" aria-hidden="true">:</div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}

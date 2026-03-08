"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TagAssignment {
  type: string;
  text: string;
  page: number;
  mcid: number;
  font_size: number;
}

interface ScreenReaderSimProps {
  tagAssignments: TagAssignment[];
  variant: "before" | "after";
}

function tagLabel(type: string): string {
  switch (type) {
    case "H1": return "Heading level 1";
    case "H2": return "Heading level 2";
    case "H3": return "Heading level 3";
    case "H4": return "Heading level 4";
    case "H5": return "Heading level 5";
    case "H6": return "Heading level 6";
    case "Table": return "Table";
    case "Figure": return "Image";
    default: return "";
  }
}

export default function ScreenReaderSim({
  tagAssignments,
  variant,
}: ScreenReaderSimProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isBefore = variant === "before";

  // Build the full text to send to ElevenLabs
  const buildSpeechText = useCallback(() => {
    if (variant === "before") {
      // Flat text dump — no structure, just raw content run together
      return tagAssignments.map((t) => t.text).join(". ");
    } else {
      // Structured reading — announce tag types like a screen reader
      return tagAssignments
        .map((tag) => {
          const label = tagLabel(tag.type);
          return label ? `${label}. ${tag.text}` : tag.text;
        })
        .join(". ");
    }
  }, [tagAssignments, variant]);

  // Estimate which block is active based on audio playback time
  const startTracking = useCallback(
    (audio: HTMLAudioElement) => {
      const texts = tagAssignments.map((tag) => {
        if (variant === "after") {
          const label = tagLabel(tag.type);
          return label ? `${label}. ${tag.text}` : tag.text;
        }
        return tag.text;
      });

      // Estimate cumulative character positions for timing
      const totalChars = texts.reduce((sum, t) => sum + t.length + 2, 0);
      const cumulative: number[] = [];
      let running = 0;
      for (const t of texts) {
        cumulative.push(running / totalChars);
        running += t.length + 2;
      }

      intervalRef.current = setInterval(() => {
        if (!audio.duration || audio.paused) return;
        const progress = audio.currentTime / audio.duration;

        // Find which block we're in
        let idx = 0;
        for (let i = cumulative.length - 1; i >= 0; i--) {
          if (progress >= cumulative[i]) {
            idx = i;
            break;
          }
        }

        setActiveIndex(idx);

        // Auto-scroll
        const el = itemRefs.current[idx];
        if (el && scrollContainerRef.current) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 150);
    },
    [tagAssignments, variant]
  );

  const handlePlay = useCallback(async () => {
    // Stop if playing
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setActiveIndex(-1);
      return;
    }

    setIsLoading(true);

    try {
      const text = buildSpeechText();

      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        // Fallback to Web Speech API if ElevenLabs fails
        fallbackWebSpeech(text);
        return;
      }

      const audioBlob = await res.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
        startTracking(audio);
      };

      audio.onended = () => {
        setIsPlaying(false);
        setActiveIndex(-1);
        if (intervalRef.current) clearInterval(intervalRef.current);
        URL.revokeObjectURL(audioUrl);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setIsLoading(false);
        setActiveIndex(-1);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };

      audio.play();
    } catch {
      setIsLoading(false);
      // Fallback to browser speech
      fallbackWebSpeech(buildSpeechText());
    }
  }, [isPlaying, buildSpeechText, startTracking]);

  // Fallback to Web Speech API
  const fallbackWebSpeech = useCallback(
    (text: string) => {
      setIsLoading(false);
      const synth = window.speechSynthesis;
      synth.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.rate = 1.0;
      utt.onstart = () => setIsPlaying(true);
      utt.onend = () => {
        setIsPlaying(false);
        setActiveIndex(-1);
      };
      synth.speak(utt);
    },
    []
  );

  // Cleanup
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.speechSynthesis?.cancel();
    };
  }, []);

  return (
    <div className="rounded-xl border border-caso-border bg-caso-navy/80 p-4">
      {/* Header with play button */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-caso-slate"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
          <span className="text-xs font-bold uppercase tracking-widest text-caso-glacier">
            {isBefore ? "Before" : "After"} — Screen Reader
          </span>
        </div>
        <button
          onClick={handlePlay}
          disabled={isLoading}
          className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            isLoading
              ? "cursor-wait bg-caso-border/20 text-caso-slate"
              : isPlaying
                ? "bg-caso-red/20 text-caso-red hover:bg-caso-red/30"
                : isBefore
                  ? "bg-caso-red/10 text-caso-red hover:bg-caso-red/20"
                  : "bg-caso-green/10 text-caso-green hover:bg-caso-green/20"
          }`}
          aria-label={
            isLoading
              ? "Generating audio..."
              : isPlaying
                ? "Stop screen reader preview"
                : "Play screen reader preview"
          }
        >
          {isLoading ? (
            <>
              <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading...
            </>
          ) : isPlaying ? (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              Stop
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Listen
            </>
          )}
        </button>
      </div>

      {/* Content display — shows what's being read */}
      <div
        ref={scrollContainerRef}
        className="max-h-40 overflow-y-auto rounded-lg bg-caso-navy-light/50 p-3"
      >
        {tagAssignments.map((tag, i) => {
          const isActive = activeIndex === i;
          const label = variant === "after" ? tagLabel(tag.type) : "";

          return (
            <div
              key={`${variant}-${tag.page}-${tag.mcid}`}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={`rounded px-2 py-1 text-sm transition-all duration-200 ${
                isActive
                  ? isBefore
                    ? "bg-caso-red/15 text-caso-white"
                    : "bg-caso-green/15 text-caso-white"
                  : "text-caso-slate/70"
              }`}
            >
              {variant === "after" && label && (
                <span
                  className={`mr-1.5 inline-block rounded px-1 py-0.5 text-[10px] font-bold uppercase ${
                    isActive
                      ? "bg-caso-blue/30 text-caso-blue"
                      : "bg-caso-border/30 text-caso-slate/50"
                  }`}
                >
                  {label}
                </span>
              )}
              <span>{tag.text}</span>
            </div>
          );
        })}
        <p className="mt-2 border-t border-caso-border/30 pt-2 text-[10px] text-caso-slate/40 italic">
          {isBefore
            ? "No structure — screen reader reads as flat, unorganized text"
            : "Proper heading levels — screen reader navigates logically"}
        </p>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-4 text-sm text-caso-slate hover:text-caso-white transition-colors"
    >
      {copied ? "Link copied!" : "Share This Report \u2014 Copy Link"}
    </button>
  );
}

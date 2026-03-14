"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface TrialState {
  status: string | null;
  trial_pages_used: number;
  trial_pages_limit: number;
  loading: boolean;
}

const SERVICE_LEVELS = [
  {
    key: "standard",
    name: "Standard",
    price: "$0.30",
    priceCents: 30,
    description: "Automated structure tagging, language, metadata",
    badge: null,
  },
  {
    key: "enhanced",
    name: "Enhanced",
    price: "$1.80",
    priceCents: 180,
    description: "AI-verified with alt text and reading order",
    badge: "RECOMMENDED",
  },
  {
    key: "expert",
    name: "Expert",
    price: "$12.00",
    priceCents: 1200,
    description: "Human expert review, full WCAG 2.1 AA guarantee",
    badge: null,
  },
] as const;

const ACCEPTED_EXTENSIONS = [".pdf"];
const ACCEPTED_MIME_TYPES = ["application/pdf"];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

function formatBatchName(): string {
  const now = new Date();
  const y = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const h = String(now.getHours()).padStart(2, "0");
  const mi = String(now.getMinutes()).padStart(2, "0");
  return `Batch ${y}-${mo}-${d} ${h}:${mi}`;
}

export default function RemediatePage() {
  const router = useRouter();
  const [serviceLevel, setServiceLevel] = useState("enhanced");
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const [trial, setTrial] = useState<TrialState>({
    status: null,
    trial_pages_used: 0,
    trial_pages_limit: 10,
    loading: true,
  });

  // Fetch trial status on mount
  useEffect(() => {
    async function fetchTrialStatus() {
      try {
        const res = await fetch("/api/tenants/settings");
        if (res.ok) {
          const data = await res.json();
          const tenant = data.tenant;
          setTrial({
            status: tenant.status ?? null,
            trial_pages_used: tenant.trial_pages_used ?? 0,
            trial_pages_limit: tenant.trial_pages_limit ?? 10,
            loading: false,
          });
        } else {
          setTrial((prev) => ({ ...prev, loading: false }));
        }
      } catch {
        setTrial((prev) => ({ ...prev, loading: false }));
      }
    }
    fetchTrialStatus();
  }, []);

  const trialExhausted =
    !trial.loading &&
    trial.status === "trial" &&
    trial.trial_pages_used >= trial.trial_pages_limit;

  const dropZoneDisabled = uploading || trialExhausted;
  const serviceLevelLocked = files.length > 0;

  const validateFile = useCallback((file: File): string | null => {
    const hasValidExt = ACCEPTED_EXTENSIONS.some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );
    const hasValidMime = ACCEPTED_MIME_TYPES.includes(file.type);
    if (!hasValidExt && !hasValidMime) {
      return `"${file.name}" is not a supported file type. Only PDF files are accepted.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `"${file.name}" exceeds the 50MB file size limit.`;
    }
    if (file.size === 0) {
      return `"${file.name}" is empty.`;
    }
    return null;
  }, []);

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (trialExhausted) return;
      setError(null);
      const toAdd: UploadFile[] = [];
      for (const file of Array.from(newFiles)) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          return;
        }
        // Deduplicate by name + size
        const isDuplicate = files.some(
          (f) => f.name === file.name && f.size === file.size
        );
        if (!isDuplicate) {
          toAdd.push({ id: generateId(), file, name: file.name, size: file.size });
        }
      }
      setFiles((prev) => [...prev, ...toAdd]);
    },
    [files, validateFile, trialExhausted]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      dragCounter.current = 0;
      if (!dropZoneDisabled && e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles, dropZoneDisabled]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [addFiles]
  );

  const estimatedPages = files.length * 10; // rough estimate: 10 pages per doc
  const selectedLevel = SERVICE_LEVELS.find((l) => l.key === serviceLevel)!;
  const estimatedCost = ((estimatedPages * selectedLevel.priceCents) / 100).toFixed(2);

  async function handleSubmit() {
    if (files.length === 0 || trialExhausted) return;
    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Build FormData for batch API
      const formData = new FormData();
      formData.append("name", formatBatchName());
      formData.append("service_level", serviceLevel);
      for (const uploadFile of files) {
        formData.append("files", uploadFile.file);
      }

      setUploadProgress(10);

      const res = await fetch("/api/documents/batch", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(70);

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(data.error || "Failed to create batch");
      }

      const data = await res.json();
      const batchId = data.batch?.id;

      if (!batchId) {
        throw new Error("No batch ID returned");
      }

      setUploadProgress(80);

      // Fire-and-forget: trigger processing
      fetch(`/api/documents/batch/${batchId}/process`, { method: "POST" }).catch(
        () => {
          // Processing failures are handled in the batch detail view
        }
      );

      setUploadProgress(100);

      // Redirect to batch detail page
      router.push(`/dashboard/documents/batch/${batchId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-caso-white">
          Remediate Documents
        </h1>
        <p className="mt-1 text-sm text-caso-slate">
          Upload documents for automated accessibility remediation
        </p>
      </div>

      {/* Trial exhausted banner */}
      {trialExhausted && (
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
          <p className="text-sm font-semibold text-yellow-400">
            You&apos;ve used all {trial.trial_pages_limit} trial pages. Your remediated
            documents are still available to download.
          </p>
          <p className="mt-2 text-sm text-caso-slate">
            Ready to continue?{" "}
            <a
              href="mailto:sales@casocomply.com"
              className="text-caso-blue underline underline-offset-2 hover:text-caso-blue-bright"
            >
              Contact sales@casocomply.com
            </a>
          </p>
        </div>
      )}

      {/* Step 1: Service Level Selection */}
      <div>
        <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
          Step 1: Choose Service Level
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {SERVICE_LEVELS.map((level) => {
            const isSelected = serviceLevel === level.key;
            const isDisabled = uploading || serviceLevelLocked || trialExhausted;
            return (
              <button
                key={level.key}
                onClick={() => !isDisabled && setServiceLevel(level.key)}
                disabled={isDisabled}
                className={`relative rounded-xl border-2 p-5 text-left transition-all ${
                  isSelected
                    ? "border-caso-blue bg-caso-blue/5 shadow-[0_0_20px_rgba(46,163,242,0.1)]"
                    : "border-caso-border bg-caso-navy-light/50 hover:border-caso-blue/40"
                } ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {level.badge && (
                  <span className="absolute -top-2.5 right-3 rounded-full bg-caso-blue px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {level.badge}
                  </span>
                )}
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-caso-white">{level.price}</span>
                  <span className="text-xs text-caso-slate">/page</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-caso-white">{level.name}</p>
                <p className="mt-2 text-xs text-caso-slate leading-relaxed">
                  {level.description}
                </p>
                {/* Radio indicator */}
                <div
                  className={`absolute top-4 left-4 h-4 w-4 rounded-full border-2 transition-colors ${
                    isSelected
                      ? "border-caso-blue bg-caso-blue"
                      : "border-caso-border"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute inset-[3px] rounded-full bg-white" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
        {serviceLevelLocked && !trialExhausted && (
          <p className="mt-2 text-xs text-caso-slate">
            Clear files to change service level.
          </p>
        )}
      </div>

      {/* Step 2: Upload Files */}
      <div>
        <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
          Step 2: Upload Files
        </h2>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={dropZoneDisabled ? -1 : 0}
          aria-label="Upload files. Click or drag and drop."
          aria-disabled={dropZoneDisabled}
          className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-300 ${
            dropZoneDisabled
              ? "cursor-not-allowed border-caso-border/30 bg-caso-navy-light/20 opacity-60"
              : isDragOver
                ? "border-caso-blue bg-caso-blue/10 shadow-[0_0_40px_rgba(46,163,242,0.15)]"
                : "border-caso-border hover:border-caso-blue/60 hover:bg-caso-navy-light/50"
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !dropZoneDisabled && inputRef.current?.click()}
          onKeyDown={(e) => {
            if ((e.key === "Enter" || e.key === " ") && !dropZoneDisabled) {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
            tabIndex={-1}
            disabled={dropZoneDisabled}
          />

          <div className="flex flex-col items-center gap-4 text-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300 ${
                isDragOver ? "bg-caso-blue/20" : "bg-caso-navy-light"
              }`}
            >
              <svg
                className={`h-8 w-8 transition-all duration-300 ${
                  isDragOver
                    ? "text-caso-blue scale-110"
                    : "text-caso-slate group-hover:text-caso-blue"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-caso-white">
                {isDragOver ? "Drop files here" : "Drag & drop your files here"}
              </p>
              <p className="mt-1 text-xs text-caso-slate">
                or{" "}
                <span className="text-caso-blue underline underline-offset-2">
                  browse to upload
                </span>
              </p>
            </div>
            <p className="text-[11px] text-caso-slate/60">
              PDF files only. Max 50MB per file.
            </p>
          </div>

          {isDragOver && (
            <div className="pointer-events-none absolute inset-0 rounded-2xl" aria-hidden="true">
              <div className="upload-glow absolute inset-0 rounded-2xl" />
            </div>
          )}
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4 space-y-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-lg border border-caso-border/50 bg-caso-navy-light/30 px-4 py-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <svg
                    className="h-5 w-5 shrink-0 text-caso-blue"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-caso-white truncate">
                      {f.name}
                    </p>
                    <p className="text-xs text-caso-slate">{formatFileSize(f.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(f.id);
                  }}
                  disabled={uploading}
                  className="ml-3 shrink-0 rounded-lg p-1.5 text-caso-slate hover:text-caso-red hover:bg-caso-red/10 transition-colors disabled:opacity-40"
                  aria-label={`Remove ${f.name}`}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div role="alert" className="mt-3 flex items-center gap-2 text-sm text-caso-red">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            {error}
          </div>
        )}
      </div>

      {/* Step 3: Review & Submit */}
      {files.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-caso-slate uppercase tracking-wider mb-4">
            Step 3: Review & Submit
          </h2>
          <div className="rounded-xl border border-caso-border bg-caso-navy-light/50 p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-caso-slate">Files</p>
                <p className="mt-1 text-lg font-bold text-caso-white">{files.length}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-caso-slate">Service Level</p>
                <p className="mt-1 text-lg font-bold text-caso-white capitalize">
                  {serviceLevel}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-caso-slate">Estimated Cost</p>
                <p className="mt-1 text-lg font-bold text-caso-white">${estimatedCost}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-caso-slate">
              Cost estimate assumes ~10 pages per file. We will calculate the exact page count
              after upload and provide final pricing before charges are applied.
            </p>

            {/* Upload progress */}
            {uploading && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-caso-slate mb-1">
                  <span>Uploading files...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-caso-navy overflow-hidden">
                  <div
                    className="h-full rounded-full bg-caso-blue transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={uploading || files.length === 0 || trialExhausted}
              className="mt-5 w-full rounded-lg bg-caso-blue-deep px-6 py-3 text-sm font-semibold text-caso-white hover:bg-caso-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {uploading
                ? `Uploading... ${uploadProgress}%`
                : `Upload & Remediate (${files.length} file${files.length !== 1 ? "s" : ""})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

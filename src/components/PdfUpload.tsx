"use client";

import { useCallback, useRef, useState } from "react";

interface PdfUploadProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PdfUpload({ onFileSelected, disabled = false }: PdfUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);

      const validExtensions = [".pdf", ".docx", ".doc", ".xlsx", ".xls"];
      const validMimeTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));
      const hasValidMime = validMimeTypes.includes(file.type);
      if (!hasValidExt && !hasValidMime) {
        setError("Please select a PDF, Word, or Excel file.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}.`);
        return;
      }

      if (file.size === 0) {
        setError("File is empty. Please select a valid document.");
        return;
      }

      setSelectedFile(file);
      onFileSelected(file);
    },
    [onFileSelected]
  );

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

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        validateAndSelect(files[0]);
      }
    },
    [disabled, validateAndSelect]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        validateAndSelect(files[0]);
      }
    },
    [validateAndSelect]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === "Enter" || e.key === " ") && !disabled) {
        e.preventDefault();
        inputRef.current?.click();
      }
    },
    [disabled]
  );

  return (
    <div className="pdf-upload-wrapper">
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={selectedFile ? `Selected file: ${selectedFile.name}. Click to choose a different document.` : "Upload a document. Click or drag and drop."}
        aria-disabled={disabled}
        className={`pdf-upload-zone group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 transition-all duration-300 ${
          disabled
            ? "cursor-not-allowed border-caso-border/30 bg-caso-navy-light/20 opacity-60"
            : isDragOver
              ? "border-caso-blue bg-caso-blue/10 shadow-[0_0_40px_rgba(46,163,242,0.15)]"
              : selectedFile
                ? "border-caso-green/50 bg-caso-green/5"
                : "border-caso-border hover:border-caso-blue/60 hover:bg-caso-navy-light/50"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.xlsx,.doc,.xls"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3 text-center">
            {/* PDF icon */}
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-caso-green/10">
              <svg className="h-8 w-8 text-caso-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-caso-white">{selectedFile.name}</p>
              <p className="mt-1 text-xs text-caso-slate">{formatFileSize(selectedFile.size)}</p>
            </div>
            {!disabled && (
              <p className="text-xs text-caso-glacier">Click or drop to replace</p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Upload icon */}
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300 ${
              isDragOver ? "bg-caso-blue/20" : "bg-caso-navy-light"
            }`}>
              <svg
                className={`h-8 w-8 transition-all duration-300 ${
                  isDragOver ? "text-caso-blue scale-110" : "text-caso-slate group-hover:text-caso-blue"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-caso-white">
                {isDragOver ? "Drop your file here" : "Drag & drop your PDF, Word, or Excel file"}
              </p>
              <p className="mt-1 text-xs text-caso-slate">
                or <span className="text-caso-blue underline underline-offset-2">browse to upload</span>
              </p>
            </div>
            <p className="text-[11px] text-caso-slate/60">PDF, Word, and Excel files accepted, up to 250MB</p>
          </div>
        )}

        {/* Animated border glow on drag over */}
        {isDragOver && (
          <div className="pointer-events-none absolute inset-0 rounded-2xl" aria-hidden="true">
            <div className="upload-glow absolute inset-0 rounded-2xl" />
          </div>
        )}
      </div>

      {error && (
        <div role="alert" className="mt-3 flex items-center gap-2 text-sm text-caso-red">
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

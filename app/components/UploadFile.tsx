"use client";

import React, { useCallback, useState } from "react";
import { ArrowUpTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { mutate } from "swr";

interface UploadFileProps {
  onFileUpload?: (content: string) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onFileUpload = () => {} }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }

      setIsUploading(true);
      setError(null);
      setSuccessMessage(null);

      try {
        const text = await file.text();

        // Send the CSV data to the upload API
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ csvData: text }),
        });

        if (!response.ok) {
          throw new Error("Failed to upload CSV data");
        }

        const result = await response.json();
        console.log("Upload result:", result);

        if (result.success) {
          setSuccessMessage(result.message);
          onFileUpload(text);

          // Invalidate all companies cache entries to trigger refetch
          mutate(
            (key) =>
              typeof key === "string" && key.startsWith("/api/companies"),
            undefined,
            { revalidate: true }
          );
        } else {
          throw new Error(result.message || "Upload failed");
        }
      } catch (err) {
        setError("Error uploading file: " + (err as Error).message);
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    },
    [onFileUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (isUploading) return; // Prevent upload during loading

      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile, isUploading]
  );

  const onDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!isUploading) {
        setIsDragging(true);
      }
    },
    [isUploading]
  );

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isUploading) return; // Prevent upload during loading

      if (e.target.files?.length) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile, isUploading]
  );

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg transition-colors ${
          isUploading
            ? "border-theme-100 bg-theme-400 cursor-not-allowed"
            : isDragging
            ? "border-white bg-theme-300 cursor-pointer"
            : "border-theme-100 hover:border-white hover:bg-theme-300 cursor-pointer"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          type="file"
          accept=".csv"
          className={`absolute inset-0 w-full h-full opacity-0 ${
            isUploading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onChange={onFileChange}
          disabled={isUploading}
        />

        {isUploading ? (
          <>
            <ArrowPathIcon className="w-8 h-8 text-theme-50 mb-2 animate-spin" />
            <p className="text-sm text-theme-50">Uploading CSV file</p>
          </>
        ) : (
          <>
            <ArrowUpTrayIcon className="w-8 h-8 text-theme-50 mb-2" />
            <p className="text-sm text-theme-50">
              Click to upload or drag and drop a CSV file
            </p>
          </>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {successMessage && (
        <p className="mt-2 text-sm text-green-400">{successMessage}</p>
      )}
    </div>
  );
};

export default UploadFile;

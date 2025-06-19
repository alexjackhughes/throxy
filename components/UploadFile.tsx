"use client";

import React, { useCallback, useState } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";

interface UploadFileProps {
  onFileUpload?: (content: string) => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ onFileUpload = () => {} }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setError("Please upload a CSV file");
        return;
      }

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

        onFileUpload(text);
        setError(null);
      } catch (err) {
        setError("Error uploading file");
        console.error(err);
      }
    },
    [onFileUpload]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile]
  );

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragging
            ? "border-white bg-theme-300"
            : "border-theme-100 hover:border-white hover:bg-theme-300"
        }`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          type="file"
          accept=".csv"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileChange}
        />
        <ArrowUpTrayIcon className="w-8 h-8 text-theme-50 mb-2" />
        <p className="text-sm text-theme-50">
          Click to upload or drag and drop a CSV file
        </p>
      </div>
      {error && <p className="mt-2 text-sm text-white">{error}</p>}
    </div>
  );
};

export default UploadFile;

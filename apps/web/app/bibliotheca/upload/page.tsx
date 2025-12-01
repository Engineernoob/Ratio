"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { TopNavBar } from "@/components/core/TopNavBar";
import { uploadPDF } from "@/lib/storage/upload";
import { EngravedHeader } from "@/components/core/EngravedHeader";
import { Main } from "@/components/Main";
import { ScholarivmShell } from "@/components/Scholarivm/ScholarivmShell";

export default function BibliothecaUploadPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        setError("Only PDF files are supported");
        return;
      }
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100MB");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Generate path from filename
      const path = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");

      // Upload to cloud storage
      const result = await uploadPDF(path, file);

      if (result.error) {
        setError(result.error.message);
        setUploading(false);
        return;
      }

      // Simulate progress (in real app, track actual upload progress)
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setProgress(i);
      }

      // TODO: Run ingestion pipeline here
      // This would:
      // 1. Extract text from PDF
      // 2. Split into chapters
      // 3. Generate summaries
      // 4. Create micro-lessons
      // 5. Store processed data in storage/books/{id}

      alert("Upload successful! Processing will begin shortly.");
      router.push("/bibliotheca");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <TopNavBar />
      <Main className="scroll-fade-top scroll-fade-bottom">
        <ScholarivmShell>
          <div className="relative z-10 min-h-screen p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center mb-12"
              >
                <EngravedHeader level={1} delay={0.2}>
                  UPLOAD BOOK
                </EngravedHeader>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="font-mono text-sm mt-4"
                  style={{ color: "rgba(215, 196, 158, 0.6)" }}
                >
                  Upload a PDF to add it to your library
                </motion.p>
              </motion.div>

              {/* Upload Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-6"
              >
                {/* File Input */}
                <div
                  className="p-6 border rounded-sm"
                  style={{
                    borderColor: "rgba(215, 196, 158, 0.2)",
                    background: "rgba(10, 10, 10, 0.6)",
                  }}
                >
                  <label
                    className="block font-mono text-xs uppercase mb-3"
                    style={{ color: "rgba(215, 196, 158, 0.6)" }}
                  >
                    Select PDF File
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="block w-full font-mono text-sm"
                    style={{
                      color: "rgba(232, 230, 225, 0.9)",
                    }}
                  />
                  {file && (
                    <div
                      className="mt-4 font-mono text-xs"
                      style={{ color: "rgba(215, 196, 158, 0.7)" }}
                    >
                      Selected: {file.name} (
                      {(file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div
                    className="p-4 border rounded-sm"
                    style={{
                      borderColor: "rgba(255, 100, 100, 0.3)",
                      background: "rgba(255, 100, 100, 0.05)",
                      color: "rgba(255, 100, 100, 0.8)",
                    }}
                  >
                    <div className="font-mono text-xs">{error}</div>
                  </div>
                )}

                {/* Progress */}
                {uploading && (
                  <div
                    className="p-6 border rounded-sm"
                    style={{
                      borderColor: "rgba(215, 196, 158, 0.2)",
                      background: "rgba(10, 10, 10, 0.6)",
                    }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="font-mono text-xs uppercase"
                        style={{ color: "rgba(215, 196, 158, 0.6)" }}
                      >
                        Uploading...
                      </span>
                      <span
                        className="font-mono text-xs"
                        style={{ color: "#d7c49e" }}
                      >
                        {progress}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-sm overflow-hidden"
                      style={{
                        background: "rgba(215, 196, 158, 0.1)",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full"
                        style={{
                          background:
                            "linear-gradient(to right, rgba(215, 196, 158, 0.6), rgba(215, 196, 158, 0.8))",
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <motion.button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  whileHover={{ scale: file && !uploading ? 1.02 : 1 }}
                  whileTap={{ scale: file && !uploading ? 0.98 : 1 }}
                  className="w-full p-6 border rounded-sm font-mono text-xs uppercase disabled:opacity-50"
                  style={{
                    borderColor: "rgba(215, 196, 158, 0.3)",
                    background:
                      file && !uploading
                        ? "rgba(215, 196, 158, 0.1)"
                        : "rgba(10, 10, 10, 0.6)",
                    color: "#d7c49e",
                  }}
                >
                  {uploading ? "Uploading..." : "Upload to Cloud"}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </ScholarivmShell>
      </Main>
    </>
  );
}

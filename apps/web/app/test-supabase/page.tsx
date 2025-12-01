"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { testSupabaseConnection, testStorageUpload } from "@/lib/supabase/test";
import { getCurrentUser } from "@/lib/supabase/auth";
import { Main } from "@/components/Main";
import { ScholarivmShell } from "@/components/Scholarivm/ScholarivmShell";
import { EngravedHeader } from "@/components/core/EngravedHeader";

export default function TestSupabasePage() {
  const router = useRouter();
  const [testing, setTesting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [results, setResults] = useState<{
    success: boolean;
    results: any;
    errors: string[];
  } | null>(null);
  const [storageTest, setStorageTest] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    checkAuth();
  }, []);

  const handleTest = async () => {
    setTesting(true);
    setResults(null);
    setStorageTest(null);

    try {
      const connectionResults = await testSupabaseConnection();
      setResults(connectionResults);

      if (connectionResults.success) {
        const uploadResults = await testStorageUpload();
        setStorageTest(uploadResults);
      }
    } catch (error) {
      setResults({
        success: false,
        results: {},
        errors: [error instanceof Error ? error.message : "Unknown error"],
      });
    } finally {
      setTesting(false);
    }
  };

  return (
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
                SUPABASE TEST
              </EngravedHeader>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-mono text-sm mt-4"
                style={{ color: "rgba(215, 196, 158, 0.6)" }}
              >
                Verify Supabase connection and configuration
              </motion.p>
            </motion.div>

            {/* Auth Status */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8"
              >
                <div
                  className="p-4 border rounded-sm text-center"
                  style={{
                    borderColor: "rgba(255, 200, 100, 0.3)",
                    background: "rgba(255, 200, 100, 0.05)",
                  }}
                >
                  <p
                    className="font-mono text-xs mb-3"
                    style={{ color: "rgba(255, 200, 100, 0.8)" }}
                  >
                    Not authenticated. Storage tests require sign-in.
                  </p>
                  <motion.button
                    onClick={() => router.push("/auth")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 border rounded-sm font-mono text-xs uppercase"
                    style={{
                      borderColor: "rgba(215, 196, 158, 0.3)",
                      background: "rgba(215, 196, 158, 0.1)",
                      color: "#d7c49e",
                    }}
                  >
                    Sign In / Sign Up
                  </motion.button>
                </div>
              </motion.div>
            )}

            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mb-8"
              >
                <div
                  className="p-4 border rounded-sm text-center"
                  style={{
                    borderColor: "rgba(150, 255, 150, 0.3)",
                    background: "rgba(150, 255, 150, 0.05)",
                  }}
                >
                  <p
                    className="font-mono text-xs"
                    style={{ color: "rgba(150, 255, 150, 0.8)" }}
                  >
                    ✓ Authenticated as: {user.email}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Test Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8 flex justify-center relative"
              style={{ zIndex: 20 }}
            >
              <motion.button
                onClick={handleTest}
                disabled={testing}
                whileHover={{ scale: testing ? 1 : 1.02 }}
                whileTap={{ scale: testing ? 1 : 0.98 }}
                className="px-8 py-4 border rounded-sm font-mono text-sm uppercase disabled:opacity-50 relative"
                style={{
                  borderColor: "rgba(215, 196, 158, 0.3)",
                  background: "rgba(215, 196, 158, 0.1)",
                  color: "#d7c49e",
                  zIndex: 20,
                  pointerEvents: "auto",
                }}
              >
                {testing ? "Testing..." : "Run Tests"}
              </motion.button>
            </motion.div>

            {/* Results */}
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Overall Status */}
                <div
                  className={`p-6 border rounded-sm ${
                    results.success
                      ? "border-[rgba(150,255,150,0.3)]"
                      : "border-[rgba(255,100,100,0.3)]"
                  }`}
                  style={{
                    background: results.success
                      ? "rgba(150,255,150,0.05)"
                      : "rgba(255,100,100,0.05)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        results.success
                          ? "bg-[rgba(150,255,150,0.8)]"
                          : "bg-[rgba(255,100,100,0.8)]"
                      }`}
                    />
                    <div
                      className="font-serif text-xl"
                      style={{
                        color: results.success
                          ? "rgba(150,255,150,0.9)"
                          : "rgba(255,100,100,0.9)",
                      }}
                    >
                      {results.success ? "All Tests Passed" : "Tests Failed"}
                    </div>
                  </div>
                </div>

                {/* Test Results */}
                <div
                  className="p-6 border rounded-sm"
                  style={{
                    borderColor: "rgba(215, 196, 158, 0.2)",
                    background: "rgba(10, 10, 10, 0.6)",
                  }}
                >
                  <div
                    className="font-mono text-xs uppercase mb-4"
                    style={{ color: "rgba(215, 196, 158, 0.5)" }}
                  >
                    Test Results
                  </div>
                  <div className="space-y-3">
                    {Object.entries(results.results).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center"
                      >
                        <span
                          className="font-mono text-xs uppercase"
                          style={{ color: "rgba(215, 196, 158, 0.6)" }}
                        >
                          {key.replace(/_/g, " ")}
                        </span>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            value
                              ? "bg-[rgba(150,255,150,0.8)]"
                              : "bg-[rgba(255,100,100,0.8)]"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Storage Upload Test */}
                {storageTest && (
                  <div
                    className={`p-6 border rounded-sm ${
                      storageTest.success
                        ? "border-[rgba(150,255,150,0.3)]"
                        : "border-[rgba(255,100,100,0.3)]"
                    }`}
                    style={{
                      background: storageTest.success
                        ? "rgba(150,255,150,0.05)"
                        : "rgba(255,100,100,0.05)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full ${
                          storageTest.success
                            ? "bg-[rgba(150,255,150,0.8)]"
                            : "bg-[rgba(255,100,100,0.8)]"
                        }`}
                      />
                      <div>
                        <div
                          className="font-mono text-xs uppercase mb-1"
                          style={{
                            color: storageTest.success
                              ? "rgba(150,255,150,0.9)"
                              : "rgba(255,100,100,0.9)",
                          }}
                        >
                          Storage Upload Test
                        </div>
                        {storageTest.error && (
                          <div
                            className="font-mono text-xs"
                            style={{ color: "rgba(255,100,100,0.7)" }}
                          >
                            {storageTest.error}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Errors */}
                {results.errors.length > 0 && (
                  <div
                    className="p-6 border rounded-sm"
                    style={{
                      borderColor: "rgba(255, 100, 100, 0.3)",
                      background: "rgba(255, 100, 100, 0.05)",
                    }}
                  >
                    <div
                      className="font-mono text-xs uppercase mb-3"
                      style={{ color: "rgba(255, 100, 100, 0.8)" }}
                    >
                      Errors
                    </div>
                    <div className="space-y-2">
                      {results.errors.map((error, i) => (
                        <div
                          key={i}
                          className="font-mono text-xs"
                          style={{ color: "rgba(255, 100, 100, 0.7)" }}
                        >
                          • {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {results.success && storageTest?.success && (
                  <div
                    className="p-6 border rounded-sm text-center"
                    style={{
                      borderColor: "rgba(150, 255, 150, 0.3)",
                      background: "rgba(150, 255, 150, 0.05)",
                    }}
                  >
                    <div
                      className="font-serif text-lg mb-2"
                      style={{ color: "rgba(150, 255, 150, 0.9)" }}
                    >
                      ✓ Supabase is fully configured and working!
                    </div>
                    <div
                      className="font-mono text-xs"
                      style={{ color: "rgba(150, 255, 150, 0.7)" }}
                    >
                      You can now use all cloud storage features
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </ScholarivmShell>
    </Main>
  );
}

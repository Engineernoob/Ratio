"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithMagicLink,
} from "@/lib/supabase/auth";
import { EngravedHeader } from "@/components/core/EngravedHeader";
import { Main } from "@/components/Main";
import { ScholarivmShell } from "@/components/Scholarivm/ScholarivmShell";

type AuthMode = "signin" | "signup" | "magic";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === "signup") {
        const { user, error } = await signUpWithEmail(email, password);
        if (error) {
          setError(error.message);
        } else if (user) {
          setSuccess("Account created! Please check your email to verify.");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } else {
        const { user, error } = await signInWithEmail(email, password);
        if (error) {
          setError(error.message);
        } else if (user) {
          setSuccess("Signed in successfully!");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await signInWithMagicLink(email);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("Check your email for the magic link!");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main className="scroll-fade-top scroll-fade-bottom">
      <ScholarivmShell>
        <div className="relative z-10 min-h-screen p-6 md:p-12 flex items-center justify-center">
          <div className="max-w-md w-full">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <EngravedHeader level={1} delay={0.2}>
                AUTHENTICATION
              </EngravedHeader>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-mono text-sm mt-4"
                style={{ color: "rgba(215, 196, 158, 0.6)" }}
              >
                Sign in to sync your data across devices
              </motion.p>
            </motion.div>

            {/* Mode Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-6 flex gap-2"
            >
              {(
                [
                  { id: "signin", label: "Sign In" },
                  { id: "signup", label: "Sign Up" },
                  { id: "magic", label: "Magic Link" },
                ] as const
              ).map((m) => (
                <motion.button
                  key={m.id}
                  onClick={() => {
                    setMode(m.id as AuthMode);
                    setError(null);
                    setSuccess(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-4 py-2 border rounded-sm font-mono text-xs uppercase ${
                    mode === m.id
                      ? "border-[#d7c49e] bg-[rgba(215,196,158,0.1)]"
                      : "border-[rgba(215,196,158,0.2)]"
                  }`}
                  style={{
                    color:
                      mode === m.id ? "#d7c49e" : "rgba(215, 196, 158, 0.6)",
                  }}
                >
                  {m.label}
                </motion.button>
              ))}
            </motion.div>

            {/* Auth Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <form
                onSubmit={mode === "magic" ? handleMagicLink : handleEmailAuth}
                className="space-y-4"
              >
                {/* Email */}
                <div>
                  <label
                    className="block font-mono text-xs uppercase mb-2"
                    style={{ color: "rgba(215, 196, 158, 0.6)" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full px-4 py-3 border rounded-sm font-mono text-sm bg-transparent disabled:opacity-50"
                    style={{
                      borderColor: "rgba(215, 196, 158, 0.2)",
                      color: "rgba(232, 230, 225, 0.9)",
                    }}
                    placeholder="your@email.com"
                  />
                </div>

                {/* Password (not for magic link) */}
                {mode !== "magic" && (
                  <div>
                    <label
                      className="block font-mono text-xs uppercase mb-2"
                      style={{ color: "rgba(215, 196, 158, 0.6)" }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                      className="w-full px-4 py-3 border rounded-sm font-mono text-sm bg-transparent disabled:opacity-50"
                      style={{
                        borderColor: "rgba(215, 196, 158, 0.2)",
                        color: "rgba(232, 230, 225, 0.9)",
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-sm"
                    style={{
                      borderColor: "rgba(255, 100, 100, 0.3)",
                      background: "rgba(255, 100, 100, 0.05)",
                    }}
                  >
                    <div
                      className="font-mono text-xs"
                      style={{ color: "rgba(255, 100, 100, 0.8)" }}
                    >
                      {error}
                    </div>
                  </motion.div>
                )}

                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-sm"
                    style={{
                      borderColor: "rgba(150, 255, 150, 0.3)",
                      background: "rgba(150, 255, 150, 0.05)",
                    }}
                  >
                    <div
                      className="font-mono text-xs"
                      style={{ color: "rgba(150, 255, 150, 0.8)" }}
                    >
                      {success}
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={
                    loading || !email || (mode !== "magic" && !password)
                  }
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full px-6 py-4 border rounded-sm font-mono text-sm uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    borderColor: "rgba(215, 196, 158, 0.3)",
                    background:
                      loading || !email || (mode !== "magic" && !password)
                        ? "rgba(10, 10, 10, 0.6)"
                        : "rgba(215, 196, 158, 0.1)",
                    color: "#d7c49e",
                  }}
                >
                  {loading
                    ? "Processing..."
                    : mode === "signup"
                    ? "Create Account"
                    : mode === "magic"
                    ? "Send Magic Link"
                    : "Sign In"}
                </motion.button>
              </form>

              {/* Info */}
              <div className="mt-6 text-center">
                <p
                  className="font-mono text-xs"
                  style={{ color: "rgba(215, 196, 158, 0.4)" }}
                >
                  {mode === "magic"
                    ? "We'll send you a link to sign in"
                    : mode === "signup"
                    ? "Password must be at least 6 characters"
                    : "Forgot your password? Use Magic Link"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </ScholarivmShell>
    </Main>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopNavBar } from "@/components/core/TopNavBar";
import { MentorShell } from "@/components/Mentor/MentorShell";
import { PersonaSelector } from "@/components/Mentor/PersonaSelector";
import { MessageBubble } from "@/components/Mentor/MessageBubble";
import { InputBar } from "@/components/Mentor/InputBar";
import { MentorAvatar } from "@/components/Mentor/MentorAvatar";
import { EngravedHeader } from "@/components/core/EngravedHeader";
import { Main } from "@/components/Main";
import type { MentorPersona, MentorMessage } from "@/lib/mentor/types";
import { getPersonaDescription } from "@/lib/mentor/persona";

export default function MentorPage() {
  const [persona, setPersona] = useState<MentorPersona>("stoic_philosopher");
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load conversation history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch("/api/mentor?action=history");
        if (res.ok) {
          const data = await res.json();
          if (data.history && Array.isArray(data.history)) {
            setMessages(data.history);
          }
        }
      } catch (error) {
        console.error("Error loading conversation history:", error);
      }
    };

    loadHistory();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message immediately
    const userMessage: MentorMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          persona,
        }),
      });

      if (res.ok) {
        const data = await res.json();

        // Add mentor response
        const mentorMessage: MentorMessage = {
          id: data.conversationId || `msg-${Date.now()}-mentor`,
          role: "mentor",
          content: data.message,
          timestamp: new Date().toISOString(),
          metadata: {
            persona,
          },
        };

        setMessages((prev) => [...prev, mentorMessage]);
        setSuggestions(data.suggestions || []);
      } else {
        // Error message
        const errorMessage: MentorMessage = {
          id: `msg-${Date.now()}-error`,
          role: "mentor",
          content: "I apologize, but I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: MentorMessage = {
        id: `msg-${Date.now()}-error`,
        role: "mentor",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TopNavBar />
      <Main className="scroll-fade-top scroll-fade-bottom">
        <MentorShell>
        <div className="relative z-10 min-h-screen p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8"
            >
              <EngravedHeader level={1} delay={0.2}>
                RATIO MENTOR
              </EngravedHeader>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-mono text-sm mt-4"
                style={{ color: "rgba(215, 196, 158, 0.6)" }}
              >
                Your personal guide through the halls of knowledge
              </motion.p>
            </motion.div>

            {/* Persona Selector */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-8"
            >
              <PersonaSelector
                selectedPersona={persona}
                onSelectPersona={setPersona}
              />
            </motion.div>

            {/* Messages Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mb-8"
            >
              <div
                ref={messagesContainerRef}
                className="relative h-[500px] overflow-y-auto p-4 border rounded-sm"
                style={{
                  borderColor: "rgba(215, 196, 158, 0.2)",
                  background: "rgba(10, 10, 10, 0.4)",
                }}
              >
                {/* Empty state */}
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full">
                    <MentorAvatar persona={persona} />
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="font-mono text-sm mt-4 text-center max-w-md"
                      style={{ color: "rgba(215, 196, 158, 0.6)" }}
                    >
                      {getPersonaDescription(persona).description}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                      className="font-mono text-xs mt-2 italic"
                      style={{ color: "rgba(215, 196, 158, 0.4)" }}
                    >
                      Ask me anything, or choose a suggestion below.
                    </motion.p>
                  </div>
                )}

                {/* Messages */}
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      index={index}
                    />
                  ))}
                </AnimatePresence>

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-4"
                  >
                    <MentorAvatar persona={persona} isTyping={true} />
                    <div
                      className="font-mono text-xs italic"
                      style={{ color: "rgba(215, 196, 158, 0.5)" }}
                    >
                      Thinking...
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </motion.div>

            {/* Input Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <InputBar
                onSend={handleSend}
                suggestions={suggestions}
                disabled={isLoading}
              />
            </motion.div>
          </div>
        </div>
      </MentorShell>
      </Main>
    </>
  );
}

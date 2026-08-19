"use client"

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbSend, TbLoader, TbSparkles, TbRefresh, TbUser } from "react-icons/tb";
import { Button } from "@/components/ui/Button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "What projects has Ravindi worked on?",
  "What are her core skills in AI/ML?",
  "Tell me about the Multimodal Leukemia Detection project.",
  "What is her academic background?",
  "How can I contact her?"
];

export default function AgentPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hey there! 👋 I'm Elara, Ravindi's AI assistant. Ask me about her projects, skills, research, or background!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
  }, [input]);

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hey there! 👋 I'm Elara, Ravindi's AI assistant. Ask me about her projects, skills, research, or background!"
      }
    ]);
    setInput("");
    setIsLoading(false);
  };

  const renderMarkdown = (text: string) => {
    const escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const withBold = escaped.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    const withList = withBold
      .split(/\n/)
      .map(line => {
        if (line.trim().startsWith("* ")) {
          return `<li>${line.trim().slice(2)}</li>`;
        }
        return line;
      })
      .join("\n");

    const blocks = withList.split(/\n\n+/);
    const html = blocks
      .map(block => {
        if (block.includes("<li>")) {
          return `<ul>${block}</ul>`;
        }
        return `<p>${block.replace(/\n/g, "<br />")}</p>`;
      })
      .join("");

    return html;
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Placeholder message for the assistant that will be populated via stream
    const assistantPlaceholder: Message = { role: "assistant", content: "" };
    setMessages(prev => [...prev, assistantPlaceholder]);

    try {
      const configuredBackendUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
      const backendUrl = configuredBackendUrl && configuredBackendUrl !== "/"
        ? configuredBackendUrl.replace(/\/+$/, "")
        : "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text })
      });

      if (!response.ok) {
        throw new Error(`Failed to connect to agent backend: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("No readable response body from chat backend");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        // Keep the last partial line in the buffer
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;

          const dataStr = trimmed.slice(6);
          if (dataStr === "[DONE]") continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.token) {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  last.content += parsed.token;
                }
                return updated;
              });
            } else if (parsed.error) {
              setMessages(prev => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last && last.role === "assistant") {
                  last.content = `Error: ${parsed.error}`;
                }
                return updated;
              });
            }
          } catch {
            // Ignore JSON parsing errors for partial lines
          }
        }
      }
    } catch (error: unknown) {
      console.error(error);
      const errMsg = error instanceof Error ? error.message : String(error);
      setMessages(prev => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last && last.role === "assistant") {
          last.content = `I'm sorry, I couldn't reach my reasoning server. Please ensure the backend is running. (Error: ${errMsg})`;
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl flex-col overflow-hidden rounded-[28px] border border-surface-border/80 bg-surface/70 shadow-[0_20px_80px_rgba(14,18,24,0.35)] backdrop-blur-sm">
        <header className="flex-shrink-0 border-b border-surface-border/70 bg-surface/80 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-accent">
                <TbSparkles className="h-3.5 w-3.5" />
                Live assistant
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground/60">
                <span className="h-2.5 w-2.5 rounded-full bg-accent-soft shadow-[0_0_12px_rgba(175,113,157,0.9)]" />
                Ready
              </div>
            </div>

            <button
              type="button"
              onClick={resetChat}
              className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-light/70 px-3 py-1.5 text-xs text-foreground/75 transition hover:border-accent/30 hover:text-accent"
            >
              <TbRefresh className="h-3.5 w-3.5" />
              Reset
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 text-accent ring-1 ring-accent/20">
              <TbSparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">Elara</h1>
              <p className="text-sm text-foreground/65">
                A conversational assistant for my profile, work, and experience.
              </p>
            </div>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                      msg.role === "user"
                        ? "border-accent/25 bg-accent/15 text-accent"
                        : "border-surface-border bg-surface-light text-foreground/80"
                    }`}>
                      {msg.role === "user" ? <TbUser className="h-4 w-4" /> : <TbSparkles className="h-4 w-4" />}
                    </div>

                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.role === "user"
                        ? "border border-accent/25 bg-gradient-to-br from-accent/18 to-accent/10 text-black"
                        : "border border-surface-border/70 bg-surface-light/75 text-black"
                    }`}>
                      {msg.role === "assistant" && msg.content ? (
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
                      ) : msg.content || (isLoading && index === messages.length - 1 ? (
                        <span className="flex items-center gap-2 text-foreground/60">
                          <TbLoader className="h-4 w-4 animate-spin" />
                          Thinking...
                        </span>
                      ) : "")}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-surface-border/80 bg-surface-light/50 p-4">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/50">
                  Suggested questions
                </p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => handleSend(suggestion)}
                      className="rounded-full border border-surface-border bg-surface px-3 py-1.5 text-xs text-foreground/75 transition hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <footer className="border-t border-surface-border/70 bg-surface/90 px-4 py-4 sm:px-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-surface-border bg-surface-light/80 p-2 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
            >
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                placeholder="Ask Elara about Ravindi’s work, skills, or background..."
                disabled={isLoading}
                className="max-h-40 min-h-[46px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-foreground/90 font-medium placeholder:text-foreground/50 focus:outline-none disabled:cursor-not-allowed"
              />

              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-11 w-11 shrink-0 rounded-xl p-0"
              >
                <TbSend className="h-4 w-4" />
              </Button>
            </form>
          </footer>
        </main>
      </div>
    </div>
  );
}

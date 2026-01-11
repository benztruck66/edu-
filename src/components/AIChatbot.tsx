"use client";
import { useState, useRef, useEffect, useCallback, memo } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type ChatError = {
  message: string;
  retryable: boolean;
};

export const AIChatbot = memo(function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Сайн байна уу! Би танд их сургууль, хөтөлбөр сонголт, элсэлт зэрэг асуудлаар туслах болно. Юу хэлэх вэ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ChatError | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(async (retryMessage?: string) => {
    const messageToSend = retryMessage || input.trim();
    if (!messageToSend || isLoading) return;

    // Clear any previous errors
    setError(null);

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: messageToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!retryMessage) setInput("");
    setIsLoading(true);

    // Create abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageToSend }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.response) {
        throw new Error("Invalid response format");
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      // Handle abort
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      // Handle other errors
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      const isNetworkError = errorMessage.includes("fetch") || errorMessage.includes("network");
      
      setError({
        message: isNetworkError 
          ? "Сүлжээний алдаа гарлаа. Интернет холболтоо шалгана уу."
          : "Уучлаарай, алдаа гарлаа. Дахин оролдоно уу.",
        retryable: true,
      });

      console.error("AI Chat error:", err);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [input, isLoading]);

  const handleRetry = useCallback(() => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");
    if (lastUserMessage) {
      handleSend(lastUserMessage.content);
    }
  }, [messages, handleSend]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => !prev);
    setError(null);
  }, []);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label={isOpen ? "AI чатбот хаах" : "AI чатбот нээх"}
        aria-expanded={isOpen}
        aria-controls="ai-chatbot-window"
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          id="ai-chatbot-window"
          role="dialog"
          aria-label="AI чатбот"
          aria-modal="true"
          className="fixed bottom-24 right-6 z-50 w-96 h-[600px] rounded-lg border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-sm font-semibold" aria-hidden="true">
                AI
              </div>
              <div>
                <h2 className="font-semibold text-sm">AI Туслах</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Их сургуулийн мэдээлэл</p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Чатбот хаах"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4"
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                  }`}
                  role={msg.role === "assistant" ? "article" : undefined}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="sr-only">
                    {msg.role === "user" ? "Таны мессеж" : "AI хариулт"}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg px-4 py-2">
                  <div className="flex gap-1" role="status" aria-label="Хариу хүлээж байна">
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  </div>
                  <span className="sr-only">Хариулт уншиж байна...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-900 dark:text-red-100 mb-2">{error.message}</p>
                  {error.retryable && (
                    <button
                      onClick={handleRetry}
                      className="text-xs text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    >
                      Дахин оролдох
                    </button>
                  )}
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} aria-hidden="true" />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-zinc-200 dark:border-white/10">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Асуулт асуух
              </label>
              <input
                ref={inputRef}
                id="chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Асуулт асуу..."
                className="flex-1 rounded-md border border-zinc-300 dark:border-white/20 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
                maxLength={500}
                aria-describedby={error ? "chat-error" : undefined}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={isLoading ? "Илгээж байна..." : "Мессеж илгээх"}
              >
                {isLoading ? (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Илгээх"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
});

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { sendMessageToBot } from "../services/chatService";
import { fetchAlerts } from "../services/api";
import ReactMarkdown from "react-markdown";

export default function HydroBotChat() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you today? 👋" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertPrompts, setAlertPrompts] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const alerts = await fetchAlerts(null, 1, 2);
        const prompts = alerts.map((alert) => {
          const device = alert.dispositif_id
            ? `device ${alert.dispositif_id}`
            : "a device";
          return `Why this alert: "${alert.alerte}" on ${device}?`;
        });
        setAlertPrompts(prompts);
      } catch (e) {
        console.error("Error loading alerts:", e);
      }
    };
    loadPrompts();
  }, []);

  const handleSend = async (customText = null) => {
    const textToSend = customText ?? input;
    if (!textToSend.trim()) return;

    const userMessage = { from: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const botReplyText = await sendMessageToBot(textToSend);
      const cleaned = botReplyText.replace(/\n/g, "\n\n");
      const botReply = { from: "bot", text: cleaned };
      setMessages((prev) => [...prev, botReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "❌ An error occurred while communicating with the server.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg">HydroBot</h2>
            <p className="text-xs text-blue-100">Your water quality assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs font-medium">Online</span>
        </div>
      </div>

      {/* Chat body */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start gap-3 max-w-[75%] ${
                msg.from === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                  msg.from === "user"
                    ? "bg-blue-600"
                    : "bg-gradient-to-br from-blue-500 to-blue-600"
                }`}
              >
                {msg.from === "user" ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message bubble */}
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white rounded-tr-sm"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    ul: ({ children }) => <ul className="list-disc pl-4 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1">{children}</ol>,
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start gap-3 max-w-[75%]">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-gray-500">HydroBot is typing...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {alertPrompts.length > 0 && messages.length <= 1 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Suggested Questions
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSend(prompt)}
                className="bg-white hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-xs font-medium px-4 py-2 rounded-full border border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow"
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent text-sm placeholder:text-gray-400 focus:outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow"
            disabled={isLoading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          HydroBot can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Clock,
  Eye,
  Copy,
  Check,
  Sparkles,
  Zap,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<{ id: string; url: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    setError(null);

    const body: any = { content: content.trim() };
    if (ttl) body.ttl_seconds = parseInt(ttl);
    if (maxViews) body.max_views = parseInt(maxViews);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        toast.success("✨ Paste created successfully!", {
          duration: 3000,
          style: {
            background: "rgba(34, 197, 94, 0.9)",
            color: "#fff",
            border: "1px solid rgba(34, 197, 94, 0.3)",
          },
        });
      } else {
        setError(data.error || "Failed to create paste");
        toast.error("❌ " + (data.error || "Failed to create paste"));
      }
    } catch (err) {
      setError("Network error");
      toast.error("❌ Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("📋 Link copied to clipboard!", {
        duration: 2000,
        style: {
          background: "rgba(59, 130, 246, 0.9)",
          color: "#fff",
          border: "1px solid rgba(59, 130, 246, 0.3)",
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("❌ Failed to copy to clipboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 md:p-4">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 md:mb-12"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-4"
          >
            <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-purple-400 mx-auto" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            Pastebin Lite
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-slate-300 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-2xl mx-auto">
            Create and share text pastes securely with our futuristic paste
            service
          </p>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-4 md:p-6 lg:p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Content Input */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-slate-200 mb-3">
                <FileText className="w-5 h-5 text-purple-400" />
                Paste Content *
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your text here... ✨"
                required
                rows={12}
                className="w-full p-3 md:p-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-xs md:text-sm transition-all duration-300 hover:bg-slate-800/70"
              />
            </motion.div>

            {/* Settings Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid md:grid-cols-2 gap-4 md:gap-6"
            >
              {/* TTL Input */}
              <div>
                <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-slate-200 mb-3">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  TTL (seconds)
                </label>
                <input
                  type="number"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                  placeholder="Optional"
                  min="1"
                  className="w-full p-3 md:p-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 hover:bg-slate-800/70"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Leave empty for no expiry
                </p>
              </div>

              {/* Max Views Input */}
              <div>
                <label className="flex items-center gap-2 text-base md:text-lg font-semibold text-slate-200 mb-3">
                  <Eye className="w-5 h-5 text-pink-400" />
                  Max Views
                </label>
                <input
                  type="number"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  placeholder="Optional"
                  min="1"
                  className="w-full p-3 md:p-4 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 hover:bg-slate-800/70"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Leave empty for unlimited
                </p>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !content.trim()}
              className="w-full py-3 px-4 md:py-4 md:px-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-600 text-white font-bold text-base md:text-lg rounded-xl transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Paste
                </>
              )}
            </motion.button>
          </form>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-4 md:mt-6 p-3 md:p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300"
              >
                <p className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
                className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Check className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold text-green-300">
                    Paste Created Successfully!
                  </h3>
                </div>
                <p className="text-slate-300 mb-4">
                  Share this link with others:
                </p>
                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                  <code className="flex-1 text-cyan-300 break-all">
                    {result.url}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(result.url)}
                    className="p-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-8 md:mt-12 text-slate-400"
        >
          <p className="flex items-center justify-center gap-2 text-sm md:text-base">
            <Shield className="w-4 h-4" />
            Secure • Fast • Modern
          </p>
        </motion.div>
      </div>
    </div>
  );
}

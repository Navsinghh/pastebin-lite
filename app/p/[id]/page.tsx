"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Clock,
  Eye,
  ArrowLeft,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PasteData {
  content: string;
  created_at: string;
  expires_at?: string;
  max_views?: number;
  views_remaining?: number;
}

export default function PasteView() {
  const params = useParams();
  const router = useRouter();
  const [paste, setPaste] = useState<PasteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchPaste = async () => {
      try {
        const res = await fetch(`/api/pastes/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setPaste(data);
        } else if (res.status === 404) {
          setError("Paste not found or has expired");
        } else {
          setError("Failed to load paste");
        }
      } catch (err) {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPaste();
    }
  }, [params.id]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("📋 Content copied to clipboard!", {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 text-center max-w-md"
        >
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Oops!</h1>
          <p className="text-slate-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg"
          >
            Go Home
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10"></div>

      <div className="relative z-10 p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-300 backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </motion.button>

          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <span className="text-slate-300">Paste #{params.id}</span>
          </div>
        </motion.div>

        {/* Paste Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
        >
          {/* Meta Information */}
          <div className="p-6 border-b border-white/10">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-sm text-slate-400">Created</p>
                  <p className="text-white">
                    {paste ? new Date(paste.created_at).toLocaleString() : ""}
                  </p>
                </div>
              </div>

              {paste?.expires_at && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-pink-400" />
                  <div>
                    <p className="text-sm text-slate-400">Expires</p>
                    <p className="text-white">
                      {new Date(paste.expires_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {paste?.views_remaining !== undefined && (
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-slate-400">Views Remaining</p>
                    <p className="text-white">{paste.views_remaining}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Content</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(paste?.content || "")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors duration-200"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-slate-800/50 border border-slate-600 rounded-xl p-4 overflow-x-auto"
            >
              <pre className="text-slate-200 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {paste?.content}
              </pre>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

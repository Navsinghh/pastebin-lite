"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<{ id: string; url: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);

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
        toast.success("Paste created successfully!");
      } else {
        toast.error(data.error || "Failed to create paste");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="max-w-2xl w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Pastebin Lite
          </h1>
          <p className="text-gray-400">Create and share text pastes securely</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Paste Content *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your text here..."
              required
              rows={8}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="ttl"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Time to Live (seconds)
              </label>
              <input
                id="ttl"
                type="number"
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
                placeholder="Optional"
                min="1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for no expiry
              </p>
            </div>

            <div>
              <label
                htmlFor="maxViews"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Max Views
              </label>
              <input
                id="maxViews"
                type="number"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                placeholder="Optional"
                min="1"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for unlimited
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              "Create Paste"
            )}
          </button>
        </form>

        {result && (
          <div className="mt-8 p-6 bg-gray-700 rounded-lg border border-gray-600 animate-fade-in">
            <h3 className="text-lg font-semibold text-green-400 mb-3">
              Paste Created!
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={result.url}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white text-sm"
              />
              <button
                onClick={() => copyToClipboard(result.url)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-200"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Share this link to view your paste
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

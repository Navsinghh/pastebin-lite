"use client";

import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<{ id: string; url: string } | null>(
    null
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
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
      } else {
        setError(data.error || "Failed to create paste");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Pastebin Lite</h1>
      <p>Create a text paste and share the link.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="content">Content:</label>
          <br />
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your paste content here..."
            required
            rows={10}
            cols={50}
            style={{ width: "100%", marginBottom: "10px" }}
          />
        </div>
        <div>
          <label htmlFor="ttl">TTL (seconds, optional):</label>
          <br />
          <input
            id="ttl"
            type="number"
            value={ttl}
            onChange={(e) => setTtl(e.target.value)}
            min="1"
            style={{ marginBottom: "10px" }}
          />
        </div>
        <div>
          <label htmlFor="maxViews">Max Views (optional):</label>
          <br />
          <input
            id="maxViews"
            type="number"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            min="1"
            style={{ marginBottom: "10px" }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {result && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid green",
            backgroundColor: "#eaffea",
          }}
        >
          <p>Paste created successfully!</p>
          <p>
            Share this link:{" "}
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.url}
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

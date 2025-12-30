import kv from "@/lib/kv";
import { getNow } from "@/lib/time";

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const key = `paste:${params.id}`;
  const paste = (await kv.get(key)) as any;

  if (!paste) {
    const notFoundHtml = `<html><body><h1>404 Not Found</h1></body></html>`;
    return new Response(notFoundHtml, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const now = getNow();

  if (paste.expiresAt && now >= paste.expiresAt) {
    const notFoundHtml = `<html><body><h1>404 Not Found</h1><p>Paste expired</p></body></html>`;
    return new Response(notFoundHtml, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    const notFoundHtml = `<html><body><h1>404 Not Found</h1><p>View limit exceeded</p></body></html>`;
    return new Response(notFoundHtml, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // increment views and persist
  paste.views += 1;
  await kv.set(key, paste);

  const content = escapeHtml(paste.content).replace(/\n/g, "<br />");

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Paste ${params.id}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: 'Courier New', monospace;
      background: linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%);
      color: #e2e8f0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      max-width: 800px;
      width: 100%;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 24px;
      padding: 32px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    .header {
      text-align: center;
      margin-bottom: 24px;
    }
    .title {
      font-size: 2rem;
      font-weight: bold;
      background: linear-gradient(45deg, #a855f7, #ec4899, #06b6d4);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 8px;
    }
    .meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
      font-size: 0.875rem;
      color: #94a3b8;
    }
    .content {
      background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(71, 85, 105, 0.5);
      border-radius: 12px;
      padding: 16px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 0.875rem;
      line-height: 1.5;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 16px;
      color: #a855f7;
      text-decoration: none;
      font-weight: 500;
    }
    .back-link:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">&larr; Back to Home</a>
    <div class="header">
      <h1 class="title">Paste ${params.id}</h1>
    </div>
    <div class="meta">
      <span>Created: ${new Date(paste.createdAt).toLocaleString()}</span>
      ${paste.expiresAt ? `<span>Expires: ${new Date(paste.expiresAt).toLocaleString()}</span>` : ''}
      ${paste.maxViews !== null ? `<span>Views remaining: ${Math.max(0, paste.maxViews - paste.views)}</span>` : ''}
    </div>
    <div class="content">${content}</div>
  </div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

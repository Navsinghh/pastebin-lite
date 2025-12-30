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
  const paste = await kv.get<any>(key);

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

  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Paste ${params.id}</title></head><body><pre style="white-space:pre-wrap;word-break:break-word">${content}</pre></body></html>`;

  return new Response(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

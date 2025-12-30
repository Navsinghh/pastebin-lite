import kv from "@/lib/kv";
import { getNow } from "@/lib/time";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) {
    return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  }

  const now = getNow();

  if (paste.expiresAt && now >= paste.expiresAt) {
    return new Response(JSON.stringify({ error: "Expired" }), { status: 404 });
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return new Response(JSON.stringify({ error: "View limit exceeded" }), { status: 404 });
  }

  paste.views += 1;
  await kv.set(key, paste);

  return Response.json({
    content: paste.content,
    remaining_views: paste.maxViews ? paste.maxViews - paste.views : null,
    expires_at: paste.expiresAt ? new Date(paste.expiresAt).toISOString() : null
  });
}
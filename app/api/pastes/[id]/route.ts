import kv from "@/lib/kv";
import { getNow } from "@/lib/time";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const key = `paste:${params.id}`;  console.log('Fetching paste with key:', key);  const paste = (await kv.get(key)) as any;

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const now = getNow();

  if (paste.expiresAt && now >= paste.expiresAt) {
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  // increment views and clamp remaining views to zero minimum
  paste.views += 1;
  await kv.set(key, paste);

  const remaining =
    paste.maxViews !== null ? Math.max(0, paste.maxViews - paste.views) : null;

  return Response.json({
    content: paste.content,
    remaining_views: remaining,
    expires_at: paste.expiresAt
      ? new Date(paste.expiresAt).toISOString()
      : null,
  });
}

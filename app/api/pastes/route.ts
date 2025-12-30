import kv from "@/lib/kv";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.content !== "string" || body.content.trim() === "") {
    return new Response(JSON.stringify({ error: "Invalid content" }), { status: 400 });
  }

  const ttl = body.ttl_seconds;
  const maxViews = body.max_views;

  if (ttl !== undefined && (!Number.isInteger(ttl) || ttl < 1)) {
    return new Response(JSON.stringify({ error: "Invalid ttl_seconds" }), { status: 400 });
  }

  if (maxViews !== undefined && (!Number.isInteger(maxViews) || maxViews < 1)) {
    return new Response(JSON.stringify({ error: "Invalid max_views" }), { status: 400 });
  }

  const id = nanoid(8);
  const createdAt = Date.now();
  const expiresAt = ttl ? createdAt + ttl * 1000 : null;

  await kv.set(`paste:${id}`, {
    id,
    content: body.content,
    createdAt,
    expiresAt,
    maxViews: maxViews ?? null,
    views: 0
  });

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`
  });
}
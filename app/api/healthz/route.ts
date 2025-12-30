import kv from "@/lib/kv";

export async function GET() {
  try {
    await kv.get("health-check");
    return Response.json({ ok: true });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}
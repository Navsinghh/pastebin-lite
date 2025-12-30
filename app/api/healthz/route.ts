import kv from "@/lib/kv";

export async function GET() {
  try {
    await kv.get("health-check");
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ ok: false }, { status: 500 });
  }
}

import kv from "@/lib/kv";

export async function GET() {
  try {
    console.log("Testing DB connection...");
    await kv.get("health-check");
    console.log("DB ok");
    return Response.json({ ok: true });
  } catch (err) {
    console.error("DB error:", err);
    return Response.json({ ok: false }, { status: 500 });
  }
}

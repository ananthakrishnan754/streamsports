import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const dir = path.join(process.cwd(), "public", "assets", "images", "products");
const allowed = /^[a-z0-9][a-z0-9._-]*\.(jpg|jpeg|png|webp|avif)$/;

export async function POST(req: Request) {
  const { filename, b64 } = await req.json();
  if (typeof filename !== "string" || typeof b64 !== "string" || !allowed.test(filename)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(b64, "base64"));
  return NextResponse.json({ ok: true, filename });
}

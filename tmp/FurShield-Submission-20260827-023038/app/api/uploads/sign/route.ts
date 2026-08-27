import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `${process.env.CLOUDINARY_FOLDER || "furshield"}/${session.userId}`;
  const allowedFormats = "jpg,jpeg,png,webp,pdf";
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) return NextResponse.json({ error: "Upload service is not configured" }, { status: 503 });
  const signature = createHash("sha1").update(`allowed_formats=${allowedFormats}&folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
  return NextResponse.json({ timestamp, folder, allowedFormats, signature, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY, maxBytes: 10_000_000 });
}

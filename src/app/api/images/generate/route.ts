import { NextRequest, NextResponse } from "next/server";
import { openai, MODELS } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { prompt, size } = await req.json();
  if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
  const img = await openai.images.generate({
    model: MODELS.image,
    prompt,
    size: size ?? "1024x1024",
  });
  return NextResponse.json({ imageBase64: img.data[0].b64_json });
}



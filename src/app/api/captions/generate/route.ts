import { NextRequest, NextResponse } from "next/server";
import { openai, MODELS } from "@/lib/openai";
import { BRAND_SYSTEM, STYLE_EXAMPLES } from "@/lib/brand";

export async function POST(req: NextRequest) {
  const { subject, constraints } = await req.json();
  if (!subject) return NextResponse.json({ error: "subject required" }, { status: 400 });

  const system = BRAND_SYSTEM;
  const user = [
    `Subject: ${subject}`,
    `Constraints: ${constraints ?? "Limit emojis; include 2 hashtag sets and 1 ALT text."}`,
    `Style cues: ${STYLE_EXAMPLES.join(" | ")}`,
  ].join("\n");

  const r = await openai.responses.create({
    model: MODELS.captions,
    input: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  return NextResponse.json({ draft: r.output_text });
}



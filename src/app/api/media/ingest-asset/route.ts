import { NextRequest, NextResponse } from "next/server";
import { openai, MODELS } from "@/lib/openai";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const { storageUrl, originalName } = await req.json();
  if (!storageUrl) return NextResponse.json({ error: "storageUrl required" }, { status: 400 });

  const r = await openai.responses.create({
    model: MODELS.captions,
    input: [
      { role: "system", content: "Describe images for search in 1–2 literal sentences; no speculation." },
      { role: "user", content: `Describe this hospital photo for search: ${originalName ?? storageUrl}` },
    ],
  });
  const caption = r.output_text ?? "";

  const emb = await openai.embeddings.create({ model: MODELS.embeddings, input: caption });
  // Store embedding to vector(1536) using raw SQL after insert
  const created = await prisma.asset.create({
    data: { storageUrl, originalName, caption, tags: [] },
  });

  const vecString = `[${(emb.data[0].embedding as number[]).join(",")}]`;
  await prisma.$executeRawUnsafe(
    `update "Asset" set embedding = $1::vector where id = $2`,
    vecString,
    created.id
  );

  return NextResponse.json({ ok: true });
}



import { NextRequest, NextResponse } from "next/server";
import { openai, MODELS } from "@/lib/openai";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const { topic, k } = await req.json();
  if (!topic) return NextResponse.json({ error: "topic required" }, { status: 400 });

  const emb = await openai.embeddings.create({ model: MODELS.embeddings, input: topic });
  const vector = emb.data[0].embedding as number[];

  const results = await prisma.$queryRawUnsafe<any[]>(
    `SELECT id, storageurl, caption
     FROM "Asset"
     ORDER BY (embedding <-> $1) ASC
     LIMIT $2`,
    vector,
    k ?? 6
  );

  return NextResponse.json({ results });
}



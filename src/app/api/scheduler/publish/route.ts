import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { reviewCaptionSafety } from "@/lib/safety";

export async function POST() {
  const now = new Date();
  const due = await prisma.draft.findMany({
    where: { status: "scheduled", scheduledAt: { lte: now } },
    take: 10,
  });

  let published = 0,
    skipped = 0;

  for (const d of due) {
    const check = await reviewCaptionSafety(d.caption);
    if (!check.allow) {
      skipped++;
      await prisma.draft.update({ where: { id: d.id }, data: { status: "draft" } });
      continue;
    }

    const imageUrl = d.selectedAssetIds?.[0];
    if (!imageUrl) {
      skipped++;
      continue;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/ig/publish`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ imageUrl, caption: d.caption }),
    });

    if (res.ok) {
      const { id } = await res.json();
      await prisma.draft.update({ where: { id: d.id }, data: { status: "published", publishedIgId: id } });
      published++;
    } else {
      skipped++;
    }
  }

  return NextResponse.json({ published, skipped });
}



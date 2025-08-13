import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { GRAPH, META_TOKEN, IG_USER_ID } from "@/lib/meta";

export async function POST(req: NextRequest) {
  const { imageUrl, caption } = await req.json();
  if (!imageUrl || !caption) return NextResponse.json({ error: "imageUrl and caption required" }, { status: 400 });

  const { data: created } = await axios.post(
    `${GRAPH}/${IG_USER_ID}/media`,
    null,
    { params: { image_url: imageUrl, caption, access_token: META_TOKEN } }
  );

  const { data: published } = await axios.post(
    `${GRAPH}/${IG_USER_ID}/media_publish`,
    null,
    { params: { creation_id: created.id, access_token: META_TOKEN } }
  );

  return NextResponse.json({ ok: true, id: published.id });
}



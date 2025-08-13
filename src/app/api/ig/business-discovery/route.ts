import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { GRAPH, META_TOKEN, IG_USER_ID } from "@/lib/meta";

export async function POST(req: NextRequest) {
  const { username } = await req.json();
  if (!username) return NextResponse.json({ error: "username required" }, { status: 400 });

  const fields =
    `business_discovery.username(${username})` +
    `{username,biography,media.limit(12){id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count}}`;

  const { data } = await axios.get(`${GRAPH}/${IG_USER_ID}`, {
    params: { fields, access_token: META_TOKEN },
  });

  return NextResponse.json(data);
}



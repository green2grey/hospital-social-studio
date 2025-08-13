import { NextResponse } from "next/server";
import axios from "axios";
import { GRAPH, META_TOKEN, IG_USER_ID } from "@/lib/meta";

export async function GET() {
  const fields = "id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count";
  const { data } = await axios.get(`${GRAPH}/${IG_USER_ID}/media`, {
    params: { fields, access_token: META_TOKEN },
  });
  return NextResponse.json(data);
}



import { NextResponse } from "next/server";
import axios from "axios";
import { GRAPH, META_TOKEN, IG_USER_ID } from "@/lib/meta";

export async function GET() {
  try {
    const { data } = await axios.get(`${GRAPH}/${IG_USER_ID}/content_publishing_limit`, {
      params: { access_token: META_TOKEN },
    });
    return NextResponse.json({
      quota_total: data.data?.[0]?.quota_total,
      quota_usage: data.data?.[0]?.quota_usage,
      raw: data,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Upstream error" }, { status: 502 });
  }
}



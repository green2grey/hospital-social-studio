import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET(_req: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin.storage.listBuckets();
    if (error) throw error as Error;
    return new Response(JSON.stringify({ ok: true, buckets: data?.map(b => b.name) }), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 });
  }
}



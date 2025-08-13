import { NextRequest } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(_req: NextRequest) {
  try {
    // Light-weight query to validate DB connectivity
    await prisma.$queryRaw`SELECT 1`;
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ ok: false, error: message }), { status: 500 });
  }
}



import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(_req: NextRequest) {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/drive.readonly"]
  );
  const drive = google.drive({ version: "v3", auth });
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID!;
  const filesRes = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id,name,mimeType)",
  });

  let count = 0;
  for (const f of filesRes.data.files ?? []) {
    if (!f.id || !f.name) continue;
    const stream = await drive.files.get({ fileId: f.id, alt: "media" }, { responseType: "stream" });
    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET!)
      .upload(`drive/${f.name}`, stream.data as any, { upsert: true, contentType: f.mimeType || undefined });
    if (!error) count++;
  }

  return NextResponse.json({ ok: true, count });
}



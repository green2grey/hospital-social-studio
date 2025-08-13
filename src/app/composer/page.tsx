"use client";
import { useState } from "react";

export default function ComposerPage() {
  const [subject, setSubject] = useState("");
  const [draft, setDraft] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [posting, setPosting] = useState(false);

  async function generate() {
    setDraft(null);
    const res = await fetch("/api/captions/generate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ subject }),
    });
    const data = await res.json();
    setDraft(data.draft);
  }

  async function uploadAll(): Promise<string[]> {
    const urls: string[] = [];
    for (const f of files) {
      const form = new FormData();
      form.append("file", f);
      const up = await fetch("/api/upload", { method: "POST", body: form });
      const { publicUrl } = await up.json();
      urls.push(publicUrl);
    }
    return urls;
  }

  async function publish() {
    if (!draft) return;
    setPosting(true);
    const [imageUrl] = await uploadAll();
    const res = await fetch("/api/ig/publish", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ imageUrl, caption: draft }),
    });
    setPosting(false);
    alert(res.ok ? "Published!" : "Failed to publish");
  }

  return (
    <main style={{ maxWidth: 820, margin: "40px auto", padding: 16 }}>
      <h1>Compose with AI</h1>

      <label>Subject</label>
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="e.g., Flu clinic this Saturday"
        style={{ width: "100%", padding: 12, margin: "8px 0 16px" }}
      />

      <div style={{ border: "1px dashed #999", padding: 16, marginBottom: 16 }}>
        <input type="file" multiple onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        <p style={{ opacity: 0.7, marginTop: 8 }}>Upload local images.</p>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={generate} disabled={!subject}>
          Generate Caption
        </button>
        <button onClick={publish} disabled={!draft || files.length === 0 || posting}>
          {posting ? "Publishing..." : "Publish"}
        </button>
      </div>

      {draft && (
        <section style={{ marginTop: 24 }}>
          <h3>AI Draft</h3>
          <pre style={{ whiteSpace: "pre-wrap", background: "#f7f7f7", padding: 12 }}>{draft}</pre>
        </section>
      )}
    </main>
  );
}



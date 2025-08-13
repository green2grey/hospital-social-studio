export default function Home() {
  return (
    <main style={{ maxWidth: 820, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 600 }}>Hospital Social Studio</h1>
      <p style={{ opacity: 0.7, marginTop: 8 }}>MVP utilities</p>

      <ul style={{ marginTop: 24, lineHeight: 2 }}>
        <li>
          <a href="/composer" style={{ color: "#0ea5e9" }}>
            Compose with AI
          </a>
        </li>
        <li>
          <a href="/api/health/db" style={{ color: "#0ea5e9" }}>
            API: DB Health
          </a>
        </li>
        <li>
          <a href="/api/health/supabase" style={{ color: "#0ea5e9" }}>
            API: Supabase Health
          </a>
        </li>
      </ul>
    </main>
  );
}

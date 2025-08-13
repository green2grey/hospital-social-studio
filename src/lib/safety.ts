import { openai, MODELS } from "@/lib/openai";

export async function reviewCaptionSafety(caption: string): Promise<{ allow: boolean; reason?: string }> {
  const r = await openai.responses.create({
    model: MODELS.captions,
    input: [
      {
        role: "system",
        content:
          "You are a compliance reviewer. Return ONLY 'ALLOW' or 'BLOCK: <reason>'. " +
          "Check for PHI, medical advice, or inaccessible formatting.",
      },
      { role: "user", content: caption },
    ],
  });
  const out = (r.output_text || "").trim();
  return out.startsWith("ALLOW") ? { allow: true } : { allow: false, reason: out };
}



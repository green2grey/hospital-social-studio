import OpenAI from "openai";

export function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey });
}

export const MODELS = {
  captions: process.env.OPENAI_MODEL_CAPTIONS ?? "gpt-4o-mini",
  embeddings: process.env.OPENAI_MODEL_EMBEDDINGS ?? "text-embedding-3-small",
  image: process.env.OPENAI_MODEL_IMAGE ?? "gpt-image-1",
} as const;



export const GRAPH_VER = process.env.META_GRAPH_VERSION ?? "v22.0";
export const GRAPH = `https://graph.facebook.com/${GRAPH_VER}`;
export const META_TOKEN = process.env.META_LONG_LIVED_TOKEN ?? "";
export const IG_USER_ID = process.env.IG_USER_ID ?? "";

if (!META_TOKEN || !IG_USER_ID) {
  // Only warn at runtime if endpoints are called without config
}



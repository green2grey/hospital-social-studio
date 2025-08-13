import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export function getPrismaClient(): PrismaClient {
  if (!globalThis.prismaGlobal) {
    const log: ("query" | "info" | "warn" | "error")[] =
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

    globalThis.prismaGlobal = new PrismaClient({ log });
  }
  return globalThis.prismaGlobal;
}

export const prisma = getPrismaClient();



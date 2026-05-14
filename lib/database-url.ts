import { resolve } from "node:path";

export function resolveDatabaseUrl(rawUrl = process.env.DATABASE_URL) {
  if (!rawUrl) {
    return `file:${resolve(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/")}`;
  }

  if (!rawUrl.startsWith("file:")) {
    return rawUrl;
  }

  const filePath = rawUrl.replace("file:", "");

  if (
    filePath === ":memory:" ||
    filePath.startsWith("/") ||
    /^[a-zA-Z]:\//.test(filePath) ||
    /^[a-zA-Z]:\\/.test(filePath)
  ) {
    return rawUrl;
  }

  const normalized = resolve(process.cwd(), "prisma", filePath.replace(/^\.?[\\/]/, ""));
  return `file:${normalized.replace(/\\/g, "/")}`;
}

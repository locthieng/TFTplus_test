import { BoardChampion } from "@/types/tft";
import { BuilderSnapshotSchema } from "./builderShareSchema";

/**
 * Converts a standard Base64 string into a URL-safe Base64URL string.
 */
function base64ToBase64Url(base64: string): string {
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Restores a URL-safe Base64URL string back to a standard Base64 string with padding.
 */
function base64UrlToBase64(base64Url: string): string {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4 !== 0) {
    base64 += "=";
  }
  return base64;
}

/**
 * Universal safe Base64 encoder for browser and server runtimes.
 */
function toBase64(str: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(str, "utf-8").toString("base64");
  }
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
    String.fromCharCode(parseInt(p1, 16))
  ));
}

/**
 * Universal safe Base64 decoder for browser and server runtimes.
 */
function fromBase64(base64: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(base64, "base64").toString("utf-8");
  }
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(base64), (c: string) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

/**
 * Encodes a board snapshot into a URL-safe Base64URL string.
 * Validates the input before encoding.
 */
export function encodeBuilderSnapshot(board: BoardChampion[]): string {
  const parseResult = BuilderSnapshotSchema.safeParse(board);
  if (!parseResult.success) {
    throw new Error(`Cannot encode invalid board snapshot: ${parseResult.error.message}`);
  }

  const jsonString = JSON.stringify(parseResult.data);
  const base64 = toBase64(jsonString);
  return base64ToBase64Url(base64);
}

/**
 * Decodes a URL-safe Base64URL string back into a validated board snapshot.
 * Returns null if the string is corrupted or violates the schema, preventing any page crash.
 */
export function decodeBuilderSnapshot(encoded: string): BoardChampion[] | null {
  if (!encoded || typeof encoded !== "string") {
    return null;
  }

  try {
    const base64 = base64UrlToBase64(encoded.trim());
    const jsonString = fromBase64(base64);
    const parsedData = JSON.parse(jsonString);

    const validationResult = BuilderSnapshotSchema.safeParse(parsedData);
    if (!validationResult.success) {
      return null;
    }

    return validationResult.data as BoardChampion[];
  } catch {
    return null;
  }
}

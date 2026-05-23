import type { Lang } from "./types";

// Maps Accept-Language header to a supported lang
export function detectLangFromHeader(acceptLanguage: string | null): Lang {
  if (!acceptLanguage) return "en";
  const tags = acceptLanguage
    .split(",")
    .map((s) => s.split(";")[0].trim().toLowerCase());
  for (const tag of tags) {
    if (tag.startsWith("zh")) return "zh";
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("vi")) return "vi";
    if (tag.startsWith("id")) return "id";
    if (tag.startsWith("en")) return "en";
  }
  return "en";
}

// Detects Arabic or Chinese script in a string — used while the user types
export function detectLangFromText(text: string): Lang | null {
  if (/[؀-ۿ]/.test(text)) return "ar";
  if (/[一-鿿㐀-䶿豈-﫿]/.test(text)) return "zh";
  return null;
}

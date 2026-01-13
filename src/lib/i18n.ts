/**
 * src/lib/i18n.ts
 *
 * Central i18n utilities (SERVER ONLY)
 */

export type Lang = "en" | "hi"; // extend later

const DEFAULT_LANG: Lang = "en";

/**
 * Resolve current language.
 * Later this can read from cookies, headers, middleware, user prefs.
 */
export function getCurrentLang(): Lang {
  return DEFAULT_LANG;
}

/**
 * Resolve multilingual DB field to a string
 */
export function resolveI18nField(
  value: { [key: string]: string | undefined } | string | null | undefined,
  lang: Lang
): string {
  if (!value) return "";

  if (typeof value === "string") return value;

  return value[lang] || value[DEFAULT_LANG] || "";
}

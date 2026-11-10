const SUPPORTED_LANGUAGES = Object.freeze(["es", "en"]);
const FALLBACK_LANGUAGE = "en";

function resolveLanguage(language) {
  const normalized =
    typeof language === "string" ? language.trim().toLowerCase().split(/[-_]/, 1)[0] : "";
  return SUPPORTED_LANGUAGES.includes(normalized) ? normalized : FALLBACK_LANGUAGE;
}

function getLocalizedValue(values, language) {
  const locale = resolveLanguage(language);
  return values?.[locale] ?? values?.[FALLBACK_LANGUAGE];
}

export { SUPPORTED_LANGUAGES, FALLBACK_LANGUAGE, resolveLanguage, getLocalizedValue };

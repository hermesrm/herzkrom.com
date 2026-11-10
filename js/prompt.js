import { getLocalizedValue } from "./locales.js";

const PROMPT_GUEST_NAMES = {
  es: "invitado",
  en: "guest",
};

function getPromptUsername(visitorName, lang) {
  const normalizedName = visitorName?.trim().toLowerCase();
  if (normalizedName && !["guest", "invitado"].includes(normalizedName)) {
    return visitorName;
  }
  return getLocalizedValue(PROMPT_GUEST_NAMES, lang);
}

export { PROMPT_GUEST_NAMES, getPromptUsername };
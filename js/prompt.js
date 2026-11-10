const PROMPT_GUEST_NAMES = {
  es: "invitado",
  en: "guest",
};

function getPromptUsername(visitorName, lang) {
  const normalizedName = visitorName?.trim().toLowerCase();
  if (normalizedName && !["guest", "invitado"].includes(normalizedName)) {
    return visitorName;
  }
  return PROMPT_GUEST_NAMES[lang] || PROMPT_GUEST_NAMES.en;
}

export { getPromptUsername };
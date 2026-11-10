const PROMPT_GUEST_NAMES = {
  es: "invitado",
  en: "guest",
};

function getPromptUsername(visitorName, lang) {
  if (visitorName && visitorName !== "guest") {
    return visitorName;
  }
  return PROMPT_GUEST_NAMES[lang] || PROMPT_GUEST_NAMES.en;
}

export { getPromptUsername };
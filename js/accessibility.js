const ACCESSIBLE_LABELS = {
  terminal: {
    es: "Terminal interactiva",
    en: "Interactive terminal",
  },
  "hidden-input": {
    es: "Entrada de comandos",
    en: "Command input",
  },
};

function updateDocumentLanguage(lang, documentRef = globalThis.document) {
  if (!documentRef?.documentElement) return;

  documentRef.documentElement.lang = lang;

  for (const [id, labels] of Object.entries(ACCESSIBLE_LABELS)) {
    documentRef.getElementById(id)?.setAttribute("aria-label", labels[lang]);
  }
}

export { updateDocumentLanguage };

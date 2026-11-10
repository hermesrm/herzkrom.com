/* =============================
   aliases.js
  Semantic aliases for profile navigation
   ============================= */

/*
  ES: Los alias no contienen lógica; redirigen input directo a comandos y secciones.
      Segmentados por idioma (en/es) y filtrados por autocompletado según idioma activo.
  EN: Aliases carry no logic; they redirect raw input to commands and sections.
      Segmented by language (en/es) and filtered by autocomplete for active language.
*/

import { resolveLanguage, SUPPORTED_LANGUAGES } from "./locales.js";

const navigationAliases = {
  en: [
    { name: "profile", target: "cat /profile", description: "Personal profile", order: 10 },
    { name: "contact", target: "cat /contact", description: "Contact information", order: 60 },
  ],
  es: [
    { name: "perfil", target: "cat /profile", description: "Perfil personal", order: 10 },
    { name: "contacto", target: "cat /contact", description: "Información de contacto", order: 60 },
  ],
};

const aliasRegistry = Object.fromEntries(
  SUPPORTED_LANGUAGES.map((language) => [
    language,
    Object.fromEntries((navigationAliases[language] || []).map(({ name, target }) => [name, target])),
  ])
);

function getNavigationHelpEntries(language) {
  return (navigationAliases[resolveLanguage(language)] || []).map(({ name, description, order }) => ({
    command: name,
    description,
    section: "primary",
    order,
  }));
}

export { aliasRegistry, navigationAliases, getNavigationHelpEntries };

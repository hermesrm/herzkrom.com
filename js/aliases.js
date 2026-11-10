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

const aliasRegistry = {
  en: {
    profile: "cat /profile",
    contact: "cat /contact",
  },
  es: {
    perfil: "cat /profile",
    contacto: "cat /contact",
  },
};

export { aliasRegistry };

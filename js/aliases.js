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
    about: "cat /profile",
    profile: "cat /profile",
    contact: "cat /contact",
    github: "open github",
    linkedin: "open linkedin",
  },
  es: {
    acerca: "cat /profile",
    perfil: "cat /profile",
    contacto: "cat /contact",
    github: "open github",
    linkedin: "open linkedin",
  },
};

export { aliasRegistry };

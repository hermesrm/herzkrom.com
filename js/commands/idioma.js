/* =============================
   idioma.js
   Language selection command
   ============================= */

import { updateDocumentLanguage } from "../accessibility.js";

// ES: Idiomas soportados. EN: Supported languages.
const SUPPORTED_LANGS = ["es", "en"];

const languageCommand = {
  id: "SET_LANG",
  aliases: {
    es: ["idioma", "language"],
    en: ["language", "idioma"],
  },
  description: {
    es: "Muestra o cambia el idioma de la sesión",
    en: "Show or change the session language",
  },

  execute(context, args) {
    // Limitar el comando al alias correcto según el idioma
    const inputCmd = context?.inputCmd || "";
    if (
      (context.lang === "es" && inputCmd !== "idioma") ||
      (context.lang === "en" && inputCmd !== "language")
    ) {
      return {
        output:
          context.lang === "es"
            ? "Comando no reconocido: " + inputCmd
            : "Command not found: " + inputCmd,
        code: 127,
      };
    }
    // Mostrar ayuda si se solicita --help
    if (args.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: idioma <es|en> [opciones]",
              "",
              "Muestra o cambia el idioma de la sesión.",
              "",
              "Opciones:",
              "  es    Cambia el idioma a español",
              "  en    Cambia el idioma a inglés",
            ].join("\n")
          : [
              "Usage: language <es|en> [options]",
              "",
              "Show or change the session language.",
              "",
              "Options:",
              "  es    Change language to Spanish",
              "  en    Change language to English",
            ].join("\n");
      return {
        output: helpText,
        code: 0,
      };
    }
    // Mostrar idioma actual e instrucciones
    if (!args || !args.length) {
      const currentLang = context.lang === "es" ? "Español (es)" : "English (en)";

      if (context.lang === "es") {
        return [
          `Idioma actual: ${currentLang}`,
          "",
          "Para cambiar el idioma, usa:",
          "  idioma en    → Cambiar a inglés",
          "  idioma es    → Cambiar a español",
        ].join("\n");
      } else {
        return [
          `Current language: ${currentLang}`,
          "",
          "To change the language, use:",
          "  language es  → Change to Spanish",
          "  language en  → Change to English",
        ].join("\n");
      }
    }

    const invalidFlag = args.find((arg) => arg && arg.startsWith("-"));
    if (invalidFlag) {
      const flag = invalidFlag.replace(/^-+/, "");
      const msg =
        context.lang === "es"
          ? `idioma: opción inválida -- ${flag}\nPrueba 'idioma --help' para más información.`
          : `idioma: invalid option -- ${flag}\nTry 'idioma --help' for more information.`;
      return {
        output: msg,
        code: 1,
      };
    }

    if (args.length > 1) {
      const msg =
        context.lang === "es"
          ? "idioma: demasiados argumentos\nPrueba 'idioma --help' para más información."
          : "idioma: too many arguments\nTry 'idioma --help' for more information.";
      return {
        output: msg,
        code: 1,
      };
    }

    const requested = args[0].toLowerCase();

    if (!SUPPORTED_LANGS.includes(requested)) {
      return {
        es: `Idioma no soportado: ${requested}. Usa 'idioma es' o 'idioma en'`,
        en: `Unsupported language: ${requested}. Use 'language es' or 'language en'`,
      }[context.lang];
    }

    context.lang = requested;
    updateDocumentLanguage(requested);

    const newLang = requested === "es" ? "Español (es)" : "English (en)";

    return {
      es: `✓ Idioma cambiado a: ${newLang}`,
      en: `✓ Language changed to: ${newLang}`,
    }[context.lang];
  },
};

export { languageCommand };

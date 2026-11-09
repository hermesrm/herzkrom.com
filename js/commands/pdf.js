/* =============================
   pdf.js
   Show PDF résumé location
   ============================= */

const pdfCommand = {
  id: "PDF",
  aliases: {
    es: ["pdf"],
    en: ["pdf"],
  },
  description: {
    es: "Indica si el currículum en PDF está disponible",
    en: "Show whether the PDF résumé is available",
  },

  execute(context, args) {
    if (args.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: pdf [--help]",
              "",
              "Indica si el currículum en PDF está disponible.",
              "",
              "Opciones:",
              "  --help    Muestra esta ayuda",
            ].join("\n")
          : [
              "Usage: pdf [--help]",
              "",
              "Show whether the PDF résumé is available.",
              "",
              "Options:",
              "  --help    Show this help",
            ].join("\n");
      return {
        output: helpText,
        code: 0,
      };
    }
    if (args && args.length) {
      const invalidFlag = args.find((arg) => arg && arg.startsWith("-"));
      if (invalidFlag) {
        const flag = invalidFlag.replace(/^-+/, "");
        const msg =
          context.lang === "es"
            ? `pdf: opción inválida -- ${flag}\nPrueba 'pdf --help' para más información.`
            : `pdf: invalid option -- ${flag}\nTry 'pdf --help' for more information.`;
        return {
          output: msg,
          code: 1,
        };
      }
      const msg =
        context.lang === "es"
          ? "pdf: demasiados argumentos\nPrueba 'pdf --help' para más información."
          : "pdf: too many arguments\nTry 'pdf --help' for more information.";
      return {
        output: msg,
        code: 1,
      };
    }
    return {
      es: "El currículum en PDF todavía no está disponible.",
      en: "The PDF résumé is not available yet.",
    }[context.lang];
  },
};

export { pdfCommand };

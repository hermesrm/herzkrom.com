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
    es: "Muestra la ubicación del currículum en PDF",
    en: "Show the location of the PDF résumé",
  },

  execute(context, args) {
        // Mostrar ayuda si se solicita --help
        if (args.includes('--help')) {
          const helpText = context.lang === 'es'
            ? [
                "Uso: pdf [opciones]",
                "",
                "Muestra la ubicación del currículum en PDF.",
                "",
                "Opciones:",
                "  (Por implementar)",
              ].join("\n")
            : [
                "Usage: pdf [options]",
                "",
                "Show the location of the PDF résumé.",
                "",
                "Options:",
                "  (To be implemented)",
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
        const msg = context.lang === 'es'
          ? `pdf: opción inválida -- ${flag}\nPrueba 'pdf --help' para más información.`
          : `pdf: invalid option -- ${flag}\nTry 'pdf --help' for more information.`;
        return {
          output: msg,
          code: 1,
        };
      }
      const msg = context.lang === 'es'
        ? "pdf: demasiados argumentos\nPrueba 'pdf --help' para más información."
        : "pdf: too many arguments\nTry 'pdf --help' for more information.";
      return {
        output: msg,
        code: 1,
      };
    }
    return {
      es: [
        "Currículum en PDF disponible en:",
        "/assets/HermesRM_CV.pdf",
        "",
        "Nota: El CV interactivo es la versión principal.",
      ].join("\n"),
      en: [
        "PDF résumé available at:",
        "/assets/HermesRM_CV.pdf",
        "",
        "Note: The interactive CV is the primary version.",
      ].join("\n"),
    }[context.lang];
  },
};

export { pdfCommand };

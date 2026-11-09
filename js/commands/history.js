/* =============================
   history.js
   Command history display
   ============================= */

const historyCommand = {
  id: "HISTORY",
  aliases: {
    es: ["history"],
    en: ["history"],
  },
  description: {
    es: "Muestra el historial de comandos",
    en: "Show command history",
  },

  execute(context, args) {
    const lang = context?.lang === "es" ? "es" : "en";
    if (args.includes("--help")) {
      const helpText =
        lang === "es"
          ? [
              "Uso: history [--help]",
              "",
              "Muestra el historial de comandos.",
              "",
              "Opciones:",
              "  --help    Muestra esta ayuda",
            ].join("\n")
          : [
              "Usage: history [--help]",
              "",
              "Show command history.",
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
          lang === "es"
            ? `history: opción inválida -- ${flag}\nPrueba 'history --help' para más información.`
            : `history: invalid option -- ${flag}\nTry 'history --help' for more information.`;
        return {
          output: msg,
          code: 1,
        };
      }
      const msg =
        lang === "es"
          ? "history: demasiados argumentos\nPrueba 'history --help' para más información."
          : "history: too many arguments\nTry 'history --help' for more information.";
      return {
        output: msg,
        code: 1,
      };
    }

    if (!context?.history?.length) {
      return {
        es: "No hay comandos en el historial",
        en: "No commands in history",
      }[lang];
    }

    return context.history.map((cmd, index) => `${index + 1}  ${cmd}`).join("\n");
  },
};

export { historyCommand };

/* =============================
   clear.js
   Clear terminal output
   ============================= */

const clearCommand = {
  id: "CLEAR",
  help: { section: "system", order: 50 },
  aliases: {
    es: ["clear"],
    en: ["clear"],
  },
  description: {
    es: "Limpia la pantalla de la terminal",
    en: "Clear the terminal screen",
  },

  execute(context, args) {
    if (args.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: clear [--help]",
              "",
              "Limpia la pantalla de la terminal.",
              "",
              "Opciones:",
              "  --help    Muestra esta ayuda",
            ].join("\n")
          : [
              "Usage: clear [--help]",
              "",
              "Clear the terminal screen.",
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
            ? `clear: opción inválida -- ${flag}\nPrueba 'clear --help' para más información.`
            : `clear: invalid option -- ${flag}\nTry 'clear --help' for more information.`;
        return {
          output: msg,
          code: 1,
        };
      }
      if (args.length > 0) {
        const msg =
          context.lang === "es"
            ? "clear: demasiados argumentos\nPrueba 'clear --help' para más información."
            : "clear: too many arguments\nTry 'clear --help' for more information.";
        return {
          output: msg,
          code: 1,
        };
      }
    }
    // ES: Señal para que main.js limpie el output. EN: Signal for main.js to clear output.
    return "__CLEAR__";
  },
};

export { clearCommand };

/* =============================
   reboot.js
   Reset terminal session
   ============================= */

// ES: Devuelve una señal para que la capa principal reinicie la sesión.
// EN: Returns a signal so the main layer resets the session.
const rebootCommand = {
  id: "REBOOT",
  help: { section: "system", order: 100 },
  aliases: {
    es: ["reboot"],
    en: ["reboot"],
  },
  description: {
    es: "Reinicia la consola simulada",
    en: "Reboot the simulated console",
  },

  execute(context, args) {
    if (args.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: reboot [--help]",
              "",
              "Reinicia la consola simulada.",
              "",
              "Opciones:",
              "  --help    Muestra esta ayuda",
            ].join("\n")
          : [
              "Usage: reboot [--help]",
              "",
              "Reboot the simulated console.",
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
            ? `reboot: opción inválida -- ${flag}\nPrueba 'reboot --help' para más información.`
            : `reboot: invalid option -- ${flag}\nTry 'reboot --help' for more information.`;
        return {
          output: msg,
          code: 1,
        };
      }
      const msg =
        context.lang === "es"
          ? "reboot: demasiados argumentos\nPrueba 'reboot --help' para más información."
          : "reboot: too many arguments\nTry 'reboot --help' for more information.";
      return {
        output: msg,
        code: 1,
      };
    }
    return "__REBOOT__"; // señal especial
  },
};

export { rebootCommand };

/* =============================
   whoami.js
   Display current session user
   ============================= */

const whoamiCommand = {
  id: "WHOAMI",
  aliases: {
    es: ["whoami"],
    en: ["whoami"],
  },
  description: {
    es: "Muestra el usuario actual de la sesión",
    en: "Display the current session user",
  },

  execute(context, args) {
        // Mostrar ayuda si se solicita --help
        if (args.includes('--help')) {
          const helpText = context.lang === 'es'
            ? [
                "Uso: whoami [opciones]",
                "",
                "Muestra el usuario actual de la sesión.",
                "",
                "Opciones:",
                "  (Por implementar)",
              ].join("\n")
            : [
                "Usage: whoami [options]",
                "",
                "Display the current session user.",
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
          ? `whoami: opción inválida -- ${flag}\nPrueba 'whoami --help' para más información.`
          : `whoami: invalid option -- ${flag}\nTry 'whoami --help' for more information.`;
        return {
          output: msg,
          code: 1,
        };
      }
      if (args.length > 0) {
        const msg = context.lang === 'es'
          ? "whoami: demasiados argumentos\nPrueba 'whoami --help' para más información."
          : "whoami: too many arguments\nTry 'whoami --help' for more information.";
        return {
          output: msg,
          code: 1,
        };
      }
    }
    return context.visitor.name || "guest";
  },
};

export { whoamiCommand };

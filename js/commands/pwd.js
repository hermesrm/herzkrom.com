/* =============================
   pwd.js
   Print working directory
   ============================= */

import { getDisplayPath } from "./ls.js";

const pwdCommand = {
  id: "PWD",
  aliases: {
    es: ["pwd"],
    en: ["pwd"],
  },
  description: {
    es: "Muestra la ruta actual",
    en: "Print working directory",
  },

  execute(context, args) {
    if (args.includes("--help")) {
      const helpText =
        context.lang === "es"
          ? [
              "Uso: pwd [--help]",
              "",
              "Muestra la ruta actual.",
              "",
              "Opciones:",
              "  --help    Muestra esta ayuda",
            ].join("\n")
          : [
              "Usage: pwd [--help]",
              "",
              "Print working directory.",
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
            ? `pwd: opción inválida -- ${flag}\nPrueba 'pwd --help' para más información.`
            : `pwd: invalid option -- ${flag}\nTry 'pwd --help' for more information.`;
        return {
          output: msg,
          code: 1,
        };
      }
      if (args.length > 0) {
        const msg =
          context.lang === "es"
            ? "pwd: demasiados argumentos\nPrueba 'pwd --help' para más información."
            : "pwd: too many arguments\nTry 'pwd --help' for more information.";
        return {
          output: msg,
          code: 1,
        };
      }
    }
    return getDisplayPath(context);
  },
};

export { pwdCommand };

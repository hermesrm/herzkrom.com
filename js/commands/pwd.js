/* =============================
   pwd.js
   Print working directory
   ============================= */

import { getCwdPath } from "../context.js";

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
        // Mostrar ayuda si se solicita --help
        if (args.includes('--help')) {
          const helpText = context.lang === 'es'
            ? [
                "Uso: pwd [opciones]",
                "",
                "Muestra la ruta actual.",
                "",
                "Opciones:",
                "  (Por implementar)",
              ].join("\n")
            : [
                "Usage: pwd [options]",
                "",
                "Print working directory.",
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
          ? `pwd: opción inválida -- ${flag}\nPrueba 'pwd --help' para más información.`
          : `pwd: invalid option -- ${flag}\nTry 'pwd --help' for more information.`;
        return {
          output: msg,
          code: 1,
        };
      }
      if (args.length > 0) {
        const msg = context.lang === 'es'
          ? "pwd: demasiados argumentos\nPrueba 'pwd --help' para más información."
          : "pwd: too many arguments\nTry 'pwd --help' for more information.";
        return {
          output: msg,
          code: 1,
        };
      }
    }
    return getCwdPath(context);
  },
};

export { pwdCommand };

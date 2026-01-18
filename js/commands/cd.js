/* =============================
   cd.js
   Change directory
   ============================= */

import { resolvePath } from "../context.js";
import { getInternalName } from "./ls.js";

const cdCommand = {
  id: "CD",
  aliases: {
    es: ["cd"],
    en: ["cd"],
  },
  description: {
    es: "Cambia el directorio actual",
    en: "Change the current directory",
  },

  execute(context, args) {
        // Mostrar ayuda si se solicita --help
        if (args.includes('--help')) {
          const helpText = context.lang === 'es'
            ? [
                "Uso: cd <directorio> [opciones]",
                "",
                "Cambia el directorio actual.",
                "",
                "Opciones:",
                "  (Por implementar)",
              ].join("\n")
            : [
                "Usage: cd <directory> [options]",
                "",
                "Change the current directory.",
                "",
                "Options:",
                "  (To be implemented)",
              ].join("\n");
          return {
            output: helpText,
            code: 0,
          };
        }
    // Opción inválida (solo acepta argumentos que no empiezan por '-')
    const invalidFlag = args.find((arg) => arg && arg.startsWith("-"));
    if (invalidFlag) {
      const flag = invalidFlag.replace(/^-+/, "");
      const msg = context.lang === 'es'
        ? `cd: opción inválida -- ${flag}\nPrueba 'cd --help' para más información.`
        : `cd: invalid option -- ${flag}\nTry 'cd --help' for more information.`;
      return {
        output: msg,
        code: 1,
      };
    }

    if (args.length > 1) {
      const msg = context.lang === 'es'
        ? "cd: demasiados argumentos\nPrueba 'cd --help' para más información."
        : "cd: too many arguments\nTry 'cd --help' for more information.";
      return {
        output: msg,
        code: 1,
      };
    }
    let target = args[0] || "/";

    // ES: Traduce nombre mostrado al nombre interno del filesystem. EN: Translate display name to raw FS name.
    target = getInternalName(target, context.lang);

    const result = resolvePath(context, target);

    if (!result) {
      return {
        es: `cd: directorio no encontrado: ${target}`,
        en: `cd: no such file or directory: ${target}`,
      }[context.lang];
    }

    if (result.node.type !== "dir") {
      return {
        es: `cd: no es un directorio: ${target}`,
        en: `cd: not a directory: ${target}`,
      }[context.lang];
    }

    context.cwd = result.cwd;
    return "";
  },
};

export { cdCommand };
